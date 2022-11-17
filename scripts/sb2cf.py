from supabase import create_client,Client
import requests

url: str = ""
key: str = ""
account_id: str = ""
token: str = ""

supabase: Client = create_client(url, key)

data = supabase.table("images").select("href").execute()

for k in data.data:
    # print(k["href"])
    headers = {
        f'Authorization': f'Bearer {token}',
    }

    id = str(k["href"].split("/")[-1].split(".")[0])

    files = {
        'requireSignedURLs': (None, 'false'),
        'url': (None, k["href"]),
        'id': (None, f"image-{id}"),
    }

    response = requests.post(f'https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1', headers=headers, files=files)

    print(response)
    print(response.json())

    if response.status_code != requests.codes.ok:
        print(k["href"])