import { initDb } from "./lib/db.js";
import { applyCors, handleOptions } from "./lib/cors.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
  validateEventPayload,
} from "./lib/events.js";

export default async function handler(req, res) {
  applyCors(req, res);
  if (handleOptions(req, res)) return;

  await initDb();

  const idParam = req.query.id;
  const eventId =
    idParam !== undefined && idParam !== "" ? Number(idParam) : null;

  if (eventId !== null) {
    if (!Number.isInteger(eventId) || eventId < 1) {
      return res.status(400).json({ detail: "Invalid event id" });
    }

    if (req.method === "GET") {
      const event = await getEvent(eventId);
      if (!event) return res.status(404).json({ detail: "Event not found" });
      return res.status(200).json(event);
    }

    if (req.method === "PUT") {
      const errors = validateEventPayload(req.body ?? {}, { partial: true });
      if (errors.length) {
        return res.status(422).json({ detail: errors.join(". ") });
      }

      const event = await updateEvent(eventId, req.body ?? {});
      if (!event) return res.status(404).json({ detail: "Event not found" });
      return res.status(200).json(event);
    }

    if (req.method === "DELETE") {
      const removed = await deleteEvent(eventId);
      if (!removed) return res.status(404).json({ detail: "Event not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    return res.status(405).json({ detail: "Method not allowed" });
  }

  if (req.method === "GET") {
    const events = await listEvents(req.query.date || null);
    return res.status(200).json(events);
  }

  if (req.method === "POST") {
    const errors = validateEventPayload(req.body ?? {});
    if (errors.length) {
      return res.status(422).json({ detail: errors.join(". ") });
    }

    const event = await createEvent({
      title: req.body.title.trim(),
      description: req.body.description ?? null,
      date: req.body.date,
    });
    return res.status(201).json(event);
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ detail: "Method not allowed" });
}
