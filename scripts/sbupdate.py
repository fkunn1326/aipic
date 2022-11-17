from supabase import create_client,Client
import requests

url: str = ""
key: str = ""

supabase: Client = create_client(url, key)

data = supabase.table("images").select("*").execute()

for k in data.data:
    # print(k["href"])
    if "https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/" in k["href"]:
        res = supabase.table('images').update({"href": f"https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/image-{k['id']}/public"}).eq("id", k['id']).execute() 
        print(res)
