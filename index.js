#!/usr/bin/env node

const download = require("download-git-repo")
const program = require('commander');
const ora = require('ora');
const execa = require('execa');
const path = require("path")
const util = require("util")
const fs = require("fs")
const spinner = ora()
// a command of creating a project
program
    .version('1.2.1')
    .command('create <dir>')
    .option("-y, --yield", "automatically install dependancy")
    .action(async function (dir, options) {
        spinner.start("正在创建项目...")
        await downloadRepo('fekun/vue-cli-template#master', dir)
        spinner.succeed("项目创建成功")
        if (options.yield) {
            spinner.start("正在安装依赖...")
            let { stdout, stderr } = await installDependancy(dir)
            spinner.succeed("依赖安装完成")
            if (stderr) {
                console.error(stdout)
            } else {
                console.log(stdout)
            }
        }
    })
function downloadRepo(repoAddr, dirName) {

    let _download = util.promisify(download)
    return _download(repoAddr, dirName)
}
function installDependancy(dirName) {
    let dirPath = path.resolve(process.cwd(), dirName)
    return execa("npm", ["i"], {
        cwd: dirPath,
        stdio: ['pipe', 'pipe', 'pipe']
    })
}


// a command of creating a file by template
program
    .command("new <fileName>")
    .option("--jsx", "create jsx file by template")
    .action(async function (fileName, options) {
        let targetFilePath = ""
        if (options.jsx)
            targetFilePath = path.join(__dirname, "./template/template.jsx")
        else
            targetFilePath = path.join(__dirname, "./template/template.vue")
        spinner.start("正在新建文件...")
        let newFileName = path.resolve(process.cwd(), fileName)
        let err = await createFileByTemplate(targetFilePath, newFileName, options.jsx)
        if (err) {
            spinner.fail("抱歉，该文件已存在")
        } else {
            spinner.succeed("新建文件成功")
        }

    })
async function createFileByTemplate(targetFilePath, newFileName, isJsx) {
    let readFile = util.promisify(fs.readFile)
    let targetFile = await readFile(targetFilePath)
    let writeFile = util.promisify(fs.writeFile)
    if (!isJsx) {
        return writeFile(`${newFileName}.vue`, targetFile, {
            flag: 'wx'
        }).catch(err => {
            return err
        })
    } else {
        return writeFile(`${newFileName}.jsx`, targetFile, {
            flag: 'wx'
        }).catch(err => {
            return err
        })
    }

}

// parse param from process.argv
program.parse(process.argv)