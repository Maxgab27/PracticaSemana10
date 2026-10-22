import React from 'react';
import { Customer } from '../../types';
import { Card, Badge } from '../../components/ui';

interface PortfolioSummaryCardProps {
  customers: Customer[];
}

export const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({ customers }) => {
  const total = customers.length;
  const antiguedadMedia =
    total > 0
      ? (customers.reduce((acc, c) => acc + c.antiguedadMeses, 0) / total).toFixed(1)
      : '0.0';

  const totalGasto = customers.reduce((acc, c) => acc + c.gastoAcumulado, 0);
  const totalVisitas = customers.reduce((acc, c) => acc + c.visitas6Meses, 0);
  const ticketMedioPorVisita =
    totalVisitas > 0 ? (totalGasto / totalVisitas).toFixed(2) : '0.00';

  const clientesAltoGasto = customers.filter((c) => c.gastoAcumulado >= 1500).length;
  const clientesMedioBajoGasto = total - clientesAltoGasto;

  return (
    <Card
      title="Perfil de Cartera y Reglas de Negocio"
      subtitle="Parámetros operativos y control de integridad de datos"
      className="dashboard-col-card"
    >
      <div className="portfolio-metrics-grid">
        <div className="portfolio-stat-item">
          <span className="portfolio-stat-label">Antigüedad Media de Cartera</span>
          <span className="portfolio-stat-val">{antiguedadMedia} meses</span>
          <span className="portfolio-stat-hint">Tiempo promedio de relación comercial</span>
        </div>

        <div className="portfolio-stat-item">
          <span className="portfolio-stat-label">Rendimiento por Visita</span>
          <span className="portfolio-stat-val font-numeric">S/ {ticketMedioPorVisita}</span>
          <span className="portfolio-stat-hint">Gasto promedio por visita registrada</span>
        </div>
      </div>

      <div className="section-spacer-sm" />

      <div className="portfolio-distribution">
        <div className="dist-row">
          <div className="dist-label-wrap">
            <span className="dist-label">Clientes de Mayor Inversión (&ge; S/ 1,500)</span>
            <span className="dist-count">{clientesAltoGasto} ({total > 0 ? Math.round((clientesAltoGasto / total) * 100) : 0}%)</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill fill-primary"
              style={{ width: `${total > 0 ? (clientesAltoGasto / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="dist-row">
          <div className="dist-label-wrap">
            <span className="dist-label">Clientes de Gasto Moderado (&lt; S/ 1,500)</span>
            <span className="dist-count">{clientesMedioBajoGasto} ({total > 0 ? Math.round((clientesMedioBajoGasto / total) * 100) : 0}%)</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill fill-secondary"
              style={{ width: `${total > 0 ? (clientesMedioBajoGasto / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="section-spacer-sm" />

      <div className="integrity-status-box">
        <div className="integrity-item">
          <Badge variant="success">Regla Valida</Badge>
          <span className="integrity-text">Valores no negativos (&ge; 0) en gasto, visitas y antigüedad</span>
        </div>
        <div className="integrity-item">
          <Badge variant="success">Estandarización</Badge>
          <span className="integrity-text">Z-Score para equiparar escalas en distancias euclidianas</span>
        </div>
      </div>
    </Card>
  );
};
