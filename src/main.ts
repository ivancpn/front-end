import { SERVIZI, getJson, isUp, type Giacenza, type Ordine, type Prodotto } from "./api";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

function el<K extends keyof HTMLElementTagNameMap>(tag: K, testo = "", classe = ""): HTMLElementTagNameMap[K] {
  const nodo = document.createElement(tag);
  nodo.textContent = testo;
  if (classe) nodo.className = classe;
  return nodo;
}

async function renderStato(): Promise<void> {
  const contenitore = document.querySelector<HTMLDivElement>("#stato")!;
  const esiti = await Promise.all(SERVIZI.map(isUp));
  contenitore.replaceChildren(
    ...SERVIZI.map((s, i) => {
      const card = el("div", "", `card ${esiti[i] ? "up" : "down"}`);
      card.append(el("strong", s.nome), el("span", s.tecnologia, "tech"), el("span", esiti[i] ? "UP" : "DOWN", "badge"));
      return card;
    }),
  );
}

async function renderProdotti(): Promise<void> {
  const tbody = document.querySelector<HTMLTableSectionElement>("#prodotti")!;
  try {
    const [prodotti, giacenze] = await Promise.all([
      getJson<Prodotto[]>("/api/catalogo/prodotti"),
      getJson<Giacenza[]>("/api/magazzino/giacenze").catch(() => [] as Giacenza[]),
    ]);
    const perProdotto = new Map(giacenze.map((g) => [g.prodottoId, g.quantita]));
    tbody.replaceChildren(
      ...prodotti.map((p) => {
        const riga = el("tr");
        const giacenza = perProdotto.get(p.id);
        riga.append(
          el("td", String(p.id)),
          el("td", p.nome),
          el("td", p.categoria),
          el("td", euro.format(p.prezzo), "num"),
          el("td", giacenza === undefined ? "—" : String(giacenza), "num"),
        );
        return riga;
      }),
    );
  } catch {
    const riga = el("tr");
    const cella = el("td", "Catalogo non raggiungibile: avvia micro-1-java", "vuoto");
    cella.colSpan = 5;
    riga.append(cella);
    tbody.replaceChildren(riga);
  }
}

async function renderOrdini(): Promise<void> {
  const lista = document.querySelector<HTMLUListElement>("#ordini")!;
  try {
    const ordini = await getJson<Ordine[]>("/api/ordini/ordini");
    lista.replaceChildren(
      ...ordini.map((o) => el("li", `#${o.id} · prodotto ${o.prodottoId} × ${o.quantita} · ${o.stato}`)),
    );
  } catch {
    lista.replaceChildren(el("li", "Ordini non raggiungibili: avvia micro-2-java", "vuoto"));
  }
}

async function aggiorna(): Promise<void> {
  await Promise.all([renderStato(), renderProdotti(), renderOrdini()]);
}

document.querySelector<HTMLButtonElement>("#aggiorna")!.addEventListener("click", () => void aggiorna());
void aggiorna();
