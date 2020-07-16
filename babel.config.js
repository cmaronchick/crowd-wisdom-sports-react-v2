module.exports = {
    "presets": [
        "@babel/preset-react", ["@babel/preset-env", {
        "targets": {
          "browsers": ["last 2 versions"],
          "node": "current"
        }
      }]
    ],
    "plugins": [["@babel/plugin-proposal-class-properties"],
        ["@babel/plugin-transform-runtime", {
        "regenerator": true
      }]
    ]
}