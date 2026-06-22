# Visão — versão estática (HTML + CSS + JS puro)

Conversão da landing page Next.js/React para HTML/CSS/JS puro. **Mesma
identidade visual e mesmo conteúdo** — só mudou a tecnologia.

## Como rodar

É um site estático. Basta servir a pasta `static/` com qualquer servidor:

```bash
cd static
python3 -m http.server 8000
# abra http://localhost:8000
```

> Abrir o `index.html` direto pelo `file://` também funciona, mas o quiz usa
> `sessionStorage` e fetch — recomenda-se servir via HTTP.

## Páginas

| Arquivo | Equivalente Next.js |
|---|---|
| `index.html` | landing (`/`) |
| `quiz.html` | `/quiz` |
| `obrigado.html` | `/obrigado` (resultado + imagem de classificação) |
| `politica-privacidade.html` | `/politica-privacidade` |

## Configuração

Edite `assets/js/config.js` (equivale às variáveis `NEXT_PUBLIC_*` do `.env`):

- `WEBHOOK_URL` — webhook do Google Apps Script (vazio = envio desativado).
- `BOOKING_URL` — link de agendamento.
- `WHATSAPP_NUMBER` — WhatsApp comercial.
- `META_PIXEL_ID` / `GTM_ID` — analytics (carregados só após aceite de cookies).

## Dependências externas (via CDN)

- **Google Fonts** — Poppins, Inter, Nunito, Caveat.
- **jsPDF** (`unpkg`) — carregado **sob demanda** (só ao gerar/baixar o PDF).

O CSS do Tailwind agora é **pré-compilado** (`assets/css/tailwind.build.css`,
~24 KB / ~5 KB gzip) — não usa mais o CDN em runtime. Tudo o mais (lógica do
quiz, classificação, perfis, geração de PDF) roda local em `assets/js/`.

## Performance / mobile

Otimizações aplicadas:

- **Tailwind pré-compilado e purgado** no lugar do Play CDN (que baixava
  ~115 KB gzip de JS e compilava o CSS no navegador a cada visita, com flash
  de tela sem estilo). Agora é um CSS estático de ~6 KB gzip.
- **Um único CSS** — os tokens/base/helpers (antigo `styles.css`) foram
  embutidos no `tailwind.build.css` via `input.css`, eliminando um request
  que bloqueava a renderização.
- **Fontes não-bloqueantes** — carregadas com `media="print" onload` (+
  `preload`), então não atrasam a primeira pintura (com `display=swap`).
- **jsPDF lazy** — só baixa ao clicar em gerar/baixar o diagnóstico.
- **Imagens otimizadas** — ilustrações de classificação de ~340–404 KB (PNG
  1080px) para ~104–116 KB (JPEG 760px); `logo.png` de 487×417/36 KB para
  160×137/16 KB (era exibido a ~74px); fotos dos fundadores recomprimidas.
  Imagens abaixo da dobra com `loading="lazy"` + `decoding="async"`.
- **Fontes enxutas** — removidas a família Anton (não usada) e o peso 700 da
  Caveat.
- **Media query mobile (`<=767px`)** em `input.css` — esconde as decorações
  (orbitais/arcos em SVG), desliga `backdrop-blur` (caro na GPU) e reduz o
  respiro vertical das seções, cortando custo de paint no celular.

> **Cache (item "ciclos de vida de cache" do Lighthouse):** o TTL de 10 min é
> definido pelo **GitHub Pages** e não é configurável em site estático. Para
> cache longo, sirva por um CDN/host com controle de `Cache-Control`
> (Cloudflare Pages, Netlify, etc.).

### Como recompilar o CSS

Sempre que adicionar/alterar classes Tailwind no HTML ou JS, regere o CSS
**a partir desta pasta** (`static/`):

```bash
npx tailwindcss@3.4.15 -c tailwind.config.cjs -i input.css \
  -o assets/css/tailwind.build.css --minify
```

> `tailwind.config.cjs` (cores/fontes da marca) e `input.css` ficam aqui na
> pasta só para o build — não são carregados pelas páginas em runtime.

## Onde fica a lógica

- `assets/js/data.js` — conteúdo do quiz, perfis e **classificação** (`classify`).
- `assets/js/quiz.js` — fluxo do quiz e captura de lead.
- `assets/js/obrigado.js` — render do resultado + imagem de classificação.
- `assets/js/pdf.js` — PDF do diagnóstico (porte de `lib/pdf.ts`).
- `assets/js/submit.js` — envio do lead ao webhook.
- `assets/js/main.js` — reveal on scroll, FAQ, cookie banner, analytics.
- `input.css` — fonte do CSS (Tailwind + tokens/base/helpers + media query
  mobile); gera `assets/css/tailwind.build.css` no build.
- `assets/css/styles.css` — tokens de cor da marca + helpers.
