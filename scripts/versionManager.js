const semver = require("semver");
const signale = require("signale");

function incrementVersion(currentVersion, type, isBeta = false) {
  try {
    let newVersion;

    if (isBeta) {
      // 如果当前不是 beta 版本，则基于当前版本创建 beta
      if (!currentVersion.includes("beta")) {
        const incrementedVersion = semver.inc(currentVersion, "minor");
        newVersion = `${incrementedVersion}-beta.0`;
      } else {
        // 如果已经是 beta 版本，增加 beta 版本号
        const betaVersion = currentVersion.split("-beta.")[1];
        const newBetaNum = parseInt(betaVersion) + 1;
        newVersion = currentVersion.replace(
          `beta.${betaVersion}`,
          `beta.${newBetaNum}`
        );
      }
    } else {
      // 正式版本
      if (currentVersion.includes("beta")) {
        // 如果当前是 beta 版本，移除 beta 标识
        newVersion = currentVersion.split("-beta.")[0];
      } else {
        // 普通版本号递增
        newVersion = semver.inc(currentVersion, type || "patch");
      }
    }

    return newVersion;
  } catch (error) {
    signale.error("版本号处理失败:", error.message);
    throw error;
  }
}

module.exports = {
  incrementVersion,
};
