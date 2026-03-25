import urllib.request
import urllib.error
import json

SUPABASE_URL = "https://zlynkkolnenjylzyhwvj.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseW5ra29sbmVuanlsenlod3ZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4Mjc4NywiZXhwIjoyMDg5OTU4Nzg3fQ.emCCxKrhyloBfwZlPfpyhK2qd3__NNy1tpuUgzMTwQM"

EMAIL = "Silviolmonzon@amenagementmonzon.com"
PASSWORD = "Noah2018!"

def create_admin_user():
    print("=" * 60)
    print("Creating Admin User for Aménagement Monzon")
    print(f"Email: {EMAIL}")
    print("=" * 60)

    # Create user via Supabase Auth API
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    payload = {
        "email": EMAIL,
        "password": PASSWORD,
        "email_confirm": True,
        "user_metadata": {
            "full_name": "Silvio Monzon",
            "role": "admin"
        }
    }

    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    
    for k, v in headers.items():
        req.add_header(k, v)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            user_id = result.get("id")
            print(f"✓ User created successfully!")
            print(f"  User ID: {user_id}")
            print(f"  Email: {EMAIL}")
            print(f"  Role: admin")
            return user_id
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"✗ Error creating user (HTTP {e.code}):")
        print(f"  {error_body}")
        return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

if __name__ == "__main__":
    create_admin_user()
    print("=" * 60)
