# Informe Técnico - Aprendizaje No Supervisado y Algoritmo K-Means

**Proyecto:** Sistema Modular de Segmentación de Clientes  
**Empresa ficticia:** Comercial Nova  
**Carrera:** Ingeniería de Software con Inteligencia Artificial - Semana 10  

---

## 1. Fundamentos Teóricos

### ¿Por qué se considera Aprendizaje No Supervisado?
En el aprendizaje supervisado, el modelo cuenta con una variable objetivo o etiqueta histórica (ej. `label = "Frecuente"` o `"Inactivo"`).  
En este caso, Comercial Nova no posee etiquetas previas que clasifiquen el comportamiento de sus clientes. El algoritmo **K-Means** analiza únicamente las características numéricas intrínsecas ($X$) para descubrir patrones de similitud natural y agrupar los registros por cercanía en el espacio multidimensional.

### Variables Empleadas
Se seleccionaron tres variables cuantitativas de comportamiento comercial:
1. **Gasto Acumulado (`gastoAcumulado` en Soles):** Mide el valor monetario total transaccionado por el cliente.
2. **Visitas en los últimos 6 meses (`visitas6Meses`):** Mide la frecuencia de interacción y recurrencia física o digital.
3. **Antigüedad del cliente (`antiguedadMeses`):** Refleja la lealtad y el tiempo que el cliente mantiene relación con Comercial Nova.

### ¿Por qué se deben estandarizar las variables?
Las variables operan en escalas numéricas completamente dispares:
- El gasto acumulado oscila entre cientos y miles de soles (ej. $120$ a $3,000$).
- Las visitas oscilan en unidades pequeñas (ej. $1$ a $18$).
- La antigüedad se expresa en meses (ej. $2$ a $36$).

El algoritmo K-Means calcula distancias euclidianas entre los puntos y los centroides:
$$d(x, c) = \sqrt{\sum_{i=1}^{m} (x_i - c_i)^2}$$

Si no se aplicara una estandarización (Z-Score: $z = \frac{x - \mu}{\sigma}$), la variable de **Gasto Acumulado** dominaría abrumadoramente el cálculo de distancias por su magnitud, haciendo que las variaciones en visitas y antigüedad resultaran irrelevantes. La estandarización equipara la varianza y pone a todas las características en un terreno neutro.

### Interpretación de los Grupos Encontrados
Una vez concluida la convergencia del algoritmo, se desestandarizan o se calculan las medias aritméticas reales de cada cluster para otorgarles significado comercial:
- **Grupo de Alto Valor y Frecuencia:** Alto gasto acumulado promedio y alta concurrencia.
- **Grupo Ocasional / Explorador:** Bajo gasto acumulado y visitas esporádicas.
- **Grupo Frecuente de Ticket Medio:** Alta periodicidad pero montos moderados.

---

## 2. Respuestas a las Preguntas de Análisis (15 a 21)

### 15. ¿Cuál es la diferencia entre clasificación supervisada y agrupamiento no supervisado?
- **Clasificación supervisada:** El conjunto de entrenamiento contiene ejemplos previamente etiquetados con una clase conocida (ej. `Fraude / No Fraude`, `Spam / No Spam`). El algoritmo busca aprender una función matemática que proyecte nuevas entradas hacia esas categorías preexistentes.
- **Agrupamiento no supervisado (Clustering):** No existen etiquetas predefinidas ni verdad fundamental. El algoritmo busca estructuras ocultas o agrupaciones naturales entre las observaciones basándose únicamente en métricas de distancia o densidad.

### 16. ¿Por qué no se debe incluir el nombre del cliente como variable numérica de K-Means?
El nombre es un atributo cualitativo identificador que carece de orden intrínseco, magnitud o escala métrica continua. Asignarle números arbitrarios (por ejemplo mediante un hash o índice ordinal) falsearía la distancia euclidiana, introduciendo ruido sin ningún sentido para los hábitos de compra.

### 17. ¿Qué podría ocurrir si no se estandarizan gasto, visitas y antigüedad?
Ocurre una distorsión geométrica crítica: el eje de **gasto** (con variaciones del orden de $10^2$ a $10^3$) aportará casi el 99% de la distancia euclidiana total, convirtiendo el espacio en unidimensional y anulando el peso de visitas y meses de lealtad.

### 18. ¿Cómo cambia la interpretación cuando se selecciona K=2 en lugar de K=4?
- **Con K=2:** Se produce una división binaria de alto nivel (por ejemplo, clientes de ticket alto frente a clientes de ticket bajo/medio).
- **Con K=4:** Se detectan nichos más granulares y accionables para el equipo de marketing, como visitantes frecuentes con ticket bajo (oportunidad de cross-selling), clientes nuevos de compra única alta, clientes leales constantes y clientes inactivos.

### 19. ¿Por qué los identificadores de grupo no significan por sí mismos “cliente frecuente” o “cliente premium”?
Porque los índices generados por K-Means (Cluster 0, 1, 2...) son simplemente etiquetas técnicas o identificadores matemáticos asignados de acuerdo con el centroide inicial aleatorio. Un grupo 0 en una ejecución puede ser el grupo de mayor gasto, y en otra ejecución con distinta inicialización puede ser el de menor gasto. El significado de negocio debe derivarse analizando las medias reales de sus centroides tras la ejecución.

### 20. ¿Qué limitaciones tiene usar únicamente tres variables para describir hábitos de compra?
No contempla la estacionalidad de compra, categorías de producto preferidas, métodos de pago, margen de ganancia por producto (rentabilidad neta), devoluciones/reclamos ni canales de compra (tienda física vs. online). Tres variables brindan una visión inicial simplificada (estilo RFM simplificado), pero insuficiente para un perfil 360° del consumidor.

### 21. ¿Qué responsabilidad cumple React y cuál cumple el servicio Python en la arquitectura propuesta?
- **React (Frontend):** Responsable de la capa de presentación y experiencia de usuario (UI/UX), administración de estado, validación de formularios, visualización interactiva de tablas, KPI y tarjetas de recomendaciones, así como de la persistencia local.
- **Servicio Python (Backend API):** Responsable del procesamiento numérico intensivo, pipelines de datos (StandardScaler de `scikit-learn`), ejecución determinista de K-Means con algoritmos optimizados y exposición del endpoint REST para desacoplar el motor de analítica avanzada.
