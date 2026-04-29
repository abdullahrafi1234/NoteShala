import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveTimerProps {
  startTimeRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<number>;
  savedMinutes: number;
}

export const LiveTimer = ({
  startTimeRef,
  pausedRef,
  savedMinutes,
}: LiveTimerProps) => {
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    setLiveSeconds(0);
    const interval = setInterval(() => {
      if (!document.hidden) {
        const activeMs = Date.now() - startTimeRef.current - pausedRef.current;
        setLiveSeconds(Math.floor(activeMs / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTimeRef, pausedRef]);

  const totalSeconds = savedMinutes * 60 + liveSeconds;
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const label = hours > 0 ? `${hours}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;
  const percent = Math.min(100, (savedMinutes / 300) * 100);

  return (
    <div className="px-5 py-3 border-b border-border/60 bg-gradient-to-r from-muted/50 via-background to-muted/30">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Total reading time
        </div>
        <span className="text-xs font-extrabold text-primary tabular-nums">
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
