/// <reference types="tailwindcss" />
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Основные цвета
        white: '#FFFFFF',
        black: '#000000',
        primary: {
          light: '#007AFF',
          dark: '#0A84FF'
        },
        accent: {
          blue: {
            light: '#007AFF',
            dark: '#0A84FF'
          },
          cyan: {
            light: '#32ADE6',
            dark: '#64D2FF'
          },
          gold: {
            light: '#FF9500',
            dark: '#FFD60A'
          },
          purple: {
            light: '#AF52DE',
            dark: '#BF5AF2'
          },
          green: {
            light: '#34C759',
            dark: '#30D158'
          }
        },
        // Системные цвета
        separator: {
          light: '#3C3C4333',
          dark: '#545458FF'
        },
        icons: {
          light: '#3C3C43',
          dark: '#EBEBF5'
        },
        label: {
          primary: {
            light: '#000000',
            dark: '#FFFFFF'
          },
          secondary: {
            light: '#3C3C43',
            dark: '#EBEBF5'
          },
          tabBar: {
            light: '#3C3C43',
            dark: '#EBEBF5'
          },
          date: {
            light: '#8E8E93',
            dark: '#98989D'
          }
        },
        bg: {
          primary: {
            light: '#F2F2F7',
            dark: '#1C1C1E'
          },
          secondary: {
            light: '#FFFFFF',
            dark: '#2C2C2E'
          },
          notification: {
            light: '#30B6F6',
            dark: '#0A84FF'
          },
          tabBar: {
            light: '#F2F2F7',
            dark: '#1C1C1E'
          }
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ]
}

export default config
