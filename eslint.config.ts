import janna from '@jannajs/lint/dist/eslint/index.js'

export default janna({
  tailwind: true,
  settings: {
    tailwindcss: {
      config: 'tailwind.config.ts',
      tags: ['cls', 'tw'],
    },
  },
})
