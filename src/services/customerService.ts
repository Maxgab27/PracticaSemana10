import { Customer, CustomerFormData } from '../types';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';

const STORAGE_KEY = 'comercial_nova_customers';

export class CustomerService {
  /**
   * Obtiene todos los clientes almacenados o inicializa con los datos base
   */
  static getAll(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveAll(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(raw) as Customer[];
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }

  /**
   * Guarda todos los clientes en localStorage
   */
  static saveAll(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }

  /**
   * Busca clientes por nombre o código
   */
  static search(query: string): Customer[] {
    const customers = this.getAll();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return customers;
    return customers.filter(
      (c) =>
        c.id.toLowerCase().includes(cleanQuery) ||
        c.nombre.toLowerCase().includes(cleanQuery)
    );
  }

  /**
   * Registra un nuevo cliente con validación de identificador único y no negatividad
   */
  static create(data: CustomerFormData): { success: boolean; error?: string; customer?: Customer } {
    const customers = this.getAll();

    // Validar ID único
    if (customers.some((c) => c.id.trim().toUpperCase() === data.id.trim().toUpperCase())) {
      return { success: false, error: `El código "${data.id}" ya está registrado.` };
    }

    // Validar valores numéricos no negativos
    if (data.gastoAcumulado < 0 || data.visitas6Meses < 0 || data.antiguedadMeses < 0) {
      return { success: false, error: 'Los valores de gasto, visitas y antigüedad no pueden ser negativos.' };
    }

    const newCustomer: Customer = {
      id: data.id.trim().toUpperCase(),
      nombre: data.nombre.trim(),
      gastoAcumulado: Number(data.gastoAcumulado),
      visitas6Meses: Number(data.visitas6Meses),
      antiguedadMeses: Number(data.antiguedadMeses)
    };

    customers.push(newCustomer);
    this.saveAll(customers);
    return { success: true, customer: newCustomer };
  }

  /**
   * Actualiza un cliente existente
   */
  static update(id: string, data: Partial<CustomerFormData>): { success: boolean; error?: string; customer?: Customer } {
    const customers = this.getAll();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return { success: false, error: `Cliente con código "${id}" no encontrado.` };
    }

    if (
      (data.gastoAcumulado !== undefined && data.gastoAcumulado < 0) ||
      (data.visitas6Meses !== undefined && data.visitas6Meses < 0) ||
      (data.antiguedadMeses !== undefined && data.antiguedadMeses < 0)
    ) {
      return { success: false, error: 'Los valores numéricos no pueden ser negativos.' };
    }

    const updated: Customer = {
      ...customers[index],
      ...data,
      nombre: data.nombre !== undefined ? data.nombre.trim() : customers[index].nombre,
      gastoAcumulado: data.gastoAcumulado !== undefined ? Number(data.gastoAcumulado) : customers[index].gastoAcumulado,
      visitas6Meses: data.visitas6Meses !== undefined ? Number(data.visitas6Meses) : customers[index].visitas6Meses,
      antiguedadMeses: data.antiguedadMeses !== undefined ? Number(data.antiguedadMeses) : customers[index].antiguedadMeses
    };

    customers[index] = updated;
    this.saveAll(customers);
    return { success: true, customer: updated };
  }

  /**
   * Elimina un cliente por su identificador
   */
  static delete(id: string): boolean {
    const customers = this.getAll();
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length !== customers.length) {
      this.saveAll(filtered);
      return true;
    }
    return false;
  }

  /**
   * Restablece los datos de prueba iniciales
   */
  static reset(): void {
    this.saveAll(INITIAL_CUSTOMERS);
  }
}
