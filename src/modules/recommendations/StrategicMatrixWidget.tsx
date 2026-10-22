import React from 'react';
import { SegmentationSummary } from '../../types';
import { Card, Badge } from '../../components/ui';

interface StrategicMatrixWidgetProps {
  summary: SegmentationSummary;
}

export const StrategicMatrixWidget: React.FC<StrategicMatrixWidgetProps> = ({ summary }) => {
  const grupos = summary.grupos;
  const totalClientes = summary.cantidadProcesada || 1;

  // Determinar límites para escalar dinámicamente el gráfico SVG
  const gastos = grupos.map((g) => g.gastoPromedio);
  const visitas = grupos.map((g) => g.visitasPromedio);

  const minGasto = Math.min(...gastos, 100);
  const maxGasto = Math.max(...gastos, 3000);
  const minVisitas = Math.min(...visitas, 1);
  const maxVisitas = Math.max(...visitas, 20);

  // Dimensiones del gráfico SVG
  const width = 480;
  const height = 180;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 28;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const midX = padLeft + plotWidth / 2;
  const midY = padTop + plotHeight / 2;

  // Mapear cada cluster a coordenadas SVG
  const clusterPoints = grupos.map((g) => {
    const xRatio = (g.visitasPromedio - minVisitas) / (maxVisitas - minVisitas || 1);
    const yRatio = (g.gastoPromedio - minGasto) / (maxGasto - minGasto || 1);

    // X va de izquierda (min) a derecha (max)
    const cx = padLeft + Math.max(15, Math.min(plotWidth - 15, xRatio * plotWidth));
    // Y va de arriba (max) a abajo (min)
    const cy = padTop + plotHeight - Math.max(15, Math.min(plotHeight - 15, yRatio * plotHeight));

    return {
      segmento: g.segmento,
      cantidad: g.cantidad,
      gasto: g.gastoPromedio,
      visitas: g.visitasPromedio,
      cx,
      cy
    };
  });

  return (
    <Card
      title="Matriz de Posicionamiento Estratégico (Gasto vs. Frecuencia)"
      subtitle="Mapa cartesiano de referencia para contextualizar las recomendaciones comerciales"
      className="strategic-matrix-card"
    >
      <div className="strategic-matrix-layout">
        {/* Gráfico SVG tenue y no invasivo */}
        <div className="matrix-chart-wrapper">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="matrix-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Fondo del área de cuadrantes */}
            <rect
              x={padLeft}
              y={padTop}
              width={plotWidth}
              height={plotHeight}
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="1"
              rx="4"
            />

            {/* Ejes divisores de cuadrantes (punteados sutiles) */}
            <line
              x1={midX}
              y1={padTop}
              x2={midX}
              y2={padTop + plotHeight}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={padLeft}
              y1={midY}
              x2={padLeft + plotWidth}
              y2={midY}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Etiquetas de cuadrantes discretas */}
            <text
              x={padLeft + plotWidth - 8}
              y={padTop + 14}
              textAnchor="end"
              className="quadrant-text"
            >
              Alto Valor / Frecuente
            </text>
            <text
              x={padLeft + 8}
              y={padTop + 14}
              textAnchor="start"
              className="quadrant-text"
            >
              Alto Ticket / Ocasional
            </text>
            <text
              x={padLeft + plotWidth - 8}
              y={padTop + plotHeight - 8}
              textAnchor="end"
              className="quadrant-text"
            >
              Frecuente / Ticket Moderado
            </text>
            <text
              x={padLeft + 8}
              y={padTop + plotHeight - 8}
              textAnchor="start"
              className="quadrant-text"
            >
              Ocasional / Explorador
            </text>

            {/* Nombres de los ejes */}
            <text
              x={padLeft + plotWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="axis-label"
            >
              Frecuencia de Visitas (6M) →
            </text>
            <text
              x={12}
              y={padTop + plotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, 12, ${padTop + plotHeight / 2})`}
              className="axis-label"
            >
              Gasto Acumulado (S/) →
            </text>

            {/* Nodos de clusters discretos */}
            {clusterPoints.map((pt) => (
              <g key={pt.segmento} className="matrix-cluster-node">
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r="13"
                  className="cluster-node-ring"
                />
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r="9"
                  className="cluster-node-dot"
                />
                <text
                  x={pt.cx}
                  y={pt.cy + 3.5}
                  textAnchor="middle"
                  className="cluster-node-label"
                >
                  S{pt.segmento}
                </text>
                <title>
                  Segmento #{pt.segmento}: Gasto Promedio S/ {pt.gasto.toFixed(2)}, Visitas: {pt.visitas.toFixed(1)}
                </title>
              </g>
            ))}
          </svg>
        </div>

        {/* Panel lateral de leyenda ejecutiva */}
        <div className="matrix-legend-wrapper">
          <div className="legend-header">DISTRIBUCIÓN DE SEGMENTOS</div>
          <div className="legend-items-list">
            {grupos.map((g) => {
              const pct = Math.round((g.cantidad / totalClientes) * 100);
              return (
                <div key={g.segmento} className="legend-item-row">
                  <div className="legend-item-main">
                    <Badge variant="primary">Segmento #{g.segmento}</Badge>
                    <span className="legend-item-metrics">
                      {g.cantidad} clientes ({pct}%)
                    </span>
                  </div>
                  <div className="legend-item-sub">
                    <span>Gasto: S/ {g.gastoPromedio.toFixed(0)}</span>
                    <span className="bullet-sep">•</span>
                    <span>Visitas: {g.visitasPromedio.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
