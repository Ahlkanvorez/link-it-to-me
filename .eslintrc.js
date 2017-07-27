module.exports = {
    extends: "google",
    plugins: [
        "must-use-await"
    ],
    parserOptions: {
        ecmaVersion: 7, // This option is for syntax only.
        sourceType: "module"
    },
    env: {
        es6: true   // This option deals with libraries, such as Map, Set, etc.
    },
    rules: {
        "space-before-function-paren": [
            "error", {
                anonymous: "always",
                named: "always",
                asyncArrow: "always"
            }
        ],
        "comma-dangle": [ "error", "never" ] // no comma-dangle
    }
};