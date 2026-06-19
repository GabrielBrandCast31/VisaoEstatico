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

- **Tailwind CSS** (`cdn.tailwindcss.com`) — config da marca em `assets/js/tw-config.js`.
- **Google Fonts** — Poppins, Inter, Nunito, Caveat, Anton.
- **jsPDF** (`unpkg`) — geração do PDF do diagnóstico (só em quiz/obrigado).

Requer internet em runtime para essas três. Tudo o mais (lógica do quiz,
classificação, perfis, geração de PDF) roda local em `assets/js/`.

## Onde fica a lógica

- `assets/js/data.js` — conteúdo do quiz, perfis e **classificação** (`classify`).
- `assets/js/quiz.js` — fluxo do quiz e captura de lead.
- `assets/js/obrigado.js` — render do resultado + imagem de classificação.
- `assets/js/pdf.js` — PDF do diagnóstico (porte de `lib/pdf.ts`).
- `assets/js/submit.js` — envio do lead ao webhook.
- `assets/js/main.js` — reveal on scroll, FAQ, cookie banner, analytics.
- `assets/css/styles.css` — tokens de cor da marca + helpers.
