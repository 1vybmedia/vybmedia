from fastapi import FastAPI

from .analyzer import analyze_audio
from .models import AnalyzeRequest, AudioAnalysisResult

app = FastAPI(title="VYB Audio Worker")


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {"ok": True, "service": "audio-worker"}


@app.post("/analyze", response_model=AudioAnalysisResult)
def analyze(request: AnalyzeRequest) -> AudioAnalysisResult:
    return analyze_audio(request)
