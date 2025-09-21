import { Router } from "express";
import client from "prom-client";
import { prisma } from "../database/prismaClient";

const router = Router();

// --- Prometheus: coleta padrão
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Histograma de requisições HTTP
const httpRequestDurationMs = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duração das requisições HTTP em ms",
    labelNames: ["method", "route", "code"],
    buckets: [50, 100, 300, 500, 1000, 2000],
});

// Gauges customizados
const activeLoansGauge = new client.Gauge({
    name: "library_active_loans",
    help: "Número de empréstimos ativos",
});
const totalBooksGauge = new client.Gauge({
    name: "library_total_books",
    help: "Número total de livros cadastrados",
});
const totalUsersGauge = new client.Gauge({
    name: "library_total_users",
    help: "Número total de usuários cadastrados",
});

// Atualizar métricas reais a cada 15s
setInterval(async () => {
    try {
        const activeLoans = await prisma.loan.count({
            where: { status: "Active" },
        });
        const totalBooks = await prisma.book.count();
        const totalUsers = await prisma.user.count();

        activeLoansGauge.set(activeLoans);
        totalBooksGauge.set(totalBooks);
        totalUsersGauge.set(totalUsers);
    } catch (err) {
        console.error("Erro ao atualizar métricas:", err);
    }
}, 15000);

// --- Middleware para medir duração das requisições
export function metricsMiddleware(req: any, res: any, next: any) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        httpRequestDurationMs
            .labels(req.method, req.originalUrl, res.statusCode.toString())
            .observe(duration);
    });
    next();
}

// --- Endpoints de métricas

// JSON para frontend
router.get("/metrics", async (req, res, next) => {
    if (req.query.format === "json") {
        const [activeLoans, totalBooks, totalUsers] = await Promise.all([
            prisma.loan.count({ where: { status: "Active" } }),
            prisma.book.count(),
            prisma.user.count(),
        ]);
        return res.json({ activeLoans, totalBooks, totalUsers });
    }
    next();
});

// Página bonita
router.get("/metrics", async (_req, res) => {
    const [activeLoans, totalBooks, totalUsers] = await Promise.all([
        prisma.loan.count({ where: { status: "Active" } }),
        prisma.book.count(),
        prisma.user.count(),
    ]);

    res.send(`
    <html>
      <head>
        <title>📊 Biblioteca - Métricas</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; margin: 2rem; background: #f5f7fa; color: #333; }
          h1 { color: #222; }
          .metrics { display: flex; gap: 2rem; margin: 2rem 0; }
          .card { flex: 1; background: white; border-radius: 12px; padding: 1.5rem;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          .card h2 { margin: 0; font-size: 2.8rem; }
          .books h2 { color: #007bff; }
          .users h2 { color: #28a745; }
          .loans h2 { color: #6f42c1; }
          a { display: inline-block; margin-top: 1.5rem; padding: 0.6rem 1.2rem;
              background: #007bff; color: white; border-radius: 6px;
              text-decoration: none; font-weight: bold; }
          a:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <h1>📊 Biblioteca - Métricas em Tempo Real</h1>
        <div class="metrics">
          <div class="card loans"><h2>${activeLoans}</h2><p>Empréstimos Ativos</p></div>
          <div class="card books"><h2>${totalBooks}</h2><p>Livros Cadastrados</p></div>
          <div class="card users"><h2>${totalUsers}</h2><p>Usuários Registrados</p></div>
        </div>
        <a href="/metrics/raw">Ver métricas no formato Prometheus</a>
      </body>
    </html>
  `);
});

// Raw
router.get("/metrics/raw", async (req, res) => {
    const metrics = await client.register.metrics();

    if (req.headers.accept?.includes("text/html")) {
        res.send(`
      <html>
        <head>
          <title>📈 Biblioteca - Prometheus Raw Metrics</title>
          <style>
            body { font-family: monospace; margin: 2rem; background: #1e1e1e; color: #eee; }
            h1 { font-family: 'Segoe UI', sans-serif; color: #0f9d58; }
            pre { background: #2d2d2d; color: #8ae234; padding: 1rem; border-radius: 8px;
                  overflow-y: auto; max-height: 80vh; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
            .comment { color: #729fcf; }
            .metric { color: #ad7fa8; }
          </style>
        </head>
        <body>
          <h1>📈 Biblioteca - Prometheus Raw Metrics</h1>
          <pre>${metrics
              .replace(/^#.*$/gm, (m) => `<span class="comment">${m}</span>`)
              .replace(/^\w+/gm, (m) => `<span class="metric">${m}</span>`)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</pre>
          <a href="/metrics">⬅ Voltar para visão amigável</a>
        </body>
      </html>
    `);
    } else {
        res.set("Content-Type", client.register.contentType);
        res.end(metrics);
    }
});

export default router;
