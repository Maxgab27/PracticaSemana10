import React from 'react';
import { SegmentationSummary } from '../../types';
import { Card, Table, Badge } from '../../components/ui';

interface ClusterResultsTableProps {
  summary: SegmentationSummary;
}

export const ClusterResultsTable: React.FC<ClusterResultsTableProps> = ({ summary }) => {
  const columns = [
    {
      header: 'Segmento',
      render: (item: { segmento: number }) => (
        <Badge variant="primary">Grupo {item.segmento}</Badge>
      )
    },
    {
      header: 'Cantidad de Clientes',
      accessor: 'cantidad' as const,
      render: (item: { cantidad: number }) => <strong>{item.cantidad}</strong>
    },
    {
      header: 'Gasto Promedio',
      render: (item: { gastoPromedio: number }) => (
        <span className="font-numeric">S/ {item.gastoPromedio.toFixed(2)}</span>
      )
    },
    {
      header: 'Visitas Promedio (6m)',
      render: (item: { visitasPromedio: number }) => (
        <span>{item.visitasPromedio.toFixed(1)} visitas</span>
      )
    },
    {
      header: 'Antigüedad Promedio',
      render: (item: { antiguedadPromedio: number }) => (
        <span>{item.antiguedadPromedio.toFixed(1)} meses</span>
      )
    }
  ];

  return (
    <Card
      title="Resumen Estadístico por Segmento (Centroides)"
      subtitle={`Resultados calculados para K=${summary.k} sobre ${summary.cantidadProcesada} clientes`}
    >
      <Table
        columns={columns}
        data={summary.grupos}
        keyExtractor={(item) => item.segmento}
      />
    </Card>
  );
};
