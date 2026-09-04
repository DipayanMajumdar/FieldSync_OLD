import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import whisper
from parse import parse_yolo_results, parse_whisper_transcript

app = FastAPI(title="FieldSync AI Worker Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading YOLO11 Nano model...")
yolo_model = YOLO('yolo11n.pt')

print("Loading OpenAI Whisper Base...")
whisper_model = whisper.load_model("base")

@app.post("/analyze")
async def analyze(
    image: UploadFile = File(None),
    audio: UploadFile = File(None)
):
    results = {
        "vision_analysis": [],
        "voice_transcript": None,
        "verified": True
    }

    if image:
        temp_img = f"temp_{image.filename}"
        with open(temp_img, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        try:
            yolo_out = yolo_model(temp_img)
            results["vision_analysis"] = parse_yolo_results(yolo_out)
        finally:
            if os.path.exists(temp_img):
                os.remove(temp_img)

    if audio:
        temp_aud = f"temp_{audio.filename}"
        with open(temp_aud, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        try:
            transcription = whisper_model.transcribe(temp_aud)
            results["voice_transcript"] = parse_whisper_transcript(transcription.get("text", ""))
        finally:
            if os.path.exists(temp_aud):
                os.remove(temp_aud)

    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)