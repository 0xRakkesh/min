from fastapi import FastAPI
from pydantic import BaseModel 
from fastapi.responses import RedirectResponse
from fastapi import HTTPException
from utils import encode_base62

port = "http://127.0.0.1:8000/"

app = FastAPI()

class URLitems(BaseModel):
    target_url : str

memory = {}
counter = 100000


@app.post("/shortner")
def root(url_data: URLitems):
    global counter
    counter += 1
    short_id = encode_base62(counter)
    memory[short_id] = url_data.target_url
    return {
         "short_id" : short_id,
         "target_url" : url_data.target_url,
         "short_url" : f"{port}{short_id}"
         }

@app.get("/{short_id}")

def redirect_url(short_id: str):

    if short_id not in memory:                                                
        raise HTTPException(status_code=404, detail="URL not found") 
    
    target_url = memory[short_id]
    return RedirectResponse(url = target_url, status_code=307)