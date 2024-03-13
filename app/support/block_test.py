import requests

i=0
while(i<300):
    response = requests.get("http://localhost:3500",headers={"origin":"http://localhost:3500"})
    print(i,response.status_code)


    # i=i+1