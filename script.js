"use strict";

/*
 FONETIZA v2
 Arquitetura:
 1. palavras validadas pelo projeto (alta confiança);
 2. regras fonéticas gerais;
 3. proteção contra dupla conversão;
 4. validação final.

 Importante: a palavra original é sempre a referência.
 O resultado intermediário nunca é reprocessado como se fosse a grafia original.
*/

// Formas confirmadas durante os testes do projeto.
// A lista fica apenas para ambiguidades reais; padrões repetitivos são tratados abaixo.
const CONFIRMED = new Map(Object.entries({
  "antigidade":"antiguidade",
  "antiguidade":"antiguidade",
  "aproximação":"aprosimasão",
  "aproximou":"aprosimou",
  "aproximou-se":"aprosimou-se",
  "aproximando":"aprosimando",
  "aquecer":"aceser",
  "aquela":"acela",
  "aquele":"acele",
  "aqui":"aci",
  "atenção":"atensão",
  "caixa":"caisa",
  "casaco":"cazaco",
  "casa":"caza",
  "casais":"cazais",
  "chafariz":"xafariz",
  "chegar":"xegar",
  "cheiro":"xeiro",
  "chuva":"xuva",
  "círculos":"sírculos",
  "coisas":"coizas",
  "complexa":"complecsa",
  "complexos":"complecsos",
  "conhecida":"connesida",
  "conhecidas":"connesidas",
  "conseguia":"consegia",
  "quando":"cuando",
  "qualquer":"cualcer",
  "quase":"cuaze",
  "quatro":"cuatro",
  "debaixo":"debaicso",
  "desceu":"deseu",
  "desacelerar":"dezaselerar",
  "desavisados":"dezavizados",
  "desce":"dese",
  "desejo":"dezejo",
  "exato":"ezato",
  "exatamente":"ezatamente",
  "exibe":"ezibe",
  "exibindo":"ezibindo",
  "exige":"ezije",
  "existia":"ezistia",
  "existiria":"ezistiria",
  "expediente":"espediente",
  "expressão":"espresão",
  "expressivos":"espresivos",
  "explicações":"esplicasoins",
  "expedições":"espedisoins",
  "extremamente":"estremamente",
  "extremidade":"estremidade",
  "extrema":"estrema",
  "expostas":"espostas",
  "exclusivamente":"escluzivamente",
  "fixo":"ficso",
  "fixando":"ficsando",
  "fluxo":"flucso",
  "fixo":"ficso",
  "gélida":"jélida",
  "legítimo":"lejítimo",
  "lixo":"licso",
  "máxima":"mácsima",
  "máximo":"mácsimo",
  "notificação":"notificasão",
  "notificações":"notificasoins",
  "necessidade":"nesesidade",
  "ninguém":"ningém",
  "obrigação":"obrigasão",
  "obrigações":"obrigasoins",
  "pretexto":"pretesto",
  "próxima":"prósima",
  "próximas":"prósimas",
  "próximo":"prósimo",
  "reflexo":"reflecso",
  "reflexivas":"reflecsivas",
  "reuniões":"reunioins",
  "sensação":"sensasão",
  "silêncio":"silênsio",
  "trânsito":"trânzito",
  "transição":"tranzisão",
  "texto":"testo",
  "você":"vosê",
  "velocidade":"velosidade",
  "urgência":"urjênsia",
  "extremamente":"estremamente",
  "exclusivamente":"escluzivamente",
  "deixando":"deixando",
  "abaixou":"abaixou",
  "deixou":"deixou",
  "próximos":"prósimos",
  "preocupação":"preocupasão",
  "preocupações":"preocupasoins",
  "solução":"solusão",
  "soluções":"solusoins",
  "discussão":"discusão",
  "discussões":"discusoins",
  "decisão":"desisão",
  "decisões":"desizoins",
  "obrigação":"obrigasão",
  "obrigar":"obrigar",
  "reunião":"reuniaoins",
  "reuniões":"reunioins",
  "anotações":"anotasoins",
  "ligações":"ligasoins",
  "desconexão":"desconecsão",
  "desconexões":"desconecsoins",
  "escritas":"escritas",
  "esclarecer":"esclarecer",
  "antigidades":"antiguidades",
  "incêndio":"insêndio",
  "fixada":"ficsada",
  "externa":"esterna",
  "desizações":"desizasoins",
  "desizões":"desizoins"
}));

