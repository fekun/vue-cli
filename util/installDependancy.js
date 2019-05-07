const path = require('path')
const ora = require('ora');
const spinner = ora()
const execa = require('execa');
module.exports = async function installDependancy(dirName) {
    spinner.start("正在安装依赖...")
    let dirPath = path.resolve(process.cwd(), dirName)
    try {
        await execa("npm", ["i"], {
            cwd: dirPath,
            stdio: ['pipe', 'pipe', 'pipe']
        })
        spinner.succeed("依赖安装完成")
    }catch(err) {
        spinner.fail("依赖安装失败")
        console.log(err)
    }   
}