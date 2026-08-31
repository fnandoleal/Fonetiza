const regras = [
  // Sequências com nasalização/terminação já validadas
  [/ções/gi, "soins"],
  [/ção/gi, "são"],

  // Grafias de som /z/
  [/ex(?=[aeiouáéíóúâêôãõ])/gi, "ez"],
  [/x(?=[aeiouáéíóúâêôãõ])/gi, "z"],

  // c com som de /s/
  [/ce/gi, "se"],
  [/ci/gi, "si"],

  // g com som de /j/
  [/ge/gi, "je"],
  [/gi/gi, "ji"],

  // Exemplos consolidados do projeto
  [/aproxim/gi, m => m.replace(/xim/i, "sim")],
  [/express/gi, m => m.replace(/xpress/i, "spress")],
  [/extrem/gi, m => m.replace(/xtrem/i, "strem")],
  [/exerc/gi, m => m.replace(/xerc/i, "zerc")],
  [/incênd/gi, "insênd"],
  [/fix/gi, m => m.replace(/fix/i, "fics")],
  [/transi/gi, m => m.replace(/transi/i, "tranzi")],
  [/antiguidade/gi, "antiguidade"]
];

function fonetizar(texto) {
  let resultado = texto;

  for (const [padrao, substituicao] of regras) {
    resultado = resultado.replace(padrao, substituicao);
  }

  return resultado;
}

const entrada = document.querySelector("#entrada");
const saida = document.querySelector("#saida");

document.querySelector("#fonetizar").addEventListener("click", () => {
  saida.value = fonetizar(entrada.value);
});

document.querySelector("#copiar").addEventListener("click", async () => {
  if (!saida.value) return;

  await navigator.clipboard.writeText(saida.value);

  const botao = document.querySelector("#copiar");
  const original = botao.textContent;
  botao.textContent = "Copiado!";
  setTimeout(() => botao.textContent = original, 1200);
});
