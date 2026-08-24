# 个人学术主页

一个无需构建工具、可直接部署到 GitHub Pages 的静态学术主页。

## 更新个人信息

大部分内容都集中在 `site-data.js` 中。可以直接修改：

- `profile`：姓名、头像、邮箱、个人状态、研究关键词、爱好、单位与个人简介
- `facts`：学位、导师等信息
- `education`：教育背景与学术简历时间线
- `research`：研究方向
- `publications`：论文与其他成果
- `links`：Google Scholar、ORCID、GitHub、ResearchGate、CV 等链接；暂时留空时页面会显示“待补充”占位入口

论文条目的格式：

```js
{
  title: "Paper title",
  authors: "Your Name, Coauthor A, Coauthor B",
  venue: "Journal or Conference",
  year: "2026",
  type: "JOURNAL",
  url: "https://doi.org/...",
}
```

双语字段使用 `{ zh: "中文", en: "English" }` 格式。顶部的中英文按钮会切换整页内容并记住访客的选择。

首页现在采用合并式“个人简介”结构：方形头像与姓名并排，随后集中展示个人简介、研究关键词、爱好、学术链接，以及缩小后的地点地图和所属单位；右侧保留留白与粒子文化图形。教育经历独立为后续首个内容模块，研究方向、成果与联系模块继续保留。头像路径在 `profile.avatar` 中填写，留空时自动显示姓名首字母；爱好在 `profile.hobbies` 中维护。

粒子背景实现位于 `particle-map.js`，会根据页面滚动进度在复旦校徽、老校门、子彬院与复旦校徽之间平滑变形，确保首屏和末屏均为官方校徽。粒子图整体尺寸为早期版本的 50%，正校门阶段已移除。
四段造型不是手绘轮廓：脚本会读取 `assets/` 中保存的复旦官方实拍与官方校徽原稿，通过主体裁切、强轮廓优先、像素蒙版和 Sobel 边缘检测生成 9,000–26,000 个粒子。采样时会排除照片裁切区域边缘，因此建筑周围不会出现原图的矩形边框。

主页身份卡使用 MapLibre GL JS 和 OpenFreeMap 的 OpenMapTiles 矢量数据。地图采用与页面纸张背景融合的透明画布，放大聚焦复旦大学&#x90AF;&#x90F8;校区，并使用一个克制的红色定位点与校区名称标注；其余地图文字、建筑、POI、土地用途和地图控件均不绘制。地图数据遵循 ODbL，署名位于页面页脚。

页眉使用复旦官方校徽原稿与学院官网发布的 3376 × 973 透明 PNG 标识，并通过无损裁切窗口显示，未重新绘制或替换字体。

## 视觉参考

- [复旦大学标识系统](https://www.fudan.edu.cn/bsxt/)
- [复旦大学标识元素下载](https://www.fudan.edu.cn/fdbsxz/list.htm)
- [复旦大学集成电路与微纳电子创新学院](https://icmne.fudan.edu.cn/)
- [&#x90AF;&#x90F8;校区与正门局部地图](https://news.fudan.edu.cn/2025/0630/c1247a146130/page.htm)
- [复旦校门建筑史](https://www.fudan.edu.cn/2019/0424/c426a95980/page.htm)
- [子彬院建筑与历史](https://www.fudan.edu.cn/2019/0424/c426a95988/page.htm)
- [OpenStreetMap 版权与署名](https://www.openstreetmap.org/copyright)
- [OpenFreeMap](https://openfreemap.org/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)

## 本地预览

不要直接双击 `index.html`。粒子动效需要读取本地图片并分析像素，浏览器在 `file://` 模式下可能因安全策略阻止这一过程。请在项目目录启动本地 HTTP 服务。

Windows PowerShell：

```powershell
python -m http.server 8000
```

macOS / Linux：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库，并将这个目录中的文件推送到 `main` 分支。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 的 Source 中选择 **GitHub Actions**。
4. 推送新代码后，`.github/workflows/pages.yml` 会自动发布网站。

站点默认地址通常为 `https://<GitHub 用户名>.github.io/<仓库名>/`。

## 文件结构

```text
.
├── index.html                 # 页面结构
├── styles.css                # 视觉样式与响应式布局
├── site-data.js              # 个人内容配置
├── main.js                   # 内容渲染与小屏导航
├── particle-map.js           # 真实源图采样与滚动粒子动画
├── city-map.js               # MapLibre 城市路网纹理样式
├── assets/                   # 官方实拍、校徽原稿和校园地图
└── .github/workflows/pages.yml
```
