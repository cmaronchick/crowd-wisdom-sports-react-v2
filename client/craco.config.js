const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            modifyVars: { 
                '@primary-color': '#0a1f8f',
                '@info-color': '@primary-color',
                '@success-color': '#124734',
                '@processing-color': '@primary-color',
                '@error-color': 'rgba(224, 20, 7, 1.0)',
                '@highlight-color': '#f6dfa4',
                '@warning-color': 'rgba(224, 20, 7, 1.0)',
                '@normal-color': '#231f20',
                '@white': '#fff',
                '@black': '#231f20',
                '@layout-header-background': '#231f20',
                '@layout-header-color': '#f6dfa4'
            },
            javascriptEnabled: true,
          },
        },
      },
    ]
};