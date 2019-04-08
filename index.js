#!/usr/bin/env node

const download = require("download-git-repo")
const program = require('commander');
const ora = require('ora');
const execa = require('execa');
const path = require("path")
const util = require("util")
program
    .version('1.1.1')
    .command('create <dir>')
    .option("-y, --yield", "automatically install dependancy")
    .action(async function (dir, options) {
        const spinner = ora('正在创建项目...').start();
        await downloadRepo('fekun/vue-cli-template#master', dir)
        spinner.succeed(`项目创建成功`)
        if (options.yield) {
            spinner.start("正在安装依赖...")
            let dirPath = path.resolve(process.cwd(), dir)
            execa("npm", ["i"], {
                cwd: dirPath,
                stdio: ['pipe', 'pipe', 'pipe']
            }).then(result => {
                let { stdout, stderr } = result
                spinner.succeed("依赖安装完成")
                if (stderr) {
                    console.error(stderr)
                } else {
                    console.log(stdout)
                }
            })
        }
    })
async function downloadRepo(repoAddr, dirName) {
    let _promise = util.promisify(download)
    let err = await _promise(repoAddr, dirName)
    return new Promise((resolve, reject) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }

    })
}
// async function installDependancy(dirName) {
//     let dirPath = path.resolve(process.cwd(), dirName)
//     const { stdout, stderr } = await execa("npm", ["i"], {
//         cwd: dirPath,
//         stdio: ['pipe', 'pipe', 'pipe']
//     })
//     return new Promise((resolve, reject) => {
//         if (stdout) {
//             resolve(stdout)
//         } else if (stderr) {
//             reject(stderr)
//         }
//     })
// }
program.parse(process.argv)

