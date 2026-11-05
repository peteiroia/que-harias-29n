// Test 29N «¿Qué harías?»: guarda respuestas anónimas y se las da solo al organizador.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const LIST = "b29q:respuestas";

// Copia del cálculo de la web, para dar resultados agregados sin enseñar respuestas individuales.
const BLOCKS=[
["Economía",[
 ["La luz se dispara este invierno. Si gobernaras, ¿qué harías?",[["Ampliar el bono social y topar temporalmente el precio del gas","S"],["Quitar impuestos a la generación eléctrica y alargar las nucleares","F"],["Bajar impuestos de la factura y apostar por la soberanía energética nacional","A"],["Crear una eléctrica pública y gravar los beneficios extra de las grandes","CM"]]],
 ["Una gran empresa anuncia beneficios récord. ¿Qué haces?",[["Aplicarle un impuesto extraordinario para financiar ayudas","S"],["Nada: más beneficios significa más inversión y empleo","FA"],["Exigir que reparta parte con su plantilla en salarios","C"],["Que el Estado entre en su capital si es un sector estratégico","M"]]],
 ["Tienes 10.000 millones extra en el presupuesto. ¿A qué los destinas?",[["A bajar el IRPF a las clases medias","F"],["A bajar impuestos a familias y empresas y a reforzar fronteras","A"],["A sanidad, educación y vivienda pública","CM"],["A pensiones y becas, sin disparar el déficit","S"]]],
 ["Para que España crezca más, lo primero que harías es…",[["Eliminar trámites: derogar tres normas por cada una nueva","FA"],["Pactar con sindicatos y empresarios una subida de salarios","S"],["Planes públicos de industria verde y reducción de jornada","C"],["Acabar con la austeridad y recuperar sectores clave para lo público","M"]]]]],
["Impuestos",[
 ["¿Qué harías con el impuesto de sucesiones (herencias)?",[["Bonificarlo en toda España","F"],["Suprimirlo del todo","A"],["Armonizarlo para que las comunidades no compitan a la baja","S"],["Hacerlo más progresivo con las grandes herencias","CM"]]],
 ["¿Y con los impuestos a las grandes fortunas?",[["Mantener el impuesto de solidaridad actual","S"],["Quitarlo, porque espanta la inversión","FA"],["Endurecerlo y perseguir más los paraísos fiscales","C"],["Un impuesto mucho mayor a los superricos","M"]]],
 ["Si tuvieras que rediseñar el IRPF…",[["Lo ajustaría cada año a la inflación y lo bajaría a rentas medias","F"],["Solo dos tramos, 15% y 25%, con 22.000 € exentos","A"],["Mantendría la progresividad actual","S"],["Subiría los tramos de las rentas más altas","CM"]]]]],
["Vivienda",[
 ["El alquiler en tu ciudad no para de subir. ¿Qué harías?",[["Topar precios en las zonas más tensionadas","S"],["Congelar alquileres y prorrogar los contratos automáticamente","CM"],["Quitar topes y dar seguridad jurídica al propietario para que alquile más","F"],["Prioridad a los españoles en vivienda pública y menos impuestos a la compra","A"]]],
 ["Un joven de 28 años quiere comprar su primera casa. ¿Cómo le ayudas?",[["Con un aval público de hasta el 100% de la hipoteca","F"],["Con IVA cero en su primera vivienda","A"],["Mejor un alquiler público asequible que endeudarse 30 años","CM"],["Con bono alquiler joven y vivienda pública a precio limitado","S"]]],
 ["Un fondo de inversión compra 300 pisos en tu barrio. ¿Qué haces?",[["Prohibiría las compras especulativas de vivienda","CM"],["Le subiría impuestos y le obligaría a destinar parte a alquiler asequible","S"],["Es legal; lo que falta es construir mucho más","F"],["Libre mercado, pero con menos impuestos y trabas para el comprador particular","A"]]],
 ["Una familia ocupa el piso vacío de un particular. ¿Qué harías?",[["Desalojo en 24 o 48 horas","FA"],["Desalojo rápido, con alternativa de servicios sociales","S"],["Nadie a la calle sin alternativa habitacional","C"],["Obligar a los grandes propietarios a sacar sus pisos vacíos para que no pase","M"]]]]],
["Trabajo",[
 ["¿Qué harías con el salario mínimo?",[["Fijarlo en 1.800 € por ley","M"],["Subirlo cada año hasta el 60% del salario medio","SC"],["Congelarlo y bajar cotizaciones para que se contrate más","F"],["Bajar impuestos al trabajo para que el sueldo neto suba","A"]]],
 ["¿Y con la jornada laboral?",[["Reducirla a 30 horas semanales","M"],["Bajarla a 37,5 horas por ley","SC"],["Que la negocie cada sector","F"],["Flexibilidad total entre empresa y trabajador","A"]]],
 ["Para reducir el paro juvenil, ¿qué harías?",[["Bajar las cotizaciones a quien contrate jóvenes","F"],["Dar prioridad a los españoles en el empleo","A"],["Más FP dual y contratos estables","S"],["Un plan de empleo público garantizado para jóvenes","CM"]]]]],
["Sanidad y educación",[
 ["Las listas de espera son eternas. ¿Qué harías?",[["Derivar pacientes a la privada para reducirlas ya","FA"],["Ley de tiempos máximos y más plazas de médicos","S"],["Prohibir las derivaciones y blindar la sanidad pública","C"],["Integrar poco a poco la sanidad privada concertada en la pública","M"]]],
 ["¿Cómo repartirías el dinero público de educación?",[["Entre pública y concertada, para que las familias elijan","F"],["Con un cheque escolar para que cada familia elija centro","A"],["Mantener el modelo actual reforzando la pública","S"],["Solo a la pública, con fin progresivo de la concertada","CM"]]],
 ["Charlas sobre sexualidad e igualdad en los colegios. ¿Qué harías?",[["Hacerlas obligatorias para todo el alumnado","CM"],["Mantenerlas en el currículo como ahora","S"],["Informar a los padres y que puedan revisar el contenido","F"],["Solo con permiso expreso de los padres","A"]]]]],
["Derechos humanos y libertades",[
 ["¿Qué harías con el aborto?",[["Blindarlo en la Constitución","S"],["Blindarlo y garantizar que se haga siempre en la sanidad pública","CM"],["Mantener la ley actual sin cambios","F"],["Restringirlo y apoyar alternativas para las madres","A"]]],
 ["¿Y con la ley trans?",[["Ampliarla, por ejemplo a personas no binarias","CM"],["Mantenerla como está","S"],["Derogarla y que el sexo biológico rija el deporte femenino","F"],["Derogarla junto a otras leyes que considero ideológicas","A"]]],
 ["Sobre la violencia contra las mujeres, ¿qué harías?",[["Mantener la ley actual y reforzar el Ministerio de Igualdad","S"],["Más juzgados especializados y recursos feministas","CM"],["Penas más duras y una ley contra la violencia vicaria","F"],["Sustituir la ley por una de violencia intrafamiliar","A"]]],
 ["Llegan cientos de pateras a Canarias. ¿Qué haces?",[["Acogida digna y vías legales seguras para migrar","CM"],["Control de fronteras, cooperación con países de origen y reparto entre comunidades","S"],["Más control, devolución de irregulares y acuerdos con países de origen","F"],["Bloqueo naval y repatriación","A"]]]]],
["Justicia",[
 ["¿Cómo elegirías al órgano de gobierno de los jueces?",[["Que lo elijan los propios jueces","FA"],["Que lo siga eligiendo el Parlamento con mayorías amplias","S"],["Con una reforma profunda que democratice la justicia","C"],["Con más participación de la ciudadanía en su elección","M"]]],
 ["¿Qué harías con la amnistía a los líderes del procés?",[["Derogarla","F"],["Derogarla e ilegalizar a los partidos separatistas","A"],["Mantenerla porque ayudó a la convivencia","S"],["Mantenerla y avanzar hacia un referéndum pactado","CM"]]],
 ["Para reducir la delincuencia, ¿qué harías?",[["Ampliar la prisión permanente revisable","F"],["Endurecer penas y expulsar a los extranjeros que delincan","A"],["Más policía de proximidad y programas de reinserción","S"],["Atacar las causas: pobreza, desigualdad y falta de vivienda","CM"]]]]],
["Honradez",[
 ["Un cargo de tu partido es investigado por corrupción. ¿Qué haces?",[["Que dimita en el acto, aunque no haya juicio","AM"],["Suspenderlo de militancia si se abre juicio oral","F"],["Esperar a que la justicia actúe","S"],["Apartarlo y crear una oficina anticorrupción independiente","C"]]],
 ["Un exministro ficha por una gran empresa del sector que regulaba. ¿Qué harías?",[["Prohibirlo de por vida","M"],["Ampliar los años de incompatibilidad y registrar a los lobbies","SC"],["Suprimir las subvenciones a partidos, sindicatos y patronal","A"],["Recortar a la mitad los altos cargos para que la política no sea un negocio","F"]]],
 ["¿Cómo controlarías el dinero de la política?",[["Más poder al Tribunal de Cuentas y transparencia total","SC"],["Acabar con las subvenciones públicas a partidos","A"],["Reducir el gasto político y el número de ministerios","F"],["Poner un tope a los sueldos de los políticos","M"]]]]],
["Parlamento y elecciones",[
 ["¿Qué cambiarías de la ley electoral?",[["Hacerla más proporcional, para que cada voto valga lo mismo","CM"],["Que gobierne la lista más votada","F"],["Nada, el sistema actual funciona","S"],["Que los partidos regionales no puedan decidir el Gobierno","A"]]],
 ["Nadie tiene mayoría absoluta. ¿Qué harías?",[["Un pacto progresista, también con partidos nacionalistas","S"],["Un Gobierno de izquierdas que exija mucho más al PSOE","CM"],["Gobernar en solitario con apoyos puntuales","F"],["Entrar en el Gobierno con condiciones firmes","A"]]],
 ["¿Qué lenguas se deberían usar en el Congreso?",[["Uso libre de catalán, euskera y gallego","S"],["Uso libre y reconocer un Estado plurinacional","CM"],["Solo español en el Congreso y las cooficiales en el Senado","F"],["Solo español en todas las instituciones del Estado","A"]]]]],
["La Corona",[
 ["¿Qué harías con la monarquía?",[["Defenderla sin cambios","A"],["Defenderla como garante de la Constitución","F"],["Mantenerla con más transparencia","S"],["Un referéndum entre monarquía y república","CM"]]],
 ["¿Y con la inviolabilidad del rey?",[["Mantenerla íntegra","FA"],["Limitarla a sus actos oficiales","S"],["Eliminarla","C"],["Eliminarla e investigar a fondo a Juan Carlos I","M"]]],
 ["Sobre los gastos de la Casa Real…",[["Están bien como están","FA"],["Más transparencia en sus cuentas","S"],["Auditorías públicas y control del Congreso","C"],["Recortarlos mucho","M"]]]]],
["Territorio",[
 ["Cataluña pide un referéndum de independencia. ¿Qué haces?",[["No, pero diálogo dentro de la Constitución","S"],["No, y aplicar el 155 si hace falta","F"],["No, y recuperar competencias para el Estado","A"],["Un referéndum pactado","CM"]]],
 ["¿Cómo repartirías el dinero entre comunidades?",[["Financiación singular para Cataluña y otras, con condiciones","S"],["Igual para todos, sin privilegios","F"],["Devolver al Estado competencias como educación y sanidad","A"],["Un modelo federal y solidario con más autogobierno","CM"]]],
 ["¿Qué harías con el castellano en la escuela?",[["Garantizarlo en toda España junto a las lenguas cooficiales","F"],["Que sea lengua vehicular en toda España","A"],["Respetar el modelo de cada comunidad","S"],["Apoyar la inmersión en la lengua propia de cada territorio","CM"]]],
 ["¿Qué harías con la memoria de la Guerra Civil y el franquismo?",[["Derogar la Ley de Memoria Democrática","F"],["Derogarla y sustituirla por una ley de concordia","A"],["Mantener la ley actual","S"],["Ampliarla con más verdad, justicia y reparación","CM"]]]]],
["Inmigración y mundo",[
 ["Personas que llevan años en España sin papeles. ¿Qué harías?",[["Una regularización extraordinaria","CM"],["Arraigo caso a caso con contrato de trabajo","S"],["Solo con contrato en origen y cupos según el empleo","F"],["Expulsión y retorno a sus países","A"]]],
 ["¿Cómo darías las ayudas sociales a extranjeros?",[["Igual que a los españoles si tienen residencia legal","S"],["Igual para todos, incluidos los derechos básicos de quien no tiene papeles","CM"],["Exigiendo varios años de residencia","F"],["Con prioridad para los españoles","A"]]],
 ["¿Qué harías con el gasto en defensa?",[["Llegar al objetivo de la OTAN","F"],["Subirlo con moderación y en clave europea","S"],["Subirlo si protege nuestras fronteras, empezando por Ceuta y Melilla","A"],["Ni un euro más en armas: diplomacia y paz","CM"]]]]]
];

