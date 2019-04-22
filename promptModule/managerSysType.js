const getVersion = require("../util/getVersion")
const path = require("path")
const fs = require("fs")
const util = require("util")
const writeFile = util.promisify(fs.writeFile)
module.exports = async function(dir, pkgName) {
    let version;
    try {
        let res = await getVersion(pkgName)
        version  = res.stdout
    }catch(err) {
        console.error(err)
    }
    let pkgJsonPath = path.resolve(dir, "package.json")
    let pkgJson
    try {
        pkgJson = require(pkgJsonPath)
    }catch(err) {
        console.error(err)
    }
    pkgJson["dependencies"][pkgName] = "^" + version
    let result = JSON.stringify(pkgJson, null, "\t")
    try {
        await writeFile(pkgJsonPath, result)
    }catch(err) {
        console.error(err)
    }
    
}