from supabase import create_client,Client
import requests

url: str = ""
key: str = ""

supabase: Client = create_client(url, key)

data = supabase.table("artworks").select("href").execute()

for k in data.data:
    if not k["href"].endswith("public"):
        id = k["href"].split("/")[4][6:]
        print(k["href"].split("/")[4][6:])
        data = supabase.table("artworks").update({
            "href": f"https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-{id}/public"
        }).eq("id", id).execute()
        print(data)
