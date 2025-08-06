const purgecss = require('@fullhuman/postcss-purgecss').default;

module.exports = {
  plugins: [
    require('autoprefixer'),
    purgecss({
      content: [
        './src/**/*.html',
        './src/**/*.ts',
        './src/**/*.js',
        './src/**/*.tsx',
        './src/**/*.jsx'
      ],
      defaultExtractor: content => content.match(/[\w-/:.]+(?<!:)/g) || [],
      safelist: {
        standard: [
          'collapse', 'collapsing', 'collapser', // por si usas collapse de Bootstrap
          'show', 'fade', 'active', // clases dinámicas
          'modal', 'modal-backdrop', 'modal-open', // modales
          'dropdown', 'dropdown-menu', 'dropdown-item',
          'btn', 'btn-primary', 'btn-secondary', // botones comunes
          /^bg-/, /^text-/, /^alert-/, /^navbar/, /^nav/, // patrones útiles
        ]
      }
    })
  ]
}
