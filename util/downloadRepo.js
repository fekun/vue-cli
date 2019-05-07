const util = require('util')
const ora = require('ora');
const spinner = ora()
const download = require("download-git-repo")
module.exports = async function downloadRepo(repoAddr, dirName) {
    let _download = util.promisify(download)
    spinner.start("正在创建项目...")
    await _download(repoAddr, dirName)
    spinner.succeed("项目创建成功")
}