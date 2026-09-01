# Fonetiza

Conversor fonético experimental para português brasileiro.

## Estrutura

```text
fonetiza/
├── index.html
├── css/
│   └── estilo.css
├── js/
│   └── conversor.js
├── README.md
└── .gitignore
```

## Publicar no GitHub Pages

Envie todos os arquivos mantendo as pastas. Depois vá em:

**Settings → Pages → Deploy from a branch → main → / (root)**

### Correção

A versão anterior tinha o carregamento do JavaScript quebrado no `index.html`. Nesta versão, HTML, CSS e JavaScript estão corretamente separados e o `index.html` referencia:

```html
<link rel="stylesheet" href="css/estilo.css">
<script src="js/conversor.js"></script>
```

O motor de conversão foi mantido.
