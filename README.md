# front-end · dashboard

Dashboard **Vite + TypeScript** (senza framework) che mostra lo stato dei 4 microservizi,
il catalogo con le giacenze e l'elenco ordini.

| | |
|---|---|
| Porta | `5173` |

## Requisiti

- Node.js 20.19+

## Comandi

```powershell
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + build in dist\
```

## Come parla con i servizi

Il dev server di Vite fa da proxy (vedi `vite.config.ts`), quindi niente CORS:

| Prefisso | Servizio | Porta |
|---|---|---|
| `/api/catalogo` | micro-1-java | 8081 |
| `/api/ordini` | micro-2-java | 8082 |
| `/api/notifiche` | micro-3-typescript | 8083 |
| `/api/magazzino` | micro-4-python | 8084 |

Se un servizio è spento la dashboard lo segna come `DOWN` e continua a funzionare.
