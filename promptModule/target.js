const path = require("path")
const fs = require("fs")
const util = require("util")
const writeFile = util.promisify(fs.writeFile)
module.exports = async function (dir) {
    let targetFile = path.resolve(dir, "postcss.config.js")
    let postcssConfig;
    try {
        postcssConfig = require(targetFile)
        postcssConfig["postcss-px-to-viewport"] = {
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