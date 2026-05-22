import { useCallback, useEffect, useState } from "react";
import { getEvents } from "@/lib/api";

export function useEventDates() {
  const [eventDates, setEventDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const refetchDates = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getEvents();
      setEventDates(new Set(all.map((e) => e.date)));
    } catch {
      setEventDates(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchDates();
  }, [refetchDates]);

  return { eventDates, refetchDates, loading };
}
