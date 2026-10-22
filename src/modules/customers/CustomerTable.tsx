import React, { useState } from 'react';
import { Customer } from '../../types';
import { Table, Button, Badge, Modal } from '../../components/ui';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (field: 'gastoAcumulado' | 'visitas6Meses') => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
  onSortChange
}) => {
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'id' as const,
      className: 'col-code'
    },
    {
      header: 'Nombre',
      accessor: 'nombre' as const,
      className: 'col-name'
    },
    {
      header: 'Gasto (S/)',
      className: 'col-numeric',
      render: (row: Customer) => (
        <span className="font-numeric">S/ {row.gastoAcumulado.toFixed(2)}</span>
      )
    },
    {
      header: 'Visitas',
      className: 'col-center',
      render: (row: Customer) => <span>{row.visitas6Meses}</span>
    },
    {
      header: 'Antigüedad',
      className: 'col-center',
      render: (row: Customer) => <span>{row.antiguedadMeses} m</span>
    },
    {
      header: 'Segmento',
      className: 'col-center',
      render: (row: Customer) =>
        row.segmento !== undefined ? (
          <Badge variant="primary">Grupo {row.segmento}</Badge>
        ) : (
          <Badge variant="gray">Sin asignar</Badge>
        )
    },
    {
      header: 'Acciones',
      className: 'col-actions',
      render: (row: Customer) => (
        <div className="table-actions">
          <Button size="sm" variant="secondary" onClick={() => onEdit(row)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="table-toolbar">
        {onSortChange && (
          <div className="sort-buttons">
            <span className="sort-label">Ordenar por:</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onSortChange('gastoAcumulado')}
            >
              Gasto
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onSortChange('visitas6Meses')}
            >
              Visitas
            </button>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={customers}
        keyExtractor={(row) => row.id}
        emptyMessage="No se encontraron clientes coincidentes con el criterio."
      />

      {/* Modal de confirmación para eliminar (Regla de negocio obligatoria) */}
      <Modal
        isOpen={!!deleteTarget}
        title="Confirmación de Eliminación"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirmar Eliminación
            </Button>
          </div>
        }
      >
        <p>
          ¿Estás seguro de que deseas eliminar al cliente{' '}
          <strong>
            {deleteTarget?.nombre} ({deleteTarget?.id})
          </strong>
          ?
        </p>
        <p className="text-muted">Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
};
