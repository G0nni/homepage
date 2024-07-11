"use client";
import React from "react";

export function RealTimeHour() {
  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const time = `${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds}`;
      const date = now.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setTime(time);
      setDate(date);
    };

    updateTimeAndDate();
    const intervalId = setInterval(updateTimeAndDate, 1000);

    return () => clearInterval(intervalId); // Cleanup function to clear the interval when the component is unmounted
  }, []);

  const [hours, minutes, seconds] = time.split(":");

  return (
    <div className="flex flex-col items-center">
      <div className="text-8xl font-medium">
        {hours}
        <span className="mx-1">:</span>
        {minutes}
        <span className="ml-2 text-3xl font-medium">{seconds}</span>
      </div>
      <h1 className="text-base tracking-tight">{date}</h1>
    </div>
  );
}
