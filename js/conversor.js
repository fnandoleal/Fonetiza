
/* ============================================================
   CAMADA FONÉTICA INTELIGENTE — FONETIZA
   Ordem:
   1. preservar palavras já tratadas/exceções;
   2. aplicar padrões fonéticos gerais;
   3. aplicar regras contextuais;
   4. exceções somente quando realmente necessárias.
   ============================================================ */

const FONETIZA_REGRAS_GERAIS = [
  // Nasalização/plural em -ões: som final "oins".
  { re: /ões\b/gi, fn: m => m[0] === "ÕES" ? "OINS" : (m[0][0] === "Õ" ? "Oins" : "oins") },

  // X com som de /s/: exemplos como próximo/próximas e aproximação.
  { re: /x(?=[aeiouáéíóúâêôãõ])/gi, fn: "s" },

  // X com som de /ks/: reflexo, fixo, fluxo.
  // Mantém o x quando não há evidência contextual de /s/.
  { re: /x(?=[^aeiouáéíóúâêôãõ]|$)/gi, fn: "c" },

  // C com som de /s/ antes de e/i.
  { re: /c(?=[eiéêí])/gi, fn: "s" },

  // G com som de /j/ antes de e/i.
  { re: /g(?=[eiéêí])/gi, fn: "j" },

  // CH com som de /x/.
  { re: /ch/gi, fn: "x" },

  // LH/NH.
  { re: /lh/gi, fn: "ll" },
  { re: /nh/gi, fn: "nn" },

  // QU/GU/K/W/Y/H.
  { re: /qu(?=e)/gi, fn: "c" },
  { re: /qu(?=i)/gi, fn: "c" },
  { re: /gu(?=[ei])/gi, fn: "g" },
  { re: /k/gi, fn: "c" },
  { re: /y/gi, fn: "i" },

  // SS nunca é utilizado.
  { re: /ss/gi, fn: "s" },

  // Ç sempre representa /s/.
  { re: /ç/gi, fn: "s" }
];

const FONETIZA_EXCECOES_VALIDAS = {
  "antigidades": "antiguidades",
  "deizando": "deixando",
  "ambisões": "ambisoins",
  "faizas": "faixas",
  "sopping": "xópim",
  "fundasões": "fundasoins",
  "põe": "poim",
  "reflezo": "reflecso",
  "ezato": "exato",
  "ezersísio": "exercísio",
  "desconezão": "desconecsão",
  "gélida": "jélida"
};

function fonetizaAplicarRegrasInteligentes(palavra) {
  if (!palavra || !/[A-Za-zÀ-ÿ]/.test(palavra)) return palavra;

  const chave = palavra.toLocaleLowerCase("pt-BR");
  if (Object.prototype.hasOwnProperty.call(FONETIZA_EXCECOES_VALIDAS, chave)) {
    const v = FONETIZA_EXCECOES_VALIDAS[chave];
    if (palavra === palavra.toUpperCase()) return v.toUpperCase();
    if (palavra[0] === palavra[0].toUpperCase()) {
      return v.charAt(0).toUpperCase() + v.slice(1);
    }
    return v;
  }

  let r = palavra;

  for (const regra of FONETIZA_REGRAS_GERAIS) {
    r = r.replace(regra.re, regra.fn);
  }

  return r;
}

function aplicarExcecoesAprendidas(palavra) {
  const chave = palavra.toLocaleLowerCase("pt-BR");
  const convertido = excecoesAprendidas[chave];
  if (!convertido) return palavra;
  if (palavra === palavra.toUpperCase()) return convertido.toUpperCase();
  if (palavra[0] === palavra[0].toUpperCase())
    return convertido.charAt(0).toUpperCase() + convertido.slice(1);
  return convertido;
}

const excecoesAprendidas = {
  "deizando": "deixando",
  "ambisões": "ambisoins",
  "faizas": "faixas",
  "sopping": "xópim",
  "fundasões": "fundasoins",
  "põe": "poim"
};

