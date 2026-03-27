import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary:       '#990FFA',
          'primary-50':  '#F5E6FF',
          'primary-100': '#E8C4FF',
          'primary-200': '#D38BFF',
          secondary:       '#E60076',
          'secondary-50':  '#FFE6F3',
          'secondary-100': '#FFC4E3',
          success:       '#16A34A',
          'success-50':  '#F0FDF4',
          warning:       '#D97706',
          'warning-50':  '#FFFBEB',
          danger:        '#DC2626',
          'danger-50':   '#FEF2F2',
          surface:       '#FFFFFF',
          text:          '#111827',
        },
      },
      fontFamily: {
        sans:    ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [typography],
};

export default config;
