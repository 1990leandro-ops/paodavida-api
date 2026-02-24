const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  "https://aeewbkacspbxwmcsmeox.supabase.co",
  "sb_publishable_Jic4Z7B_-xyCm5PqqOcUDA_wViVfPUS"
);

// TESTE
app.get("/", (req,res)=> res.send("API ONLINE"));

app.get("/api/state", async (req,res)=>{
  const { data, error } = await supabase.from("avisos").select("*");
  if(error) return res.status(500).json(error);
  res.json({avisos:data});
});

app.post("/api/state", async (req,res)=>{
  const aviso=req.body.avisos[0];

  const { data, error } = await supabase
    .from("avisos")
    .insert([{ titulo:aviso.titulo, tipo:aviso.tipo }]);

  if(error) return res.status(500).json(error);
  res.json({ok:true});
});

app.listen(3000, ()=> console.log("Servidor rodando"));
