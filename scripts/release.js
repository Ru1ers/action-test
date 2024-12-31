const { exec } = require("child_process");
const util = require("util");
const signale = require("signale");
const updateVersion = require("./updateVersion");

const execPromise = util.promisify(exec);

async function runScript(script, ...args) {
  try {
    signale.start(`开始执行 ${script}...`);
    const { stdout, stderr } = await execPromise(
      `node scripts/${script} ${args.join(" ")}`,
      {
        encoding: "utf8",
      }
    );
    signale.success(`执行 ${script} 成功:\n${stdout}`);
    if (stderr) {
      signale.warn(`执行 ${script} 时出现警告:\n${stderr}`);
    }
  } catch (error) {
    signale.error(`执行 ${script} 失败: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    const releaseType = process.argv[2] || "patch";
    const isBeta = releaseType === "beta";

    signale.info(`开始${isBeta ? "Beta" : "正式"}版本发布流程...`);

    await runScript("updateChangelog.js");
    await updateVersion(isBeta ? "minor" : "patch", isBeta);
    await runScript("publish.js");
    await runScript("commitToGithub.js");

    signale.complete(`${isBeta ? "Beta" : "正式"}版本发布完成！`);
  } catch (error) {
    signale.fatal("发布脚本执行过程中发生错误:", error.message);
    process.exit(1);
  }
}

main();