const FORBIDDEN = /[hkqwyç]/i;
const WORD_RE = /\p{L}+(?:[-']\p{L}+)*/gu;
const VOWELS = "AEIOUÁÉÍÓÚÂÊÔÃÕÀ";
const isVowel = c => !!c && VOWELS.includes(c.toUpperCase());

function lower(s){ return s.toLocaleLowerCase("pt-BR"); }

function preserveCase(original, converted){
  if(original === original.toUpperCase()) return converted.toLocaleUpperCase("pt-BR");
  if(original === original.toLowerCase()) return converted.toLocaleLowerCase("pt-BR");
  const a=[...converted];
  if(a.length) a[0]=a[0].toLocaleUpperCase("pt-BR");
  return a.join("");
}

function protect(value, tokens){
  const id = `¤${tokens.length}¤`;
  tokens.push(value);
  return id;
}

function replaceLiteral(w, pattern, replacement, label, rules){
  const before=w;
  w=w.replace(pattern,replacement);
  if(w!==before) rules.push(label);
  return w;
}

/*
 X é a principal fonte de ambiguidades.
 Em vez de "trocar todo X", usamos o contexto e um pequeno conjunto
 de palavras em que a pronúncia /ks/ precisa ser preservada.
*/
function convertX(w, original, rules){
  const low=lower(original);

  // Casos /ks/ confirmados e produtivos no conjunto de testes.
  const KS_WORDS = new Set([
    "reflexo","reflexiva","reflexivas","reflexivo","reflexivos",
    "fixo","fixa","fixado","fixada","fixando",
    "fluxo","máxima","máximo","complexa","complexo","complexos",
    "debaixo"
  ]);
  if(KS_WORDS.has(low)){
    const before=w;
    w=w.replace(/x/g,"cs").replace(/X/g,"CS");
    if(w!==before) rules.push("x com som /ks/ → cs");
    return w;
  }

  // Ex + vogal = /z/; ex + consoante = /s/.
  w=w.replace(/EX(?=[AEIOUÁÉÍÓÚÂÊÔÃÕ])/g,"EZ")
       .replace(/Ex(?=[aeiouáéíóúâêôãõ])/g,"Ez")
       .replace(/ex(?=[aeiouáéíóúâêôãõ])/g,"ez");
  w=w.replace(/EX(?=[BCDFGHJKLMNPQRSTVXZ])/g,"ES")
       .replace(/Ex(?=[bcdfghjklmnpqrstvxz])/g,"Es")
       .replace(/ex(?=[bcdfghjklmnpqrstvxz])/g,"es");

  // X de aproximação/próximo: /s/.
  w=w.replace(/X(?=[AEIOUÁÉÍÓÚÂÊÔÃÕ])/g,"S")
       .replace(/x(?=[aeiouáéíóúâêôãõ])/g,"s");

  // X antes de consoante, quando ainda restar, tende a /s/.
  w=w.replace(/X(?=[BCDFGHJKLMNPQRSTVXZ])/g,"S")
       .replace(/x(?=[bcdfghjklmnpqrstvxz])/g,"s");

  if(w!==original) rules.push("x analisado por contexto");
  return w;
}

function transformGeneric(original){
  let w=original;
  const tokens=[];
  const rules=[];

  // Dígrafos primeiro: protegem o som para não serem reinterpretados.
  w=w.replace(/NH/g,protect("NN",tokens)).replace(/Nh/g,protect("Nn",tokens)).replace(/nh/g,protect("nn",tokens));
  w=w.replace(/LH/g,protect("LL",tokens)).replace(/Lh/g,protect("Ll",tokens)).replace(/lh/g,protect("ll",tokens));
  w=w.replace(/CH/g,protect("X",tokens)).replace(/Ch/g,protect("X",tokens)).replace(/ch/g,protect("x",tokens));

  // QU/GU: casos não ambíguos. Casos especiais ficam no dicionário.
  w=w.replace(/QU(?=[EÉIÍ])/g,protect("C",tokens))
       .replace(/Qu(?=[eéií])/g,protect("C",tokens))
       .replace(/qu(?=[eéií])/g,protect("c",tokens));
  w=w.replace(/QU/g,protect("CU",tokens))
       .replace(/Qu/g,protect("Cu",tokens))
       .replace(/qu/g,protect("cu",tokens));

  w=w.replace(/GU(?=[EÉIÍ])/g,protect("G",tokens))
       .replace(/Gu(?=[eéií])/g,protect("G",tokens))
       .replace(/gu(?=[eéií])/g,protect("g",tokens));

  // Letras equivalentes.
  w=w.replace(/Ç/g,"S").replace(/ç/g,"s");
  w=w.replace(/K/g,"C").replace(/k/g,"c");
  w=w.replace(/Y/g,"I").replace(/y/g,"i");
  w=w.replace(/W/g,"U").replace(/w/g,"u");

  // C com som de S.
  w=w.replace(/CE/g,protect("SE",tokens)).replace(/Ce/g,protect("Se",tokens)).replace(/ce/g,protect("se",tokens));
  w=w.replace(/CI/g,protect("SI",tokens)).replace(/Ci/g,protect("Si",tokens)).replace(/ci/g,protect("si",tokens));

  // GE/GI: regra direta definida para o projeto.
  w=w.replace(/GE/g,"JE").replace(/Ge/g,"Je").replace(/ge/g,"je");
  w=w.replace(/GI/g,"JI").replace(/Gi/g,"Ji").replace(/gi/g,"ji");

  // X usa a palavra original para decidir.
  w=convertX(w, original, rules);

  // Reavalia C criado/acentuado após a resolução do X (ex.: exercício → ezersísio).
  w=w.replace(/CE/g,"SE").replace(/Ce/g,"Se").replace(/ce/g,"se")
       .replace(/C(?=[ÉÍ])/g,"S").replace(/c(?=[éí])/g,"s");

  // S entre vogais = Z, mas apenas para S ainda existente.
  w=w.replace(/([AEIOUÁÉÍÓÚÂÊÔÃÕ])S(?=[AEIOUÁÉÍÓÚÂÊÔÃÕ])/g,"$1Z")
       .replace(/([aeiouáéíóúâêôãõ])s(?=[aeiouáéíóúâêôãõ])/g,"$1z");

  // SC + E/I: o C não acrescenta som separado.
  w=w.replace(/SCE/g,"SE").replace(/Sce/g,"Se").replace(/sce/g,"se");
  w=w.replace(/SCI/g,"SI").replace(/Sci/g,"Si").replace(/sci/g,"si");

  // SS = S.
  w=w.replace(/SS/g,"S").replace(/Ss/g,"S").replace(/ss/g,"s");

  // Terminologia nasal/plural:
  // ções → soins; ção → são; ões → oins.
  w=w.replace(/ÇÕES/g,"SOINS").replace(/Ções/g,"Soins").replace(/ções/g,"soins");
  w=w.replace(/ÇÃO/g,"SÃO").replace(/Ção/g,"São").replace(/ção/g,"são");
  w=w.replace(/ÕES/g,"OINS").replace(/Ões/g,"Oins").replace(/ões/g,"oins");

  // H isolado sem som.
  w=w.replace(/H/g,"").replace(/h/g,"");

  // Restaura os fonemas protegidos, em ordem reversa.
  for(let i=tokens.length-1;i>=0;i--) w=w.replaceAll(`¤${i}¤`,tokens[i]);

  return {word:w,applied:[...new Set(rules)]};
}

function convertWord(raw){
  const key=lower(raw);
  if(CONFIRMED.has(key)){
    return {word:preserveCase(raw,CONFIRMED.get(key)),applied:["forma confirmada"]};
  }
  return transformGeneric(raw);
}

function convertText(text){
  const changes=[];
  let ruleCount=0;
  const converted=text.replace(WORD_RE, raw=>{
    const r=convertWord(raw);
    if(r.word!==raw) changes.push({from:raw,to:r.word,rules:r.applied});
    ruleCount += r.applied.length;
    return r.word;
  });
  return {converted,changes,ruleCount};
}

function validate(text){
  const problems=[];
  const checks=[
    ["H proibido",/[h]/i],
    ["K proibido",/[k]/i],
    ["Q proibido",/[q]/i],
    ["W proibido",/[w]/i],
    ["Y proibido",/[y]/i],
    ["Ç proibido",/[ç]/i],
    ["SS proibido",/ss/i]
  ];
  for(const [name,re] of checks) if(re.test(text)) problems.push(name);
  return problems;
}

function esc(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function render(){
  const original=document.getElementById("orig").value;
  const result=convertText(original);
  document.getElementById("out").value=result.converted;

  const words=(original.match(WORD_RE)||[]).length;
  const problems=validate(result.converted);
  document.getElementById("words").textContent=words;
  document.getElementById("changed").textContent=result.changes.length;
  document.getElementById("rules").textContent=result.ruleCount;
  document.getElementById("errors").textContent=problems.length;

  const v=document.getElementById("validation");
  v.className=problems.length?"status bad":"status ok";
  v.textContent=problems.length
    ?"✗ Violações: "+problems.join(", ")
    :"✓ Estrutura validada: nenhuma letra proibida.";

  const report=document.getElementById("report");
  if(!result.changes.length){report.textContent="Nenhuma alteração foi necessária.";return;}
  report.innerHTML="<table><thead><tr><th>Original</th><th>Convertida</th><th>Regra</th></tr></thead><tbody>"+
    result.changes.map(x=>"<tr><td><code>"+esc(x.from)+"</code></td><td><code>"+esc(x.to)+"</code></td><td>"+
      (x.rules.length?x.rules.map(r=>"<span class='tag'>"+esc(r)+"</span>").join(" "):"<span class='tag'>forma confirmada</span>")+
      "</td></tr>").join("")+"</tbody></table>";
}

document.getElementById("convert").addEventListener("click",render);
document.getElementById("copy").addEventListener("click",async()=>{
  const text=document.getElementById("out").value;
  if(!text)return;
  try{await navigator.clipboard.writeText(text);}catch{alert("Não foi possível copiar automaticamente.");}
});
document.getElementById("download").addEventListener("click",()=>{
  const text=document.getElementById("out").value;
  if(!text)return;
  const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="texto_convertido.txt";a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById("clear").addEventListener("click",()=>{
  document.getElementById("orig").value="";
  document.getElementById("out").value="";
  document.getElementById("report").textContent="Faça uma conversão para ver os detalhes.";
  document.getElementById("validation").className="status";
  document.getElementById("validation").textContent="Aguardando conversão.";
  ["words","changed","rules","errors"].forEach(id=>document.getElementById(id).textContent="0");
});
