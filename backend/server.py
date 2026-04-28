from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Response, Header, Query, Request, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import math
import requests
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Storage
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = os.environ.get("APP_NAME", "aysu-art")
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
ACCESS_TTL_HOURS = 24
storage_key: Optional[str] = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Storage ----------
def init_storage() -> str:
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------- Auth ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TTL_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(authorization: Optional[str] = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Yetkisiz")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Oturum süresi doldu")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Geçersiz token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Geçersiz token")
    user = await db.users.find_one({"id": payload["sub"], "role": "admin"}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı")
    return user


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@aysuart.com").lower()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "AysuArt2026!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_pw),
            "name": "Aysu Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_pw, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_pw)}},
        )
        logger.info("Admin password updated from .env")


app = FastAPI(title="Aysu Art API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class UploadResponse(BaseModel):
    file_id: str
    storage_path: str
    url: str


class OrderCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    photo_file_id: str
    memory_date: str
    city_name: str
    city_lat: float
    city_lon: float
    quote_text: str
    spotify_url: Optional[str] = ""
    zodiac: Optional[str] = ""
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    delivery_address: str
    notes: Optional[str] = ""
    gift_package: Optional[bool] = False
    message_card: Optional[bool] = False


class Order(BaseModel):
    id: str
    photo_file_id: str
    photo_url: str
    memory_date: str
    city_name: str
    city_lat: float
    city_lon: float
    quote_text: str
    spotify_url: Optional[str] = ""
    zodiac: Optional[str] = ""
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    notes: Optional[str] = ""
    gift_package: bool = False
    message_card: bool = False
    status: str = "pending"
    created_at: str


class PublicMemory(BaseModel):
    id: str
    photo_file_id: str
    photo_url: str
    memory_date: str
    city_name: str
    city_lat: float
    city_lon: float
    quote_text: str
    spotify_url: Optional[str] = ""
    zodiac: Optional[str] = ""


class StarMapRequest(BaseModel):
    date: str
    lat: float
    lon: float


class Star(BaseModel):
    x: float
    y: float
    mag: float


class StarMapResponse(BaseModel):
    stars: List[Star]
    constellations: List[List[int]]
    sidereal_angle: float


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class StatusUpdate(BaseModel):
    status: Literal["pending", "approved", "in_production", "shipped", "completed", "cancelled"]


# ---------- Public Routes ----------
@api_router.get("/")
async def root():
    return {"name": "Aysu Art API", "status": "ok"}


@api_router.post("/upload", response_model=UploadResponse)
async def upload_photo(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Sadece resim dosyaları yüklenebilir")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Dosya boyutu 10MB'dan büyük olamaz")
    ext = (file.filename.rsplit(".", 1)[-1] if "." in (file.filename or "") else "jpg").lower()
    file_id = str(uuid.uuid4())
    path = f"{APP_NAME}/uploads/{file_id}.{ext}"
    try:
        result = put_object(path, data, file.content_type)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=500, detail="Yükleme başarısız oldu")

    await db.photos.insert_one({
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return UploadResponse(
        file_id=file_id,
        storage_path=result["path"],
        url=f"/api/files/{file_id}",
    )


@api_router.get("/files/{file_id}")
async def serve_file(file_id: str):
    record = await db.photos.find_one({"id": file_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Dosya bulunamadı")
    try:
        data, content_type = get_object(record["storage_path"])
    except Exception as e:
        logger.error(f"Storage fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Dosya alınamadı")
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600"},
    )


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    photo = await db.photos.find_one({"id": payload.photo_file_id, "is_deleted": False}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=400, detail="Geçersiz fotoğraf")

    order_id = str(uuid.uuid4())
    doc = {
        "id": order_id,
        "photo_file_id": payload.photo_file_id,
        "photo_url": f"/api/files/{payload.photo_file_id}",
        "memory_date": payload.memory_date,
        "city_name": payload.city_name,
        "city_lat": payload.city_lat,
        "city_lon": payload.city_lon,
        "quote_text": payload.quote_text,
        "spotify_url": payload.spotify_url or "",
        "zodiac": payload.zodiac or "",
        "customer_name": payload.customer_name,
        "customer_email": payload.customer_email,
        "customer_phone": payload.customer_phone,
        "delivery_address": payload.delivery_address,
        "notes": payload.notes or "",
        "gift_package": bool(payload.gift_package),
        "message_card": bool(payload.message_card),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(doc)
    return Order(**{k: v for k, v in doc.items() if k != "_id"})


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    return Order(**doc)


@api_router.get("/memory/{order_id}", response_model=PublicMemory)
async def get_public_memory(order_id: str):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Anı bulunamadı")
    public_fields = {k: doc.get(k) for k in [
        "id", "photo_file_id", "photo_url", "memory_date", "city_name",
        "city_lat", "city_lon", "quote_text", "spotify_url", "zodiac",
    ]}
    return PublicMemory(**public_fields)


@api_router.post("/starmap", response_model=StarMapResponse)
async def compute_starmap(req: StarMapRequest):
    try:
        d = datetime.fromisoformat(req.date.replace("Z", ""))
    except Exception:
        try:
            d = datetime.strptime(req.date, "%Y-%m-%d")
        except Exception:
            raise HTTPException(status_code=400, detail="Geçersiz tarih")
    seed = int(d.timestamp()) ^ int(req.lat * 1000) ^ int(req.lon * 1000)
    rng_state = [seed & 0xFFFFFFFF]

    def rnd():
        rng_state[0] = (1103515245 * rng_state[0] + 12345) & 0x7FFFFFFF
        return rng_state[0] / 0x7FFFFFFF

    day_of_year = d.timetuple().tm_yday
    sidereal = (day_of_year / 365.25) * 360.0 + req.lon

    stars: List[Star] = []
    n = 220
    for _ in range(n):
        r = math.sqrt(rnd()) * 0.48
        theta = rnd() * 2 * math.pi
        x = 0.5 + r * math.cos(theta)
        y = 0.5 + r * math.sin(theta)
        mag = (rnd() ** 2)
        stars.append(Star(x=x, y=y, mag=mag))

    constellations: List[List[int]] = []
    bright_indices = sorted(range(n), key=lambda i: -stars[i].mag)[:40]
    used = set()
    for _ in range(4):
        line: List[int] = []
        for idx in bright_indices:
            if idx not in used:
                line.append(idx)
                used.add(idx)
                break
        target_len = 3 + int(rnd() * 3)
        while len(line) < target_len:
            last = line[-1]
            lx, ly = stars[last].x, stars[last].y
            best = None
            best_d = 1e9
            for idx in bright_indices:
                if idx in used:
                    continue
                dx = stars[idx].x - lx
                dy = stars[idx].y - ly
                dd = dx * dx + dy * dy
                if dd < best_d and dd < 0.05:
                    best_d = dd
                    best = idx
            if best is None:
                break
            line.append(best)
            used.add(best)
        if len(line) >= 2:
            for i in range(len(line) - 1):
                constellations.append([line[i], line[i + 1]])

    return StarMapResponse(stars=stars, constellations=constellations, sidereal_angle=sidereal)


# ---------- Cities ----------
def _norm(s: str) -> str:
    repl = {"ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
            "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c"}
    for k, v in repl.items():
        s = s.replace(k, v)
    return s.lower().strip()


CITIES = [
    {"name": "İstanbul", "lat": 41.0082, "lon": 28.9784, "country": "Türkiye"},
    {"name": "Ankara", "lat": 39.9334, "lon": 32.8597, "country": "Türkiye"},
    {"name": "İzmir", "lat": 38.4192, "lon": 27.1287, "country": "Türkiye"},
    {"name": "Bursa", "lat": 40.1885, "lon": 29.0610, "country": "Türkiye"},
    {"name": "Antalya", "lat": 36.8969, "lon": 30.7133, "country": "Türkiye"},
    {"name": "Adana", "lat": 37.0000, "lon": 35.3213, "country": "Türkiye"},
    {"name": "Konya", "lat": 37.8746, "lon": 32.4932, "country": "Türkiye"},
    {"name": "Gaziantep", "lat": 37.0662, "lon": 37.3833, "country": "Türkiye"},
    {"name": "Şanlıurfa", "lat": 37.1591, "lon": 38.7969, "country": "Türkiye"},
    {"name": "Kayseri", "lat": 38.7312, "lon": 35.4787, "country": "Türkiye"},
    {"name": "Mersin", "lat": 36.8121, "lon": 34.6415, "country": "Türkiye"},
    {"name": "Eskişehir", "lat": 39.7767, "lon": 30.5206, "country": "Türkiye"},
    {"name": "Diyarbakır", "lat": 37.9144, "lon": 40.2306, "country": "Türkiye"},
    {"name": "Samsun", "lat": 41.2867, "lon": 36.3300, "country": "Türkiye"},
    {"name": "Denizli", "lat": 37.7765, "lon": 29.0864, "country": "Türkiye"},
    {"name": "Trabzon", "lat": 41.0015, "lon": 39.7178, "country": "Türkiye"},
    {"name": "Sakarya", "lat": 40.7569, "lon": 30.3781, "country": "Türkiye"},
    {"name": "Hatay", "lat": 36.4018, "lon": 36.3498, "country": "Türkiye"},
    {"name": "Manisa", "lat": 38.6191, "lon": 27.4289, "country": "Türkiye"},
    {"name": "Balıkesir", "lat": 39.6484, "lon": 27.8826, "country": "Türkiye"},
    {"name": "Kahramanmaraş", "lat": 37.5858, "lon": 36.9371, "country": "Türkiye"},
    {"name": "Van", "lat": 38.4942, "lon": 43.3800, "country": "Türkiye"},
    {"name": "Aydın", "lat": 37.8560, "lon": 27.8416, "country": "Türkiye"},
    {"name": "Tekirdağ", "lat": 40.9833, "lon": 27.5167, "country": "Türkiye"},
    {"name": "Muğla", "lat": 37.2154, "lon": 28.3636, "country": "Türkiye"},
    {"name": "Erzurum", "lat": 39.9000, "lon": 41.2700, "country": "Türkiye"},
    {"name": "Malatya", "lat": 38.3552, "lon": 38.3095, "country": "Türkiye"},
    {"name": "Ordu", "lat": 40.9839, "lon": 37.8764, "country": "Türkiye"},
    {"name": "Afyonkarahisar", "lat": 38.7507, "lon": 30.5567, "country": "Türkiye"},
    {"name": "Zonguldak", "lat": 41.4564, "lon": 31.7987, "country": "Türkiye"},
    {"name": "Çanakkale", "lat": 40.1553, "lon": 26.4142, "country": "Türkiye"},
    {"name": "Sivas", "lat": 39.7477, "lon": 37.0179, "country": "Türkiye"},
    {"name": "Tokat", "lat": 40.3167, "lon": 36.5500, "country": "Türkiye"},
    {"name": "Kütahya", "lat": 39.4167, "lon": 29.9833, "country": "Türkiye"},
    {"name": "Çorum", "lat": 40.5506, "lon": 34.9556, "country": "Türkiye"},
    {"name": "Isparta", "lat": 37.7626, "lon": 30.5537, "country": "Türkiye"},
    {"name": "Elazığ", "lat": 38.6810, "lon": 39.2264, "country": "Türkiye"},
    {"name": "Edirne", "lat": 41.6764, "lon": 26.5556, "country": "Türkiye"},
    {"name": "Kocaeli", "lat": 40.8533, "lon": 29.8815, "country": "Türkiye"},
    {"name": "Kırıkkale", "lat": 39.8468, "lon": 33.5153, "country": "Türkiye"},
    {"name": "Düzce", "lat": 40.8438, "lon": 31.1565, "country": "Türkiye"},
    {"name": "Osmaniye", "lat": 37.0742, "lon": 36.2469, "country": "Türkiye"},
    {"name": "Mardin", "lat": 37.3122, "lon": 40.7350, "country": "Türkiye"},
    {"name": "Batman", "lat": 37.8812, "lon": 41.1351, "country": "Türkiye"},
    {"name": "Rize", "lat": 41.0201, "lon": 40.5234, "country": "Türkiye"},
    {"name": "Giresun", "lat": 40.9128, "lon": 38.3895, "country": "Türkiye"},
    {"name": "Yalova", "lat": 40.6500, "lon": 29.2667, "country": "Türkiye"},
    {"name": "Bolu", "lat": 40.7392, "lon": 31.6089, "country": "Türkiye"},
    {"name": "Niğde", "lat": 37.9667, "lon": 34.6833, "country": "Türkiye"},
    {"name": "Karabük", "lat": 41.2061, "lon": 32.6204, "country": "Türkiye"},
    {"name": "Aksaray", "lat": 38.3687, "lon": 34.0370, "country": "Türkiye"},
    {"name": "Kırşehir", "lat": 39.1425, "lon": 34.1709, "country": "Türkiye"},
    {"name": "Nevşehir", "lat": 38.6939, "lon": 34.6857, "country": "Türkiye"},
    {"name": "Yozgat", "lat": 39.8181, "lon": 34.8147, "country": "Türkiye"},
    {"name": "Kastamonu", "lat": 41.3887, "lon": 33.7827, "country": "Türkiye"},
    {"name": "Sinop", "lat": 42.0231, "lon": 35.1531, "country": "Türkiye"},
    {"name": "Amasya", "lat": 40.6499, "lon": 35.8353, "country": "Türkiye"},
    {"name": "Bartın", "lat": 41.6344, "lon": 32.3375, "country": "Türkiye"},
    {"name": "Bilecik", "lat": 40.0567, "lon": 30.0665, "country": "Türkiye"},
    {"name": "Burdur", "lat": 37.7203, "lon": 30.2908, "country": "Türkiye"},
    {"name": "Kırklareli", "lat": 41.7333, "lon": 27.2167, "country": "Türkiye"},
    {"name": "Uşak", "lat": 38.6823, "lon": 29.4082, "country": "Türkiye"},
    {"name": "Çankırı", "lat": 40.6013, "lon": 33.6134, "country": "Türkiye"},
    {"name": "Karaman", "lat": 37.1759, "lon": 33.2287, "country": "Türkiye"},
    {"name": "Kilis", "lat": 36.7184, "lon": 37.1212, "country": "Türkiye"},
    {"name": "Bayburt", "lat": 40.2552, "lon": 40.2249, "country": "Türkiye"},
    {"name": "Gümüşhane", "lat": 40.4386, "lon": 39.5086, "country": "Türkiye"},
    {"name": "Erzincan", "lat": 39.7464, "lon": 39.4914, "country": "Türkiye"},
    {"name": "Tunceli", "lat": 39.1079, "lon": 39.5401, "country": "Türkiye"},
    {"name": "Bingöl", "lat": 39.0626, "lon": 40.7696, "country": "Türkiye"},
    {"name": "Muş", "lat": 38.7432, "lon": 41.5065, "country": "Türkiye"},
    {"name": "Bitlis", "lat": 38.4011, "lon": 42.1078, "country": "Türkiye"},
    {"name": "Ağrı", "lat": 39.7191, "lon": 43.0503, "country": "Türkiye"},
    {"name": "Iğdır", "lat": 39.8880, "lon": 44.0048, "country": "Türkiye"},
    {"name": "Kars", "lat": 40.6013, "lon": 43.0975, "country": "Türkiye"},
    {"name": "Ardahan", "lat": 41.1105, "lon": 42.7022, "country": "Türkiye"},
    {"name": "Artvin", "lat": 41.1828, "lon": 41.8183, "country": "Türkiye"},
    {"name": "Hakkari", "lat": 37.5833, "lon": 43.7333, "country": "Türkiye"},
    {"name": "Şırnak", "lat": 37.4187, "lon": 42.4918, "country": "Türkiye"},
    {"name": "Siirt", "lat": 37.9333, "lon": 41.9500, "country": "Türkiye"},
    {"name": "Adıyaman", "lat": 37.7648, "lon": 38.2786, "country": "Türkiye"},
    {"name": "Paris", "lat": 48.8566, "lon": 2.3522, "country": "Fransa"},
    {"name": "Londra", "lat": 51.5074, "lon": -0.1278, "country": "İngiltere"},
    {"name": "Roma", "lat": 41.9028, "lon": 12.4964, "country": "İtalya"},
    {"name": "Barcelona", "lat": 41.3851, "lon": 2.1734, "country": "İspanya"},
    {"name": "Amsterdam", "lat": 52.3676, "lon": 4.9041, "country": "Hollanda"},
    {"name": "Berlin", "lat": 52.5200, "lon": 13.4050, "country": "Almanya"},
    {"name": "Viyana", "lat": 48.2082, "lon": 16.3738, "country": "Avusturya"},
    {"name": "Prag", "lat": 50.0755, "lon": 14.4378, "country": "Çekya"},
    {"name": "New York", "lat": 40.7128, "lon": -74.0060, "country": "ABD"},
    {"name": "Tokyo", "lat": 35.6762, "lon": 139.6503, "country": "Japonya"},
    {"name": "Dubai", "lat": 25.2048, "lon": 55.2708, "country": "BAE"},
    {"name": "Atina", "lat": 37.9838, "lon": 23.7275, "country": "Yunanistan"},
    {"name": "Bakü", "lat": 40.4093, "lon": 49.8671, "country": "Azerbaycan"},
    {"name": "Saraybosna", "lat": 43.8563, "lon": 18.4131, "country": "Bosna Hersek"},
    {"name": "Kapadokya", "lat": 38.6431, "lon": 34.8289, "country": "Türkiye"},
    {"name": "Bodrum", "lat": 37.0344, "lon": 27.4305, "country": "Türkiye"},
    {"name": "Çeşme", "lat": 38.3225, "lon": 26.3056, "country": "Türkiye"},
    {"name": "Alaçatı", "lat": 38.2806, "lon": 26.3756, "country": "Türkiye"},
    {"name": "Fethiye", "lat": 36.6519, "lon": 29.1233, "country": "Türkiye"},
    {"name": "Marmaris", "lat": 36.8550, "lon": 28.2741, "country": "Türkiye"},
]


@api_router.get("/cities")
async def list_cities(q: Optional[str] = Query(default=None)):
    if not q:
        return {"cities": CITIES}
    ql = _norm(q)
    filtered = [c for c in CITIES if ql in _norm(c["name"]) or ql in _norm(c["country"])]
    return {"cities": filtered[:50]}


# ---------- Auth Endpoints ----------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-posta veya parola hatalı")
    token = create_access_token(user["id"], user["email"], user.get("role", "admin"))
    safe_user = {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
    }
    return LoginResponse(access_token=token, user=safe_user)


@api_router.get("/auth/me")
async def auth_me(admin: dict = Depends(get_current_admin)):
    return admin


# ---------- Admin Endpoints ----------
@api_router.get("/admin/orders")
async def admin_list_orders(admin: dict = Depends(get_current_admin)):
    cursor = db.orders.find({}, {"_id": 0}).sort("created_at", -1)
    orders = await cursor.to_list(1000)
    return {"orders": orders}


@api_router.get("/admin/orders/{order_id}")
async def admin_get_order(order_id: str, admin: dict = Depends(get_current_admin)):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    return doc


@api_router.patch("/admin/orders/{order_id}")
async def admin_update_status(order_id: str, payload: StatusUpdate, admin: dict = Depends(get_current_admin)):
    res = await db.orders.update_one({"id": order_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return doc


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,  # Bearer header used; no cookies
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    try:
        await db.users.create_index("email", unique=True)
        await seed_admin()
    except Exception as e:
        logger.error(f"Admin seed failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
