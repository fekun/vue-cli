const getVersion = require("../util/getVersion")
const path = require("path")
const fs = require("fs")
const util = require("util")
const writeFile = util.promisify(fs.writeFile)
module.exports = async function (dir) {
    let mobilePluginName = 'postcss-px-to-viewport'
    let version;
    try {
        let res = await getVersion(mobilePluginName)
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
    pkgJson["devDependencies"][mobilePluginName] = "^" + version
    let pkgResult = JSON.stringify(pkgJson, null, "\t")
    try {
        await writeFile(pkgJsonPath, pkgResult)
    }catch(err) {
        console.error(err)
    }

    let targetFile = path.resolve(dir, "postcss.config.js")
    let postcssConfig;
    try {
        postcssConfig = require(targetFile)
        postcssConfig["plugins"]["postcss-px-to-viewport"] = {
            viewportWidth: 750
        }
    } catch (err) {
        console.error("你的postcss.config.js文件好像丢失了哦")
        return
    }
    let result = `module.exports = ${JSON.stringify(postcssConfig, null, "\t")}`
    try {
        await writeFile(targetFile, result)
    }catch(err) {
        console.error(err)
    }
    

}