/*
  FONETIZA — Motor fonético v4

  PRINCÍPIO CRÍTICO:
  A conversão SEMPRE é calculada a partir da palavra original.
  O resultado nunca volta para o motor como entrada de outra regra.

  Ordem:
  1) casos lexicais validados (original -> resultado);
  2) padrões fonéticos gerais;
  3) regras contextuais;
  4) validação/regressão.

  IMPORTANTE:
  Não são cadastrados erros (ex.: "deizando"). Quando um caso lexical é
  necessário, o cadastro é feito pela forma ORIGINAL correta (ex.: "deixando"
  -> "deixando"). Isso impede que o sistema perpetue uma conversão errada.
*/

"use strict";

const EXCEPTIONS = new Map(Object.entries({
  /* Casos que não devem ser decididos por uma substituição mecânica. */
  "antiguidade":"antiguidade",
  "antiguidades":"antiguidades",
  "deixando":"deixando",
  "deixar":"deixar",
  "faixa":"faixa",
  "faixas":"faixas",
  "caixa":"caixa",
  "caixas":"caixas",
  "shopping":"xópim",
  "põe":"poim",

  /* X / KS / Z / S já validados */
  "reflexo":"reflecso",
  "reflexivas":"reflecsivas",
  "fixo":"ficso",
  "fixada":"ficsada",
  "fluxo":"flucso",
  "texto":"testo",
  "você":"vosê",
  "exato":"ezato",
  "exatamente":"ezatamente",
  "exemplo":"ezemplo",
  "excelente":"eselente",
  "excelência":"eselênsia",
  "excesso":"eseso",
  "exceto":"eseto",
  "existiria":"ezistiria",
  "existia":"ezistia",
  "existe":"eziste",
  "exibindo":"ezibindo",
  "expediente":"espediente",
  "expostas":"espostas",
  "externa":"esterna",
  "exercício":"ezersísio",
  "exclusivamente":"escluzivamente",
  "explicação":"esplicasão",
  "experiência":"esperiênsia",
  "expedições":"espedisoins",

  /* Padrões já confirmados */
  "aproximar":"aprosimar",
  "aproximando":"aprosimando",
  "aproximação":"aprosimasão",
  "próximo":"prósimo",
  "próxima":"prósima",
  "próximas":"prósimas",
  "transição":"tranzisão",
  "trânsito":"trânzito",
  "desconexão":"desconecsão",
  "gélida":"jélida",
  "legítimo":"lejítimo",
  "urgência":"urjênsia",
  "incêndio":"insêndio",
  "extrema":"estrema",
  "extremidade":"estremidade",
  "extremamente":"estremamente",

  /* ões -> oins e palavras já validadas */
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
  "estações":"estasoins",
  "espiões":"espioins",

  /* Outras formas validadas durante os testes */
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
  "idoso":"idozo",
  "cercada":"sercada",
  "principal":"prinsipal",
  "artificial":"artifisial",
  "esquina":"escina",
  "silencioso":"silensioso",
  "silenciosas":"silensiosas",
  "expressão":"espresão",
  "expressivo":"espresivo",
  "exigindo":"ezijindo",
  "exige":"ezije",
  "exigiriam":"ezijiriam",
  "anúncio":"anúnsio",
  "precisa":"presisa",
  "precisar":"presizar",
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
  "tranquilo":"trancuilo"
}));

function lower(s) {
  return s.toLocaleLowerCase("pt-BR");
}

function preserveCase(original, converted) {
  if (original === original.toLocaleUpperCase("pt-BR") &&
      original !== original.toLocaleLowerCase("pt-BR")) {
    return converted.toLocaleUpperCase("pt-BR");
  }
  if (original[0] &&
      original[0] === original[0].toLocaleUpperCase("pt-BR") &&
      original[0] !== original[0].toLocaleLowerCase("pt-BR")) {
    return converted.charAt(0).toLocaleUpperCase("pt-BR") + converted.slice(1);
  }
  return converted;
}

function exceptionLookup(word) {
  const key = lower(word);
  return EXCEPTIONS.has(key)
    ? preserveCase(word, EXCEPTIONS.get(key))
    : null;
}

function isVowel(c) {
  return !!c && /[aeiouáéíóúâêôãõü]/iu.test(c);
}

function isFrontVowel(c) {
  return !!c && /[eéií]/iu.test(c);
}

