const signale = require("signale");
const { paths, execCommand } = require("./utils");

async function publishToNpm(isBeta = false) {
  try {
    signale.pending(`正在发布${isBeta ? "Beta" : ""}包到 npm...`);
    const publishTag = isBeta ? "--tag beta" : "";
    await execCommand(`npm publish ${publishTag}`, { cwd: paths.srcDir });
    signale.success("npm 发布成功！");
  } catch (error) {
    signale.error("npm 发布失败:", error.message);
    throw error;
  }
}

if (require.main === module) {
  publishToNpm();
}

module.exports = publishToNpm;
