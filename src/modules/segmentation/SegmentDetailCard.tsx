import React, { useState } from 'react';
import { Customer, SegmentationSummary } from '../../types';
import { Card, Table, Badge } from '../../components/ui';

interface SegmentDetailCardProps {
  summary: SegmentationSummary;
  customers: Customer[];
}

export const SegmentDetailCard: React.FC<SegmentDetailCardProps> = ({ summary, customers }) => {
  const [selectedClusterId, setSelectedClusterId] = useState<number>(0);

  const activeGroup = summary.grupos.find((g) => g.segmento === selectedClusterId) || summary.grupos[0];
  const clusterCustomers = customers.filter((c) => c.segmento === selectedClusterId);

  const columns = [
    {
      header: 'Código',
      accessor: 'id' as const,
      className: 'col-code'
    },
    {
      header: 'Nombre del Cliente',
      accessor: 'nombre' as const,
      className: 'col-name'
    },
    {
      header: 'Gasto (S/)',
      className: 'col-numeric',
      render: (c: Customer) => <span className="font-numeric">S/ {c.gastoAcumulado.toFixed(2)}</span>
    },
    {
      header: 'Visitas',
      className: 'col-center',
      render: (c: Customer) => <span>{c.visitas6Meses}</span>
    },
    {
      header: 'Antigüedad',
      className: 'col-center',
      render: (c: Customer) => <span>{c.antiguedadMeses} m</span>
    }
  ];

  return (
    <Card
      title="Pantalla de Detalle de Segmento"
      subtitle="Inspección granular de métricas y clientes asignados al grupo seleccionado"
    >
      <div className="segment-detail-header">
        <label className="form-label">Seleccionar Segmento a Detallar:</label>
        <div className="k-button-group">
          {summary.grupos.map((g) => (
            <button
              key={g.segmento}
              type="button"
              className={`k-option-btn ${selectedClusterId === g.segmento ? 'active' : ''}`}
              onClick={() => setSelectedClusterId(g.segmento)}
            >
              Segmento #{g.segmento} ({g.cantidad})
            </button>
          ))}
        </div>
      </div>

      {activeGroup && (
        <div className="segment-metrics-highlight">
          <div className="metric-box">
            <span className="metric-label">Clientes en Segmento:</span>
            <span className="metric-num"><Badge variant="primary">{activeGroup.cantidad} clientes</Badge></span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Gasto Promedio:</span>
            <span className="metric-num font-numeric">S/ {activeGroup.gastoPromedio.toFixed(2)}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Visitas Promedio:</span>
            <span className="metric-num">{activeGroup.visitasPromedio.toFixed(1)}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Antigüedad Promedio:</span>
            <span className="metric-num">{activeGroup.antiguedadPromedio.toFixed(1)} meses</span>
          </div>
        </div>
      )}

      <div className="section-spacer-sm" />

      <h4 className="detail-table-title">Clientes pertenecientes al Segmento #{selectedClusterId}</h4>
      <Table
        columns={columns}
        data={clusterCustomers}
        keyExtractor={(c) => c.id}
        emptyMessage={`No hay clientes asignados al Segmento #${selectedClusterId}.`}
      />
    </Card>
  );
};