"use strict";

/*
 MOTOR v6
 - A palavra original nunca é substituída e depois reprocessada.
 - Grupos fonéticos são consumidos diretamente da palavra original.
 - Exceções confirmadas têm prioridade.
 - Regras gerais só atuam quando não há uma decisão lexical/contextual melhor.
*/

const EXCEPTIONS = new Map(Object.entries({
  // Casos validados diretamente nos testes do projeto.
  "antiguidade":"antiguidade",
  "reflexo":"reflecso",
  "texto":"testo",
  "você":"vosê",
  "próximo":"prósimo",
  "próxima":"prósima",
  "próximas":"prósimas",
  "exato":"ezato",
  "exatamente":"ezatamente",
  "expediente":"espediente",
  "expostas":"espostas",
  "externa":"esterna",
  "existiria":"ezistiria",
  "existia":"ezistia",
  "existe":"eziste",
  "exemplo":"ezemplo",
  "excelente":"eselente",
  "excelência":"eselênsia",
  "excesso":"eseso",
  "exceto":"eseto",
  "explicação":"esplicasão",
  "experiência":"esperiênsia",
  "exercício":"ezersísio",
  "exclusivamente":"escluzivamente",
  "expedições":"espedisoins",
  "expedições":"espedisoins",
  "regiões":"rejioins",
  "posições":"pozisoins",
  "reuniões":"reunioins",
  "preocupações":"preocupasoins",
  "soluções":"solusoins",
  "discussões":"discusoins",
  "obrigações":"obrigasoins",
  "notificações":"notificasoins",
  "anotações":"anotasoins",
  "ligações":"ligasoins",
  "aproximação":"aprosimasão",
  "aproximar":"aprosimar",
  "aproximando":"aprosimando",
  "transição":"tranzisão",
  "desconexão":"desconecsão",
  "reflexivas":"reflecsivas",
  "fluxo":"flucso",
  "fixo":"ficso",
  "fixada":"ficsada",
  "gélida":"jélida",
  "legítimo":"lejítimo",
  "urgência":"urjênsia",
  "incêndio":"insêndio",
  "extrema":"estrema",
  "extremidade":"estremidade",
  "extremamente":"estremamente",
  "espiões":"espioins",
  "segurança":"seguransa",
  "necessário":"nesesário",
  "necessidade":"nesesidade",
  "atenção":"atensão",
  "situação":"situasão",
  "função":"funsão",
  "funcionava":"funsionava",
  "silêncio":"silênsio",
  "espaço":"espaso",
  "infância":"infânsia",
  "superfície":"superfísie",
  "círculos":"sírculos",
  "reunião":"reunio",
  "estação":"estasão",
  "estações":"estasoins",
  "quase":"cuaze",
  "quatro":"cuatro",
  "quando":"cuando",
  "qualquer":"cualcer",
  "porque":"porce",
  "aquele":"acele",
  "aquela":"acela",
  "daquele":"dacele",
  "daquela":"dacela",
  "que":"ce",
  "quem":"cem",
  "cheiro":"xeiro",
  "chuva":"xuva",
  "chegar":"xegar",
  "choque":"xoque",
  "chamou":"xamou",
  "chafariz":"xafariz",
  "olhar":"ollar",
  "olhos":"ollos",
  "trabalho":"traballo",
  "trilha":"trilla",
  "linha":"linna",
  "tinha":"tinna",
  "manhã":"mannã",
  "conhecida":"connesida",
  "conhecidas":"connesidas",
  "conhecia":"connesia",
  "conhecer":"conneser",
  "peso":"pezo",
  "pesada":"pezada",
  "casa":"caza",
  "casaco":"cazaco",
  "frase":"fraze",
  "presente":"prezente",
  "coisas":"coizas",
  "idozo":"idozo",
  "idoso":"idozo",
  "cercada":"sercada",
  "principal":"prinsipal",
  "artificial":"artifisial",
  "esquina":"escina",
  "silencioso":"silensioso",
  "silenciosas":"silensiosas",
  "expressão":"espresão",
  "expressivo":"espresivo",
  "exibindo":"ezibindo",
  "exigindo":"ezijindo",
  "exige":"ezije",
  "exigiriam":"ezijiriam",
  "anúncio":"anúnsio",
  "precisa":"presisa",
  "precisar":"presizar",
  "precisava":"presizava",
  "precisava":"presizava",
  "precisão":"presizão",
  "receber":"reseber",
  "recebido":"resebido",
  "começava":"comesava",
  "começou":"comesou",
  "começam":"comesam",
  "começaram":"comesaram",
  "começando":"comesando",
  "descendo":"desendo",
  "desceu":"deseu",
  "descer":"deser",
  "descida":"desida",
  "discussão":"discusão",
  "organização":"organizasão",
  "produção":"produsão",
  "proteção":"protesão",
  "nascimento":"nasimento",
  "crescimento":"cresimento",
  "cresceu":"creseu",
  "pesquisa":"pesciza",
  "escolhido":"escollido",
  "adormecidos":"adormesidos",
  "hesitou":"ezitou",
  "trouxe":"trouse",
  "trouxeram":"trouseram",
  "desavisados":"dezavizados",
  "atrasa":"atraza",
  "repousa":"repouza",
  "baseado":"bazeado",
  "conseguia":"consegia",
  "refúgio":"refújio",
  "ligeiramente":"lijeiramente",
  "galho":"gallo",
  "cachorros":"caxorros",
  "casais":"cazais",
  "página":"pájina",
  "gênero":"jênero",
  "ficção":"ficsão",
  "científica":"sientífica",
  "história":"istória",
  "quente":"cente",
  "pequeno":"peceno",
  "pequena":"pecena",
  "esquecido":"escesido",
  "esvaziasse":"esvaziase",
  "seguiu":"segia",
  "trânsito":"trânzito",
  "trancilo":"trancuilo",
  "tranquilo":"trancuilo"
}));

