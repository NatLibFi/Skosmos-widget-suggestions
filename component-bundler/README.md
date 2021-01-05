
# Webpack-based Vue application

The webpack bundler for the Vue application, which this Skosmos plugin uses for initializing the suggestion dialogs.

Based on [a library](https://github.com/kartsims/vue-customelement-bundler), which allows using Vue components (or applications) as HTML tags. For a rundown of the idea behind and usage of this bundler, see [this post](http://vuetips.com/vue-web-components).

## How it works

This bundler produces the `components.js` file, which is used for this widget's suggestion dialogs. This `components.js` file is based on the Vue application in `src`, which is then bundled into two custom HTML tags by webpack:

* New suggestion dialog: `<suggestion-new-button />`
* Modification suggestion dialog for a specific label: `<suggestion-change-button />`

To create the `components.js` file, run `npm run build`. File is created into `dist/components.js`.

## Language support

This widget supports language JSON files found in `src/i18n`. To update the translations, make your modifications and run `npm run build` to create an updated `components.js` file.

## Development

To update the usability of this widget from the Vue application's stand point, run the bundler in development mode: `npm run dev` (watch mode).

* Open `demo/index.html` in a browser
* Make your edits to `src/main.js`, component files, or translations in `src/i18n`
* Refresh the page