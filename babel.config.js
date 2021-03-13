const prodPlugin = []

if (process.env.NODE_ENV === 'production') {
    prodPlugin.push('transform-remove-console')

}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
        ["@babel/preset-env", {
            "modules": false
        }]
    ],
    "plugins": [
        ["component", {
            "libraryName": "mint-ui",
            "style": true
        }],
        ...prodPlugin
    ]
}