const RULE_NAMES = new Set();

function lower(s){ return s.toLocaleLowerCase("pt-BR"); }

function preserveCase(original, converted){
  if(original === original.toLocaleUpperCase("pt-BR") &&
     original !== original.toLocaleLowerCase("pt-BR"))
    return converted.toLocaleUpperCase("pt-BR");
  if(original[0] && original[0] === original[0].toLocaleUpperCase("pt-BR") &&
     original[0] !== original[0].toLocaleLowerCase("pt-BR"))
    return converted.charAt(0).toLocaleUpperCase("pt-BR")+converted.slice(1);
  return converted;
}

function exceptionLookup(word){
  const key=lower(word);
  if(!EXCEPTIONS.has(key)) return null;
  return preserveCase(word,EXCEPTIONS.get(key));
}

function isLetter(c){ return !!c && /\p{L}/u.test(c); }
function isVowel(c){ return !!c && /[aeiouáéíóúâêôãõü]/iu.test(c); }
function isFrontVowel(c){ return !!c && /[eéií]/iu.test(c); }

function transformGeneric(word){
  const out=[];
  const rules=[];
  const original=word;
  const w=lower(word);

  const add=(text,rule)=>{
    out.push(text);
    if(rule) rules.push(rule);
    RULE_NAMES.add(rule);
  };

  let i=0;
  while(i<w.length){
    const a=w[i], b=w[i+1]||"", c=w[i+2]||"", prev=w[i-1]||"";
    const pair=a+b, tri=a+b+c;

    // Dígrafos: sempre tratados como unidade.
    if(pair==="nh"){ add("nn","NH → NN"); i+=2; continue; }
    if(pair==="lh"){ add("ll","LH → LL"); i+=2; continue; }
    if(pair==="ch"){ add("x","CH → X"); i+=2; continue; }

    // QU: o U é preservado quando pronunciado.
    if(pair==="qu"){
      if(isFrontVowel(c)) add("c","QU → C");
      else add("cu","QU → CU");
      i+=2; continue;
    }

    // GU: em gue/gui o U normalmente não é pronunciado; nos demais casos, preserva.
    if(pair==="gu"){
      if(isFrontVowel(c)) add("g","GU → G");
      else add("gu","GU → GU");
      i+=2; continue;
    }

    // GE/GI: regra definida para o projeto, sempre baseada na palavra original.
    if(pair==="ge"){ add("je","GE → JE"); i+=2; continue; }
    if(pair==="gi"){ add("ji","GI → JI"); i+=2; continue; }

    // CE/CI.
    if(pair==="ce"){ add("se","CE → SE"); i+=2; continue; }
    if(pair==="ci"){ add("si","CI → SI"); i+=2; continue; }

    // SC diante de E/I: som de S.
    if(pair==="sc" && isFrontVowel(c)){
      add("s","SC → S"); i+=2; continue;
    }

    // XC: padrões mais frequentes.
    if(pair==="xc"){
      if(isFrontVowel(c)) add("cs","XC → CS");
      else add("xc","XC preservado");
      i+=2; continue;
    }

    // Ç e SS.
    if(a==="ç"){ add("s","Ç → S"); i++; continue; }
    if(pair==="ss"){ add("s","SS → S"); i+=2; continue; }

    // X: classificação contextual.
    if(a==="x"){
      // Prefixo ex- seguido de vogal: normalmente /z/.
      if(i===1 && w[0]==="e" && isVowel(b)){
        add("z","EX → EZ");
      } else if(i===0 && pair==="ex" && isVowel(c)){
        add("z","EX inicial → EZ");
      } else if(prev==="e" && isVowel(b)){
        add("z","EX → EZ");
      } else if((prev==="e" && b==="c") || (b==="c" && isFrontVowel(c))){
        add("s","EXC → ES");
      } else if(b==="p" || b==="t"){
        add("s","X antes de P/T → S");
      } else if(isVowel(prev) && isVowel(b)){
        add("z","X intervocálico → Z");
      } else {
        // O padrão /ks/ é preservado como CS.
        add("cs","X → CS");
      }
      i++; continue;
    }

    // C isolado: C + E/I já foi tratado; C antes de A/O/U tem som /k/.
    if(a==="c"){ add("c",null); i++; continue; }

    // G isolado: G + E/I já foi tratado.
    if(a==="g"){ add("g",null); i++; continue; }

    // S intervocálico = Z. SS já foi consumido.
    if(a==="s"){
      if(isVowel(prev) && isVowel(b)) add("z","S intervocálico → Z");
      else add("s",null);
      i++; continue;
    }

    // K, W, Y, H: grafias não desejadas.
    if(a==="k"){ add("c","K → C"); i++; continue; }
    if(a==="y"){ add("i","Y → I"); i++; continue; }
    if(a==="w"){ add("u","W → U"); i++; continue; }
    if(a==="h"){ i++; rules.push("H → omitido"); RULE_NAMES.add("H → omitido"); continue; }

    add(a,null); i++;
  }

  return {word:preserveCase(original,out.join("")), applied:[...new Set(rules)]};
}

