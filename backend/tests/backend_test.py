import os
import io
import base64
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.strip().split("=", 1)[1].strip('"')
                break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@aysuart.com"
ADMIN_PASSWORD = "AysuArt2026!"


@pytest.fixture(scope="session")
def session():
    return requests.Session()


# ---------- basic ----------
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_cities_full(session):
    r = session.get(f"{API}/cities")
    assert r.status_code == 200
    cities = r.json()["cities"]
    assert len(cities) > 50
    assert "İstanbul" in [c["name"] for c in cities]


def test_cities_search_diacritics(session):
    r = session.get(f"{API}/cities", params={"q": "izmir"})
    assert r.status_code == 200
    assert "İzmir" in [c["name"] for c in r.json()["cities"]]


# ---------- upload ----------
def _make_png_bytes():
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAA"
        "AAYAAjCB0C8AAAAASUVORK5CYII="
    )


@pytest.fixture(scope="session")
def uploaded(session):
    files = {"file": ("test.png", io.BytesIO(_make_png_bytes()), "image/png")}
    r = session.post(f"{API}/upload", files=files)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["url"] == f"/api/files/{j['file_id']}"
    return j


def test_upload(uploaded):
    assert uploaded["file_id"]


def test_upload_rejects_non_image(session):
    files = {"file": ("test.txt", io.BytesIO(b"hi"), "text/plain")}
    assert session.post(f"{API}/upload", files=files).status_code == 400


def test_serve_file(session, uploaded):
    r = session.get(f"{API}/files/{uploaded['file_id']}")
    assert r.status_code == 200
    assert r.headers["Content-Type"].startswith("image/")


def test_serve_file_404(session):
    assert session.get(f"{API}/files/nonexistent-id").status_code == 404


# ---------- starmap ----------
def test_starmap_deterministic(session):
    payload = {"date": "2024-06-15", "lat": 41.0082, "lon": 28.9784}
    r1 = session.post(f"{API}/starmap", json=payload)
    r2 = session.post(f"{API}/starmap", json=payload)
    assert r1.status_code == 200 and r2.status_code == 200
    assert r1.json() == r2.json()
    assert len(r1.json()["stars"]) == 220


def test_starmap_invalid_date(session):
    r = session.post(f"{API}/starmap", json={"date": "bad", "lat": 0, "lon": 0})
    assert r.status_code == 400


