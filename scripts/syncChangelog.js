const fs = require("fs").promises;
const signale = require("signale");
const { paths } = require("./utils");

async function syncChangelog() {
  try {
    signale.pending("正在同步 changelog...");

    // 读取源 changelog
    const sourceContent = await fs.readFile(paths.sourceChangelog, "utf8");

    // 复制到 src/changelog.md
    await fs.writeFile(paths.targetChangelogs[0], sourceContent, "utf8");
    signale.success("已更新 src/changelog.md");

    // 更新文档 changelog
    const docsChangelog = await fs.readFile(paths.targetChangelogs[1], "utf8");
    const insertPosition = docsChangelog.indexOf(
      "<!-- changedlog-unrelease -->"
    );

    if (insertPosition === -1) {
      throw new Error("未找到插入标记 <!-- changedlog-unrelease -->");
    }

    // 提取最新版本的内容
    const latestVersionMatch = sourceContent.match(
      /##\s+(\d+\.\d+\.\d+)（.*?）(.*?)(?=##|$)/s
    );
    if (!latestVersionMatch) {
      throw new Error("未找到最新版本信息");
    }

    const newContent = latestVersionMatch[0]
      .replace(/^## /, "### ")
      .replace(/（.*?）/, "");

    const updatedContent =
      docsChangelog.slice(
        0,
        insertPosition + "<!-- changedlog-unrelease -->".length
      ) +
      "\n\n" +
      newContent +
      docsChangelog.slice(
        insertPosition + "<!-- changedlog-unrelease -->".length
      );

    await fs.writeFile(paths.targetChangelogs[1], updatedContent, "utf8");
    signale.success("已更新文档 changelog");
  } catch (error) {
    signale.error("同步 changelog 失败:", error.message);
    throw error;
  }
}

if (require.main === module) {
  syncChangelog();
}

module.exports = syncChangelog;
