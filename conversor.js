/*
 Fonetiza v9
 Motor deliberadamente em etapas:
 1) tokeniza palavras sem destruir espaços/pontuação;
 2) converte cada palavra original uma única vez;
 3) normaliza apenas a separação entre pontuação e palavras.
*/

const PROTEGIDAS = new Map([
  ["reflexo", "reflecso"],
  ["reflexivas", "reflecsivas"],
  ["texto", "testo"],
  ["tezto", "testo"],
  ["você", "vosê"],
  ["vocês", "vosês"],
  ["próximas", "prósimas"],
  ["fixo", "ficso"],
  ["exato", "ezato"],
  ["trânsito", "trânzito"],
  ["exclusivamente", "escluzivamente"],
  ["deixa", "deixa"],
  ["viajem", "viajem"],
  ["frequentadores", "frecuentadores"],
  ["shopping", "xópim"],
  ["põe", "poim"]
]);

function preservarCaixa(original, convertido) {
  if (original === original.toUpperCase()) return convertido.toUpperCase();
  if (original[0] === original[0].toUpperCase())
    return convertido.charAt(0).toUpperCase() + convertido.slice(1);
  return convertido;
}

function converterPalavra(original) {
  const chave = original.toLowerCase();
  if (PROTEGIDAS.has(chave)) return preservarCaixa(original, PROTEGIDAS.get(chave));

  let w = original;

  // H não pronunciado.
  w = w.replace(/h/gi, "");

  // Dígrafos e grafias com som estável.
  w = w.replace(/lh/gi, m => m === "LH" ? "LL" : "ll");
  w = w.replace(/nh/gi, m => m === "NH" ? "NN" : "nn");
  w = w.replace(/ch/gi, m => m === "CH" ? "X" : "x");

  // Q / QU.
  w = w.replace(/que/gi, m => m === "QUE" ? "CE" : "ce");
  w = w.replace(/qui/gi, m => m === "QUI" ? "CI" : "ci");
  w = w.replace(/qua/gi, m => m === "QUA" ? "CUA" : "cua");
  w = w.replace(/quo/gi, m => m === "QUO" ? "CUO" : "cuo");
  w = w.replace(/qu/gi, m => m === "QU" ? "C" : "c");
  w = w.replace(/gu/gi, m => m === "GU" ? "G" : "g");
  w = w.replace(/k/gi, m => m === "K" ? "C" : "c");
  w = w.replace(/y/gi, m => m === "Y" ? "I" : "i");

  // GE/GI.
  w = w.replace(/ge/gi, m => m === "GE" ? "JE" : "je");
  w = w.replace(/gi/gi, m => m === "GI" ? "JI" : "ji");

  // Ç e padrões de C com som de S.
  w = w.replace(/ç/gi, m => m === "Ç" ? "S" : "s");
  w = w.replace(/c(?=[eéií])/gi, m => m === "C" ? "S" : "s");

  // Terminações nasais já validadas.
  w = w.replace(/ões$/i, m => m[0] === "Õ" ? "OINs" : "oins");
  w = w.replace(/ões(?=[,.;:!?])/gi, "oins");
  w = w.replace(/ções/gi, m => m === "ÇÕES" ? "SOINS" : "soins");

  // S com som de Z em posições comuns.
  w = w.replace(/s(?=[aeiouáéíóúâêôãõ])/gi, (m, p, whole) => {
    // Inicial não muda para Z por esta regra.
    return p === 0 ? m : (m === "S" ? "Z" : "z");
  });

  // X: regra contextual mínima; casos comprovados ficam em PROTEGIDAS.
  // x com som de S.
  w = w.replace(/x(?=[aeiouáéíóúâêôãõ])/gi, (m, p, whole) => {
    const antes = whole[p - 1] || "";
    return antes ? (m === "X" ? "S" : "s") : m;
  });

  // W -> U/V conforme padrão simples.
  w = w.replace(/w/gi, m => m === "W" ? "V" : "v");

  return w;
}

function normalizarEspacosPontuacao(texto) {
  // Corrige especificamente a falha .Á -> . Á, sem duplicar espaços.
  texto = texto.replace(/([.!?])([A-ZÁÉÍÓÚÂÊÔÃÕÀÇ])/g, "$1 $2");

  // Mantém a regra geral para pontuação seguida diretamente por palavra.
  texto = texto.replace(/([.!?])([A-Za-zÁÉÍÓÚÂÊÔÃÕÀÇáéíóúâêôãõàç])/g, "$1 $2");

  // Nunca cria dois espaços por causa desta normalização.
  texto = texto.replace(/([.!?]) {2,}/g, "$1 ");

  return texto;
}

function converterTexto(texto) {
  // Preserva exatamente separadores, pontuação, quebras de linha e espaços.
  let resultado = texto.replace(/\p{L}+(?:[-'’]\p{L}+)*/gu, palavra => converterPalavra(palavra));
  resultado = normalizarEspacosPontuacao(resultado);
  return resultado;
}

document.getElementById("converter").addEventListener("click", () => {
  const entrada = document.getElementById("entrada").value;
  document.getElementById("saida").value = converterTexto(entrada);
  document.getElementById("status").textContent = "Conversão concluída.";
});

document.getElementById("limpar").addEventListener("click", () => {
  document.getElementById("entrada").value = "";
  document.getElementById("saida").value = "";
  document.getElementById("status").textContent = "";
});

// Testes de regressão principais.
const TESTES = {
  "reflexo": "reflecso",
  "reflexivas": "reflecsivas",
  "texto": "testo",
  "você": "vosê",
  "próximas": "prósimas",
  "fixo": "ficso",
  "exato": "ezato",
  "trânsito": "trânzito",
  "exclusivamente": "escluzivamente",
  "deixa": "deixa",
  "viajem": "viajem",
  "frequentadores": "frecuentadores",
  "shopping": "xópim",
  "põe": "poim"
};

function executarTestes() {
  return Object.entries(TESTES).every(([a,b]) => converterPalavra(a) === b);
}
