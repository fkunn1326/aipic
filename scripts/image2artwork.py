from supabase import create_client,Client
import collections
import requests

url: str = ""
key: str = ""

supabase: Client = create_client(url, key)

l = []

data = supabase.table("images").select("promptarr").execute()

for k in data.data:
    l.extend(k["promptarr"])

c = collections.Counter(l)

for k in c:
    data = supabase.table("prompts").upsert({
        "name": str(k),
        "count": c[k]
    }).execute()
    print(data)