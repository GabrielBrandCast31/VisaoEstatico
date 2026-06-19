/* Tela de resultado — porte de ThankYouContent.tsx. */
(function () {
  const VISAO = window.VISAO;
  const RESULT_KEY = "visao:lastResult";
  const root = document.getElementById("result-root");
  if (!root) return;

  const INTRO_SUBTITLE =
    "Entender sua realidade financeira é o primeiro passo para ter a Visão de como construir uma estrutura possível.";
  const CLOSING_LINE_1 = "Organização financeira não começa no controle ou na proibição.";
  const CLOSING_LINE_2 = "Começa na Visão de construir a vida que você deseja.";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderBold(text) {
    return text
      .split(/(\*\*[^*]+\*\*)/g)
      .map(function (part) {
        if (part.startsWith("**") && part.endsWith("**")) {
          return '<strong class="font-bold text-white">' + esc(part.slice(2, -2)) + "</strong>";
        }
        return esc(part);
      })
      .join("");
  }

  function waveDecoration(cls) {
    let paths = "";
    for (let i = 0; i < 14; i++) {
      const d =
        "M-20 " + (40 + i * 20) +
        " C 60 " + (10 + i * 22) +
        ", 160 " + (70 + i * 18) +
        ", 300 " + (30 + i * 24);
      paths +=
        '<path d="' + d + '" stroke="currentColor" stroke-width="1" stroke-opacity="' +
        (0.18 - i * 0.008) + '"></path>';
    }
    return (
      '<svg aria-hidden viewBox="0 0 280 360" class="' + cls + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      paths + "</svg>"
    );
  }

  let result = null;
  try {
    const rawStored = sessionStorage.getItem(RESULT_KEY);
    if (rawStored) result = JSON.parse(rawStored);
  } catch (e) { /* noop */ }

  const profile = result && result.profile;

  if (!profile) {
    root.innerHTML =
      '<div class="rounded-3xl border border-edge-light bg-card p-10 text-center text-mute">Carregando seu diagnóstico…</div>';
    return;
  }

  const diagnosisParas = profile.diagnosis
    .split(/\n\n+/)
    .map(function (p) { return '<p>' + renderBold(p) + "</p>"; })
    .join("");

  const todaySignals = profile.today_signals
    .map(function (item) {
      return '<li class="flex items-start gap-2"><span aria-hidden class="leading-tight">👀</span><span>' +
        esc(item) + "</span></li>";
    })
    .join("");

  const todayNeeds = profile.today_needs
    .map(function (item) {
      return '<li class="flex items-start gap-2"><span aria-hidden class="leading-tight">✅</span><span>' +
        esc(item) + "</span></li>";
    })
    .join("");

  const imageBlock = profile.image
    ? '<div class="mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-vision-card">' +
      '<img src="' + esc(profile.image) + '" alt="Classificação: ' + esc(profile.name) +
      '" width="1080" height="1080" class="h-auto w-full select-none">' +
      "</div>"
    : "";

  const bookingUrl = result.booking_url;
  const ctaInner =
    "Agendar um Papo de Visão gratuito!";
  const ctaStyle =
    'style="background:linear-gradient(135deg, #859EF6 0%, #d9c8ff 50%, #bdcbff 100%)"';
  const ctaBtn = bookingUrl
    ? '<a href="' + esc(bookingUrl) + '" target="_blank" rel="noopener noreferrer" ' +
      'class="inline-flex items-center justify-center rounded-pill px-8 py-4 text-center font-heading text-base font-bold text-primary-800 shadow-vision-card transition hover:-translate-y-0.5 hover:shadow-glow-purple sm:text-lg" ' +
      ctaStyle + ">" + ctaInner + "</a>"
    : '<span class="inline-flex items-center justify-center rounded-pill px-8 py-4 text-center font-heading text-base font-bold text-primary-800 opacity-60 sm:text-lg" ' +
      ctaStyle + ">" + ctaInner + "</span>";

  root.innerHTML =
    '<article class="overflow-hidden rounded-[2.5rem] shadow-vision-card">' +

    // Band 1 — Hero
    '<section class="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 px-6 pb-10 pt-10 sm:px-14 sm:pb-12 sm:pt-12">' +
    waveDecoration("pointer-events-none absolute -left-10 top-6 h-72 w-72 text-primary-300") +
    '<p class="relative font-body text-xs text-white/75 sm:text-sm">Seu Diagnóstico Financeiro é,</p>' +
    '<div class="relative mt-6 text-center">' +
    '<h1 class="font-heading text-3xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">' +
    '<span class="mr-2 text-accent">✨</span>' + esc(profile.name) + '<span class="ml-2 text-accent">✨</span>' +
    "</h1>" +
    '<p class="mx-auto mt-5 max-w-xl font-body text-sm leading-relaxed text-white/85 sm:text-base">' +
    esc(INTRO_SUBTITLE) + "</p>" +
    imageBlock +
    '<p class="mt-6 font-slogan text-2xl text-accent sm:text-3xl">Pega Visão!</p>' +
    "</div></section>" +

    // Band 2 — Diagnóstico + card
    '<section class="relative grid gap-8 bg-primary-800 px-6 pb-12 pt-4 sm:px-14 sm:pb-14 md:grid-cols-[1.4fr_1fr] md:items-start">' +
    waveDecoration("pointer-events-none absolute -left-12 -top-10 h-80 w-80 text-primary-300") +
    '<div class="relative space-y-5 font-body text-sm leading-relaxed text-white/90 sm:text-base">' +
    diagnosisParas + "</div>" +
    '<aside class="relative rounded-2xl border border-white/15 bg-white/[0.08] p-6 backdrop-blur-md sm:p-7">' +
    '<h3 class="text-center font-heading text-base font-bold italic text-white sm:text-lg">Hoje, você talvez…</h3>' +
    '<ul class="mt-4 space-y-2 font-body text-sm text-white/90 sm:text-[15px]">' + todaySignals + "</ul>" +
    "</aside></section>" +

    // Band 3 — Recomendação + card
    '<section class="relative grid gap-8 bg-gradient-to-br from-secondary to-secondary-dark px-6 py-12 sm:px-14 sm:py-14 md:grid-cols-[1.4fr_1fr] md:items-start">' +
    '<div class="relative font-body text-sm text-white/90 sm:text-base">' +
    '<p class="font-body italic text-white/80">Por isso, a Visão que indicamos pra você é…</p>' +
    '<h2 class="mt-2 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">' +
    '<span class="mr-2 text-accent">✨</span>' + esc(profile.recommended_service) +
    '<span class="ml-2 text-accent">✨</span></h2>' +
    '<p class="mt-5 max-w-md leading-relaxed text-white/95">' + renderBold(profile.recommendation_pitch) +
    '<span class="ml-1" aria-hidden>🌿</span></p>' +
    "</div>" +
    '<aside class="relative rounded-2xl border border-white/25 bg-white/[0.18] p-6 backdrop-blur-md sm:p-7">' +
    '<h3 class="text-center font-heading text-base font-bold italic text-white sm:text-lg">o que você precisa hoje…</h3>' +
    '<ul class="mt-4 space-y-2 font-body text-sm italic text-white sm:text-[15px]">' + todayNeeds + "</ul>" +
    "</aside></section>" +

    // Band 4 — Encerramento + CTA
    '<section class="relative bg-primary-800 px-6 py-10 sm:px-14 sm:py-12">' +
    '<div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">' +
    '<div class="max-w-md font-body text-sm leading-relaxed text-white/90 sm:text-base">' +
    "<p>" + esc(CLOSING_LINE_1) + "</p>" +
    '<p class="mt-1 font-bold text-white">' + esc(CLOSING_LINE_2) + "</p>" +
    "</div>" +
    '<div class="flex flex-col items-center gap-2">' + ctaBtn +
    '<span class="font-body text-xs italic text-white/70">de 30 minutos a 1 hora…</span>' +
    "</div></div></section>" +

    "</article>" +

    // Ações secundárias
    '<div class="mt-8 flex flex-wrap items-center justify-center gap-4">' +
    '<button type="button" id="download-pdf" class="inline-flex items-center justify-center gap-2 rounded-pill font-heading font-semibold transition-all duration-200 border border-edge-light bg-transparent text-fg hover:border-primary hover:text-primary-light px-6 py-3 text-sm">Baixar diagnóstico (PDF)</button>' +
    (result.whatsapp_url
      ? '<a href="' + esc(result.whatsapp_url) + '" target="_blank" rel="noopener noreferrer" class="font-human text-sm text-mute hover:text-fg">Falar no WhatsApp →</a>'
      : "") +
    "</div>";

  const dl = document.getElementById("download-pdf");
  if (dl) dl.addEventListener("click", function () {
    VISAO.downloadDiagnosisPdf({
      name: result.lead.name,
      profile: result.profile,
      bookingUrl: result.booking_url,
    });
  });
})();
