import React from 'react';
import { SegmentationSummary } from '../../types';
import { Card, Badge } from '../../components/ui';

interface ClusterOverviewCardProps {
  summary: SegmentationSummary | null;
  onNavigateToSegmentation?: () => void;
}

export const ClusterOverviewCard: React.FC<ClusterOverviewCardProps> = ({
  summary,
  onNavigateToSegmentation
}) => {
  if (!summary) {
    return (
      <Card
        title="Estado del Modelo K-Means"
        subtitle="Pipeline de agrupamiento no supervisado"
        className="dashboard-col-card"
      >
        <div className="pipeline-config-box">
          <div className="pipeline-item">
            <span className="pipeline-label">Algoritmo Configurado</span>
            <span className="pipeline-val">K-Means con Semilla Fija (Reproducible)</span>
          </div>
          <div className="pipeline-item">
            <span className="pipeline-label">Espacio Vectorial</span>
            <span className="pipeline-val">3 Variables Numéricas (Gasto, Visitas, Antigüedad)</span>
          </div>
          <div className="pipeline-item">
            <span className="pipeline-label">Rango de Clusters</span>
            <span className="pipeline-val">K entre 2 y 5 grupos</span>
          </div>
          <div className="pipeline-item">
            <span className="pipeline-label">Estado Actual</span>
            <span className="pipeline-val text-muted">Pendiente de ejecución inicial</span>
          </div>
        </div>

        <div className="section-spacer-sm" />

        <div className="pipeline-action-box">
          <p className="pipeline-hint">
            Ejecuta el algoritmo en el módulo de Segmentación para calcular los centroides y asignar los grupos comerciales.
          </p>
          {onNavigateToSegmentation && (
            <button
              type="button"
              className="btn btn-primary btn-md btn-full"
              onClick={onNavigateToSegmentation}
            >
              Configurar y Ejecutar Segmentación
            </button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Distribución de Clientes por Segmento"
      subtitle={`Última ejecución: ${new Date(summary.fechaEjecucion).toLocaleTimeString()} | K = ${summary.k}`}
      className="dashboard-col-card"
    >
      <div className="clusters-grid">
        {summary.grupos.map((grupo) => (
          <div key={grupo.segmento} className="cluster-stat-box">
            <div className="cluster-header">
              <Badge variant="primary">Segmento #{grupo.segmento}</Badge>
              <span className="cluster-count">{grupo.cantidad} clientes</span>
            </div>
            <div className="cluster-metrics">
              <p>Gasto Prom.: <strong>S/ {grupo.gastoPromedio.toFixed(2)}</strong></p>
              <p>Visitas Prom.: <strong>{grupo.visitasPromedio.toFixed(1)}</strong></p>
              <p>Antigüedad: <strong>{grupo.antiguedadPromedio.toFixed(1)} m</strong></p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
