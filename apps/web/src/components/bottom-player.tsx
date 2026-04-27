import { Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export function BottomPlayer() {
  return (
    <footer className="bottom-player" aria-label="Audio player">
      <div className="player-track">
        <span className="cover-art" aria-hidden="true" />
        <div>
          <p>Ready to play</p>
          <span>Select a track, snippet, or vyb</span>
        </div>
      </div>
      <div className="player-controls">
        <button aria-label="Previous track">
          <SkipBack size={18} />
        </button>
        <button className="primary-control" aria-label="Pause">
          <Pause size={20} />
        </button>
        <button aria-label="Next track">
          <SkipForward size={18} />
        </button>
      </div>
      <div className="volume-control">
        <Volume2 size={18} />
        <div className="volume-meter" aria-hidden="true">
          <span />
        </div>
      </div>
    </footer>
  );
}
