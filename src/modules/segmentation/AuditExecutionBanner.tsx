import React from 'react';
import { SegmentationSummary } from '../../types';

interface AuditExecutionBannerProps {
  summary: SegmentationSummary | null;
}

export const AuditExecutionBanner: React.FC<AuditExecutionBannerProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="audit-banner">
      <div className="audit-icon-wrap" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="audit-svg">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div className="audit-content">
        <div className="audit-header-line">
          <span className="audit-tag">AUDITORÍA DE EJECUCIÓN</span>
          <span className="audit-timestamp">{new Date(summary.fechaEjecucion).toLocaleString()}</span>
        </div>
        <p className="audit-detail">
          Modelo ajustado con éxito para <strong>K = {summary.k}</strong> clusters sobre un volumen de{' '}
          <strong>{summary.cantidadProcesada} registros válidos</strong>. Variables normalizadas mediante Z-Score.
        </p>
      </div>
    </div>
  );
};
