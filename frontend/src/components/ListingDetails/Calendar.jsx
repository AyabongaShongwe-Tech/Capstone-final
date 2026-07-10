import { useEffect, useState } from "react";
import "./Calendar.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Local YYYY-MM-DD (avoids timezone shifts from toISOString)
function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function buildMonthCells(year, month) {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function MonthGrid({ year, month, checkIn, checkOut, todayIso, onPick }) {
  const cells = buildMonthCells(year, month);
  return (
    <div className="cal__month">
      <div className="cal__weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal__weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="cal__days">
        {cells.map((date, i) => {
          if (!date) return <span key={i} className="cal__day cal__day--empty" />;
          const iso = ymd(date);
          const isPast = iso < todayIso;
          const isStart = iso === checkIn;
          const isEnd = iso === checkOut;
          const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut;
          const cls = [
            "cal__day",
            isPast ? "cal__day--past" : "",
            isStart || isEnd ? "cal__day--selected" : "",
            inRange ? "cal__day--range" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={isPast}
              onClick={() => onPick(iso)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Two-month range calendar. value = { checkIn, checkOut } (YYYY-MM-DD). */
function Calendar({ value, onChange }) {
  const { checkIn = "", checkOut = "" } = value || {};
  const [base, setBase] = useState(() => {
    const d = checkIn ? new Date(checkIn) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Keep the calendar showing the check-in month whenever the dates change
  // (e.g. when the user edits the date fields in the reserve card).
  useEffect(() => {
    if (!checkIn) return;
    const d = new Date(checkIn);
    setBase((cur) => {
      if (cur.getFullYear() === d.getFullYear() && cur.getMonth() === d.getMonth()) {
        return cur; // already showing this month — don't fight manual navigation
      }
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });
  }, [checkIn]);

  const todayIso = ymd(new Date());
  const nextMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1);

  function pick(iso) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: iso, checkOut: "" });
    } else if (iso > checkIn) {
      onChange({ checkIn, checkOut: iso });
    } else {
      onChange({ checkIn: iso, checkOut: "" });
    }
  }

  function shift(months) {
    setBase((b) => new Date(b.getFullYear(), b.getMonth() + months, 1));
  }

  return (
    <div className="cal">
      <button
        type="button"
        className="cal__nav cal__nav--prev"
        onClick={() => shift(-1)}
        aria-label="Previous month"
      >
        ‹
      </button>
      <button
        type="button"
        className="cal__nav cal__nav--next"
        onClick={() => shift(1)}
        aria-label="Next month"
      >
        ›
      </button>

      <div className="cal__grids">
        <div className="cal__title">
          {MONTHS[base.getMonth()]} {base.getFullYear()}
        </div>
        <div className="cal__title cal__title--right">
          {MONTHS[nextMonth.getMonth()]} {nextMonth.getFullYear()}
        </div>

        <MonthGrid
          year={base.getFullYear()}
          month={base.getMonth()}
          checkIn={checkIn}
          checkOut={checkOut}
          todayIso={todayIso}
          onPick={pick}
        />
        <MonthGrid
          year={nextMonth.getFullYear()}
          month={nextMonth.getMonth()}
          checkIn={checkIn}
          checkOut={checkOut}
          todayIso={todayIso}
          onPick={pick}
        />
      </div>

      <div className="cal__footer">
        <button
          type="button"
          className="cal__clear"
          onClick={() => onChange({ checkIn: "", checkOut: "" })}
        >
          Clear dates
        </button>
      </div>
    </div>
  );
}

export default Calendar;