const Q=[];BLOCKS.forEach(([t,qs],b)=>qs.forEach(q=>Q.push([t,q[0],q[1],b])));
const LETTERS="SFACM";
const AL="k7QmZ2pXv9RbT4nJcW8sLyF3hG6dMqA5";
const N=Q.length;
function key(k){return (k*7+11)%32}
function decodeOne(body,chk){let sum=0,out=[];for(let k=0;k<N;k++){const idx=AL.indexOf(body[k]);if(idx<0)return null;const d=(idx-key(k)+64)%32;if(d>5||d===4)return null;sum+=d*(k+1);out.push(d===5?null:d)}return AL[sum%32]===chk?out:null}
const EXCLTOT=[0,0,0,0,0];Q.forEach(q=>q[2].forEach(o=>{if(o[1].length===1)EXCLTOT[LETTERS.indexOf(o[1])]++}));
function hashAns(a){let h=2166136261;a.forEach(v=>{h^=(v===null?9:v+1);h=Math.imul(h,16777619)>>>0});return h}
function round100(raw,ord){const rank=ord||[0,1,2,3,4];const fl=raw.map(Math.floor);let rest=100-fl.reduce((x,y)=>x+y,0);raw.map((v,c)=>[c,v-fl[c]]).sort((x,y)=>(Math.abs(y[1]-x[1])>1e-9?y[1]-x[1]:rank.indexOf(x[0])-rank.indexOf(y[0]))).forEach(([c])=>{if(rest>0){fl[c]++;rest--}});return fl}
function score(a){
  const m=[0,0,0,0,0],ex=[0,0,0,0,0];let n=0;
  a.forEach((v,k)=>{if(v===null||!Q[k][2][v])return;n++;const L=Q[k][2][v][1];for(const ch of L){m[LETTERS.indexOf(ch)]++}if(L.length===1)ex[LETTERS.indexOf(L)]++});
  if(!n)return null;
  const tot=m.reduce((x,y)=>x+y,0)||1;
  const raw=m.map(x=>x/tot*100);
  const h=hashAns(a);
  const ord=[0,1,2,3,4].sort((x,y)=>(m[y]-m[x])||((ex[y]/EXCLTOT[y])-(ex[x]/EXCLTOT[x]))||((((h>>>(y*3))&7)^y)-(((h>>>(x*3))&7)^x))||(x-y));
  return {n,raw,pct:round100(raw,ord),ord,top:ord[0]};
}

