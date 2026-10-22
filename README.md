# Comercial Nova - Sistema Modular de Segmentación de Clientes

**Semana 10:** Aprendizaje No Supervisado y Algoritmo K-Means  
**Carrera:** Ingeniería de Software con Inteligencia Artificial  
**Tecnologías:** React + TypeScript + Vite | Python (Scikit-Learn, FastAPI)

---

## 1. Contexto del Caso
Comercial Nova busca optimizar sus campañas de marketing minorista abandonando las promociones masivas indiferenciadas. La plataforma permite administrar clientes, visualizar métricas consolidadas (KPI), segmentar clientes con el algoritmo de agrupamiento K-Means ($K \in [2, 5]$) y generar recomendaciones comerciales orientativas adaptadas al perfil de cada segmento.

---

## 2. Arquitectura Modular del Proyecto

Siguiendo las pautas de arquitectura por funciones establecidas en la guía curricular:

```
PracticaSEmana10/
├── api/                               # Microservicio opcional de analítica en Python
│   ├── main.py                        # Endpoint REST: POST /api/segmentation/run (FastAPI + scikit-learn)
│   └── requirements.txt               # Dependencias: fastapi, scikit-learn, numpy, pydantic, uvicorn
├── docs/                              # Evidencias y documentación académica
│   ├── INFORME_TECNICO.md             # Fundamentos K-Means, justificación y preguntas 15 a 21
│   └── MATRIZ_PRUEBAS.md              # 10 casos de prueba obligatorios con estados de verificación
├── src/
│   ├── app/                           # Configuración de navegación, layout y shell de la aplicación
│   │   ├── Layout.tsx                 # Contenedor responsive con Navbar y Sidebar
│   │   ├── Navbar.tsx                 # Barra superior de navegación corporativa
│   │   ├── Sidebar.tsx                # Menú lateral modular
│   │   └── index.ts
│   ├── components/ui/                 # Componentes reutilizables desacoplados
│   │   ├── Button.tsx                 # Botones con variantes de acción (primary, danger, outline)
│   │   ├── Card.tsx                   # Tarjetas con cabecera y cuerpo
│   │   ├── Badge.tsx                  # Etiquetas de estado y grupos
│   │   ├── Modal.tsx                  # Modales accesibles y confirmaciones
│   │   ├── InputField.tsx             # Campos de texto/numéricos con feedback de validación
│   │   ├── Table.tsx                  # Tablas de datos genéricas
│   │   └── index.ts
│   ├── data/                          # Datos de prueba iniciales
│   │   └── initialCustomers.ts        # Los 12 clientes iniciales del caso (C001 a C012)
│   ├── modules/                       # Módulos funcionales independientes
│   │   ├── dashboard/                 # RF-01: KPIs, métricas globales y resumen visual
│   │   │   ├── KpiCards.tsx
│   │   │   ├── ClusterOverviewCard.tsx
│   │   │   └── DashboardView.tsx
│   │   ├── customers/                 # RF-02, RF-03, RF-06: CRUD de clientes y filtros
│   │   │   ├── CustomerListView.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── CustomerModalForm.tsx
│   │   │   └── CustomerSearchFilter.tsx
│   │   ├── segmentation/              # RF-04, RF-05, RF-08: Configuración K, ejecución y auditoría
│   │   │   ├── KSelectorCard.tsx
│   │   │   ├── ClusterResultsTable.tsx
│   │   │   ├── AuditExecutionBanner.tsx
│   │   │   └── SegmentationView.tsx
│   │   └── recommendations/           # RF-07: Propuestas comerciales orientativas
│   │       ├── recommendationRules.ts
│   │       └── RecommendationsView.tsx
│   ├── services/                      # Servicios desacoplados y acceso a datos
│   │   ├── customerService.ts         # Persistencia en localStorage y operaciones de negocio
│   │   └── segmentationService.ts     # Estandarización Z-Score, K-Means local y fallback a API
│   ├── types/                         # Definiciones de tipos TypeScript
│   │   ├── customer.ts
│   │   ├── segmentation.ts
│   │   ├── recommendation.ts
│   │   └── index.ts
│   ├── App.css                        # Estilos conforme a la guía de diseño corporativo
│   ├── App.tsx                        # Coordinador principal de estado
│   └── main.tsx                       # Punto de entrada de la aplicación Vite
├── package.json
└── tsconfig.json
```

---

## 3. Instalación y Ejecución

### Frontend (React + TypeScript + Vite)
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Compilación de producción
npm run build
```

### Backend Analítico Python (Opcional)
```bash
# 1. Crear entorno virtual (opcional pero recomendado)
python -m venv venv
venv\Scripts\activate   # En Windows

# 2. Instalar dependencias
pip install -r api/requirements.txt

# 3. Iniciar el servidor API
uvicorn api.main:app --reload --port 8000
```
> **Nota:** La aplicación incluye un motor K-Means nativo en TypeScript con estandarización Z-Score completa, por lo que el sistema funciona al 100% incluso sin levantar el servidor Python.

---

## 4. Requerimientos Funcionales Implementados

- **RF-01 (Panel Principal):** 4 KPIs (total clientes, gasto promedio, visitas promedio, segmentos detectados) y resumen visual.
- **RF-02 & RF-03 (Gestión de Clientes):** Crear, listar, editar, buscar y eliminar con modal de confirmación obligatoria. Validaciones numéricas no negativas y códigos únicos.
- **RF-04 (Segmentación):** Selector de K entre 2 y 5, con comprobación de $N \ge K$.
- **RF-05 (Resultados):** Visualización del segmento de cada cliente y desglose por grupo.
- **RF-06 (Análisis):** Filtrado dinámico por segmento y ordenamiento por gasto o visitas.
- **RF-07 (Recomendaciones):** Sugerencias comerciales orientativas y perfiles de clientes según centroides.
- **RF-08 (Auditoría Básica):** Banner informativo con fecha, hora y total de registros procesados.
- **RF-09 (Persistencia):** Conservación íntegra de cambios y segmentaciones en `localStorage`.
- **RF-10 (Experiencia):** Estados vacíos, alertas comprensibles, diseño adaptable en tonos azul corporativo y cyan.

---

## 5. Rúbrica y Documentación Adicional
- Para consultar la ejecución de los 10 casos de prueba obligatorios, ver [docs/MATRIZ_PRUEBAS.md](file:///c:/Users/Alu_Torre1/Desktop/PracticaSEmana10/docs/MATRIZ_PRUEBAS.md).
- Para consultar el informe técnico y las respuestas a las preguntas 15 a 21, ver [docs/INFORME_TECNICO.md](file:///c:/Users/Alu_Torre1/Desktop/PracticaSEmana10/docs/INFORME_TECNICO.md).
