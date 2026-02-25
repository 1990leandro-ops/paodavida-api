const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// GET AVISOS (para o app)
app.get("/notices", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("estado")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return res.json([]);
    }

    return res.json(data.avisos || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
const ADMIN_PIN = process.env.ADMIN_PIN || "1234";

const supabase = createClient(
  "https://aeewbkacspbxwmcsmeox.supabase.co",
  "sb_publishable_Jic4Z7B_-xyCm5PqqOcUDA_wViVfPUS"
);

// TESTE
app.get("/", (req, res) => {
  res.send("API Pão da Vida online 🙏");
});

// GET dados
app.get("/api/state", async (req, res) => {
  const { data, error } = await supabase
    .from("estado")
    .select("*")
    .limit(1)
    .single();

  if (error) return res.json({ avisos: [], membros: [] });
  res.json(data);
});

// POST admin
app.post("/api/state", async (req, res) => {
  const pin = req.headers["x-admin-pin"];
  if (pin !== ADMIN_PIN) {
    return res.status(401).json({ error: "PIN inválido" });
  }

  const { avisos, membros } = req.body;

  const { error } = await supabase
    .from("estado")
    .upsert({ id: 1, avisos, membros });

  if (error) return res.status(500).json(error);

  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando 🚀");
});
