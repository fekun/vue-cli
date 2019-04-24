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
const target = require("./promptModule/target")
const addManagerSysModule = require("./promptModule/managerSysType")
// a command of creating a project
program
    .version(version)
    .command('create <dir>')
    .action(async function (dir, options) {
        let answers = await inquirer.prompt([
            /* Pass your questions in here */
            {
                type: "list",
                message: "选择你需要生成的项目的组件类型",
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
                type: "list",
                message: "选择你项目的目标终端",
                name: "target",
                choices: [
                    {
                        name: "pc端",
                        value: "pc",
                        short: "pc端"
                    },
                    {
                        name: "移动端",
                        value: "mobile",
                        short: "移动端"
                    }
                ]
            },
            {
                type: "confirm",
                message: "需要添加后台管理系统模块吗",
                name: "isManagerSys",
                default: true
            },
            {
                type: "list",
                message: "选择你需要的后台管理系统模块类型",
                name: "managerSysType",
                when: function(answers) {
                    return answers.isManagerSys
                },
                choices: [
                    {
                        name: "Ant Design",
                        value: "ant-design-vue",
                        short: "Ant Design"
                    },
                    {
                        name: "iview",
                        value: "iview",
                        short: "iview"
                    },
                    {
                        name: "element-ui",
                        value: "element-ui",
                        short: "element-ui"
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
        // if (answers.syntax === "sfc" && answers.target === "pc") {
        //     await downloadRepo('fekun/vue-cli-template#master', dir)
        // } else if (answers.syntax === "jsx" && answers.target === "pc") {
        //     await downloadRepo('fekun/vue-cli-template#jsx', dir)
        // } else if (answers.syntax === "sfc" && answers.target === "mobile") {
        //     await downloadRepo('fekun/vue-cli-template#master-mobile', dir)
            
        // } else if (answers.syntax === "jsx" && answers.target === "mobile") {
        //     await downloadRepo('fekun/vue-cli-template#jsx-mobile', dir)
        // } 
        if (answers.syntax === "sfc") {
            await downloadRepo('fekun/vue-cli-template#master', dir)
        } else if (answers.syntax === "jsx") {
            await downloadRepo('fekun/vue-cli-template#jsx', dir)
        }
        if(answers.target === "mobile") {
            await target(dir)
        }
        if(answers.isManagerSys) {
            addManagerSysModule(dir, answers.managerSysType)
        }
        if (answers.yield) {
                await installDependancy(dir)
        }
    })
async function downloadRepo(repoAddr, dirName) {
    let _download = util.promisify(download)
    spinner.start("正在创建项目...")
    await _download(repoAddr, dirName)
    spinner.succeed("项目创建成功")
}
async function installDependancy(dirName) {
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