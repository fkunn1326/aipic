from supabase import create_client,Client
import requests
from dotenv import load_dotenv
import os
import asyncio
from postgrest import AsyncPostgrestClient

load_dotenv(r"env_path")

url: str = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
key: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
account_id: str = os.environ["CLOUDFLARE_IMAGES_ACCOUNT_ID"]
token: str = os.environ["CLOUDFLARE_IMAGES_API_TOKEN"]

supabase: Client = create_client(url, key)

async def main():
    async with AsyncPostgrestClient("http://localhost:3000") as client:
        r = await client.from_("countries").select("*").execute()
        countries = r.data

asyncio.run(main())

async def search(keyword):
    data = supabase.rpc("search_artworks", { "keyword": "R18" }).execute()
    # print(data.data)

async def call_search():
    print("1")
    await search("aaa")

async def call_search2():
    print(2)
    await search("ooo")

loop = asyncio.get_event_loop()
loop.create_task(call_search())
loop.run_until_complete(call_search2())