# ---------- orders (with new fields) ----------
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
        "gift_package": True,
        "message_card": True,
    }
    r = session.post(f"{API}/orders", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert "_id" not in j
    return j


def test_create_order_with_upsells(created_order):
    assert created_order["id"]
    assert created_order["gift_package"] is True
    assert created_order["message_card"] is True
    assert created_order["status"] == "pending"


def test_get_order(session, created_order):
    r = session.get(f"{API}/orders/{created_order['id']}")
    assert r.status_code == 200
    j = r.json()
    assert j["id"] == created_order["id"]
    assert j["customer_email"] == "test_aysu@example.com"
    assert j["gift_package"] is True
    assert j["message_card"] is True


def test_create_order_invalid_photo(session):
    payload = {
        "photo_file_id": "no-such-id",
        "memory_date": "2024-06-15",
        "city_name": "Ankara",
        "city_lat": 39.9, "city_lon": 32.8,
        "quote_text": "x",
        "customer_name": "x", "customer_email": "x@x.com",
        "customer_phone": "1", "delivery_address": "y",
    }
    assert session.post(f"{API}/orders", json=payload).status_code == 400


def test_get_order_404(session):
    assert session.get(f"{API}/orders/nonexistent").status_code == 404


def test_create_order_defaults_upsells_false(session, uploaded):
    payload = {
        "photo_file_id": uploaded["file_id"],
        "memory_date": "2024-01-01",
        "city_name": "Ankara", "city_lat": 39.9, "city_lon": 32.8,
        "quote_text": "TEST_ default upsell",
        "customer_name": "TEST_ Default", "customer_email": "def@x.com",
        "customer_phone": "+905551112299", "delivery_address": "TEST_ addr",
    }
    r = session.post(f"{API}/orders", json=payload)
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["gift_package"] is False
    assert j["message_card"] is False


# ---------- public memory ----------
def test_public_memory_excludes_pii(session, created_order):
    r = session.get(f"{API}/memory/{created_order['id']}")
    assert r.status_code == 200
    j = r.json()
    assert j["id"] == created_order["id"]
    assert j["city_name"] == "İstanbul"
    for forbidden in ["customer_name", "customer_email", "customer_phone", "delivery_address", "notes"]:
        assert forbidden not in j, f"{forbidden} leaked in /api/memory response"
    # quote, photo, coords, zodiac all present
    assert j["quote_text"]
    assert j["photo_url"]
    assert j["zodiac"] == "İkizler"


def test_public_memory_404(session):
    assert session.get(f"{API}/memory/nope-id").status_code == 404


# ---------- auth ----------
@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    j = r.json()
    assert "access_token" in j
    assert j["token_type"] == "bearer"
    assert j["user"]["email"] == ADMIN_EMAIL
    assert j["user"]["role"] == "admin"
    assert "password_hash" not in j["user"]
    return j["access_token"]


def test_login_success(admin_token):
    assert isinstance(admin_token, str) and len(admin_token) > 20


def test_login_wrong_password(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-pw"})
    assert r.status_code == 401


def test_login_unknown_user(session):
    r = session.post(f"{API}/auth/login", json={"email": "noone@aysuart.com", "password": "x"})
    assert r.status_code == 401


def test_auth_me_with_token(session, admin_token):
    r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    j = r.json()
    assert j["email"] == ADMIN_EMAIL
    assert j["role"] == "admin"
    assert "password_hash" not in j


def test_auth_me_without_token(session):
    r = session.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_auth_me_invalid_token(session):
    r = session.get(f"{API}/auth/me", headers={"Authorization": "Bearer bad.token.value"})
    assert r.status_code == 401


# ---------- admin orders ----------
def test_admin_orders_requires_auth(session):
    assert session.get(f"{API}/admin/orders").status_code == 401


def test_admin_orders_list(session, admin_token, created_order):
    r = session.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    j = r.json()
    assert "orders" in j
    ids = [o["id"] for o in j["orders"]]
    assert created_order["id"] in ids
    # ensure no _id leaked
    for o in j["orders"]:
        assert "_id" not in o


def test_admin_get_single_order(session, admin_token, created_order):
    r = session.get(f"{API}/admin/orders/{created_order['id']}",
                    headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    j = r.json()
    assert j["id"] == created_order["id"]
    assert j["customer_email"] == "test_aysu@example.com"
    assert "_id" not in j


def test_admin_get_single_order_unauth(session, created_order):
    r = session.get(f"{API}/admin/orders/{created_order['id']}")
    assert r.status_code == 401


def test_admin_update_status_valid(session, admin_token, created_order):
    r = session.patch(
        f"{API}/admin/orders/{created_order['id']}",
        json={"status": "approved"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["status"] == "approved"
    # verify persistence via GET
    r2 = session.get(f"{API}/admin/orders/{created_order['id']}",
                     headers={"Authorization": f"Bearer {admin_token}"})
    assert r2.json()["status"] == "approved"


def test_admin_update_status_invalid(session, admin_token, created_order):
    r = session.patch(
        f"{API}/admin/orders/{created_order['id']}",
        json={"status": "not-a-status"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 422


def test_admin_update_status_unauth(session, created_order):
    r = session.patch(f"{API}/admin/orders/{created_order['id']}",
                      json={"status": "approved"})
    assert r.status_code == 401


def test_admin_update_status_404(session, admin_token):
    r = session.patch(f"{API}/admin/orders/nope",
                      json={"status": "approved"},
                      headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 404
