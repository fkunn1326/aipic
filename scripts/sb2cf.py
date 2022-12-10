from supabase import create_client,Client
import requests
from dotenv import load_dotenv
import os

load_dotenv(r"env_path")

url: str = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
key: str = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
account_id: str = os.environ["CLOUDFLARE_IMAGES_ACCOUNT_ID"]
token: str = os.environ["CLOUDFLARE_IMAGES_API_TOKEN"]

supabase: Client = create_client(url, key)

data = supabase.table("profiles").select("avatar_url").execute()

for k in data.data:
    if k["avatar_url"].startswith(r"https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/"):
        # headers = {
        #     f'Authorization': f'Bearer {token}',
        # }

        id = k["avatar_url"].split("/")[-1].split(".")[0]

        data = supabase.table("profiles").update({
            "id": id,
            "avatar_url": f"https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/avatar-{id}/public"
        }).execute()

        print(data)

        # files = {
        #     'requireSignedURLs': (None, 'false'),
        #     'url': (None, k["avatar_url"]),
        #     'id': (None, f"avatar-{id}"),
        # }

        # response = requests.post(f'https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1', headers=headers, files=files)

        # if response.status_code == 200:
        #     print(response.json())
        # else:
        #     print(response.status_code)


    # if response.status_code != requests.codes.ok:
    #     print(k["href"])