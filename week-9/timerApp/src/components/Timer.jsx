import { useState } from "react";
import style from "./Timer.module.css";
import { calculateTime, formatTime } from "../utils/auxiliaryFunctions";
import { useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [feildEdit, setFeildEdit] = useState({ field: null, value: "" });

  const handleEditState = (field) => {
    if (feildEdit.field == field) {
      const newTime = {
        ...formatTime(time),
        [field]: feildEdit.value.padStart(2, "0"),
      };

      const calculatedTime = calculateTime(
        newTime.hours,
        newTime.minutes,
        newTime.seconds
      );

      setTime(calculatedTime);
      setInitialTime(calculatedTime);

      setFeildEdit({ field: null, value: "" });
    } else {
      console.log("caleed");

      setIsRunning(false);
      setFeildEdit({
        field,
        value: formatTime(time)[field].replace(/^0+/, ""),
      });
    }
  };

  const handleEdit = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setFeildEdit((prevValue) => ({ ...prevValue, value }));
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  useEffect(() => {
    const progress =
      initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0;

    document.documentElement.style.setProperty("--progress", `${progress}%`);
  }, [time, initialTime]);

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className={style.timerApp}>
      <h1>Timer</h1>
      <div className={style.timerDisplay}>
        <div className={style.timerCircle}>
          <div className={style.timerTime}>
            {feildEdit.field == "hours" ? (
              <input
                className={style.timeInput}
                type="text"
                autoFocus
                onChange={handleEdit}
                onBlur={() => handleEditState("hours")}
              />
            ) : (
              <span
                className={style.timeUnit}
                onClick={() => handleEditState("hours")}
              >
                {hours}
              </span>
            )}
            :
            {feildEdit.field == "minutes" ? (
              <input
                className={style.timeInput}
                type="text"
                onChange={handleEdit}
                autoFocus
                onBlur={() => handleEditState("minutes")}
              />
            ) : (
              <span
                className={style.timeUnit}
                onClick={() => handleEditState("minutes")}
              >
                {minutes}
              </span>
            )}
            :
            {feildEdit.field == "seconds" ? (
              <input
                className={style.timeInput}
                type="text"
                name="second"
                autoFocus
                onChange={handleEdit}
                onBlur={() => handleEditState("seconds")}
              />
            ) : (
              <span
                className={style.timeUnit}
                onClick={() => handleEditState("seconds")}
              >
                {seconds}
              </span>
            )}
            <div className={style.actionButtons}>
              <button
                className={style.actionButton}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                className={style.actionButton}
                onClick={() => {
                  setTime(0);
                  setInitialTime(0);
                  setIsRunning(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
