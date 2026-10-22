import React, { useState } from 'react';
import { Customer, SegmentationSummary } from '../../types';
import { SegmentationService } from '../../services/segmentationService';
import { CustomerService } from '../../services/customerService';
import { KSelectorCard } from './KSelectorCard';
import { ClusterResultsTable } from './ClusterResultsTable';
import { AuditExecutionBanner } from './AuditExecutionBanner';
import { SegmentDetailCard } from './SegmentDetailCard';

interface SegmentationViewProps {
  customers: Customer[];
  summary: SegmentationSummary | null;
  onSegmentationComplete: (
    updatedCustomers: Customer[],
    summary: SegmentationSummary
  ) => void;
}

export const SegmentationView: React.FC<SegmentationViewProps> = ({
  customers,
  summary,
  onSegmentationComplete
}) => {
  const [selectedK, setSelectedK] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useRemoteApi, setUseRemoteApi] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const handleExecute = async () => {
    setIsLoading(true);
    setErrorAlert(null);
    setSuccessAlert(null);

    try {
      const response = await SegmentationService.runSegmentation(
        customers,
        selectedK,
        useRemoteApi
      );

      // Mapear segmentos a la lista de clientes
      const labelMap = new Map<string, number>();
      response.labels.forEach((l) => labelMap.set(l.id, l.segmento));

      const updatedCustomers = customers.map((c) => ({
        ...c,
        segmento: labelMap.get(c.id) ?? c.segmento
      }));

      // Guardar en persistencia local
      CustomerService.saveAll(updatedCustomers);

      const newSummary: SegmentationSummary = {
        k: response.k,
        fechaEjecucion: new Date().toISOString(),
        cantidadProcesada: response.labels.length,
        grupos: response.groups
      };

      onSegmentationComplete(updatedCustomers, newSummary);
      setSuccessAlert(
        `Segmentación K-Means completada exitosamente con K=${selectedK}. Se agruparon ${response.labels.length} clientes.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al ejecutar K-Means';
      setErrorAlert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="module-view segmentation-view">
      <header className="page-header">
        <h1 className="page-title">Segmentación de Clientes (K-Means)</h1>
        <p className="page-description">
          Aplica algoritmos de aprendizaje no supervisado para agrupar clientes según gasto acumulado, visitas y antigüedad.
        </p>
      </header>

      {errorAlert && <div className="alert alert-danger">{errorAlert}</div>}
      {successAlert && <div className="alert alert-success">{successAlert}</div>}

      <KSelectorCard
        selectedK={selectedK}
        onKChange={setSelectedK}
        onExecute={handleExecute}
        isLoading={isLoading}
        totalCustomers={customers.length}
        useRemoteApi={useRemoteApi}
        onToggleRemoteApi={setUseRemoteApi}
      />

      <div className="section-spacer" />

      {summary && (
        <>
          <AuditExecutionBanner summary={summary} />
          <div className="section-spacer-sm" />
          <ClusterResultsTable summary={summary} />
          <div className="section-spacer-sm" />
          <SegmentDetailCard summary={summary} customers={customers} />
        </>
      )}
    </div>
  );
};
