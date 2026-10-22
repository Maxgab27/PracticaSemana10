# Matriz de Pruebas Mínimas Obligatorias

Pruebas funcionales y de robustez para el sistema de segmentación de clientes **Comercial Nova** (Semana 10).

| N.º | Caso de Prueba | Entrada / Acción | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|
| **1** | Registrar cliente con todos los datos válidos | Código: `C013`, Nombre: `Carmen Ramos`, Gasto: `1500`, Visitas: `9`, Antigüedad: `14` | Se guarda el cliente, aparece en la tabla y se actualizan los KPI. | Cliente registrado y listado exitosamente en tabla y estado. | **PASÓ** |
| **2** | Registrar cliente con código duplicado | Intentar registrar con código existente `C001` | Se rechaza el formulario y se informa con mensaje de error específico. | Se muestra alerta: `"El código 'C001' ya está registrado."`. | **PASÓ** |
| **3** | Ingresar gasto negativo | Código: `C014`, Gasto: `-50` | La validación del formulario impide guardar y notifica campo inválido. | Validación activa impide envío y resalta error en campo de gasto. | **PASÓ** |
| **4** | Editar visitas de un cliente | Editar cliente `C004`: cambiar visitas de `2` a `8` | Se actualiza el registro en la tabla y recalculan métricas de visitas promedio. | Registro actualizado correctamente y KPI recalculado en tiempo real. | **PASÓ** |
| **5** | Buscar por nombre o código | Ingresar texto de búsqueda `"Luis"` o `"C002"` | La tabla filtra dinámicamente mostrando coincidencias exactas y parciales. | Se visualiza únicamente el cliente Luis Rojas (`C002`). | **PASÓ** |
| **6** | Eliminar un cliente y cancelar confirmación | Clic en eliminar a `C006` y presionar botón `"Cancelar"` en el modal | La operación se cancela y el cliente se conserva intacto en la lista. | Modal cerrado sin afectar la lista de clientes. | **PASÓ** |
| **7** | Ejecutar K=3 con datos suficientes | Seleccionar selector $K=3$ y presionar `"Ejecutar Segmentación"` | Se calculan centroides, se asigna segmento 0, 1 y 2 a cada cliente y se genera resumen. | Asignación exitosa con métricas promedio y visualización por cluster. | **PASÓ** |
| **8** | Elegir K mayor que el número de registros válidos | Filtrar o vaciar clientes dejando menos de K registros (ej. 2 clientes para K=3) | Se bloquea o interrumpe la ejecución informando el motivo claro. | Botón deshabilitado y mensaje advierte registros insuficientes ($N < K$). | **PASÓ** |
| **9** | Simular fallo de API o ausencia de datos | Marcar API remota sin levantar servidor o datos vacíos | Se muestra alerta o estado vacío entendible sin romper la aplicación. | Fallback graceful: captura error o ejecuta K-Means local sin error de pantalla. | **PASÓ** |
| **10** | Recargar la página | Modificar clientes, recargar navegador (F5) | Los clientes persisten gracias al almacenamiento en `localStorage`. | Datos persisten íntegros tras refrescar el navegador. | **PASÓ** |
