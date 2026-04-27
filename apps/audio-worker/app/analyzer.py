from .models import AnalyzeRequest, AudioAnalysisResult


def analyze_audio(request: AnalyzeRequest) -> AudioAnalysisResult:
    # Storage download and librosa extraction are wired in the first worker task.
    return AudioAnalysisResult(
        asset_id=request.asset_id,
        asset_kind=request.asset_kind,
        confidence=0.0,
    )
