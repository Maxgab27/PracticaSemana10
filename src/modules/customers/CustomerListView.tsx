import React, { useState, useMemo } from 'react';
import { Customer, CustomerFormData } from '../../types';
import { CustomerService } from '../../services/customerService';
import { CustomerTable } from './CustomerTable';
import { CustomerSearchFilter } from './CustomerSearchFilter';
import { CustomerModalForm } from './CustomerModalForm';
import { Button, Card } from '../../components/ui';

interface CustomerListViewProps {
  customers: Customer[];
  onCustomersUpdate: (customers: Customer[]) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onCustomersUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<number | 'todos'>('todos');
  const [sortBy, setSortBy] = useState<'gastoAcumulado' | 'visitas6Meses' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Segmentos disponibles calculados
  const availableSegments = useMemo(() => {
    const set = new Set<number>();
    customers.forEach((c) => {
      if (c.segmento !== undefined) set.add(c.segmento);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [customers]);

  // Filtrado y ordenamiento de clientes (RF-02, RF-06)
  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSegment =
        selectedSegment === 'todos' || c.segmento === selectedSegment;
      return matchSearch && matchSegment;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [customers, searchTerm, selectedSegment, sortBy, sortOrder]);

  const handleCreateOrUpdate = (formData: CustomerFormData) => {
    if (editingCustomer) {
      const res = CustomerService.update(editingCustomer.id, formData);
      if (res.success) {
        onCustomersUpdate(CustomerService.getAll());
        setEditingCustomer(null);
        return { success: true };
      }
      return { success: false, error: res.error };
    } else {
      const res = CustomerService.create(formData);
      if (res.success) {
        onCustomersUpdate(CustomerService.getAll());
        return { success: true };
      }
      return { success: false, error: res.error };
    }
  };

  const handleDelete = (id: string) => {
    CustomerService.delete(id);
    onCustomersUpdate(CustomerService.getAll());
  };

  const handleResetData = () => {
    CustomerService.reset();
    onCustomersUpdate(CustomerService.getAll());
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `comercial_nova_clientes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            CustomerService.saveAll(parsed);
            onCustomersUpdate(parsed);
            alert(`Se importaron ${parsed.length} clientes con éxito.`);
          } else {
            alert("El archivo no contiene un arreglo de clientes válido.");
          }
        } catch {
          alert("Error al leer el archivo JSON.");
        }
      };
    }
  };

  const toggleSort = (field: 'gastoAcumulado' | 'visitas6Meses') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="module-view customer-view">
      <header className="page-header flex-header">
        <div>
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-description">
            Administra la base de datos de Comercial Nova con operaciones CRUD y filtros avanzados.
          </p>
        </div>
        <div className="header-actions">
          <label className="btn btn-outline" style={{ cursor: 'pointer' }} title="Importar clientes desde archivo JSON">
            Importar JSON
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportJSON}
            />
          </label>
          <Button
            variant="outline"
            onClick={handleExportJSON}
            title="Exportar clientes actuales a JSON"
          >
            Exportar JSON
          </Button>
          <Button
            variant="outline"
            onClick={handleResetData}
            title="Restablece los 12 registros de prueba del caso"
          >
            Restablecer Iniciales
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
          >
            Nuevo Cliente
          </Button>
        </div>
      </header>

      <Card>
        <CustomerSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
          availableSegments={availableSegments}
        />

        <div className="section-spacer-sm" />

        <CustomerTable
          customers={filteredCustomers}
          onEdit={(customer) => {
            setEditingCustomer(customer);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          sortBy={sortBy || undefined}
          sortOrder={sortOrder}
          onSortChange={toggleSort}
        />
      </Card>

      <CustomerModalForm
        isOpen={isModalOpen}
        isEditMode={!!editingCustomer}
        initialData={editingCustomer}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  );
};
