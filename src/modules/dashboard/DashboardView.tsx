import React from 'react';
import { Customer, SegmentationSummary } from '../../types';
import { KpiCards } from './KpiCards';
import { ClusterOverviewCard } from './ClusterOverviewCard';
import { PortfolioSummaryCard } from './PortfolioSummaryCard';

interface DashboardViewProps {
  customers: Customer[];
  summary: SegmentationSummary | null;
  onNavigateToSegmentation?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  summary,
  onNavigateToSegmentation
}) => {
  return (
    <div className="module-view dashboard-view">
      <header className="page-header flex-header">
        <div>
          <h1 className="page-title">Panel de Control Ejecutivo</h1>
          <p className="page-description">
            Monitoreo general de la cartera de clientes y segmentación K-Means de Comercial Nova.
          </p>
        </div>
        <div className="header-status-group">
          <div className="status-pill">
            <span className="status-pill-dot" />
            <span>Base de Datos: {customers.length} registros</span>
          </div>
          <div className="status-pill status-pill-muted">
            <span>Persistencia: Activa (localStorage)</span>
          </div>
        </div>
      </header>

      {/* Fila 1: 4 Tarjetas KPI Simétricas */}
      <KpiCards customers={customers} summary={summary} />

      <div className="section-spacer" />

      {/* Fila 2: Cuadrícula Simétrica de 2 Columnas (50% / 50%) */}
      <div className="dashboard-grid-symmetric">
        <ClusterOverviewCard
          summary={summary}
          onNavigateToSegmentation={onNavigateToSegmentation}
        />
        <PortfolioSummaryCard customers={customers} />
      </div>
    </div>
  );
};
