# VYB Audio Worker

Python service responsible for upload-time audio analysis.

## Local run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

The first implementation should download source audio from signed storage URLs, run librosa analysis, and return BPM, key, Camelot key, beat grid, waveform peaks, and energy curve data to the API.
