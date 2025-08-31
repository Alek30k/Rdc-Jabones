"use client";

import type React from "react";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import type { Address } from "@/sanity.types";
import {
  AddressFormData,
  createAddressSimple,
} from "@/sanity/lib/actions/address-actions";

interface AddAddressModalProps {
  onAddressAdded: (address: Address) => void;
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
}

const AddAddressModal = ({
  onAddressAdded,
  variant = "outline",
  className,
  children,
}: AddAddressModalProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Argentina",
    phone: "",
    notes: "",
    isDefault: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const validateForm = () => {
    const required = ["name", "address", "city", "state", "zip"];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`El campo ${field} es requerido`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.id) {
      toast.error("Debes estar logueado para agregar una dirección");
      return;
    }

    const addressData: AddressFormData = {
      ...formData,
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      userName: user.fullName || user.firstName || "Usuario",
    };

    startTransition(async () => {
      try {
        const result = await createAddressSimple(addressData);

        if (result.success) {
          toast.success("result.message");
          onAddressAdded(result.data as Address);
          setOpen(false);

          // Reset form
          setFormData({
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "Argentina",
            phone: "",
            notes: "",
            isDefault: false,
          });
        } else {
          toast.error("result.error");
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        toast.error("Error inesperado. Intenta nuevamente.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} className={className}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Nueva Dirección
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Agregar Nueva Dirección
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Nombre de la dirección *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Casa, Oficina, etc."
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección completa *</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Calle, número, barrio, referencias"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="state">Departamento/Estado *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Departamento"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">Código Postal *</Label>
                <Input
                  id="zip"
                  name="zip"
                  placeholder="Código postal"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Número de contacto"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Instrucciones especiales para la entrega"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={handleCheckboxChange}
                disabled={isPending}
              />
              <Label htmlFor="isDefault" className="text-sm">
                Establecer como dirección predeterminada
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Guardando..." : "Guardar Dirección"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
