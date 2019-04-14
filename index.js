#!/usr/bin/env node

const download = require("download-git-repo")
const program = require('commander');
const ora = require('ora');
const execa = require('execa');
const path = require("path")
const util = require("util")
const fs = require("fs")
const inquirer = require('inquirer');
const spinner = ora()
const {version} = require("./package")
// a command of creating a project
program
    .version(version)
    .command('create <dir>')
    .action(async function (dir, options) {
        let answers = await inquirer.prompt([
            /* Pass your questions in here */
            {
                type: "list",
                message: "选择你需要生成的项目的组建类型",
                name: "syntax",
                choices: [
                    {
                        name: "单文件组件",
                        value: "sfc",
                        short: "单文件组件"
                    },
                    {
                        name: "jsx组件",
                        value: "jsx",
                        short: "jsx组件"
                    }
                ]
            },
            {
                type: "confirm",
                name: "yield",
                message: "需要自动安装依赖吗",
                default: true
            }
        ])
        if (answers.syntax === "sfc") {
            spinner.start("正在创建项目...")
            await downloadRepo('fekun/vue-cli-template#master', dir)
            spinner.succeed("项目创建成功")
        } else if (answers.syntax === "jsx") {
            spinner.start("正在创建项目...")
            await downloadRepo('fekun/vue-cli-template#jsx', dir)
            spinner.succeed("项目创建成功")
        }
        if (answers.yield) {
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