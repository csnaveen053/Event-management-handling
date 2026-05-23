import { client } from "./db.js";

function rowToEvent(row) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description ?? null,
    date: row.date,
  };
}

export async function listEvents(date) {
  const result = date
    ? await client.execute({
        sql: "SELECT id, title, description, date FROM events WHERE date = ? ORDER BY id",
        args: [date],
      })
    : await client.execute(
        "SELECT id, title, description, date FROM events ORDER BY id"
      );
  return result.rows.map(rowToEvent);
}

export async function getEvent(id) {
  const result = await client.execute({
    sql: "SELECT id, title, description, date FROM events WHERE id = ?",
    args: [id],
  });
  return result.rows[0] ? rowToEvent(result.rows[0]) : null;
}

export async function createEvent({ title, description, date }) {
  await client.execute({
    sql: "INSERT INTO events (title, description, date) VALUES (?, ?, ?)",
    args: [title, description ?? null, date],
  });
  const inserted = await client.execute("SELECT last_insert_rowid() AS id");
  const id = Number(inserted.rows[0].id);
  return getEvent(id);
}

export async function updateEvent(id, updates) {
  const existing = await getEvent(id);
  if (!existing) return null;

  const title = updates.title ?? existing.title;
  const description =
    updates.description !== undefined
      ? updates.description
      : existing.description;
  const date = updates.date ?? existing.date;

  await client.execute({
    sql: "UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?",
    args: [title, description, date, id],
  });
  return getEvent(id);
}

export async function deleteEvent(id) {
  const result = await client.execute({
    sql: "DELETE FROM events WHERE id = ?",
    args: [id],
  });
  return result.rowsAffected > 0;
}

export function validateEventPayload(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("title is required");
    } else if (body.title.length > 200) {
      errors.push("title must be at most 200 characters");
    }
  }

  if (!partial || body.date !== undefined) {
    if (typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      errors.push("date must be YYYY-MM-DD");
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      errors.push("description must be a string");
    }
  }

  return errors;
}