function genericConvert(word) {
  const w = lower(word);
  const out = [];
  const rules = [];

  const add = (s, rule) => {
    out.push(s);
    if (rule) rules.push(rule);
  };

  let i = 0;

  while (i < w.length) {
    const a = w[i];
    const b = w[i + 1] || "";
    const c = w[i + 2] || "";
    const prev = w[i - 1] || "";
    const prev2 = w[i - 2] || "";

    /* Nasalização: regra geral, não exceção por palavra. */
    if (w.slice(i, i + 2) === "õe") {
      add("oin", "ÕE → OIN");
      i += 2;
      continue;
    }

    if (w.slice(i, i + 2) === "ões") {
      add("oins", "ÕES → OINS");
      i += 3;
      continue;
    }

    /* Dígrafos consumidos diretamente da palavra original. */
    if (a + b === "nh") {
      add("nn", "NH → NN"); i += 2; continue;
    }
    if (a + b === "lh") {
      add("ll", "LH → LL"); i += 2; continue;
    }
    if (a + b === "ch") {
      add("x", "CH → X"); i += 2; continue;
    }

    /* QU / GU */
    if (a + b === "qu") {
      if (isFrontVowel(c)) add("c", "QUE/QUI → CE/CI");
      else add("cu", "QUA/QUO → CUA/CUO");
      i += 2; continue;
    }

    if (a + b === "gu") {
      if (isFrontVowel(c)) add("g", "GUE/GUI → GE/GI");
      else add("gu", null);
      i += 2; continue;
    }

    /* GE / GI e CE / CI */
    if (a + b === "ge") {
      add("je", "GE → JE"); i += 2; continue;
    }
    if (a + b === "gi") {
      add("ji", "GI → JI"); i += 2; continue;
    }
    if (a + b === "ce") {
      add("se", "CE → SE"); i += 2; continue;
    }
    if (a + b === "ci") {
      add("si", "CI → SI"); i += 2; continue;
    }

    if (a + b === "ss") {
      add("s", "SS → S"); i += 2; continue;
    }

    if (a === "ç") {
      add("s", "Ç → S"); i++; continue;
    }

    /*
      X:
      - EX + vogal: /z/
      - EX + consoante: /s/ em vários prefixos (exp-, ext-, exc-...)
      - X após AI/EI: /ʃ/, portanto o X já é a grafia simplificada e fica X.
      - X com /ks/: CS.
      - Os casos lexicalmente ambíguos ficam no mapa acima.
    */
    if (a === "x") {
      const prefixEx = (i === 1 && w[0] === "e") || (i === 0 && b === "x");
      const afterAiEi = (prev2 === "a" && prev === "i") ||
                        (prev2 === "e" && prev === "i");

      if (prefixEx && isVowel(b)) {
        add("z", "EX + vogal → EZ");
      } else if (prefixEx && (b === "p" || b === "t" || b === "c")) {
        add("s", "EX + P/T/C → ES");
      } else if (afterAiEi) {
        add("x", "X com som /ʃ/ preservado");
      } else {
        add("cs", "X com som /ks/ → CS");
      }
      i++; continue;
    }

    /*
      S intervocálico = Z.
      A regra é aplicada à palavra original e não ao resultado de outra regra.
    */
    if (a === "s" && isVowel(prev) && isVowel(b)) {
      add("z", "S intervocálico → Z"); i++; continue;
    }

    if (a === "c") {
      add("c"); i++; continue;
    }
    if (a === "g") {
      add("g"); i++; continue;
    }
    if (a === "k") {
      add("c", "K → C"); i++; continue;
    }
    if (a === "y") {
      add("i", "Y → I"); i++; continue;
    }
    if (a === "w") {
      add("u", "W → U"); i++; continue;
    }
    if (a === "h") {
      i++; continue;
    }

    add(a);
    i++;
  }

  return {
    word: preserveCase(word, out.join("")),
    applied: [...new Set(rules)]
  };
}

function convertWord(raw) {
  const ex = exceptionLookup(raw);
  if (ex !== null) return {word: ex, applied:["caso validado"]};
  return genericConvert(raw);
}

function convertText(text) {
  const changes = [];
  const converted = text.replace(/\p{L}+(?:[-']\p{L}+)*/gu, raw => {
    const r = convertWord(raw);
    if (r.word !== raw) {
      changes.push({from: raw, to: r.word, rules: r.applied});
    }
    return r.word;
  });
  return {converted, changes};
}

function validate(text) {
  const problems = [];
  for (const [nome, re] of [
    ["SS proibido", /ss/i],
    ["Ç proibido", /ç/i],
    ["K proibido", /k/i],
    ["W proibido", /w/i],
    ["Y proibido", /y/i]
  ]) {
    if (re.test(text)) problems.push(nome);
  }
  return problems;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])
  );
}

