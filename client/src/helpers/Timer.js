// Timer.js
import React from "react";
import { useState, useEffect } from "react";

const styles = {
  timer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    display: "inline-block",
    marginTop: "25px",
    padding: "10px",
    textAlign: "center",
    width: "400px",
  },

  col: {
    width: "25%",
    float: "left",
  },

  box: {
    borderRight: "solid 1px rgba(255, 255, 255, 0.2)",
    padding: "10px",
  },
};

function Timer() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "January, 20, 2023";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.timer} role="timer">
      <div style={styles.col}>
        <div style={styles.box}>
          <p id="day">{days < 10 ? "0" + days : days}</p>
          <span>Days</span>
        </div>
      </div>
      <div style={styles.col}>
        <div style={styles.box}>
          <p id="hour">{hours < 10 ? "0" + hours : hours}</p>
          <span>Hours</span>
        </div>
      </div>
      <div style={styles.col}>
        <div style={styles.box}>
          <p id="minute">{minutes < 10 ? "0" + minutes : minutes}</p>
          <span>Minutes</span>
        </div>
      </div>
      <div style={styles.col}>
        <div style={styles.box}>
          <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}

export default Timer;