// Ley electoral: sin publicar resultados del 24 de noviembre al cierre de los colegios el día 29 (20:00 hora canaria).
const BLACKOUT_FROM = Date.UTC(2026, 10, 23, 23, 0);
const BLACKOUT_TO = Date.UTC(2026, 10, 29, 20, 0);
function aggregate(codes) {
  const cnt = [0, 0, 0, 0, 0], sum = [0, 0, 0, 0, 0]; let n = 0;
  for (const c of codes) {
    const m = String(c).match(/^29Q-([A-Za-z0-9]{40})-([A-Za-z0-9])$/); if (!m) continue;
    const a = decodeOne(m[1], m[2]); if (!a) continue;
    const s = score(a); if (!s) continue;
    n++; cnt[s.top]++; s.raw.forEach((p, i) => { sum[i] += p; });
  }
  return { n, cnt, avg: sum.map(v => (n ? v / n : 0)) };
}

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
    if (req.method === "GET" && req.query.public) {
      const now = Date.now();
      if (now >= BLACKOUT_FROM && now < BLACKOUT_TO) return res.status(200).json({ blackout: true });
      const codes = await redis(["LRANGE", LIST, "0", "-1"]);
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      const g = aggregate(codes || []);
      const t = g.cnt.reduce((x, y) => x + y, 0);
      // Sin número de participantes: solo porcentajes.
      return res.status(200).json({ has: g.n > 0, fav: g.cnt.map(v => (t ? v / t * 100 : 0)), avg: g.avg });
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
