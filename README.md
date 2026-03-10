# LiteLoaderQQNT 插件模板
[QuiltNT](https://github.com/QuiltNT) 定制的 [LiteLoaderQQNT](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT)(以下简称为 "框架") 插件模板

## 优点
- [x] 完善的 TypeScript 类型定义 [^1]
- [x] 快速打包 [^2]
- [x] 自动生成插件清单
- [x] 自动构建/发版 [^3]
- [x] 包含简单的示例代码
- [x] 强大的生态系统 [^4]

## 对比已经存在的插件模板
| 对比 | [官方模板](https://github.com/LiteLoaderQQNT/Plugin-Template) | [MisaLiu 的模板](https://github.com/MisaLiu/LiteLoaderQQNT-PluginTemplate-Vite) | 本模板 |
| --- | --- | --- | --- |
| 是否完善 | ✅ | ✅ | ✅ |
| 扩展性 | ❔ [^5] | ✅ [^4] | ✅ [^4] |
| 轻量级 | ✅ | ⛔ [^6] | ✅ |
| 其他对比 | --- | --- | --- |
| 上手难度 | 无 | 适中 | 简单 |
| TypeScript 类型定义 | 无 | 有，但不保持与框架最新版本同步 | 保持与框架最新版本同步 [^1] |
| 构建工具 | N/A | electron-vite [^7] | tsdown [^2] |
| 构建速度 | N/A | 较快 [^7] | 极快 [^2] |
| 插件清单 | 手动修改 | 手动修改 | 自动生成 |
| 自动构建/发版 | 无 | 有 [^3] | 有 [^3] |

## 如何使用
1. 点击 `Use this template` 按钮创建新仓库
2. clone 新仓库到本地并初始化
   ```bash
   git clone https://github.com/your-username/exclusive-plugin-template.git
   cd exclusive-plugin-template
   pnpm install
   ```
3. 修改你的插件信息及代码
4. 提交并推送修改到新仓库
5. 等待 GitHub Actions 自动构建插件
6. 下载构建好的插件解压到框架插件目录

[^1]: 使用由 [QuiltNT (以前称为 `LLQQNT-unofficial` 或 `LLQQNTuno`)](https://github.com/QuiltNT) 提供的 [`@llqqntuno/liteloader-types`](https://www.npmjs.com/package/@llqqntuno/liteloader-types) 包。
[^2]: 使用 [`tsdown`](https://www.npmjs.com/package/tsdown) 快速打包 TypeScript 代码。
[^3]: 自动构建/发版基于 [GitHub Actions](https://github.com/features/actions)，你可以在 Actions 标签页查看构建状态。
[^4]: 基于 [Node.js](https://nodejs.org/) 的强大生态系统，你可以使用 [npm](https://www.npmjs.com/) 或 [pnpm](https://pnpm.io/) 等包管理器安装依赖项。

[^5]: 需用户手动配置
[^6]: 开发时需要安装大量依赖项
[^7]: 使用 [`electron-vite`](https://www.npmjs.com/package/electron-vite) 构建
