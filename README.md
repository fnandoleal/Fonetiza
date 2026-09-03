# Fonetiza 🔤

### Conversor experimental de ortografia fonética para português brasileiro

O **Fonetiza** é um projeto experimental criado para explorar uma proposta de escrita mais próxima da **pronúncia do português brasileiro**.

A ideia é simples: **manter a língua e a estrutura das palavras, modificando principalmente a forma de escrever determinados sons**.

> ⚠️ O Fonetiza é um projeto experimental. As regras estão sendo desenvolvidas e aprimoradas progressivamente a partir de testes e validações.

---

## ✨ O que o Fonetiza faz?

O sistema analisa cada palavra e aplica regras de conversão fonética, preservando a estrutura do texto original.

Entre as regras atualmente trabalhadas estão:

- `CH` → `X`
- `LH` → `LL`
- `NH` → `NN`
- `Ç` → `S`
- `CE` / `CI` → `SE` / `SI`
- `GE` / `GI` → `JE` / `JI`
- `SS` → `S`
- `QUE` → `CE`
- `QUI` → `CI`
- `QUA` → `CUA`
- `QUO` → `CUO`
- `ÇÕES` → `SOINS`
- conversões contextuais para `X`
- remoção de `H` quando não representa som

As regras não são aplicadas simplesmente por substituição de letras: o objetivo é considerar o **som representado pela escrita original**.

---

## 🧪 Alguns exemplos

| Português tradicional | Fonetiza |
|---|---|
| criança | **criansa** |
| coração | **corasão** |
| educação | **educasão** |
| inscrições | **inscrisoins** |
| soluções | **solusoins** |
| exterior | **esterior** |
| exploradores | **esploradores** |
| explorar | **esplorar** |
| exemplo | **ezemplo** |
| experiência | **esperiênsia** |
| excelente | **eselente** |
| conhecimento | **connesimento** |
| escolhido | **escollido** |
| pesquisa | **pesciza** |
| ciência | **siênsia** |
| cidade | **sidade** |
| chuva | **xuva** |
| cheiro | **xeiro** |
| trabalho | **traballo** |
| linha | **linna** |

---

## 🎯 Princípio do projeto

O Fonetiza busca evitar uma ortografia cheia de regras arbitrárias e exceções individuais.

A prioridade é desenvolver **regras gerais e contextuais**, capazes de converter palavras que o sistema ainda não conhece.

Por exemplo, em vez de cadastrar somente:

```text
inscrições → inscrisoins
soluções → solusoins
informações → informasoins
```

uma regra geral trata o padrão:

```text
ÇÕES → SOINS
```

Assim, novas palavras com o mesmo padrão também podem ser convertidas automaticamente.

---

## 🖥️ Interface

A interface foi pensada para ser simples e direta:

1. Digite ou cole o texto original.
2. Clique em **Fonetizar**.
3. Confira o resultado.
4. Copie ou baixe o texto convertido.

O sistema também apresenta informações sobre as alterações realizadas e uma validação estrutural do resultado.

---

## 🚀 Como usar

O projeto não precisa de servidor, banco de dados ou instalação.

### Opção 1 — navegador

Baixe ou clone o repositório e abra:

```text
index.html
```

### Opção 2 — GitHub Pages

O projeto pode ser publicado diretamente pelo **GitHub Pages**, permitindo acessar o Fonetiza pelo navegador.

---

## 📁 Estrutura do projeto

```text
Fonetiza/
├── index.html       # Página principal
├── fonetiza.html    # Aplicação completa
└── README.md        # Documentação
```

O projeto é propositalmente compacto e atualmente funciona sem dependências externas obrigatórias.

---

## 🧠 Motor de conversão

O motor foi desenvolvido em JavaScript e trabalha palavra por palavra, usando a palavra original como referência durante a conversão.

Isso é importante porque uma palavra já convertida **não deve ser convertida novamente** como se fosse uma palavra original.

O sistema também procura preservar:

- espaços;
- pontuação;
- quebras de linha;
- maiúsculas e minúsculas sempre que possível;
- estrutura geral do texto.

---

## 🔬 Estado atual

**Versão:** `v17`

O projeto está em desenvolvimento ativo e as regras estão sendo testadas continuamente com palavras isoladas e textos maiores.

### Validações recentes

- `inscrições` → `inscrisoins`
- `exterior` → `esterior`
- `exploradores` → `esploradores`
- `explorar` → `esplorar`
- `criança` → `criansa`
- `coração` → `corasão`
- `sequência` → `secuênsia`
- `língua` → `língua`
- `sangue` → `sange`

---

## 🛠️ Tecnologias

- **HTML5**
- **CSS3**
- **JavaScript**

Sem framework obrigatório e sem backend.

---

## 🗺️ Próximos passos

Algumas possibilidades para a evolução do projeto:

- ampliar a cobertura das regras fonéticas;
- testar o motor com grandes listas de palavras;
- identificar novos padrões que possam virar regras gerais;
- reduzir gradualmente a dependência de exceções individuais;
- melhorar a validação automática;
- adicionar mais ferramentas para revisão do texto convertido;
- disponibilizar uma versão online pelo GitHub Pages.

---

## 🤝 Contribuições

Sugestões de novas palavras, padrões e correções são bem-vindas.

Uma boa contribuição deve, sempre que possível, informar:

```text
Palavra original → conversão esperada
```

Exemplo:

```text
exterior → esterior
```

Quando várias palavras apresentam o mesmo comportamento, a preferência é transformar o caso em uma **regra geral**, em vez de criar várias exceções.

---

## 📜 Licença

Este repositório ainda não define uma licença específica. Consulte os arquivos do projeto e as futuras versões do repositório para informações sobre redistribuição e uso.

---

## 💡 Sobre o projeto

O Fonetiza é uma experiência de **engenharia de regras linguísticas aplicada à programação**, buscando investigar até que ponto é possível aproximar a escrita do português brasileiro de sua pronúncia por meio de regras computacionais simples, transparentes e reproduzíveis.
