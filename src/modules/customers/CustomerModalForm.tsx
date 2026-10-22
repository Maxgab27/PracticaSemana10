import React, { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from '../../types';
import { Modal, InputField, Button } from '../../components/ui';

interface CustomerModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => { success: boolean; error?: string };
  initialData?: Customer | null;
  isEditMode?: boolean;
}

export const CustomerModalForm: React.FC<CustomerModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    id: '',
    nombre: '',
    gastoAcumulado: 0,
    visitas6Meses: 0,
    antiguedadMeses: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formAlert, setFormAlert] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nombre: initialData.nombre,
        gastoAcumulado: initialData.gastoAcumulado,
        visitas6Meses: initialData.visitas6Meses,
        antiguedadMeses: initialData.antiguedadMeses
      });
    } else {
      setFormData({
        id: '',
        nombre: '',
        gastoAcumulado: 0,
        visitas6Meses: 0,
        antiguedadMeses: 0
      });
    }
    setErrors({});
    setFormAlert(null);
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.id.trim()) {
      errs.id = 'El código del cliente es obligatorio.';
    }
    if (!formData.nombre.trim()) {
      errs.nombre = 'El nombre es obligatorio.';
    }
    if (formData.gastoAcumulado === undefined || formData.gastoAcumulado < 0) {
      errs.gastoAcumulado = 'El gasto acumulado no puede ser negativo.';
    }
    if (formData.visitas6Meses === undefined || formData.visitas6Meses < 0) {
      errs.visitas6Meses = 'La cantidad de visitas no puede ser negativa.';
    }
    if (formData.antiguedadMeses === undefined || formData.antiguedadMeses < 0) {
      errs.antiguedadMeses = 'La antigüedad no puede ser negativa.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = onSubmit(formData);
    if (!res.success) {
      setFormAlert(res.error || 'Error al guardar el cliente.');
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? `Editar Cliente: ${initialData?.id}` : 'Registrar Nuevo Cliente'}
      onClose={onClose}
      footer={
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="button">
            {isEditMode ? 'Guardar Cambios' : 'Registrar Cliente'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="customer-form">
        {formAlert && <div className="alert alert-danger">{formAlert}</div>}

        <InputField
          label="Código Único"
          placeholder="Ej. C013"
          disabled={isEditMode}
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          error={errors.id}
          helperText={isEditMode ? 'El código no puede modificarse.' : 'Identificador alfanumérico único.'}
        />

        <InputField
          label="Nombre Completo"
          placeholder="Ej. Carmen Salazar"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
        />

        <InputField
          label="Gasto Acumulado (S/)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.gastoAcumulado}
          onChange={(e) => setFormData({ ...formData, gastoAcumulado: parseFloat(e.target.value) || 0 })}
          error={errors.gastoAcumulado}
        />

        <InputField
          label="Visitas en los últimos 6 meses"
          type="number"
          min="0"
          placeholder="0"
          value={formData.visitas6Meses}
          onChange={(e) => setFormData({ ...formData, visitas6Meses: parseInt(e.target.value, 10) || 0 })}
          error={errors.visitas6Meses}
        />

        <InputField
          label="Antigüedad como cliente (meses)"
          type="number"
          min="0"
          placeholder="0"
          value={formData.antiguedadMeses}
          onChange={(e) => setFormData({ ...formData, antiguedadMeses: parseInt(e.target.value, 10) || 0 })}
          error={errors.antiguedadMeses}
        />
      </form>
    </Modal>
  );
};
