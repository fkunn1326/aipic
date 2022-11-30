module.exports = {
    locales: ['ja'],
    sort: true,
    createOldCatalogs: false,
    defaultNamespace:"translation",
    output: 'locale/extracts/$LOCALE/$NAMESPACE.json',
    lexers: {
      tsx: ['JsxLexer'],
    },
    input: "pages/**/*.tsx",
}