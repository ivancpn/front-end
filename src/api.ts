export interface Servizio {
  nome: string;
  tecnologia: string;
  health: string;
}

export const SERVIZI: Servizio[] = [
  { nome: "catalogo", tecnologia: "Java · Quarkus", health: "/api/catalogo/q/health" },
  { nome: "ordini", tecnologia: "Java · Quarkus", health: "/api/ordini/q/health" },
  { nome: "notifiche", tecnologia: "TypeScript · Node", health: "/api/notifiche/health" },
  { nome: "magazzino", tecnologia: "Python · Flask", health: "/api/magazzino/health" },
];

export interface Prodotto {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
}

export interface Giacenza {
  prodottoId: number;
  quantita: number;
}

export interface Ordine {
  id: number;
  prodottoId: number;
  quantita: number;
  stato: string;
}

export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function isUp(servizio: Servizio): Promise<boolean> {
  try {
    const body = await getJson<{ status?: string }>(servizio.health);
    return body.status === "UP";
  } catch {
    return false;
  }
}
