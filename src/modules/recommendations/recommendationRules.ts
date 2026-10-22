import { ClusterGroupSummary, SegmentRecommendation } from '../../types';

/**
 * Reglas de negocio para generar propuestas comerciales orientativas basadas en promedios del cluster.
 * Nota de la regla de negocio: "La recomendación es orientativa; no afirma una verdad absoluta".
 */
export function generateRecommendations(
  grupos: ClusterGroupSummary[]
): SegmentRecommendation[] {
  if (grupos.length === 0) return [];

  // Encontrar rangos para categorizar relativamente
  const maxGasto = Math.max(...grupos.map((g) => g.gastoPromedio));
  const minGasto = Math.min(...grupos.map((g) => g.gastoPromedio));
  const maxVisitas = Math.max(...grupos.map((g) => g.visitasPromedio));
  const minVisitas = Math.min(...grupos.map((g) => g.visitasPromedio));

  return grupos.map((grupo) => {
    let etiquetaSugerida = 'Clientes Ocasionales / En Crecimiento';
    let perfil = 'Grupo con comportamiento equilibrado en visitas y gasto.';
    let estrategia = 'Campañas de fidelización moderada y recordatorios de promociones.';
    let acciones = [
      'Enviar boletín informativo quincenal con ofertas del mes.',
      'Incentivar compras recurrentes mediante cupones escalonados.'
    ];

    // Heurística orientativa según los centroides del grupo
    if (grupo.gastoPromedio >= maxGasto * 0.8 && grupo.visitasPromedio >= maxVisitas * 0.7) {
      etiquetaSugerida = 'Clientes de Alto Valor / Alta Frecuencia';
      perfil = `Clientes con gasto medio sobresaliente (S/ ${grupo.gastoPromedio.toFixed(2)}) y alta frecuencia (${grupo.visitasPromedio.toFixed(1)} visitas).`;
      estrategia = 'Programa VIP exclusivo, atención prioritaria y promociones preventa.';
      acciones = [
        'Acceso preferencial a lanzamientos de temporada.',
        'Membresía premium con acumulación de puntos dobles.',
        'Canal de atención directa y servicio post-venta personalizado.'
      ];
    } else if (grupo.gastoPromedio <= minGasto * 1.3 && grupo.visitasPromedio <= minVisitas * 1.3) {
      etiquetaSugerida = 'Clientes Ocasionales / Exploradores';
      perfil = `Bajo volumen de visitas (${grupo.visitasPromedio.toFixed(1)}) y bajo gasto acumulado (S/ ${grupo.gastoPromedio.toFixed(2)}).`;
      estrategia = 'Reactivación de interés y campañas de atracción inicial con bajo costo de entrada.';
      acciones = [
        'Ofertas de bienvenida / reactivación con descuentos en primera recompra.',
        'Promociones tipo "2x1" o combos accesibles para aumentar frecuencia.',
        'Encuestas de satisfacción para identificar motivos de baja recurrencia.'
      ];
    } else if (grupo.visitasPromedio >= maxVisitas * 0.7 && grupo.gastoPromedio < maxGasto * 0.5) {
      etiquetaSugerida = 'Visitantes Frecuentes de Ticket Moderado';
      perfil = `Alta afluencia de visitas (${grupo.visitasPromedio.toFixed(1)}), pero con tickets de compra moderados.`;
      estrategia = 'Venta cruzada (cross-selling) y aumento del ticket promedio por visita.';
      acciones = [
        'Sugerencias de productos complementarios en caja.',
        'Descuentos por volumen de compra en productos de consumo recurrente.',
        'Promoción de beneficios por superar montos mínimos por ticket.'
      ];
    } else if (grupo.gastoPromedio >= maxGasto * 0.6 && grupo.visitasPromedio <= minVisitas * 1.5) {
      etiquetaSugerida = 'Compradores de Ticket Alto y Baja Frecuencia';
      perfil = `Gasto relevante (S/ ${grupo.gastoPromedio.toFixed(2)}) acumulado en pocas visitas.`;
      estrategia = 'Incentivar visitas intermedias y recordatorios programados.';
      acciones = [
        'Cupones con vigencia delimitada para impulsar retorno rápido.',
        'Comunicaciones personalizadas sobre reposición de productos comprados.'
      ];
    }

    return {
      segmento: grupo.segmento,
      etiquetaSugerida,
      perfil,
      estrategiaComercial: estrategia,
      accionesSugeridas: acciones
    };
  });
}
