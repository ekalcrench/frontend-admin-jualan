import { useState, useRef, useEffect } from "react";
import { ResendOtpTimerProps } from "./ResendOtpTimer.types";

export default function useResendOtpTimer({
  delaySeconds,
  onResend,
}: ResendOtpTimerProps) {
  const [showResend, setShowResend] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(delaySeconds);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (delaySeconds <= 0) {
      setSecondsLeft(0);
      setShowResend(true);
      return;
    }

    setSecondsLeft(delaySeconds);
    setShowResend(false);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setShowResend(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [delaySeconds]);

  const handleResend = () => {
    if (!showResend) return;
    onResend?.();
  };

  return { containerRef, secondsLeft, showResend, handleResend };
}