function render() {
  const original = document.getElementById("orig").value;
  const result = convertText(original);
  document.getElementById("out").value = result.converted;

  const words = (original.match(/\p{L}+(?:[-']\p{L}+)*/gu) || []).length;
  const problems = validate(result.converted);

  document.getElementById("words").textContent = words;
  document.getElementById("changed").textContent = result.changes.length;
  document.getElementById("rules").textContent =
    result.changes.reduce((n, x) => n + x.rules.length, 0);
  document.getElementById("errors").textContent = problems.length;

  const validation = document.getElementById("validation");
  if (!problems.length) {
    validation.className = "ok";
    validation.textContent =
      "✓ Validação estrutural concluída: nenhuma grafia proibida encontrada.";
  } else {
    validation.className = "bad";
    validation.textContent =
      "✗ Problemas encontrados: " + problems.join(", ");
  }

  const report = document.getElementById("report");
  if (!result.changes.length) {
    report.textContent = "Nenhuma alteração foi necessária.";
    return;
  }

  report.innerHTML =
    "<table><thead><tr><th>Original</th><th>Convertida</th><th>Regra</th></tr></thead><tbody>" +
    result.changes.map(x =>
      "<tr><td><code>" + escapeHtml(x.from) +
      "</code></td><td><code>" + escapeHtml(x.to) +
      "</code></td><td>" +
      x.rules.map(r => "<span class='tag'>" + escapeHtml(r) +
      "</span>").join(" ") +
      "</td></tr>"
    ).join("") + "</tbody></table>";
}

/* ============================================================
   REGRESSÃO: casos que já foram validados pelo usuário.
   A versão só é considerada correta se todos passarem.
   ============================================================ */
const TESTES_REGRESSAO = [
  ["reflexo","reflecso"],
  ["texto","testo"],
  ["você","vosê"],
  ["antiguidade","antiguidade"],
  ["antiguidades","antiguidades"],
  ["deixando","deixando"],
  ["faixa","faixa"],
  ["faixas","faixas"],
  ["põe","poim"],
  ["shopping","xópim"],
  ["ambições","ambisoins"],
  ["fundações","fundasoins"],
  ["reuniões","reunioins"],
  ["soluções","solusoins"],
  ["discussões","discusoins"],
  ["obrigações","obrigasoins"],
  ["notificações","notificasoins"],
  ["aproximar","aprosimar"],
  ["aproximando","aprosimando"],
  ["aproximação","aprosimasão"],
  ["próximas","prósimas"],
  ["transição","tranzisão"],
  ["desconexão","desconecsão"],
  ["exercício","ezersísio"],
  ["gélida","jélida"],
  ["exato","ezato"],
  ["exatamente","ezatamente"],
  ["expediente","espediente"],
  ["expostas","espostas"],
  ["externa","esterna"],
  ["reflexivas","reflecsivas"],
  ["fixo","ficso"],
  ["fixada","ficsada"],
  ["fluxo","flucso"],
  ["extrema","estrema"],
  ["extremidade","estremidade"],
  ["extremamente","estremamente"],
  ["urgência","urjênsia"],
  ["incêndio","insêndio"],
  ["legítimo","lejítimo"]
];

function executarTestesRegressao() {
  return TESTES_REGRESSAO.map(([entrada, esperado]) => {
    const atual = convertWord(entrada).word;
    return {entrada, esperado, atual, ok: atual === esperado};
  });
}

function validarVersao() {
  const resultados = executarTestesRegressao();
  return {
    total: resultados.length,
    aprovados: resultados.filter(x => x.ok).length,
    falhas: resultados.filter(x => !x.ok)
  };
}

document.getElementById("convert").addEventListener("click", render);

document.getElementById("copy").addEventListener("click", async () => {
  const text = document.getElementById("out").value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.getElementById("out");
    ta.select();
    document.execCommand("copy");
  }
});

document.getElementById("clear").addEventListener("click", () => {
  document.getElementById("orig").value = "";
  document.getElementById("out").value = "";
  document.getElementById("report").textContent =
    "Faça uma conversão para ver a análise.";
  document.getElementById("validation").className = "small";
  document.getElementById("validation").textContent = "Ainda não executada.";
  ["words","changed","rules","errors"].forEach(id =>
    document.getElementById(id).textContent = "0"
  );
});

document.getElementById("download").addEventListener("click", () => {
  const text = document.getElementById("out").value;
  if (!text) return;
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "texto_convertido.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
});

/* A interface pode consultar os testes sem interferir na conversão. */
window.fonetiza = {
  converter: convertText,
  converterPalavra: convertWord,
  validar: validarVersao,
  testes: executarTestesRegressao
};
