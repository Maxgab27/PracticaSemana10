from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

app = FastAPI(
    title="Comercial Nova - Servicio de Segmentación K-Means",
    description="API para preparar datos numéricos y segmentar clientes mediante K-Means y scikit-learn",
    version="1.0.0"
)

# Permitir CORS para comunicación directa con Vite (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomerItem(BaseModel):
    id: str
    gastoAcumulado: float = Field(..., ge=0, description="Gasto acumulado no negativo")
    visitas6Meses: float = Field(..., ge=0, description="Visitas en últimos 6 meses no negativas")
    antiguedadMeses: float = Field(..., ge=0, description="Antigüedad en meses no negativa")

class SegmentationRequest(BaseModel):
    k: int = Field(..., ge=2, le=5, description="Número de clusters (entre 2 y 5)")
    customers: List[CustomerItem]

class LabelResult(BaseModel):
    id: str
    segmento: int

class GroupSummary(BaseModel):
    segmento: int
    cantidad: int
    gastoPromedio: float
    visitasPromedio: float
    antiguedadPromedio: float

class SegmentationResponse(BaseModel):
    k: int
    labels: List[LabelResult]
    groups: List[GroupSummary]

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Comercial Nova K-Means API",
        "endpoint": "POST /api/segmentation/run"
    }

@app.post("/api/segmentation/run", response_model=SegmentationResponse)
def run_segmentation(payload: SegmentationRequest):
    k = payload.k
    customers = payload.customers

    # Validación 1: k entre 2 y 5
    if k < 2 or k > 5:
        raise HTTPException(
            status_code=400,
            detail="El parámetro K debe estar comprendido entre 2 y 5."
        )

    # Validación 2: cantidad de clientes >= k
    if len(customers) < k:
        raise HTTPException(
            status_code=400,
            detail=f"Se requieren al menos {k} clientes para segmentar con K={k}. Recibidos: {len(customers)}."
        )

    try:
        # 1. Extracción de variables numéricas (el ID no se incluye en el modelo de clustering)
        X = np.array([
            [c.gastoAcumulado, c.visitas6Meses, c.antiguedadMeses]
            for c in customers
        ], dtype=float)

        # 2. Estandarización de variables para evitar sesgo de escala
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # 3. Ajuste del algoritmo K-Means con semilla fija para reproducibilidad
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X_scaled)

        # 4. Asignación de etiquetas
        label_results = [
            LabelResult(id=customers[i].id, segmento=int(labels[i]))
            for i in range(len(customers))
        ]

        # 5. Cálculo de métricas y centroides reales por grupo
        groups: List[GroupSummary] = []
        for cluster_id in range(k):
            cluster_indices = np.where(labels == cluster_id)[0]
            cluster_count = len(cluster_indices)

            if cluster_count > 0:
                cluster_data = X[cluster_indices]
                gasto_prom = float(np.mean(cluster_data[:, 0]))
                visitas_prom = float(np.mean(cluster_data[:, 1]))
                antiguedad_prom = float(np.mean(cluster_data[:, 2]))
            else:
                gasto_prom = 0.0
                visitas_prom = 0.0
                antiguedad_prom = 0.0

            groups.append(GroupSummary(
                segmento=cluster_id,
                cantidad=cluster_count,
                gastoPromedio=round(gasto_prom, 2),
                visitasPromedio=round(visitas_prom, 2),
                antiguedadPromedio=round(antiguedad_prom, 2)
            ))

        return SegmentationResponse(
            k=k,
            labels=label_results,
            groups=groups
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el proceso de K-Means: {str(e)}")
