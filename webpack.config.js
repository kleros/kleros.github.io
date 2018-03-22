const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const I18nPlugin = require('i18n-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const languages = {
  en: require('./locales/en.json'),
  es: require('./locales/es.json')
}

const buildDirPath = resolve(__dirname, 'build/')

module.exports = [
  ...Object.keys(languages).map(language => {
    const isEnglish = language === 'en'

    return {
      entry: {
        index: './src/index.html',
        'token-sale': './src/token-sale.html'
      },

      output: {
        filename: '[name].html',
        path: isEnglish ? buildDirPath : resolve(buildDirPath, language)
      },

      module: {
        rules: [
          {
            test: /\.html$/,
            use: ExtractTextPlugin.extract({
              loader: 'html-loader',
              options: {
                interpolate: true,
                attrs: ['link:href', 'img:src']
              }
            })
          },
          {
            test: /\.css$/,
            use: ['file-loader', 'extract-loader', 'css-loader']
          },
          {
            test: /\.(png|jpg|svg|woff|woff2)$/,
            use: {
              loader: 'url-loader',
              options: { limit: 8192 }
            }
          }
        ]
      },

      plugins: [
        new CleanWebpackPlugin(['./build/']),
        new I18nPlugin(languages[language]),
        new ExtractTextPlugin('[name].html'),
        ...(isEnglish ? [new CopyWebpackPlugin(['./public/'])] : []),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
      ]
    }
  })
]
