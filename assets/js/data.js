/* ============================================================
   Conteúdo + lógica do quiz (porte de lib/content, profiles,
   quiz-data e scoring). Tudo client-side, sem build.
   ============================================================ */
(function () {
  const VISAO = {};

  // ---- Contato / conteúdo editorial ------------------------------------
  VISAO.CONTACT = {
    whatsappNumber: "5521997079059",
    whatsappLink: "https://wa.me/5521997079059",
    email: "contato.visaobr@gmail.com",
    instagram: "https://instagram.com/visao_oficial",
    youtube: "https://www.youtube.com/@Visãooficial",
    cnpj: "54.589.204/0001-39",
    legalName: "Azevedo Guimarães Produções LTDA",
    businessHours: "10h às 19h",
  };

  // ---- Quiz: perguntas --------------------------------------------------
  VISAO.QUIZ_QUESTIONS = [
    {
      id: "1",
      prompt: "Hoje, qual é sua maior dificuldade financeira?",
      options: [
        { id: "1a", label: "Organizar meu dinheiro" },
        { id: "1b", label: "Entender minhas contas" },
        { id: "1c", label: "Separar pessoal e empresa" },
        { id: "1d", label: "Imposto de Renda / MEI" },
        { id: "1e", label: "Começar a investir" },
        { id: "1f", label: "Outra coisa" },
      ],
    },
    {
      id: "2",
      prompt: "Como você se sente em relação à sua vida financeira hoje?",
      options: [
        { id: "2a", label: "Confuso(a)" },
        { id: "2b", label: "Ansioso(a)" },
        { id: "2c", label: "Sobrecarregado(a)" },
        { id: "2d", label: "Travado(a)" },
        { id: "2e", label: "Organizado(a), mas quero melhorar" },
      ],
    },
    {
      id: "3",
      prompt: "Você já tentou se organizar antes?",
      options: [
        { id: "3a", label: "Sim, sozinho(a)" },
        { id: "3b", label: "Sim, com planilhas ou apps" },
        { id: "3c", label: "Sim, com ajuda profissional" },
        { id: "3d", label: "Ainda não" },
      ],
    },
    {
      id: "4",
      prompt: "Qual seu objetivo agora?",
      options: [
        { id: "4a", label: "Sair da desorganização" },
        { id: "4b", label: "Ter mais controle" },
        { id: "4c", label: "Regularizar minha situação" },
        { id: "4d", label: "Investir melhor" },
        { id: "4e", label: "Crescer financeiramente" },
      ],
    },
  ];
  VISAO.TOTAL_STEPS = VISAO.QUIZ_QUESTIONS.length + 1; // +1 = captura de lead

  // ---- Perfis -----------------------------------------------------------
  VISAO.PROFILES = {
    consumidor_calorico: {
      id: "consumidor_calorico",
      name: "Consumidor Calórico",
      summary: "O dinheiro vai embora nos pequenos excessos do cotidiano.",
      diagnosis:
        "Sua rotina e os pequenos gastos do dia a dia podem estar consumindo seu dinheiro sem que você perceba.\n\nMais do que falta de controle, esse perfil mostra **falta de visão** sobre hábitos financeiros e prioridades.",
      recommended_service: "Consultoria Básica",
      signals: [
        "Vida corrida e renda variável dificultam manter um método.",
        "Os 'pequenos gastos' do dia a dia somam mais do que parecem.",
        "Você sente que sabe o que faz, mas não enxerga o conjunto.",
      ],
      today_signals: [
        "viva no automático financeiro",
        "tenha pequenos excessos recorrentes",
        "tente se organizar e desista",
        "não visualize os gastos do mês",
      ],
      today_needs: [
        "visualizar melhor seus gastos",
        "criar uma rotina financeira simples",
        "organizar prioridades do mês",
        "ter mais clareza nas decisões",
      ],
      recommendation_pitch:
        "Uma metodologia pensada por nós para ajudar você a **encontrar o seu alívio mental** através de **organização** financeira, de forma **prática** e **humana**.",
      accent_color: "#8350F2",
      image: "assets/img/classificacao/consumidor_calorico.webp",
    },
    equilibrista_da_rotina: {
      id: "equilibrista_da_rotina",
      name: "Equilibrista da Rotina",
      summary:
        "Tenta equilibrar trabalho, vida pessoal e dinheiro, mas sente que está sempre apagando incêndios.",
      diagnosis:
        "Você tenta equilibrar trabalho, vida pessoal e estabilidade financeira ao mesmo tempo.\n\nEsse perfil normalmente aparece quando existe **excesso de responsabilidades** e pouca estrutura para sustentar tudo sozinho(a).",
      recommended_service: "Mentoria Financeira",
      signals: [
        "Você toma boas decisões pontuais, mas falta planejamento.",
        "Um imprevisto pequeno ainda bagunça o mês inteiro.",
        "Existe espaço pra evoluir — só falta método e acompanhamento.",
      ],
      today_signals: [
        "viva apagando incêndios financeiros",
        "tome decisões pontuais sem planejamento",
        "sinta que um imprevisto bagunça tudo",
        "carregue tudo sozinho(a) na rotina",
      ],
      today_needs: [
        "estruturar um método sustentável",
        "ganhar previsibilidade no mês",
        "ter acompanhamento próximo",
        "evoluir com direção clara",
      ],
      recommendation_pitch:
        "Uma mentoria pensada por nós para ajudar você a **encontrar o seu equilíbrio** através de **estrutura** financeira, de forma **estratégica** e **humana**.",
      accent_color: "#859EF6",
      image: "assets/img/classificacao/equilibrista_da_rotina.webp",
    },
    empreendedor_modo_aviao: {
      id: "empreendedor_modo_aviao",
      name: "Empreendedor no Modo Avião",
      summary:
        "Foca tanto em fazer o negócio funcionar que a parte burocrática entra no 'modo avião'.",
      diagnosis:
        "Você provavelmente dedica toda sua energia ao negócio e acaba deixando **organização financeira e burocracias** para depois.\n\nEsse perfil é comum em rotinas multitarefa e empreendimentos em crescimento.",
      recommended_service: "Serviços Contábeis + Consultoria",
      signals: [
        "MEI, NF e DAS viraram dor de cabeça recorrente.",
        "Você mistura conta pessoal e da empresa sem perceber.",
        "Quer profissionalizar, mas não sabe por onde começar.",
      ],
      today_signals: [
        "esteja com MEI, NF ou DAS em atraso",
        "misture conta pessoal e da empresa",
        "deixe a burocracia sempre pra depois",
        "queira profissionalizar e não saiba como",
      ],
      today_needs: [
        "regularizar a parte contábil sem dor",
        "separar o pessoal do empresarial",
        "ter rotina fiscal organizada",
        "profissionalizar o seu CNPJ",
      ],
      recommendation_pitch:
        "Uma combinação pensada por nós para tirar você do **modo avião** através de **estrutura** contábil, de forma **prática** e **humana**.",
      accent_color: "#C0F685",
      image: "assets/img/classificacao/empreendedor_modo_aviao.webp",
    },
    investidor_de_reels: {
      id: "investidor_de_reels",
      name: "Investidor de Reels",
      summary:
        "Consome conteúdo financeiro o tempo todo, mas ainda não conseguiu transformar informação em estratégia.",
      diagnosis:
        "Você já busca aprender sobre dinheiro e investimentos, mas ainda sente dificuldade em **transformar informação em direção prática**.\n\nEsse perfil costuma surgir no excesso de conteúdo e comparação digital.",
      recommended_service: "Mentoria Financeira",
      signals: [
        "Você já tem base, mas falta um plano consistente.",
        "Há mais opções de investimento abertas no celular do que decisões.",
        "Comparação digital atrapalha mais do que ajuda.",
      ],
      today_signals: [
        "consuma muito conteúdo financeiro",
        "tenha base, mas falte um plano",
        "se compare digitalmente o tempo todo",
        "não saiba qual o seu próximo passo",
      ],
      today_needs: [
        "transformar informação em direção",
        "ter um plano consistente",
        "filtrar o que faz sentido pra você",
        "evoluir sem comparação",
      ],
      recommendation_pitch:
        "Uma mentoria pensada por nós para transformar informação em **direção prática** através de **estratégia** financeira, de forma **personalizada** e **humana**.",
      accent_color: "#F2E850",
      image: "assets/img/classificacao/investidor_de_reels.webp",
    },
  };

  VISAO.getProfile = function (id) {
    return VISAO.PROFILES[id];
  };

  // ---- Scoring (porte de lib/scoring.ts) --------------------------------
  const SCORING_MATRIX = {
    "1": {
      "1a": { consumidor_calorico: 2, equilibrista_da_rotina: 1 },
      "1b": { consumidor_calorico: 2 },
      "1c": { empreendedor_modo_aviao: 3 },
      "1d": { empreendedor_modo_aviao: 3 },
      "1e": { investidor_de_reels: 3 },
      "1f": {
        consumidor_calorico: 1,
        equilibrista_da_rotina: 1,
        empreendedor_modo_aviao: 1,
        investidor_de_reels: 1,
      },
    },
    "2": {
      "2a": { consumidor_calorico: 2, investidor_de_reels: 1 },
      "2b": { equilibrista_da_rotina: 2 },
      "2c": { equilibrista_da_rotina: 3, empreendedor_modo_aviao: 1 },
      "2d": { investidor_de_reels: 2, consumidor_calorico: 1 },
      "2e": { investidor_de_reels: 2 },
    },
    "3": {
      "3a": { consumidor_calorico: 1, empreendedor_modo_aviao: 1 },
      "3b": { equilibrista_da_rotina: 2 },
      "3c": { investidor_de_reels: 1, equilibrista_da_rotina: 1 },
      "3d": { consumidor_calorico: 2 },
    },
    "4": {
      "4a": { consumidor_calorico: 3 },
      "4b": { equilibrista_da_rotina: 2, consumidor_calorico: 1 },
      "4c": { empreendedor_modo_aviao: 3 },
      "4d": { investidor_de_reels: 3 },
      "4e": { investidor_de_reels: 2, equilibrista_da_rotina: 1 },
    },
  };

  const TIEBREAKER = [
    "empreendedor_modo_aviao",
    "equilibrista_da_rotina",
    "investidor_de_reels",
    "consumidor_calorico",
  ];

  VISAO.classify = function (answers) {
    const scores = {
      consumidor_calorico: 0,
      equilibrista_da_rotina: 0,
      empreendedor_modo_aviao: 0,
      investidor_de_reels: 0,
    };

    for (const questionId in answers) {
      const answerId = answers[questionId];
      const rule = SCORING_MATRIX[questionId] && SCORING_MATRIX[questionId][answerId];
      if (!rule) continue;
      for (const profileId in rule) {
        scores[profileId] += rule[profileId] || 0;
      }
    }

    const values = Object.keys(scores).map((k) => scores[k]);
    const max = Math.max.apply(null, values);
    if (max === 0) return "consumidor_calorico";

    const leaders = Object.keys(scores).filter((id) => scores[id] === max);
    if (leaders.length === 1) return leaders[0];

    for (const candidate of TIEBREAKER) {
      if (leaders.indexOf(candidate) !== -1) return candidate;
    }
    return leaders[0];
  };

  window.VISAO = VISAO;
})();
