import "vuetify/styles";
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "bankLight",
    themes: {
      bankLight: {
        dark: false,
        colors: {
          background: "#f5f7f2",
          surface: "#ffffff",
          primary: "#1a7f64",
          secondary: "#2d5f98",
          accent: "#d28a1a",
          success: "#2e8f58",
          warning: "#b7651f",
          error: "#b12a2a",
          info: "#2a6fb1"
        }
      }
    }
  }
});
