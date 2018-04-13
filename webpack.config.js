const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const I18nPlugin = require('i18n-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const languages = {
  en: require('./locales/en.json'),
  fr: require('./locales/fr.json'),
  es: require('./locales/es.json'),
  ru: require('./locales/ru.json'),
  it: require('./locales/it.json'),
  id: require('./locales/id.json')
}

const buildDirPath = resolve(__dirname, 'build/')

module.exports = [
  ...Object.keys(languages).map(language => {
    const isEnglish = language === 'en'

    return {
      entry: {
        index: './src/index.html',
        'token-sale': './src/token-sale.html',
        jurors: './src/jurors.html'
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
                attrs: ['link:href', 'img:src', 'object:data']
              }
            })
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'file-loader',
                options: { outputPath: './' }
              },
              'extract-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: { plugins: [autoprefixer] }
              }
            ]
          },
          {
            test: /\.(png|jpe?g|svg|woff|woff2)$/,
            use: {
              loader: 'url-loader',
              options: { limit: 8192, name: './[hash].[ext]' }
            }
          }
        ]
      },

      plugins: [
        new CleanWebpackPlugin(['./build/']),
        new I18nPlugin(languages[language], { failOnMissing: true }),
        new ExtractTextPlugin('[name].html'),
        ...(isEnglish
          ? [
              new CopyWebpackPlugin(['./public/']),
              new OpenBrowserPlugin({ url: 'http://localhost:8080' })
            ]
          : [])
      ]
    }
  })
]
