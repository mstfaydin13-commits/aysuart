import os
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback: read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.strip().split("=", 1)[1]
                break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    return s


def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


def test_cities_full(session):
    r = session.get(f"{API}/cities")
    assert r.status_code == 200
    cities = r.json()["cities"]
    assert isinstance(cities, list)
    assert len(cities) > 50
    names = [c["name"] for c in cities]
    assert "İstanbul" in names
    assert "Ankara" in names


def test_cities_search_turkish(session):
    r = session.get(f"{API}/cities", params={"q": "ist"})
    assert r.status_code == 200
    names = [c["name"] for c in r.json()["cities"]]
    assert any("İstanbul" == n for n in names), names


def test_cities_search_diacritics(session):
    r = session.get(f"{API}/cities", params={"q": "izmir"})
    assert r.status_code == 200
    names = [c["name"] for c in r.json()["cities"]]
    assert "İzmir" in names


def _make_png_bytes():
    # Minimal 1x1 PNG
    import base64
    b64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAA"
        "AAYAAjCB0C8AAAAASUVORK5CYII="
    )
    return base64.b64decode(b64)


@pytest.fixture(scope="session")
def uploaded(session):
    data = _make_png_bytes()
    files = {"file": ("test.png", io.BytesIO(data), "image/png")}
    r = session.post(f"{API}/upload", files=files)
    assert r.status_code == 200, r.text
    j = r.json()
    assert "file_id" in j and "storage_path" in j and "url" in j
    assert j["url"] == f"/api/files/{j['file_id']}"
    return j


def test_upload(uploaded):
    assert uploaded["file_id"]


def test_upload_rejects_non_image(session):
    files = {"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    r = session.post(f"{API}/upload", files=files)
    assert r.status_code == 400


def test_serve_file(session, uploaded):
    r = session.get(f"{API}/files/{uploaded['file_id']}")
    assert r.status_code == 200
    assert r.headers.get("Content-Type", "").startswith("image/")
    assert len(r.content) > 0


def test_serve_file_404(session):
    r = session.get(f"{API}/files/nonexistent-id")
    assert r.status_code == 404


def test_starmap_deterministic(session):
    payload = {"date": "2024-06-15", "lat": 41.0082, "lon": 28.9784}
    r1 = session.post(f"{API}/starmap", json=payload)
    r2 = session.post(f"{API}/starmap", json=payload)
    assert r1.status_code == 200
    assert r2.status_code == 200
    j1, j2 = r1.json(), r2.json()
    assert len(j1["stars"]) == 220
    assert isinstance(j1["constellations"], list)
    assert "sidereal_angle" in j1
    assert j1 == j2  # deterministic


def test_starmap_invalid_date(session):
    r = session.post(f"{API}/starmap", json={"date": "not-a-date", "lat": 0, "lon": 0})
    assert r.status_code == 400


@pytest.fixture(scope="session")
def created_order(session, uploaded):
    payload = {
        "photo_file_id": uploaded["file_id"],
        "memory_date": "2024-06-15",
        "city_name": "İstanbul",
        "city_lat": 41.0082,
        "city_lon": 28.9784,
        "quote_text": "TEST_ Bizim hikayemiz buradan başladı",
        "spotify_url": "https://open.spotify.com/track/abc",
        "zodiac": "İkizler",
        "customer_name": "TEST_ Aysu Test",
        "customer_email": "test_aysu@example.com",
        "customer_phone": "+905551112233",
        "delivery_address": "TEST_ Adres, İstanbul",
        "notes": "TEST_ note",
    }
    r = session.post(f"{API}/orders", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert "_id" not in j
    assert j["id"]
    assert j["city_name"] == "İstanbul"
    assert j["status"] == "pending"
    return j


def test_create_order(created_order):
    assert created_order["id"]


def test_get_order(session, created_order):
    r = session.get(f"{API}/orders/{created_order['id']}")
    assert r.status_code == 200
    j = r.json()
    assert "_id" not in j
    assert j["id"] == created_order["id"]
    assert j["customer_email"] == "test_aysu@example.com"
    assert j["photo_url"] == f"/api/files/{created_order['photo_file_id']}"


def test_create_order_invalid_photo(session):
    payload = {
        "photo_file_id": "no-such-id",
        "memory_date": "2024-06-15",
        "city_name": "Ankara",
        "city_lat": 39.9,
        "city_lon": 32.8,
        "quote_text": "x",
        "customer_name": "x",
        "customer_email": "x@x.com",
        "customer_phone": "1",
        "delivery_address": "y",
    }
    r = session.post(f"{API}/orders", json=payload)
    assert r.status_code == 400


def test_get_order_404(session):
    r = session.get(f"{API}/orders/nonexistent")
    assert r.status_code == 404
