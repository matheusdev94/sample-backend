import requests

i=0

while(i<3000):
    headers = {"origin":"http://localhost:3500",'user-agent':'mozilla'}
    response = requests.get("http://localhost:3500",headers=headers)
    print(f"Nº: {i} status_code: {response.status_code}")


    i=i+1