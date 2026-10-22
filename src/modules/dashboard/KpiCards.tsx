import React from 'react';
import { Customer, SegmentationSummary } from '../../types';
import { Card } from '../../components/ui';

interface KpiCardsProps {
  customers: Customer[];
  summary: SegmentationSummary | null;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ customers, summary }) => {
  const totalCustomers = customers.length;
  const gastoPromedio =
    totalCustomers > 0
      ? (customers.reduce((sum, c) => sum + c.gastoAcumulado, 0) / totalCustomers).toFixed(2)
      : '0.00';
  const visitasPromedio =
    totalCustomers > 0
      ? (customers.reduce((sum, c) => sum + c.visitas6Meses, 0) / totalCustomers).toFixed(1)
      : '0.0';
  const segmentosDetectados = summary ? summary.k : 0;

  return (
    <div className="grid-kpi">
      <Card title="Total Clientes" className="kpi-card">
        <div className="kpi-value">{totalCustomers}</div>
        <p className="kpi-hint">Registrados en la plataforma</p>
      </Card>

      <Card title="Gasto Promedio" className="kpi-card">
        <div className="kpi-value">S/ {gastoPromedio}</div>
        <p className="kpi-hint">Por cliente en historial</p>
      </Card>

      <Card title="Visitas Promedio" className="kpi-card">
        <div className="kpi-value">{visitasPromedio}</div>
        <p className="kpi-hint">Frecuencia en últimos 6 meses</p>
      </Card>

      <Card title="Segmentos Detectados" className="kpi-card">
        <div className="kpi-value">{segmentosDetectados}</div>
        <p className="kpi-hint">Grupos calculados por K-Means</p>
      </Card>
    </div>
  );
};
