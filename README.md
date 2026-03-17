# 设备测试套件

一个基于 TypeScript + React 的纯静态设备测试套件，可以部署在 Cloudflare Pages、GitHub Pages 或任何静态网站托管服务上。

## 🚀 功能特性

- 📊 **屏幕测试** - 分辨率检测、色彩显示测试、响应时间测试
- ⌨️ **键盘测试** - 按键功能测试、响应速度测试
- 🖱️ **鼠标测试** - 点击测试、滚轮测试、指针精度
- 📷 **摄像头测试** - 画质测试、帧率检测、分辨率信息
- 🎤 **麦克风测试** - 录音质量、灵敏度测试
- 📢 **扬声器测试** - 音质测试、音量控制、声道检测
- 🎮 **手柄测试** - 按键测试、摇杆校准、振动功能

## 🛠️ 技术栈

- **TypeScript** - 类型安全的 JavaScript 超集
- **React 18** - 用户界面构建库
- **Vite** - 快速的前端构建工具
- **CSS3** - 现代化的样式设计

## 📦 安装与运行

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🚀 部署

### Cloudflare Pages 部署

1. 克隆仓库到 GitHub
2. 登录 Cloudflare 控制台
3. 创建新的 Pages 项目
4. 连接你的 GitHub 仓库
5. 配置构建设置:
   - 构建命令: `npm run build`
   - 输出目录: `dist`
6. 点击部署

### GitHub Pages 部署

```bash
# 安装 gh-pages
npm install -D gh-pages

# 在 package.json 中添加
"homepage": "https://yourusername.github.io/your-repo-name"

# 部署
npm run deploy
```

## 📝 使用说明

### 屏幕测试

1. **分辨率信息** - 显示屏幕和窗口的分辨率信息
2. **色彩测试** - 测试屏幕的色彩显示准确性
   - 自动模式: 每 2 秒自动切换颜色
   - 手动模式: 点击颜色按钮切换
   - 全屏模式: 进入全屏测试
3. **响应时间测试** - 测试屏幕的响应速度和拖影情况

## 🎨 设计特点

- 🎯 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **现代化 UI** - 渐变背景、卡片布局、平滑动画
- 📱 **移动友好** - 完美支持触摸设备
- ⚡ **高性能** - 纯静态页面，加载速度快

## 📄 许可证

AGPL-v3 License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系:

- GitHub Issues: [提交问题](https://github.com/yourusername/your-repo-name/issues)

---

**享受测试！** 🎉
