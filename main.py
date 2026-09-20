from fastapi import FastAPI
from pydantic import BaseModel 
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException
from utils import encode_base62
from crud import *

port = "http://127.0.0.1:8000/"

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend"), name="static")

class URLitems(BaseModel):
    target_url : str


@app.get("/")
def home():
    return FileResponse("frontend/index.html")


@app.post("/shortner")
def root(url_data: URLitems):

    next_id = get_next_sequence_value()
    short_id = encode_base62(next_id)
    short_id = create_url(next_id, url_data.target_url, short_id)
    return {"short_url":f"{port}{short_id}"}
   

@app.get("/{short_id}")

def redirect_url(short_id: str):

    target_url = get_url(short_id)
    if target_url == None :
        raise HTTPException(status_code=404, detail="URL not found")
    return RedirectResponse(url = target_url, status_code=307)