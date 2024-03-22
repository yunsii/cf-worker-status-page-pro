import defaultTheme from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'
import { addDynamicIconSelectors } from 'tailwindcss-plugin-iconify'

import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    animate,
    addDynamicIconSelectors({
      prefix: 'i',
      preprocessSets: {
        'ic': '*',
        'svg-spinners': '*',
      },
    }),
  ],
} satisfies Config

export default config
