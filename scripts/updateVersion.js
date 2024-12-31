const fs = require("fs").promises;
const path = require("path");
const signale = require("signale");
const { incrementVersion } = require("./versionManager");

const zebraUiPackagePath = path.join(
  __dirname,
  "../demos/demo-normal/uni_modules/zebra-ui/package.json"
);
const rootPackagePath = path.join(__dirname, "../package.json");
const srcPackagePath = path.join(__dirname, "../src/package.json");

async function updateVersion(releaseType = "patch", isBeta = false) {
  try {
    // 读取当前版本号
    const rootData = await fs.readFile(rootPackagePath, "utf8");
    const rootPackage = JSON.parse(rootData);
    const currentVersion = rootPackage.version;

    // 计算新版本号
    const newVersion = incrementVersion(currentVersion, releaseType, isBeta);
    signale.info(`版本号将从 ${currentVersion} 更新到 ${newVersion}`);

    // 更新所有相关文件的版本号
    const files = [
      { path: rootPackagePath, json: rootPackage },
      {
        path: srcPackagePath,
        json: JSON.parse(await fs.readFile(srcPackagePath, "utf8")),
      },
      {
        path: zebraUiPackagePath,
        json: JSON.parse(await fs.readFile(zebraUiPackagePath, "utf8")),
      },
    ];

    for (const file of files) {
      file.json.version = newVersion;
      await fs.writeFile(file.path, JSON.stringify(file.json, null, 4), "utf8");
      signale.success(`更新 ${file.path} 版本号为: ${newVersion}`);
    }

    return newVersion;
  } catch (error) {
    signale.error("版本更新失败:", error.message);
    throw error;
  }
}

module.exports = updateVersion;

if (require.main === module) {
  updateVersion();
}
