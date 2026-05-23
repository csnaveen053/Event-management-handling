import { initDb } from "./lib/db.js";
import { applyCors, handleOptions } from "./lib/cors.js";
import {
  createEvent,
  listEvents,
  validateEventPayload,
} from "./lib/events.js";

export default async function handler(req, res) {
  applyCors(req, res);
  if (handleOptions(req, res)) return;

  await initDb();

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
