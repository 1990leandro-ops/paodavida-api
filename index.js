const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function requireAdmin(req, res, next) {
  const pin = req.header("x-admin-pin");
  if (pin !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/api/state", async (req, res) => {
  const { data: avisos } = await supabase.from("avisos").select("*");
  const { data: membros } = await supabase.from("membros").select("*");

  res.json({
    avisos: avisos || [],
    membros: membros || []
  });
});

app.post("/api/state", requireAdmin, async (req, res) => {
  const { avisos, membros } = req.body;

  if (avisos) {
    await supabase.from("avisos").delete().neq("id", 0);
    await supabase.from("avisos").insert(avisos);
  }

  if (membros) {
    await supabase.from("membros").delete().neq("id", 0);
    await supabase.from("membros").insert(membros);
  }

  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API rodando");
});
