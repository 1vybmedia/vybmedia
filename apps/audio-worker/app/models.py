from pydantic import BaseModel, Field, HttpUrl


class AnalyzeRequest(BaseModel):
    audio_url: HttpUrl
    asset_id: str
    asset_kind: str = Field(pattern="^(track|snippet|mix)$")


class AudioAnalysisResult(BaseModel):
    asset_id: str
    asset_kind: str
    bpm: float | None = None
    musical_key: str | None = None
    camelot_key: str | None = None
    beat_grid: list[float] = Field(default_factory=list)
    energy_curve: list[float] = Field(default_factory=list)
    waveform_peaks: list[float] = Field(default_factory=list)
    confidence: float | None = None
