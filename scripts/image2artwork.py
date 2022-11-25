from supabase import create_client,Client

url: str = "https://xefsjwahbvrgjqysodbm.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZnNqd2FoYnZyZ2pxeXNvZGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NTM1NjMwOSwiZXhwIjoxOTgwOTMyMzA5fQ.vddndWcJ9kYKRinBUw3L_CJTD1uyQNa2E-zzCreoJnM"

supabase: Client = create_client(url, key)

data = supabase.table("images").select("id, created_at, title, age_limit, user_id, caption, tags, views, copies, daily_point, href").execute()

for k in data.data:
    data = supabase.table("artworks").insert({
        "id": k["id"],
        "created_at": k["created_at"],
        "title": k["title"],
        "age_limit": k["age_limit"],
        "user_id": k["user_id"],
        "caption": k["caption"],
        "tags": k["tags"],
        "views": k["views"],
        "copies": k["copies"],
        "daily_point": k["daily_point"],
        "images": [k["id"]],
        "href": k["href"]
    }).execute()
    print(data)