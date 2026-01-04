"use client";

import { useEffect, useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

export default function SoapProductionApp() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    soapName: "",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("soap_production")
      .select("*")
      .order("date", { ascending: false });

    if (!error) setEntries(data || []);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function addEntry() {
    if (!form.date || !form.soapName || !form.quantity) return;

    await supabase.from("soap_production").insert([
      {
        date: form.date,
        soap_name: form.soapName,
        quantity: Number(form.quantity),
        notes: form.notes,
      },
    ]);

    setForm({ date: "", soapName: "", quantity: "", notes: "" });
    fetchEntries();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📒 Registro de Producción de Jabones
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 mb-8 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Nueva Producción</h2>

        <div className="space-y-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="soapName"
            placeholder="Tipo de jabón (ej: Rosa y miel)"
            value={form.soapName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Cantidad producida"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="notes"
            placeholder="Notas (ingredientes, observaciones, costos, etc.)"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={addEntry}
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
          >
            Guardar producción
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Producciones registradas</h2>

        {loading && <p className="text-gray-500">Cargando...</p>}

        <div className="grid gap-4">
          {!loading && entries.length === 0 && (
            <p className="text-gray-500">
              Todavía no hay producciones registradas.
            </p>
          )}

          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{entry.soap_name}</h3>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </div>
              <p className="text-sm">
                Cantidad: <strong>{entry.quantity}</strong>
              </p>
              {entry.notes && (
                <p className="text-sm text-gray-600 mt-2">📝 {entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
