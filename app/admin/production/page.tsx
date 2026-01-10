"use client";

import type React from "react";
import Link from "next/link"; // ← Importamos Link de Next.js

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
  ArrowRight, // ← Icono para el botón de enlace
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";

interface ProductionRecord {
  id: string;
  created_at: string;
  tipo_jabon: string;
  cantidad: number;
  color: string | null;
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
  "Leche",
  "Leche de Cabra",
  "Avena",
  "Jazmín",
  "Rosa",
  "Menta",
  "Coco",
  "Frutilla",
  "Eucalipto",
  "Limón",
  "Naranja",
  "Uva",
  "Vino",
  "Té Verde",
  "Espirulina",
  "Otro",
];

const soapColors = [
  "Blanco",
  "Rosa",
  "Verde",
  "Amarillo",
  "Marrón",
  "Azul",
  "Negro",
  "Morado",
  "Otro",
];

export default function ProduccionPage() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ProductionRecord | null>(
    null
  );

  // Form states
  const [tipoJabon1, setTipoJabon1] = useState("");
  const [tipoJabon2, setTipoJabon2] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [color, setColor] = useState("");
  const [notas, setNotas] = useState("");

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  //Fecha
  const [fechaProduccion, setFechaProduccion] = useState<string>("");

  // Toggle states for sections
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
    fetchRecords();
  }, [filterStartDate, filterEndDate]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("soap_production")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStartDate) {
        query = query.gte("created_at", filterStartDate);
      }
      if (filterEndDate) {
        query = query.lte("created_at", filterEndDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Error al cargar los registros");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTipoJabon1("");
    setTipoJabon2("");
    setCantidad("");
    setColor("");
    setNotas("");
    setFechaProduccion(getTodayISO());
    setIsEditing(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoJabon1 || !cantidad || !fechaProduccion) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      const tipoJabon = tipoJabon1 + (tipoJabon2 ? ` y ${tipoJabon2}` : "");
      const recordData = {
        tipo_jabon: tipoJabon,
        cantidad: Number(cantidad),
        color: color || null,
        notas: notas || null,
        created_at: fechaProduccion,
      };

      if (isEditing && currentRecord) {
        const { error } = await supabase
          .from("soap_production")
          .update(recordData)
          .eq("id", currentRecord.id);

        if (error) throw error;
        toast.success("Registro actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("soap_production")
          .insert([recordData]);

        if (error) throw error;
        toast.success("Registro creado exitosamente");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRecords();
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Error al guardar el registro");
    }
  };

  const handleEdit = (record: ProductionRecord) => {
    setCurrentRecord(record);
    const tipos = record.tipo_jabon.split(" y ");
    setTipoJabon1(tipos[0] || "");
    setTipoJabon2(tipos[1] || "");
    setCantidad(record.cantidad.toString());
    setColor(record.color || "");
    setNotas(record.notas || "");
    const recordDate = getDateKey(record.created_at);
    setFechaProduccion(recordDate);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      const { error } = await supabase
        .from("soap_production")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Registro eliminado");
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Error al eliminar el registro");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  // Calculate statistics
  const totalProduction = records.reduce(
    (sum, record) => sum + (Number(record.cantidad) || 0),
    0
  );

  const totalRecords = records.length;
  const averageProduction =
    totalRecords > 0 ? totalProduction / totalRecords : 0;

  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const groupedRecords = useMemo(() => {
    const groups: Record<string, ProductionRecord[]> = {};

    const sorted = [...records].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    sorted.forEach((record) => {
      const dateKey = getDateKey(record.created_at);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(record);
    });

    return groups;
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Container className="py-8">
        <div className="space-y-6">
          {/* Header con botón a Envíos */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📒 Registro de Producción de Jabones
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y registra tu producción diaria
              </p>
            </div>

            {/* Botón para ir a la página de envíos */}
            <Link href="/admin/envios">
              <Button variant="outline" className="gap-2">
                Ir a Registro de Envíos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {/* Botón de nuevo registro (mantenido) */}
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
                  Nuevo Registro
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing
                      ? "Editar Registro"
                      : "Nuevo Registro de Producción"}
                  </DialogTitle>
                  <DialogDescription>
                    Completa la información de la producción del día
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha de producción *</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={fechaProduccion}
                        onChange={(e) => setFechaProduccion(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {isEditing
                          ? "Fecha original del registro (puedes modificarla)"
                          : "Por defecto hoy. Puedes seleccionar cualquier fecha anterior."}
                      </p>
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
                        <Label htmlFor="tipo2">Tipo de Jabón 2</Label>
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
                      <Label htmlFor="cantidad">Cantidad (unidades) *</Label>
                      <Input
                        id="cantidad"
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="Ej: 25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Select value={color} onValueChange={setColor}>
                        <SelectTrigger id="color">
                          <SelectValue placeholder="Selecciona un color" />
                        </SelectTrigger>
                        <SelectContent>
                          {soapColors.map((colorOption) => (
                            <SelectItem key={colorOption} value={colorOption}>
                              {colorOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notas">Notas adicionales</Label>
                      <Textarea
                        id="notas"
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="Observaciones, ingredientes especiales, etc."
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

          {/* Toggle for Statistics */}
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
                    Total Producido
                  </CardTitle>
                  <Package className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProduction}</div>
                  <p className="text-xs text-gray-600">unidades en total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Registros
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRecords}</div>
                  <p className="text-xs text-gray-600">días de producción</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Promedio Diario
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-shop_orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {averageProduction.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-600">unidades por día</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Toggle for Filters */}
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

          {/* Records Table */}
          <Card className="border-green-400 bg-green-200">
            <CardHeader>
              <CardTitle>Historial de Producción</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-600">
                  Cargando registros...
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No hay registros. Comienza agregando tu primera producción.
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Agrupamos los registros por fecha */}
                  {Object.entries(groupedRecords).map(
                    ([dateKey, dateRecords]) => (
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
                            ({dateRecords.length}{" "}
                            {dateRecords.length === 1
                              ? "producción"
                              : "producciones"}
                            )
                          </span>
                        </h3>

                        <div className="space-y-3 rounded-lg bg-white/40 p-4 shadow-sm">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tipo de Jabón</TableHead>
                                <TableHead className="text-center">
                                  Cantidad
                                </TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Notas</TableHead>
                                <TableHead className="text-right">
                                  Acciones
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dateRecords
                                .slice()
                                .sort(
                                  (a, b) =>
                                    new Date(b.created_at).getTime() -
                                    new Date(a.created_at).getTime()
                                )
                                .map((record) => (
                                  <TableRow key={record.id}>
                                    <TableCell>
                                      {record.tipo_jabon
                                        .split(" y ")
                                        .map((tipo, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="mr-1"
                                          >
                                            {tipo.trim()}
                                          </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                      {record.cantidad}
                                    </TableCell>
                                    <TableCell>
                                      {record.color || (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                      {record.notas || (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEdit(record)}
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDelete(record.id)
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
