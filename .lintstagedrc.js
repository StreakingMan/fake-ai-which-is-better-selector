/**
 * lint-staged config
 * @ref https://www.npmjs.com/package/lint-staged
 * @desc generated at 11/23/2022, 1:13:31 AM by streakingman-cli@1.10.1
 */

module.exports = {
    '*.{[tj]s,[tj]sx,[cm]js}': ['eslint --fix'],
    '*.json': ['prettier --write'],

    '*.{css,scss}': ['stylelint --fix'],
};
