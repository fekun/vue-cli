const getVersion = require("../util/getVersion")
const path = require("path")
const fs = require("fs")
const util = require("util")
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)
module.exports = async function(dir, pkgName) {
    let main
    try {
        let templatePath = path.join(__dirname, `../template/${pkgName}.js`)
        readFile(templatePath)
            .then(result=> {
                let targetPath = path.resolve(dir, "src", "main.js")
                writeFile(targetPath, result)
                    .then(()=> {

                    }).catch(err=> {
                        console.error(err)
                        console.error("更新main.js出错")
                    })
            }).catch(err=> {
                console.error(err)
                console.error("读取ui模板文件出错")
            }) 
    }catch(err) {
        console.error(err)
    }
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