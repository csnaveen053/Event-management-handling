import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForApi } from "@/lib/api";

const emptyForm = { title: "", description: "", date: "" };

export function EventForm({ event, defaultDate, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description || "",
        date: event.date,
      });
    } else {
      setForm({
        ...emptyForm,
        date: defaultDate ? formatDateForApi(defaultDate) : "",
      });
    }
    setValidationError("");
  }, [event, defaultDate]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    if (!form.date) {
      setValidationError("Date is required.");
      return;
    }
    setValidationError("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Event title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Optional description"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={handleChange("date")}
          required
        />
      </div>
      {validationError && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : event ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
