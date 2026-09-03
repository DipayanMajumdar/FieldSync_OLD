from fastapi import FastAPI
from pydantic import BaseModel
from ultralytics import YOLO
from faster_whisper import WhisperModel

app = FastAPI()

# Load AI Models into memory
mdl_cv = YOLO('yolov8n.pt') 
mdl_nlp = WhisperModel("tiny", device="cpu", compute_type="int8")

class Evd(BaseModel):
    id: int
    uri: str
    typ: str

@app.post("/analyze")
async def run_ai(e: Evd):
    if e.typ == "img":
        res = mdl_cv(e.uri)
        dtc = [mdl_cv.names[int(box.cls)] for box in res[0].boxes]
        r = f"Detected: {', '.join(dtc)}" if dtc else "No construction elements found"
    
    elif e.typ == "aud":
        # Process the voice note file passed from Express
        segs, _ = mdl_nlp.transcribe(e.uri, beam_size=5)
        txt = " ".join([s.text for s in segs])
        r = f"Transcription: {txt}"
        
    else:
        r = "Unknown media format"
        
    return {"id": e.id, "sts": r}