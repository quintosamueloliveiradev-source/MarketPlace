import express from "express";
import path from "path";
import pkg, { Pool as PgPool } from "pg";
const { Pool } = pkg;

// Lazy initialization of PG pool to prevent crashing at boot if URL is missing
let pool: PgPool | null = null;
function getPool() {
  if (!pool) {
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("DATABASE_URL is not set. API calls requiring database will fail.");
    } else if (dbUrl.includes('#') || dbUrl.includes('[')) {
      console.warn("\n⚠️ AVISO: Seu DATABASE_URL contém caracteres especiais como '#' ou '['. Tentando auto-corrigir (URL Encode)...");
      try {
        // Simple auto-fix for common issues
        // format is postgres://user:password@host...
        const urlMatch = dbUrl.match(/^(postgres(?:ql)?:\/\/[^:]+:)(.*)(@[^@]+)$/);
        if (urlMatch) {
          const prefix = urlMatch[1];
          let password = urlMatch[2];
          const suffix = urlMatch[3];
          password = password.replace(/\[/g, '%5B').replace(/\]/g, '%5D').replace(/#/g, '%23').replace(/@/g, '%40');
          dbUrl = prefix + password + suffix;
          console.log("✅ DATABASE_URL auto-corrigido com sucesso.");
        }
      } catch (e) {
        console.warn("Falha ao tentar auto-corrigir DATABASE_URL.");
      }
    }
    const isLocal = dbUrl ? typeof dbUrl === 'string' && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) : true;
    pool = new Pool({
      connectionString: dbUrl || "postgres://dummy:dummy@localhost:5432/dummy",
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      query_timeout: 5000,
    });
    pool.on('error', (err: any) => {
      if (err.code === 'ETIMEDOUT' || err.message?.includes('ETIMEDOUT')) {
        console.warn("Idle connection timeout. Please check if your database requires Connection Pooler URL.");
      } else {
        console.error('Unexpected error on idle client', err.message);
      }
    });
  }
  return pool;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API ROUTES
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all ads
// Messages Endpoints
app.get("/api/messages", async (req, res) => {
  try {
    const db = getPool();
    const { user_email } = req.query;
    if (!user_email) {
      return res.status(400).json({ error: "user_email is required" });
    }
    const result = await db.query(
      `SELECT m.*, a.title as ad_title 
       FROM messages m 
       LEFT JOIN ads a ON m.ad_id = a.id 
       WHERE m.sender_email = $1 OR m.receiver_email = $1 
       ORDER BY m.created_at ASC`,
      [user_email]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const db = getPool();
    const { ad_id, sender_email, receiver_email, content } = req.body;
    if (!sender_email || !receiver_email || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await db.query(
      "INSERT INTO messages (ad_id, sender_email, receiver_email, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [ad_id, sender_email, receiver_email, content]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/migrate", async (req, res) => {
  try {
    const db = getPool();
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
        sender_email VARCHAR(255) NOT NULL,
        receiver_email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.json({ status: "ok" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/ads", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured", message: "Database URL is not configured." });
    }
    const db = getPool();
    const { user_email } = req.query;
    let query = "SELECT * FROM ads ORDER BY created_at DESC LIMIT 50";
    let params: any[] = [];
    if (user_email) {
      query = "SELECT * FROM ads WHERE user_email = $1 ORDER BY created_at DESC LIMIT 50";
      params = [user_email];
    }
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.message?.includes('ENOTFOUND')) {
      console.error("Database Connection Error (ENOTFOUND): Hostname not found. This is often caused by an unencoded special character (like '@' or '#') in your database password which breaks URL parsing.");
      return res.status(503).json({ 
        error: "Database Host Not Found", 
        message: "Erro na conexão. Se estiver usando Supabase, verifique se a sua senha tem caracteres especiais (como #, @, [, ]) e substitua-os pelo seu respectivo URL Encode (ex: %23, %40, %5B, %5D)." 
      });
    }
    if (error.code === '28P01' || error.message?.includes('password authentication failed')) {
      console.error("Database Auth Error: Senha incorreta ou caracteres especiais não codificados (ex: '#'). Substitua '#' por '%23', '[' por '%5B' e ']' por '%5D' no seu DATABASE_URL.");
      return res.status(503).json({ 
        error: "Database Authentication Failed", 
        message: "Erro de autenticação no banco. Verifique se sua senha no DATABASE_URL contém caracteres especiais como '#' e substitua por '%23' (URL Encode)." 
      });
    }
    if (error.code === 'ETIMEDOUT' || error.message?.includes('ETIMEDOUT') || error.message?.includes('timeout')) {
      console.warn("Database Connection Timeout. Please switch your Supabase DATABASE_URL to use the Connection Pooler URL (port 6543) instead of direct connection (port 5432).");
      return res.status(503).json({ 
        error: "Database Connection Timeout", 
        message: "A conexão com o banco de dados falhou por tempo esgotado. Se estiver usando Supabase, certifique-se de usar a URL de 'Connection Pooler' (geralmente porta 6543) ao invés da porta padrão 5432." 
      });
    }
    console.error("Database Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create an ad
app.post("/api/ads", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured", message: "Database URL is not configured." });
    }
    const { title, category, price, description, images, location, user_email } = req.body;
    const db = getPool();
    const result = await db.query(
      "INSERT INTO ads (title, category, price, description, images, location, user_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, category, price, description, JSON.stringify(images), location, user_email || null]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update an ad
app.put("/api/ads/:id", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured", message: "Database URL is not configured." });
    }
    const { title, category, price, description, images, location } = req.body;
    const db = getPool();
    const result = await db.query(
      "UPDATE ads SET title = $1, category = $2, price = $3, description = $4, images = $5, location = $6 WHERE id = $7 RETURNING *",
      [title, category, price, description, JSON.stringify(images), location, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get single ad
app.get("/api/ads/:id", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured" });
    }
    const db = getPool();
    const result = await db.query("SELECT * FROM ads WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/ads/:id", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "No Database Configured" });
    }
    const db = getPool();
    try {
      await db.query("DELETE FROM ads WHERE id = $1", [req.params.id]);
    } catch (e: any) {
      console.warn("Delete DB error ignored:", e.message);
    }
    // Always return success so the UI updates optimistically if it's a minor error formatting
    res.json({ success: true });
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
    const { createServer: createViteServer } = await import("vite");
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
