import React, { useMemo } from 'react';
import { SegmentationSummary } from '../../types';
import { generateRecommendations } from './recommendationRules';
import { StrategicMatrixWidget } from './StrategicMatrixWidget';
import { Card, Badge } from '../../components/ui';

interface RecommendationsViewProps {
  summary: SegmentationSummary | null;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ summary }) => {
  const recommendations = useMemo(() => {
    if (!summary || !summary.grupos) return [];
    return generateRecommendations(summary.grupos);
  }, [summary]);

  if (!summary) {
    return (
      <div className="module-view recommendations-view">
        <header className="page-header">
          <h1 className="page-title">Recomendaciones Comerciales</h1>
          <p className="page-description">
            Estrategias de marketing y ventas personalizadas por segmento de clientes.
          </p>
        </header>
        <Card>
          <div className="empty-state">
            <p>No hay segmentos calculados aún.</p>
            <p className="text-muted">
              Primero debes ejecutar la segmentación K-Means en el módulo correspondiente.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="module-view recommendations-view">
      <header className="page-header">
        <h1 className="page-title">Recomendaciones Comerciales por Segmento</h1>
        <p className="page-description">
          Propuestas orientativas basadas en los promedios de gasto, visitas y antigüedad detectados por K-Means (K = {summary.k}).
        </p>
      </header>

      {/* Matriz sutil de referencia */}
      <StrategicMatrixWidget summary={summary} />

      <div className="section-spacer-sm" />

      <div className="recommendations-list">
        {recommendations.map((rec) => {
          const stats = summary.grupos.find((g) => g.segmento === rec.segmento);
          return (
            <Card
              key={rec.segmento}
              title={`Segmento #${rec.segmento}: ${rec.etiquetaSugerida}`}
              extra={<Badge variant="primary">{stats?.cantidad || 0} clientes</Badge>}
              className="recommendation-card"
            >
              <div className="rec-stats-row">
                <span><strong>Gasto Prom.:</strong> S/ {stats?.gastoPromedio.toFixed(2)}</span>
                <span><strong>Visitas Prom.:</strong> {stats?.visitasPromedio.toFixed(1)}</span>
                <span><strong>Antigüedad Prom.:</strong> {stats?.antiguedadPromedio.toFixed(1)} m</span>
              </div>

              <div className="rec-section">
                <h4 className="rec-subtitle">Perfil de Comportamiento:</h4>
                <p>{rec.perfil}</p>
              </div>

              <div className="rec-section">
                <h4 className="rec-subtitle">Estrategia Comercial Orientativa:</h4>
                <p>{rec.estrategiaComercial}</p>
              </div>

              <div className="rec-section">
                <h4 className="rec-subtitle">Acciones Sugeridas:</h4>
                <ul className="rec-actions-list">
                  {rec.accionesSugeridas.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <p className="rec-disclaimer">
                Nota: Esta recomendación es orientativa y sirve de apoyo a la toma de decisiones, no constituye una verdad absoluta.
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