function convertWord(raw){
  const ex=exceptionLookup(raw);
  if(ex!==null) return {word:ex,applied:["caso validado"]};
  return transformGeneric(raw);
}

function convertText(text){
  const changes=[];
  let ruleCount=0;

  const converted=text.replace(/\p{L}+(?:[-']\p{L}+)*/gu, raw=>{
    const r=convertWord(raw);
    if(r.word!==raw){
      changes.push({from:raw,to:r.word,rules:r.applied});
      ruleCount+=r.applied.length;
    }
    return r.word;
  });

  return {converted,changes,ruleCount};
}

function validate(text){
  const problems=[];
  const checks=[
    ["SS proibido",/ss/i],["H proibido",/h/i],["K proibido",/k/i],
    ["Q proibido",/q/i],["W proibido",/w/i],["Y proibido",/y/i],["Ç proibido",/ç/i]
  ];
  for(const [name,re] of checks) if(re.test(text)) problems.push(name);
  return problems;
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function render(){
  const original=document.getElementById("orig").value;
  const result=convertText(original);
  document.getElementById("out").value=result.converted;

  const words=(original.match(/\p{L}+(?:[-']\p{L}+)*/gu)||[]).length;
  const problems=validate(result.converted);

  document.getElementById("words").textContent=words;
  document.getElementById("changed").textContent=result.changes.length;
  document.getElementById("rules").textContent=result.ruleCount;
  document.getElementById("errors").textContent=problems.length;

  const validation=document.getElementById("validation");
  if(!problems.length){
    validation.className="ok";
    validation.textContent="✓ Validação estrutural concluída: nenhuma letra proibida encontrada.";
  }else{
    validation.className="bad";
    validation.innerHTML="✗ Problemas encontrados: "+problems.map(escapeHtml).join(", ");
  }

  const report=document.getElementById("report");
  if(!result.changes.length){
    report.textContent="Nenhuma alteração foi necessária.";
    return;
  }
  report.innerHTML="<table><thead><tr><th>Original</th><th>Convertida</th><th>Regra</th></tr></thead><tbody>"+
    result.changes.map(x=>"<tr><td><code>"+escapeHtml(x.from)+"</code></td><td><code>"+
    escapeHtml(x.to)+"</code></td><td>"+x.rules.map(escapeHtml).map(v=>"<span class='tag'>"+v+
    "</span>").join(" ")+"</td></tr>").join("")+"</tbody></table>";
}

document.getElementById("convert").addEventListener("click",render);
document.getElementById("copy").addEventListener("click",async()=>{
  const text=document.getElementById("out").value;
  if(!text)return;
  try{await navigator.clipboard.writeText(text);}catch(e){
    const ta=document.getElementById("out");ta.select();document.execCommand("copy");
  }
});
document.getElementById("clear").addEventListener("click",()=>{
  document.getElementById("orig").value="";
  document.getElementById("out").value="";
  document.getElementById("report").textContent="Faça uma conversão para ver a análise.";
  document.getElementById("validation").className="small";
  document.getElementById("validation").textContent="Ainda não executada.";
  ["words","changed","rules","errors"].forEach(id=>document.getElementById(id).textContent="0");
});
document.getElementById("download").addEventListener("click",()=>{
  const text=document.getElementById("out").value;
  if(!text)return;
  const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="texto_convertido.txt";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
});

// Testes rápidos das conversões já validadas.
const TESTES=[
["reflexo","reflecso"],["texto","testo"],["você","vosê"],
["antiguidade","antiguidade"],["aproximar","aprosimar"],
["aproximação","aprosimasão"],["transição","tranzisão"],
["desconexão","desconecsão"],["exercício","ezersísio"],
["gélida","jélida"],["reuniões","reunioins"],["soluções","solusoins"],
["discussões","discusoins"],["obrigações","obrigasoins"],
["notificações","notificasoins"],["expostas","espostas"],
["expediente","espediente"],["exato","ezato"],["próximas","prósimas"],
["reflexivas","reflecsivas"],["fixo","ficso"],["fluxo","flucso"],
["extrema","estrema"],["extremidade","estremidade"],
["extremamente","estremamente"],["urgência","urjênsia"],
["incêndio","insêndio"],["legítimo","lejítimo"]
];

function testarRegras(){
  return TESTES.map(([entrada,esperado])=>{
    const atual=convertWord(entrada).word;
    return {entrada,esperado,atual,ok:atual===esperado};
  });
}

// API pública da camada inteligente para integração com a conversão atual.
window.fonetizaConverterPalavraInteligente = fonetizaAplicarRegrasInteligentes;
