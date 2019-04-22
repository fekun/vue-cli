const execa = require('execa')
module.exports = function(pkgName) {
    return execa("npm", ["view", pkgName, "version"])
}