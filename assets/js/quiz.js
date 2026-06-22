/* Fluxo do quiz — porte de QuizFlow + QuestionStep + LeadCaptureStep +
   ProgressBar. Renderização imperativa em #quiz-root. */
(function () {
  const VISAO = window.VISAO;
  const RESULT_KEY = "visao:lastResult";
  const root = document.getElementById("quiz-root");
  if (!root) return;

  const QUESTIONS = VISAO.QUIZ_QUESTIONS;
  const TOTAL = VISAO.TOTAL_STEPS;

  const inputClass =
    "w-full rounded-xl border border-edge-light bg-canvas px-4 py-3 font-body text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

  let stepIdx = 0;
  const answers = {};
  let submitting = false;
  let errorMsg = null;
  let advancing = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function progressBar() {
    const step = stepIdx + 1;
    const percent = Math.min(100, Math.max(0, (step / TOTAL) * 100));
    return (
      '<div class="w-full">' +
      '<div class="flex items-center justify-between text-xs text-mute">' +
      '<span class="font-heading uppercase tracking-widest">Passo ' +
      Math.min(step, TOTAL) + " de " + TOTAL + "</span>" +
      '<span class="font-mono text-support">' + Math.round(percent) + "%</span>" +
      "</div>" +
      '<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-card">' +
      '<div class="h-full rounded-full bg-gradient-orbital transition-all duration-300" style="width:' +
      percent + '%"></div>' +
      "</div></div>"
    );
  }

  function questionStepHtml(question) {
    const selected = answers[question.id];
    let opts = "";
    question.options.forEach(function (option) {
      const isSel = selected === option.id;
      opts +=
        '<button type="button" data-answer="' + esc(option.id) + '" ' +
        'class="group relative flex items-center gap-3 rounded-2xl border p-5 text-left transition ' +
        (isSel
          ? "border-primary bg-primary/15 ring-2 ring-primary"
          : "border-edge-light bg-card hover:-translate-y-0.5 hover:border-primary-400 hover:bg-card-hover") +
        '">' +
        '<span class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ' +
        (isSel ? "border-primary bg-primary" : "border-edge") + '">' +
        (isSel ? '<span class="h-2 w-2 rounded-full bg-white"></span>' : "") +
        "</span>" +
        '<span class="font-body text-base text-fg">' + esc(option.label) + "</span>" +
        "</button>";
    });
    return (
      '<div class="step-enter" data-step>' +
      '<h2 class="font-heading text-2xl font-bold text-fg sm:text-3xl">' +
      esc(question.prompt) + "</h2>" +
      '<div class="mt-8 grid gap-3 sm:grid-cols-2">' + opts + "</div>" +
      "</div>"
    );
  }

  function field(label, name, inner, opts) {
    opts = opts || {};
    return (
      '<label class="block">' +
      '<span class="mb-1 flex items-center justify-between font-heading text-xs uppercase tracking-widest text-dim">' +
      esc(label) +
      (opts.optional ? '<span class="text-dim">opcional</span>' : "") +
      "</span>" +
      inner +
      '<span class="mt-1 hidden text-sm text-error" data-error="' + name + '" role="alert" aria-live="polite"></span>' +
      "</label>"
    );
  }

  function leadStepHtml() {
    return (
      '<form id="lead-form" class="space-y-5 step-enter" data-step novalidate>' +
      "<div>" +
      '<h2 class="font-heading text-2xl font-bold text-fg sm:text-3xl">Pra onde a gente envia seu diagnóstico?</h2>' +
      '<p class="mt-2 font-body text-mute">Em poucos segundos você recebe um PDF personalizado no seu e-mail.</p>' +
      "</div>" +
      field("Nome", "name",
        '<input type="text" name="name" autocomplete="name" class="' + inputClass + '">') +
      '<div class="grid gap-4 sm:grid-cols-2">' +
      field("E-mail", "email",
        '<input type="email" name="email" autocomplete="email" class="' + inputClass + '">') +
      field("WhatsApp", "phone",
        '<input type="tel" name="phone" autocomplete="tel" placeholder="(21) 99999-9999" class="' + inputClass + '">') +
      "</div>" +
      '<div class="grid gap-4 sm:grid-cols-3">' +
      field("Idade", "age",
        '<input type="number" name="age" class="' + inputClass + '">', { optional: true }) +
      field("Gênero", "gender",
        '<select name="gender" class="' + inputClass + '">' +
        '<option value="">Selecione</option>' +
        '<option value="feminino">Feminino</option>' +
        '<option value="masculino">Masculino</option>' +
        '<option value="nao_binario">Não-binário</option>' +
        '<option value="prefiro_nao_dizer">Prefiro não dizer</option>' +
        "</select>", { optional: true }) +
      field("Cidade", "city",
        '<input type="text" name="city" class="' + inputClass + '">', { optional: true }) +
      "</div>" +
      '<label class="flex items-start gap-3 rounded-2xl border border-edge-light bg-card p-4 text-sm text-mute">' +
      '<input type="checkbox" name="lgpd_consent" class="mt-1 h-4 w-4 rounded border-edge text-primary focus:ring-primary">' +
      "<span>Concordo com o tratamento dos meus dados pela Visão para receber o diagnóstico e contato comercial, conforme a " +
      '<a href="politica-privacidade.html" class="text-support hover:text-accent" target="_blank">Política de Privacidade</a>.</span>' +
      "</label>" +
      '<span class="hidden text-sm text-error" data-error="lgpd_consent" role="alert" aria-live="polite"></span>' +
      '<button type="submit" id="lead-submit" class="inline-flex w-full items-center justify-center gap-2 rounded-pill font-heading font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-accent text-ink hover:-translate-y-0.5 hover:shadow-glow-yellow shadow-vision-soft px-8 py-4 text-base">' +
      (submitting ? "Enviando…" : "Receber meu diagnóstico") +
      "</button>" +
      "</form>"
    );
  }

  function render() {
    const isQuestionStep = stepIdx < QUESTIONS.length;
    const current = QUESTIONS[stepIdx];
    root.innerHTML =
      '<div class="mx-auto w-full max-w-2xl">' +
      progressBar() +
      '<div class="mt-10 min-h-[360px]">' +
      (isQuestionStep ? questionStepHtml(current) : leadStepHtml()) +
      "</div>" +
      (errorMsg
        ? '<p class="mt-6 rounded-xl border border-error/40 bg-error/10 p-4 text-sm text-error">' + esc(errorMsg) + "</p>"
        : "") +
      '<div class="mt-8 flex items-center justify-between">' +
      '<button type="button" id="quiz-back" class="inline-flex items-center justify-center gap-2 rounded-pill font-heading font-semibold transition-all duration-200 bg-transparent text-fg hover:bg-card px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"' +
      (stepIdx === 0 ? " disabled" : "") + ">← Voltar</button>" +
      (isQuestionStep
        ? '<span class="font-human text-sm text-dim">Toque na opção que mais combina.</span>'
        : "") +
      "</div></div>";

    bindEvents(isQuestionStep);
  }

  function markSelected(selectedBtn) {
    root.querySelectorAll("[data-answer]").forEach(function (b) {
      const isSel = b === selectedBtn;
      b.className =
        "group relative flex items-center gap-3 rounded-2xl border p-5 text-left transition " +
        (isSel
          ? "border-primary bg-primary/15 ring-2 ring-primary"
          : "border-edge-light bg-card hover:-translate-y-0.5 hover:border-primary-400 hover:bg-card-hover");
      const radio = b.querySelector("span");
      if (radio) {
        radio.className =
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition " +
          (isSel ? "border-primary bg-primary" : "border-edge");
        radio.innerHTML = isSel ? '<span class="h-2 w-2 rounded-full bg-white"></span>' : "";
      }
    });
  }

  function bindEvents(isQuestionStep) {
    const back = document.getElementById("quiz-back");
    if (back) back.addEventListener("click", function () {
      if (advancing) return;
      stepIdx = Math.max(0, stepIdx - 1);
      errorMsg = null;
      render();
    });

    if (isQuestionStep) {
      root.querySelectorAll("[data-answer]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (advancing) return;
          advancing = true;
          const q = QUESTIONS[stepIdx];
          answers[q.id] = btn.getAttribute("data-answer");
          markSelected(btn); // reflete seleção sem re-renderizar (evita reanimar)
          // pequena pausa pra ver a seleção, depois anima a saída e entra a próxima
          setTimeout(function () {
            const stepEl = root.querySelector("[data-step]");
            if (stepEl) {
              stepEl.classList.remove("step-enter");
              stepEl.classList.add("step-exit");
            }
            setTimeout(function () {
              stepIdx += 1;
              advancing = false;
              render();
            }, 220); // casa com a duração de .step-exit
          }, 160);
        });
      });
    } else {
      const form = document.getElementById("lead-form");
      if (form) form.addEventListener("submit", onLeadSubmit);
    }
  }

  function showFieldError(name, msg) {
    const el = root.querySelector('[data-error="' + name + '"]');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
    const input = root.querySelector('[name="' + name + '"]');
    if (input) input.setAttribute("aria-invalid", "true");
  }
  function clearFieldErrors() {
    root.querySelectorAll("[data-error]").forEach(function (el) {
      el.textContent = "";
      el.classList.add("hidden");
    });
    root.querySelectorAll("[aria-invalid]").forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
  }

  function validate(data) {
    const errors = {};
    if (!data.name || data.name.trim().length < 2) errors.name = "Conta pra gente seu nome";
    else if (data.name.length > 120) errors.name = "Nome muito longo";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
    if (!emailOk) errors.email = "Confere se o e-mail está certo";
    if (!data.phone || data.phone.length < 10) errors.phone = "Faltou um dígito no telefone";
    else if (data.phone.length > 20) errors.phone = "Telefone muito longo";
    if (data.age !== "" && data.age != null) {
      const n = Number(data.age);
      if (!Number.isInteger(n) || n < 14 || n > 120) errors.age = "Idade inválida";
    }
    if (!data.lgpd_consent)
      errors.lgpd_consent = "A gente precisa do seu consentimento para enviar o diagnóstico";
    return errors;
  }

  function onLeadSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    clearFieldErrors();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      name: (fd.get("name") || "").trim(),
      email: (fd.get("email") || "").trim(),
      phone: (fd.get("phone") || "").trim(),
      age: fd.get("age"),
      gender: fd.get("gender") || undefined,
      city: (fd.get("city") || "").trim() || undefined,
      lgpd_consent: fd.get("lgpd_consent") === "on",
    };

    const errors = validate(raw);
    if (Object.keys(errors).length) {
      for (const k in errors) showFieldError(k, errors[k]);
      return;
    }

    submitting = true;
    errorMsg = null;
    const submitBtn = document.getElementById("lead-submit");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; }

    try {
      const lead = {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        age: raw.age === "" || raw.age == null ? undefined : Number(raw.age),
        gender: raw.gender,
        city: raw.city,
        lgpd_consent: true,
        source: document.referrer || "direct",
      };

      const profileId = VISAO.classify(answers);
      const profile = VISAO.getProfile(profileId);
      const lead_id = VISAO.newLeadId();
      const generated_at = VISAO.apiTimestamp();

      VISAO.diagnosisPdfBase64({
        name: lead.name,
        profile: profile,
        bookingUrl: VISAO.BOOKING_URL,
      }).then(function (pdfBase64) {
        VISAO.sendLeadWebhook({
          lead_id: lead_id,
          lead: lead,
          answers: answers,
          profile: profile,
          pdf_base64: pdfBase64,
          pdf_filename: "diagnostico-visao-" + profile.id + ".pdf",
          booking_url: VISAO.BOOKING_URL,
          generated_at: generated_at,
        });

        const result = {
          lead_id: lead_id,
          profile: profile,
          lead: lead,
          answers: answers,
          booking_url: VISAO.BOOKING_URL,
          whatsapp_url: VISAO.whatsappLink,
          generated_at: generated_at,
        };
        sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
        window.location.href = "obrigado.html?profile=" + profile.id;
      }).catch(failure);
    } catch (err) {
      failure(err);
    }
  }

  function failure(err) {
    submitting = false;
    errorMsg =
      (err && err.message) ||
      "Tivemos um problema ao gerar seu diagnóstico — tenta de novo daqui a pouco.";
    render();
  }

  render();
})();
