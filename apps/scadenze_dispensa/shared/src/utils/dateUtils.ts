import { format, parse } from 'date-fns';
import { it } from 'date-fns/locale';

export function formatDataScadenza(dataString: string): string {
  try {
    const data = new Date(dataString);
    return format(data, 'dd/MM/yyyy', { locale: it });
  } catch {
    return 'Data non valida';
  }
}

export function formatDataScadenzaLunga(dataString: string): string {
  try {
    const data = new Date(dataString);
    return format(data, 'EEEE, dd MMMM yyyy', { locale: it });
  } catch {
    return 'Data non valida';
  }
}

export function toISOString(data: Date): string {
  return data.toISOString();
}

export function parseDataString(dateString: string): Date {
  return new Date(dateString);
}

export function formatDataAggiunta(dataString: string): string {
  try {
    const data = new Date(dataString);
    return format(data, 'dd MMM yyyy HH:mm', { locale: it });
  } catch {
    return 'Data non valida';
  }
}
