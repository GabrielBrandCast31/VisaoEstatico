/* Porte de tailwind.config.ts para o Tailwind Play CDN.
   As cores apontam para as CSS vars definidas em styles.css — mesma
   semântica e mesmo comportamento de opacidade do build original. */
(function () {
  const scale = (name) => ({
    100: `var(--vision-${name}-100)`,
    200: `var(--vision-${name}-200)`,
    300: `var(--vision-${name}-300)`,
    400: `var(--vision-${name}-400)`,
    500: `var(--vision-${name}-500)`,
    600: `var(--vision-${name}-600)`,
    700: `var(--vision-${name}-700)`,
    800: `var(--vision-${name}-800)`,
    900: `var(--vision-${name}-900)`,
  });

  const visionPurple = scale("purple");
  const visionBlue = scale("blue");
  const visionGreen = scale("green");
  const visionYellow = scale("yellow");
  const visionDark = scale("dark");

  tailwind.config = {
    theme: {
      extend: {
        colors: {
          purple: visionPurple,
          blue: visionBlue,
          green: visionGreen,
          yellow: visionYellow,
          dark: visionDark,

          primary: {
            DEFAULT: "var(--primary)",
            light: "var(--primary-light)",
            dark: "var(--primary-dark)",
            ...visionPurple,
          },
          secondary: {
            DEFAULT: "var(--secondary)",
            light: "var(--secondary-light)",
            dark: "var(--secondary-dark)",
            ...visionBlue,
          },
          accent: {
            DEFAULT: "var(--accent)",
            light: "var(--accent-light)",
            dark: "var(--accent-dark)",
            ...visionYellow,
          },
          support: {
            DEFAULT: "var(--support)",
            light: "var(--support-light)",
            dark: "var(--support-dark)",
            ...visionGreen,
          },

          canvas: "var(--background)",
          soft: "var(--background-soft)",
          card: {
            DEFAULT: "var(--background-card)",
            hover: "var(--background-card-hover)",
          },
          paper: "var(--background-light)",
          section: "var(--background-section)",

          fg: "var(--text-default)",
          mute: "var(--text-muted)",
          dim: "var(--text-soft)",
          ink: "var(--text-dark)",

          edge: {
            DEFAULT: "var(--border-default)",
            light: "var(--border-light)",
            strong: "var(--border-strong)",
          },

          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
          info: "var(--info)",
        },
        fontFamily: {
          heading: ["Poppins", "system-ui", "sans-serif"],
          body: ["Inter", "system-ui", "sans-serif"],
          human: ["Nunito", "system-ui", "sans-serif"],
          slogan: ["Caveat", "cursive"],
          logo: ["Anton", "Oswald", "Impact", "Arial Black", "sans-serif"],
        },
        borderRadius: { pill: "9999px" },
        backgroundImage: {
          "gradient-hero": "var(--gradient-hero)",
          "gradient-card": "var(--gradient-card)",
          "gradient-cta": "var(--gradient-cta)",
          "gradient-orbital": "var(--gradient-orbital)",
        },
        boxShadow: {
          "vision-soft": "var(--shadow-soft)",
          "vision-card": "var(--shadow-card)",
          "glow-purple": "var(--shadow-glow-purple)",
          "glow-yellow": "var(--shadow-glow-yellow)",
        },
      },
    },
  };
})();
