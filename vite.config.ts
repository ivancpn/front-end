import { defineConfig } from "vite";

// Il proxy evita problemi di CORS: il browser chiama /api/<servizio>/...
// e Vite inoltra la richiesta al microservizio corrispondente.
const servizi: Record<string, number> = {
  catalogo: 8081,
  ordini: 8082,
  notifiche: 8083,
  magazzino: 8084,
};

export default defineConfig({
  server: {
    port: 5173,
    proxy: Object.fromEntries(
      Object.entries(servizi).map(([nome, porta]) => [
        `/api/${nome}`,
        {
          target: `http://localhost:${porta}`,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(`/api/${nome}`, ""),
        },
      ]),
    ),
  },
});
