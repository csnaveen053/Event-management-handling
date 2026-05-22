import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { EventCalendar } from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { useEvents } from "@/hooks/useEvents";
import { useEventDates } from "@/hooks/useEventDates";

export function EventCalendarView() {
  const [selected, setSelected] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { eventDates, refetchDates } = useEventDates();
  const { events, loading, error, addEvent, editEvent, removeEvent } =
    useEvents(selected);

  const selectedDateLabel = format(selected, "MMMM d, yyyy");

  const openCreate = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingEvent) {
        await editEvent(editingEvent.id, payload);
      } else {
        await addEvent(payload);
      }
      await refetchDates();
      closeDialog();
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await removeEvent(deleteTarget.id);
      await refetchDates();
      setDeleteTarget(null);
      if (editingEvent?.id === deleteTarget.id) {
        closeDialog();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 max-w-5xl">
          <h1 className="text-2xl font-bold tracking-tight">Event Manager</h1>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="rounded-lg border p-4 bg-card shrink-0">
            <EventCalendar
              value={selected}
              onChange={(date) => date instanceof Date && setSelected(date)}
              eventDates={eventDates}
            />
          </div>
          <EventList
            events={events}
            loading={loading}
            error={error}
            selectedDateLabel={selectedDateLabel}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent}
            defaultDate={selected}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
            submitting={submitting}
          />
          {editingEvent && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setDeleteTarget(editingEvent)}
            >
              Delete Event
            </Button>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.title}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
