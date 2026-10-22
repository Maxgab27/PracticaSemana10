import React from 'react';
import { Card, Button } from '../../components/ui';

interface KSelectorCardProps {
  selectedK: number;
  onKChange: (k: number) => void;
  onExecute: () => void;
  isLoading: boolean;
  totalCustomers: number;
  useRemoteApi: boolean;
  onToggleRemoteApi: (useRemote: boolean) => void;
}

export const KSelectorCard: React.FC<KSelectorCardProps> = ({
  selectedK,
  onKChange,
  onExecute,
  isLoading,
  totalCustomers,
  useRemoteApi,
  onToggleRemoteApi
}) => {
  const kOptions = [2, 3, 4, 5];

  return (
    <Card
      title="Configuración del Algoritmo K-Means"
      subtitle="Define el número de grupos (K) a descubrir entre los clientes según sus atributos de compra."
    >
      <div className="segmentation-config-grid">
        <div className="k-picker-section">
          <label className="form-label">Selecciona el número de grupos (K):</label>
          <div className="k-button-group">
            {kOptions.map((k) => (
              <button
                key={k}
                type="button"
                className={`k-option-btn ${selectedK === k ? 'active' : ''}`}
                onClick={() => onKChange(k)}
              >
                K = {k}
              </button>
            ))}
          </div>
          <p className="k-helper">
            Rango permitido por la rúbrica: 2 a 5 grupos.
          </p>
        </div>

        <div className="engine-picker-section">
          <label className="form-label">Motor de Cálculo:</label>
          <div className="toggle-container">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={useRemoteApi}
                onChange={(e) => onToggleRemoteApi(e.target.checked)}
              />
              <span>Conectar a API Python (Scikit-Learn)</span>
            </label>
            <p className="k-helper">
              {useRemoteApi
                ? 'Solicitará POST a http://localhost:8000/api/segmentation/run'
                : 'Ejecución en navegador con estandarización z-score y convergencia K-Means'}
            </p>
          </div>
        </div>

        <div className="execution-section">
          <Button
            variant="primary"
            size="lg"
            disabled={isLoading || totalCustomers < selectedK}
            onClick={onExecute}
            className="btn-full"
          >
            {isLoading ? 'Calculando Segmentos...' : `Ejecutar Segmentación (K=${selectedK})`}
          </Button>

          {totalCustomers < selectedK && (
            <p className="error-note">
              No es posible ejecutar: se requieren al menos {selectedK} clientes y hay {totalCustomers}.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
