"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createClient } from "@/lib/supabase/client";
import { format, isSameDay, parseISO, addMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Plus, Trash, Edit } from "lucide-react";

/**
 * ProductionCalendar
 * - lee/escribe en tabla `events` de Supabase
 * - campos: id, title, date, type, notes, recurrence, reminder_minutes
 *
 * NOTA: los recordatorios funcionan en cliente (mientras la pestaña esté abierta).
 * Para recordatorios reales (push/email) hace falta un job server-side.
 */

type Recurrence = "none" | "weekly" | "monthly";
type EventType = "produccion" | "feria" | "entrega" | "otro";

interface EventRow {
  id: string;
  title: string;
  date: string; // ISO
  type: EventType;
  notes?: string | null;
  recurrence?: Recurrence;
  reminder_minutes?: number | null;
  created_at?: string;
}

const supabase = createClient();

export default function ProductionCalendar() {
  const [value, setValue] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState(""); // yyyy-MM-ddTHH:mm
  const [type, setType] = useState<EventType>("produccion");
  const [notes, setNotes] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [reminderMinutes, setReminderMinutes] = useState<number>(0);

  const remindersRef = useRef<Record<string, number>>({}); // timeouts

  // fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      setEvents((data as EventRow[]) || []);
    } catch (err) {
      console.error("Error fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // schedule simple in-page reminders for upcoming events (client-side only)
  useEffect(() => {
    // clear previous timers
    Object.values(remindersRef.current).forEach((t) => clearTimeout(t));
    remindersRef.current = {};

    events.forEach((ev) => {
      const mins = Number(ev.reminder_minutes) || 0;
      if (mins <= 0) return;

      const eventDate = parseISO(ev.date);
      const notifyAt = addMinutes(eventDate, -mins);
      const delay = notifyAt.getTime() - Date.now();
      if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 30) {
        // schedule only upcoming within 30 days to avoid long timers
        const t = window.setTimeout(() => {
          // simple UI alert (podés reemplazar por Notification API si pedís permisos)
          alert(`Recordatorio: ${ev.title} en ${format(eventDate, "PPPp")}`);
        }, delay);
        remindersRef.current[ev.id] = t;
      }
    });

    return () => {
      Object.values(remindersRef.current).forEach((t) => clearTimeout(t));
      remindersRef.current = {};
    };
  }, [events]);

  const eventsForDay = useMemo(() => {
    return events.filter((ev) => isSameDay(new Date(ev.date), value));
  }, [events, value]);

  // helpers CRUD
  const openCreateModal = (prefillDate?: Date) => {
    setEditing(null);
    setTitle("");
    setType("produccion");
    setNotes("");
    setRecurrence("none");
    setReminderMinutes(0);
    if (prefillDate) {
      const iso = new Date(prefillDate).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      setDateStr(iso);
    } else {
      setDateStr(new Date().toISOString().slice(0, 16));
    }
    setIsOpen(true);
  };

  const openEditModal = (ev: EventRow) => {
    setEditing(ev);
    setTitle(ev.title);
    setType(ev.type || "produccion");
    setNotes(ev.notes || "");
    setRecurrence((ev.recurrence as Recurrence) || "none");
    setReminderMinutes(ev.reminder_minutes || 0);
    // fill dateStr in local timezone
    const d = new Date(ev.date);
    setDateStr(
      new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    );
    setIsOpen(true);
  };

  const saveEvent = async () => {
    try {
      const isoDate = new Date(dateStr).toISOString();
      if (editing) {
        const { error } = await supabase
          .from("events")
          .update({
            title,
            date: isoDate,
            type,
            notes,
            recurrence,
            reminder_minutes: reminderMinutes,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert([
          {
            title,
            date: isoDate,
            type,
            notes,
            recurrence,
            reminder_minutes: reminderMinutes,
          },
        ]);
        if (error) throw error;
      }
      setIsOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event", err);
      alert("Error guardando evento");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Eliminar este evento?")) return;
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      fetchEvents();
    } catch (err) {
      console.error("Error deleting", err);
      alert("Error eliminando evento");
    }
  };

  // calendar tile content: mark days with events
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayEvents = events.filter((ev) =>
        isSameDay(new Date(ev.date), date)
      );
      if (dayEvents.length > 0) {
        return (
          <div className="mt-1 flex flex-wrap gap-1">
            {dayEvents.slice(0, 2).map((ev) => (
              <span
                key={ev.id}
                className="text-xs px-1 rounded-full bg-green-100 text-green-800"
              >
                {ev.type === "produccion"
                  ? "P"
                  : ev.type === "feria"
                    ? "F"
                    : ev.type === "entrega"
                      ? "E"
                      : "O"}
              </span>
            ))}
            {dayEvents.length > 2 && (
              <span className="text-xs text-gray-500">...</span>
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Calendar */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Calendario de Producción</CardTitle>
          <div>
            <Button size="sm" onClick={() => openCreateModal(value)}>
              <Plus className="w-4 h-4 mr-2" /> Nuevo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            onChange={(d) => setValue(Array.isArray(d) ? d[0] : d)}
            value={value}
            tileContent={tileContent}
          />
        </CardContent>
      </Card>

      {/* Events list */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Eventos del día — {format(value, "PPP")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : eventsForDay.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay eventos para este día.
            </div>
          ) : (
            <div className="space-y-3">
              {eventsForDay.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 border rounded flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <strong>{ev.title}</strong>
                      <span className="text-xs text-gray-500">[{ev.type}]</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(ev.date), "p - PPP")}
                      {ev.recurrence && ev.recurrence !== "none" && (
                        <span className="ml-2 text-xs text-gray-400">
                          • {ev.recurrence}
                        </span>
                      )}
                    </div>
                    {ev.notes && (
                      <div className="mt-2 text-sm text-gray-700">
                        {ev.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(ev)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEvent(ev.id)}
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal (simple) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-lg p-6 z-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Editar evento" : "Nuevo evento"}
              </h3>
              <button className="p-1" onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle((e.target as HTMLInputElement).value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Fecha y hora</label>
                <input
                  type="datetime-local"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as EventType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produccion">Producción</SelectItem>
                    <SelectItem value="feria">Feria</SelectItem>
                    <SelectItem value="entrega">Entrega</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">Recurrencia</label>
                <Select
                  value={recurrence}
                  onValueChange={(v) => setRecurrence(v as Recurrence)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Recordatorio (minutos antes)
                </label>
                <Input
                  type="number"
                  value={String(reminderMinutes)}
                  onChange={(e) =>
                    setReminderMinutes(
                      Number((e.target as HTMLInputElement).value || 0)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Notas</label>
                <Textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes((e.target as HTMLTextAreaElement).value)
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                {editing && (
                  <Button
                    variant="destructive"
                    onClick={() => editing && deleteEvent(editing.id)}
                  >
                    Eliminar
                  </Button>
                )}
                <Button onClick={saveEvent}>
                  {editing ? "Guardar" : "Crear"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
