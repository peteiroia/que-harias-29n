// Test 29N «¿Qué harías?»: guarda respuestas anónimas y se las da solo al organizador.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const LIST = "b29q:respuestas";

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).result;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) return res.status(500).json({ error: "Falta conectar la base de datos" });
  try {
    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      const code = String((body && body.code) || "");
      if (!/^29Q-[A-Za-z0-9]{40}-[A-Za-z0-9]$/.test(code)) return res.status(400).json({ error: "Código no válido" });
      await redis(["RPUSH", LIST, code]);
      await redis(["LTRIM", LIST, "-50000", "-1"]);
      return res.status(200).json({ ok: true });
    }
    if (req.method === "GET") {
      const admin = process.env.ADMIN_KEY;
      if (!admin || req.query.key !== admin) return res.status(401).json({ error: "Clave incorrecta" });
      const codes = await redis(["LRANGE", LIST, "0", "-1"]);
      return res.status(200).json({ codes: codes || [] });
    }
    return res.status(405).json({ error: "Método no permitido" });
  } catch (e) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};
