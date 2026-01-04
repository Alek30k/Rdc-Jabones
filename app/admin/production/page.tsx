"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  "Cúrcuma",
  "Avena",
  "Lavanda",
  "Menta",
  "Carbón Activado",
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
  const [tipoJabon, setTipoJabon] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [color, setColor] = useState("");
  const [notas, setNotas] = useState("");

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

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
    setTipoJabon("");
    setCantidad("");
    setColor("");
    setNotas("");
    setIsEditing(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoJabon || !cantidad) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      const recordData = {
        tipo_jabon: tipoJabon,
        cantidad: Number(cantidad),
        color: color || null,
        notas: notas || null,
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
    setTipoJabon(record.tipo_jabon);
    setCantidad(record.cantidad.toString());
    setColor(record.color || "");
    setNotas(record.notas || "");
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

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Container className="py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Producción de Jabones
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y registra tu producción diaria
              </p>
            </div>
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
                      <Label htmlFor="tipo">Tipo de Jabón *</Label>
                      <Select
                        value={tipoJabon}
                        onValueChange={setTipoJabon}
                        required
                      >
                        <SelectTrigger id="tipo">
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

          {/* Statistics Cards */}
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

          {/* Filters */}
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

          {/* Records Table */}
          <Card>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo de Jabón</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Notas
                        </TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {format(new Date(record.created_at), "dd/MM/yyyy", {
                              locale: es,
                            })}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">{record.tipo_jabon}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {record.cantidad}
                          </TableCell>
                          <TableCell>
                            {record.color ? (
                              <span className="text-sm text-gray-700">
                                {record.color}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-xs truncate">
                            {record.notas ? (
                              <span className="text-sm text-gray-600">
                                {record.notas}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(record.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
