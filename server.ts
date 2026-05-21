import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import pkg, { Pool as PgPool } from "pg";
const { Pool } = pkg;

// Lazy initialization of PG pool to prevent crashing at boot if URL is missing
let pool: PgPool | null = null;
function getPool() {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("DATABASE_URL is not set. API calls requiring database will fail.");
    }
    pool = new Pool({
      connectionString: dbUrl || "postgres://dummy:dummy@localhost:5432/dummy",
    });
  }
  return pool;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API ROUTES
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all ads
app.get("/api/ads", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured", message: "Preview mode: Please configure PostgreSQL to fetch real ads." });
    }
    const db = getPool();
    const result = await db.query("SELECT * FROM ads ORDER BY created_at DESC LIMIT 50");
    res.json(result.rows);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create an ad
app.post("/api/ads", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured", message: "Preview mode: Please configure PostgreSQL to save ads." });
    }
    const { title, category, price, description, images, location } = req.body;
    const db = getPool();
    const result = await db.query(
      "INSERT INTO ads (title, category, price, description, images, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, category, price, description, JSON.stringify(images), location]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: null }); // Unauthenticated by default in preview
});

async function setupVite() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Start server if not running in a serverless environment (e.g. Vercel)
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(console.error);
} else {
  // Setup statically for Vercel if needed, though Vercel handles static via vercel.json
  setupVite().catch(console.error);
}

export default app;
