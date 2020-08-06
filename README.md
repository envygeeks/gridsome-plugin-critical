# @gridsome/plugin-critical

***This plugin is not published, and is a rewrite of the current
@gridsome/plugin-critical that allows you to update so you can remove some 
CVE's that exist in current versions of the plugin. It also removes a few
obscure features I don't need or want in the plugin I use.***

> Extracts & inlines critical-path (above-the-fold) CSS

## Install
- `yarn add @gridsome/plugin-critical`
- `npm install @gridsome/plugin-critical`

## Usage

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/plugin-critical',
      options: {
        paths: ['/'],
        width: 1300,
        height: 900
      }
    }
  ]
}
```
