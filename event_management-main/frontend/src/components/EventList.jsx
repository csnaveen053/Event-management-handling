import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EventList({
  events,
  loading,
  error,
  selectedDateLabel,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <Card className="flex-1">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading events...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex-1">
        <CardContent className="py-8 text-center text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-lg">Events on {selectedDateLabel}</CardTitle>
        <CardDescription>
          {events.length === 0
            ? "No events for this date. Click Add Event to create one."
            : `${events.length} event(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start justify-between gap-3 rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
            onClick={() => onEdit(event)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onEdit(event)}
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{event.title}</p>
              {event.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit event"
                onClick={() => onEdit(event)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete event"
                onClick={() => onDelete(event)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
