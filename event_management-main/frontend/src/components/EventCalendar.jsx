import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatDateForApi } from "@/lib/api";

export function EventCalendar({ value, onChange, eventDates = new Set() }) {
  const hasEvent = (date) => eventDates.has(formatDateForApi(date));

  const tileContent = ({ date, view }) => {
    if (view !== "month" || !hasEvent(date)) return null;
    return <span className="event-calendar__dot" aria-hidden="true" />;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const classes = [];
    if (hasEvent(date)) classes.push("has-event");
    return classes.length ? classes.join(" ") : null;
  };

  return (
    <Calendar
      value={value}
      onChange={onChange}
      className="event-calendar"
      tileContent={tileContent}
      tileClassName={tileClassName}
    />
  );
}
