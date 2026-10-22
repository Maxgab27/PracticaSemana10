import { Customer, SegmentationResponse, ClusterGroupSummary } from '../types';

export class SegmentationService {
  private static API_URL = 'http://localhost:8000/api/segmentation/run';

  /**
   * Ejecuta la segmentación ya sea por API Python o por algoritmo K-Means local
   */
  static async runSegmentation(
    customers: Customer[],
    k: number,
    preferRemoteApi = false
  ): Promise<SegmentationResponse> {
    // Regla de negocio: K entre 2 y 5
    if (k < 2 || k > 5) {
      throw new Error('El valor de K debe estar comprendido entre 2 y 5.');
    }

    // Regla de negocio: Registros válidos >= K
    const validCustomers = customers.filter(
      (c) =>
        c.gastoAcumulado >= 0 &&
        c.visitas6Meses >= 0 &&
        c.antiguedadMeses >= 0
    );

    if (validCustomers.length < k) {
      throw new Error(
        `Se requieren al menos ${k} clientes válidos para segmentar con K=${k}. Actualmente hay ${validCustomers.length}.`
      );
    }

    if (preferRemoteApi) {
      try {
        return await this.runRemoteKMeans(validCustomers, k);
      } catch (error) {
        console.warn('API Python no disponible, usando algoritmo K-Means local:', error);
      }
    }

    return this.runLocalKMeans(validCustomers, k);
  }

  /**
   * Llamada al servicio Python (scikit-learn)
   */
  private static async runRemoteKMeans(
    customers: Customer[],
    k: number
  ): Promise<SegmentationResponse> {
    const payload = {
      k,
      customers: customers.map((c) => ({
        id: c.id,
        gastoAcumulado: c.gastoAcumulado,
        visitas6Meses: c.visitas6Meses,
        antiguedadMeses: c.antiguedadMeses
      }))
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error en API remota: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Implementación de K-Means local con estandarización z-score
   */
  public static runLocalKMeans(customers: Customer[], k: number): SegmentationResponse {
    const n = customers.length;
    const features = customers.map((c) => [
      c.gastoAcumulado,
      c.visitas6Meses,
      c.antiguedadMeses
    ]);

    // 1. Estandarización (Z-score: (x - mean) / std)
    const means = [0, 1, 2].map(
      (col) => features.reduce((sum, row) => sum + row[col], 0) / n
    );
    const stds = [0, 1, 2].map((col) => {
      const variance =
        features.reduce((sum, row) => sum + Math.pow(row[col] - means[col], 2), 0) / n;
      return Math.sqrt(variance) || 1; // Evitar división por cero
    });

    const scaled = features.map((row) =>
      row.map((val, col) => (val - means[col]) / stds[col])
    );

    // 2. Inicialización de centroides (K-Means++ o determinista con semilla)
    let centroids: number[][] = [];
    const step = Math.floor(n / k);
    for (let i = 0; i < k; i++) {
      centroids.push([...scaled[Math.min(i * step, n - 1)]]);
    }

    let assignments = new Array(n).fill(0);
    const maxIterations = 100;
    let converged = false;

    // 3. Bucle de convergencia K-Means
    for (let iter = 0; iter < maxIterations && !converged; iter++) {
      converged = true;

      // Paso de asignación: distancia euclidiana
      for (let i = 0; i < n; i++) {
        let minDist = Infinity;
        let bestCluster = 0;
        for (let c = 0; c < k; c++) {
          const dist = scaled[i].reduce(
            (acc, val, d) => acc + Math.pow(val - centroids[c][d], 2),
            0
          );
          if (dist < minDist) {
            minDist = dist;
            bestCluster = c;
          }
        }
        if (assignments[i] !== bestCluster) {
          assignments[i] = bestCluster;
          converged = false;
        }
      }

      // Paso de actualización de centroides
      const newCentroids: number[][] = Array.from({ length: k }, () => [0, 0, 0]);
      const counts = new Array(k).fill(0);

      for (let i = 0; i < n; i++) {
        const cluster = assignments[i];
        counts[cluster]++;
        for (let d = 0; d < 3; d++) {
          newCentroids[cluster][d] += scaled[i][d];
        }
      }

      for (let c = 0; c < k; c++) {
        if (counts[c] > 0) {
          centroids[c] = newCentroids[c].map((sum) => sum / counts[c]);
        }
      }
    }

    // 4. Construcción de etiquetas y resúmenes descriptivos
    const labels = customers.map((c, i) => ({
      id: c.id,
      segmento: assignments[i]
    }));

    const groups: ClusterGroupSummary[] = Array.from({ length: k }, (_, idx) => {
      const clusterCustomers = customers.filter((_, i) => assignments[i] === idx);
      const count = clusterCustomers.length;

      if (count === 0) {
        return {
          id: idx,
          segmento: idx,
          cantidad: 0,
          gastoPromedio: 0,
          visitasPromedio: 0,
          antiguedadPromedio: 0
        };
      }

      const totalGasto = clusterCustomers.reduce((s, c) => s + c.gastoAcumulado, 0);
      const totalVisitas = clusterCustomers.reduce((s, c) => s + c.visitas6Meses, 0);
      const totalAntiguedad = clusterCustomers.reduce((s, c) => s + c.antiguedadMeses, 0);

      return {
        id: idx,
        segmento: idx,
        cantidad: count,
        gastoPromedio: Math.round((totalGasto / count) * 100) / 100,
        visitasPromedio: Math.round((totalVisitas / count) * 100) / 100,
        antiguedadPromedio: Math.round((totalAntiguedad / count) * 100) / 100
      };
    });

    return {
      k,
      labels,
      groups
    };
  }
}
