"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Package,
  TrendingUp,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
  Box,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface ShipmentRecord {
  id: string;
  created_at: string;
  destinatario: string;
  tipo_jabon: string;
  cantidad: number;
  notas: string | null;
}

const soapTypes = [
  "Arroz",
  "Café",
  "Cacao",
  "Aloe Vera",
  "Cúrcuma",
  "Maicena",
  "Miel",
  "Caléndula",
  "Manzanilla",
  "Lavanda",
  "Carbón Activado",
  "Avena",
  "Jazmín",
  "Rosa",
  "Menta",
  "Coco",
  "Eucalipto",
  "Limón",
  "Naranja",
  "Uva",
  "Vino",
  "Espirulina",
  "Otro",
];

// Función que faltaba → la agregamos aquí
const getTodayISO = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EnviosPage() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShipment, setCurrentShipment] = useState<ShipmentRecord | null>(
    null
  );

  // Form states
  const [destinatario, setDestinatario] = useState("");
  const [tipoJabon1, setTipoJabon1] = useState("");
  const [tipoJabon2, setTipoJabon2] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Fecha
  const [fechaEnvio, setFechaEnvio] = useState<string>("");

  // Toggle states
  const [showStatistics, setShowStatistics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getDateKey = (timestamp: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
      return timestamp;
    }
    try {
      const dt = new Date(timestamp);
      return dt.toISOString().split("T")[0];
    } catch {
      return timestamp.split("T")[0];
    }
  };

  const supabase = createClient();

  useEffect(() => {
    fetchShipments();
  }, [filterStartDate, filterEndDate]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("soap_shipments")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStartDate) query = query.gte("created_at", filterStartDate);
      if (filterEndDate) query = query.lte("created_at", filterEndDate);

      const { data, error } = await query;
      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error("Error al cargar los envíos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDestinatario("");
    setTipoJabon1("");
    setTipoJabon2("");
    setCantidad("");
    setNotas("");
    setFechaEnvio(getTodayISO()); // ← Ahora sí funciona
    setIsEditing(false);
    setCurrentShipment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destinatario || !tipoJabon1 || !cantidad || !fechaEnvio) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      const tipoJabon = tipoJabon1 + (tipoJabon2 ? ` y ${tipoJabon2}` : "");
      const recordData = {
        destinatario,
        tipo_jabon: tipoJabon,
        cantidad: Number(cantidad),
        notas: notas || null,
        created_at: fechaEnvio,
      };

      if (isEditing && currentShipment) {
        const { error } = await supabase
          .from("soap_shipments")
          .update(recordData)
          .eq("id", currentShipment.id);
        if (error) throw error;
        toast.success("Envío actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("soap_shipments")
          .insert([recordData]);
        if (error) throw error;
        toast.success("Envío creado exitosamente");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchShipments();
    } catch (error) {
      console.error("Error saving shipment:", error);
      toast.error("Error al guardar el envío");
    }
  };

  const handleEdit = (shipment: ShipmentRecord) => {
    setCurrentShipment(shipment);
    setDestinatario(shipment.destinatario);
    const tipos = shipment.tipo_jabon.split(" y ");
    setTipoJabon1(tipos[0] || "");
    setTipoJabon2(tipos[1] || "");
    setCantidad(shipment.cantidad.toString());
    setNotas(shipment.notas || "");
    const recordDate = getDateKey(shipment.created_at);
    setFechaEnvio(recordDate);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este envío?")) return;

    try {
      const { error } = await supabase
        .from("soap_shipments")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Envío eliminado");
      fetchShipments();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Error al eliminar el envío");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // Estadísticas
  const totalShipped = shipments.reduce((sum, r) => sum + r.cantidad, 0);
  const totalShipmentsCount = shipments.length;
  const averageShipped =
    totalShipmentsCount > 0 ? totalShipped / totalShipmentsCount : 0;

  const groupedShipments = useMemo(() => {
    const groups: Record<string, ShipmentRecord[]> = {};
    const sorted = [...shipments].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    sorted.forEach((record) => {
      const dateKey = getDateKey(record.created_at);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(record);
    });
    return groups;
  }, [shipments]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Container className="py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📦 Registro de Envíos de Jabones
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y registra tus envíos
              </p>
            </div>

            {/* Botón para ir a la página de Production */}
            <Link href="/admin/production">
              <Button variant="outline" className="gap-2">
                Ir a Registro de Producción
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-shop_orange hover:bg-shop_orange/90"
                  onClick={() => {
                    resetForm();
                    setIsEditing(false);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Envío
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Envío" : "Nuevo Registro de Envío"}
                  </DialogTitle>
                  <DialogDescription>
                    Completa la información del envío
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha de envío *</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={fechaEnvio}
                        onChange={(e) => setFechaEnvio(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {isEditing
                          ? "Fecha original del envío (puedes modificarla)"
                          : "Por defecto hoy. Puedes seleccionar cualquier fecha anterior."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destinatario">Destinatario *</Label>
                      <Input
                        id="destinatario"
                        value={destinatario}
                        onChange={(e) => setDestinatario(e.target.value)}
                        placeholder="Nombre de la persona o empresa"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipo1">Tipo de Jabón 1 *</Label>
                        <Select
                          value={tipoJabon1}
                          onValueChange={setTipoJabon1}
                          required
                        >
                          <SelectTrigger id="tipo1">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {soapTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo2">
                          Tipo de Jabón 2 (opcional)
                        </Label>
                        <Select
                          value={tipoJabon2}
                          onValueChange={setTipoJabon2}
                        >
                          <SelectTrigger id="tipo2">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {soapTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cantidad">
                        Cantidad total (unidades) *
                      </Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="Ej: 50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notas">Notas adicionales</Label>
                      <Textarea
                        id="notas"
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="Observaciones, dirección, método de envío, etc."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-shop_orange hover:bg-shop_orange/90"
                    >
                      {isEditing ? "Actualizar" : "Guardar"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Toggle para Estadísticas */}
          <Button
            variant="outline"
            onClick={() => setShowStatistics(!showStatistics)}
            className="w-full md:w-auto"
          >
            {showStatistics ? "Ocultar Estadísticas" : "Mostrar Estadísticas"}
            {showStatistics ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          {showStatistics && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Enviado
                  </CardTitle>
                  <Box className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShipped}</div>
                  <p className="text-xs text-gray-600">unidades enviadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Envíos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalShipmentsCount}
                  </div>
                  <p className="text-xs text-gray-600">envíos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Promedio por Envío
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {averageShipped.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">unidades por envío</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Toggle para Filtros */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto"
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            {showFilters ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar por Fecha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="start-date">Desde</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="end-date">Hasta</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterStartDate("");
                        setFilterEndDate("");
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Envíos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-600">
                  Cargando envíos...
                </div>
              ) : shipments.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No hay envíos. Comienza agregando tu primer envío.
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedShipments).map(
                    ([dateKey, dateShipments]) => (
                      <div key={dateKey} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 flex items-baseline gap-3">
                          <span>
                            {format(
                              new Date(`${dateKey}T12:00:00`),
                              "EEEE dd 'de' MMMM 'de' yyyy",
                              { locale: es }
                            )}
                          </span>
                          <span className="text-sm font-normal text-gray-500">
                            ({dateShipments.length}{" "}
                            {dateShipments.length === 1 ? "envío" : "envíos"})
                          </span>
                        </h3>

                        <div className="space-y-3 rounded-lg bg-white/40 p-4 shadow-sm">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Destinatario</TableHead>
                                <TableHead>Tipo de Jabón</TableHead>
                                <TableHead className="text-center">
                                  Cantidad
                                </TableHead>
                                <TableHead>Notas</TableHead>
                                <TableHead className="text-right">
                                  Acciones
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dateShipments
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.created_at).getTime() -
                                    new Date(a.created_at).getTime()
                                )
                                .map((shipment) => (
                                  <TableRow key={shipment.id}>
                                    <TableCell className="font-medium">
                                      {shipment.destinatario}
                                    </TableCell>
                                    <TableCell>
                                      {shipment.tipo_jabon
                                        .split(" y ")
                                        .map((tipo, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="outline"
                                            className="mr-1"
                                          >
                                            {tipo.trim()}
                                          </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                      {shipment.cantidad}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                      {shipment.notas || (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEdit(shipment)}
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDelete(shipment.id)
                                          }
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
