import { useState, useEffect, useRef } from "react";

export function HoraLive() {
  const [currentTime, setCurrentTime] = useState("");
  const dniInputRef = useRef(null);

  useEffect(() => {
    if (dniInputRef.current) dniInputRef.current.focus();

    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{currentTime}</div>;
}
