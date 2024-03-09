import janna from '@jannajs/lint/dist/eslint/index.js'

export default janna({
  tailwind: true,
  ignores: ['**/worker-configuration.d.ts'],
  settings: {
    tailwindcss: {
      config: 'tailwind.config.ts',
      tags: ['cls', 'tw'],
    },
  },
})
