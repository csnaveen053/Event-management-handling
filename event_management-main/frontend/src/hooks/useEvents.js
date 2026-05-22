import { useCallback, useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  formatDateForApi,
  getEvents,
  updateEvent,
} from "@/lib/api";

export function useEvents(selectedDate) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dateStr = selectedDate ? formatDateForApi(selectedDate) : null;

  const fetchEvents = useCallback(async () => {
    if (!dateStr) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(dateStr);
      setEvents(data);
    } catch (e) {
      setError(e.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (payload) => {
    await createEvent(payload);
    await fetchEvents();
  };

  const editEvent = async (id, payload) => {
    await updateEvent(id, payload);
    await fetchEvents();
  };

  const removeEvent = async (id) => {
    await deleteEvent(id);
    await fetchEvents();
  };

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    addEvent,
    editEvent,
    removeEvent,
  };
}
