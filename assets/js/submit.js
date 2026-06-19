/* Envio do lead — fire-and-forget para o webhook do Apps Script.
   Porte de lib/submit.ts. */
(function () {
  const CFG = window.VISAO_CONFIG || {};
  const VISAO = window.VISAO;

  VISAO.BOOKING_URL = CFG.BOOKING_URL || "https://calendar.app.google/PLACEHOLDER";
  VISAO.WHATSAPP_NUMBER = CFG.WHATSAPP_NUMBER || "5521997079059";
  VISAO.whatsappLink = "https://wa.me/" + VISAO.WHATSAPP_NUMBER;
  const WEBHOOK_URL = CFG.WEBHOOK_URL || "";

  VISAO.newLeadId = function () {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  VISAO.apiTimestamp = function () {
    const d = new Date();
    const pad = (n, w) => String(n).padStart(w || 2, "0");
    return (
      d.getUTCFullYear() +
      "-" + pad(d.getUTCMonth() + 1) +
      "-" + pad(d.getUTCDate()) +
      "T" + pad(d.getUTCHours()) +
      ":" + pad(d.getUTCMinutes()) +
      ":" + pad(d.getUTCSeconds()) +
      "." + pad(d.getUTCMilliseconds(), 3) + "000"
    );
  };

  VISAO.sendLeadWebhook = function (payload) {
    if (!WEBHOOK_URL) {
      console.warn("[visao] WEBHOOK_URL não configurado — pulando envio.");
      return Promise.resolve({ sent: false });
    }
    return fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
    })
      .then(() => ({ sent: true }))
      .catch((err) => {
        console.warn("[visao] webhook falhou (ignorando):", err);
        return { sent: false };
      });
  };
})();
