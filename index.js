import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const DATA_FILE = path.join(process.cwd(), "data.json");

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { avisos: null, membros: null, pin: "1234" };
  }
}

function writeData(d) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), "utf-8");
}

app.get("/api/state", (req, res) => {
  const d = readData();
  res.json({
    avisos: d.avisos ?? null,
    membros: d.membros ?? null,
  });
});

app.post("/api/state", (req, res) => {
  const { avisos, membros, pin } = req.body || {};
  const cur = readData();
  const okPin = String(pin || "") === String(cur.pin || "1234");
  if (!okPin) return res.status(401).json({ ok: false, error: "PIN inválido" });

  const next = {
    ...cur,
    avisos: Array.isArray(avisos) ? avisos : cur.avisos,
    membros: Array.isArray(membros) ? membros : cur.membros,
    updatedAt: Date.now(),
  };
  writeData(next);
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("✅ Servidor Pão da Vida rodando em http://0.0.0.0:" + port);
});
