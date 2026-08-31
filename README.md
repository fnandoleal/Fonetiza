# Fonetiza

> **Escreva o português de uma forma mais próxima de como ele é pronunciado.**

**Fonetiza** é um conversor experimental de escrita fonética para português brasileiro.  
A proposta é transformar palavras e textos da ortografia convencional para uma escrita simplificada, visualmente familiar e mais próxima da pronúncia cotidiana.

## ✨ Exemplos

| Português convencional | Fonetiza |
|---|---|
| exatamente | ezatamente |
| aproximação | aprosimasão |
| reuniões | reunioins |
| preocupações | preocupasoins |
| transição | tranzisão |
| extremidade | estremidade |
| exercício | ezersísio |
| incêndio | insêndio |
| fixada | ficsada |
| expressão | espresão |
| antiguidade | antiguidade |
| legítimo | lejítimo |

## 🎯 Objetivo

O projeto não pretende substituir a ortografia oficial nem representar palavras usando o Alfabeto Fonético Internacional (IPA).

A ideia é diferente:

**ortografia tradicional → escrita fonética legível**

O resultado procura continuar sendo facilmente compreendido por quem já conhece o português, mas reduzindo algumas diferenças entre a forma escrita e a forma pronunciada.

## 🧠 Como funciona

O conversor utiliza regras de transformação aplicadas diretamente à palavra original. As regras são organizadas para evitar conversões redundantes e impedir que uma transformação feita anteriormente seja reinterpretada por outra regra.

Entre os princípios utilizados estão:

- representação de determinados sons de forma mais próxima da pronúncia;
- tratamento contextual de `c`, `ç`, `s`, `z`, `x`, `g` e `j`;
- tratamento de sequências como `ções` → `soins` em contextos apropriados;
- preservação de grafias que possuem pronúncia diferente da aparência sugerida;
- tratamento especial de casos como `antiguidade`, em que o `u` participa da pronúncia;
- regras para evitar conversões em cadeia;
- prioridade para regras específicas antes das regras gerais.

## 🔬 Projeto experimental

O Fonetiza é um projeto em evolução. As regras são testadas com textos reais e ajustadas a partir de casos em que a conversão não representa adequadamente a pronúncia desejada.

Por isso, determinadas palavras podem receber tratamento específico quando uma regra geral produziria um resultado incorreto.

A intenção é, progressivamente, substituir exceções isoladas por regras linguísticas mais gerais sempre que uma mesma lógica puder ser identificada.

## 📌 Fonetiza não é IPA

Projetos como PETRUS, TugaPhone e outras ferramentas de conversão fonética trabalham com transcrição fonética ou fonemas, frequentemente utilizando IPA. O Fonetiza segue outra proposta: produzir uma **reortografia fonética legível**, mantendo o alfabeto comum.

Por exemplo:

```text
Ortografia: exatamente
Fonetiza:   ezatamente
```

em vez de produzir uma representação técnica com símbolos fonéticos.

## 🚀 Demonstração

Cole um texto no campo de entrada, clique em **Fonetizar** e veja o resultado imediatamente.

O projeto foi pensado para funcionar diretamente no navegador, sem necessidade de instalação.

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript
- GitHub Pages

## 📂 Estrutura

```text
fonetiza/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🌐 Publicação

O projeto pode ser publicado gratuitamente com o **GitHub Pages**.

Depois de criar o repositório:

1. envie os arquivos;
2. abra **Settings → Pages**;
3. selecione a branch principal;
4. escolha a pasta `/root`;
5. salve;
6. aguarde a publicação.

## 🤝 Contribuições

Sugestões de palavras, casos problemáticos e novas regras são bem-vindos.

Um bom caso de contribuição deve informar:

```text
Original:     aproximação
Esperado:     aprosimasão
Resultado:    ...
```

Isso permite identificar padrões e transformar exceções em regras gerais quando possível.

## 📜 Licença

Este projeto pode ser distribuído sob a licença MIT.

---

### Fonetiza

**Português escrito mais perto da fala.**
