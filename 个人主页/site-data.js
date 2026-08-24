/**
 * 个人主页的内容编辑入口。
 * 中英文内容均在此维护；暂时没有的链接可留空 "" 。
 */
window.SITE_DATA = {
  profile: {
    nameZh: "易坤鹤",
    nameEn: "Kunhe Yi",
    initials: "YN",
    avatar: "./个人证件照-白底_副本.jpg", // 使用项目内相对路径，换电脑或部署到 GitHub Pages 后仍可访问。
    title: { zh: "博士研究生", en: "Doctoral Researcher" },
    status: { zh: "研究进行中", en: "Research in progress" },
    university: { zh: "复旦大学", en: "Fudan University" },
    school: {
      zh: "集成电路与微纳电子创新学院",
      en: "School of Integrated Circuits and Micro-Nano Electronics Innovation",
    },
    location: { zh: "上海，中国", en: "Shanghai, China" },
    email: "yi15083810327@163.com",
    phone: "+86 15083810327", // 例如 "+86 138 0000 0000"；留空时保留电话入口占位。
    wechat: "yi761587873", // 填写微信号后，首屏入口会自动启用。
    intro: {
      zh: "聚焦先进节点半导体器件与跨尺度计算仿真，在物理机理、数值方法与工艺—设计协同优化之间建立联系。",
      en: "I study advanced-node semiconductor devices and multiscale computational simulation, connecting physical mechanisms, numerical methods, and design–technology co-optimization.",
    },
    aboutLead: {
      zh: "Hi!我叫易坤鹤，欢迎访问我的主页。我于2022年6月在中国北京的中国地质大学（北京）材料科学与工程学院取得材料科学与工程专业工学学士学位，本科的指导老师是材料科学与工程学院的李晓薇副教授。目前，我在复旦大学集成电路与微纳电子创新学院攻读博士学位，指导老师是陈时友教授。我的研究兴趣主要聚焦于半导体器件设计和计算仿真方法、基于密度泛函理论的第一性原理计算、人工智能技术驱动的多尺度仿真模拟方法、DTCO 设计-工艺协同优化。期待与您交流和合作！",
      en: "Hi! My name is Yikun He, and welcome to my personal homepage. I received my B.Eng. degree in Materials Science and Engineering from the School of Materials Science and Technology, China University of Geosciences (Beijing) in June 2022, where I was advised by Associate Professor Xiaowei Li. I am currently pursuing my Ph.D. degree at the College of Integrated Circuits and Micro-Nano Electronics, Fudan University, under the supervision of Professor Shiyou Chen. My research interests primarily focus on semiconductor device design and computational modeling, first-principles calculations based on density functional theory (DFT), AI-driven multiscale simulation methods, and design-technology co-optimization (DTCO). I am always open to exchanging research ideas and exploring potential collaborations. Please feel free to get in touch!",
    },
    aboutDetail: {
      zh: "目前研究围绕先进节点器件的建模与优化展开，结合 TCAD、第一性原理计算与 DTCO 方法，探索从材料、器件到工艺与电路协同设计的高效仿真路径。",
      en: "My current work combines TCAD, first-principles calculations, and DTCO to develop efficient simulation workflows spanning materials, devices, process technology, and circuit-aware design.",
    },
    focusKeywords: ["Advanced Nodes", "TCAD", "Atomistic", "DTCO"],
    hobbies: [
      { zh: "足球", en: "Football" },
      { zh: "登山", en: "Mountaineering" },
      { zh: "阅读", en: "Reading" },
    ], // 请替换为你的真实爱好，例如阅读、摄影或运动。
  },

  facts: [
    { label: { zh: "学位", en: "Degree" }, value: { zh: "博士研究生", en: "Ph.D. Candidate" } },
    { label: { zh: "所属单位", en: "Affiliation" }, value: { zh: "复旦大学", en: "Fudan University" } },
    { label: { zh: "研究领域", en: "Field" }, value: { zh: "半导体器件与计算仿真", en: "Semiconductor Devices & Computational Simulation" } },
    { label: { zh: "导师", en: "Advisor" }, value: { zh: "陈时友", en: "Shiyou Chen" } },
  ],

  education: [
    {
      period: "2026 — PRESENT",
      major: { zh: "集成电路科学与工程", en: "Integrated Circuit Science and Engineering" },
      degree: { zh: "工学博士（在读）", en: "Ph.D. in Engineering" },
      institution: { zh: "复旦大学", en: "Fudan University" },
      detail: { zh: "集成电路与微纳电子创新学院 · 中国 上海", en: "School of Integrated Circuits and Micro-Nano Electronics Innovation · Shanghai" },
      logo: {
        src: "./assets/fudan-identity-guideline.png",
        className: "fudan",
        alt: { zh: "复旦大学校徽", en: "Fudan University seal" },
      },
    },
    {
      period: "2022 — 2026",
      major: { zh: "材料科学与工程", en: "Materials Science and Engineering" },
      degree: { zh: "工学学士", en: "Bachelor of Engineering" },
      institution: { zh: "中国地质大学（北京）", en: "China University of Geosciences (Beijing)" },
      detail: { zh: "材料科学与工程学院 · 中国 北京", en: "School of Materials Science and Engineering · Beijing, China" },
      logo: {
        src: "./assets/cugb-seal.png",
        className: "cugb",
        alt: { zh: "中国地质大学（北京）校徽", en: "China University of Geosciences Beijing seal" },
      },

    },
    {
      period: "2024 — 2025",
      major: { zh: "高性能无氟醚类锂离子电池电解液", en: "High-performance fluorine-free ether-based lithium-ion battery electrolyte" },
      degree: { zh: "访问学生", en: "Visit students" },
      institution: { zh: "中国科学院物理研究所", en: "Institute of Physics, Chinese Academy of Sciences" },
      detail: { zh: "A01组 · 中国 北京", en: "SGroup A01 · Beijing, China" },
      logo: {
        src: "./assets/iop-cas-seal-transparent.png",
        className: "iop",
        alt: { zh: "中国科学院物理研究所院徽", en: "Institute of Physics, Chinese Academy of Sciences seal" },
      },
    },
  ],

  // 项目经历：按时间从近到远排列。示例字段：
  // { period: "2025 — PRESENT", number: "项目编号", level: { zh: "项目级别", en: "Project level" }, title: { zh: "项目名称", en: "Project Name" }, role: { zh: "负责内容", en: "Role" }, organization: { zh: "所属单位", en: "Organization" }, detail: { zh: "项目简介", en: "Project summary" }, keywords: ["TCAD", "DFT"] }
  projects: [
    { period: "2025 — 2026", number: "202511415033", level: { zh: "国家级", en: "National level" }, title: { zh: "二维矿物铁电材料和新型二维铁电金属的机制研究和理论预测", en: "Mechanism research and theoretical prediction of two-dimensional mineral ferroelectric materials and new two-dimensional ferroelectric metals" }, role: { zh: "项目负责人", en: "Project Manager" }, organization: { zh: "中国地质大学（北京）材料科学与工程学院", en: "College of Materials Science and Engineering, China University of Geosciences (Beijing)" }, keywords: ["Ferroelectricity", "DFT"] },
    { period: "2024 — 2025", number: "S202411415066", level: { zh: "省级", en: "Provincial" }, title: { zh: "共价键调节石墨烯层间距用于碱金属离子电池负极的性能模拟研究", en: "Simulation study on the performance of negative electrodes for alkali metal ion batteries using the modulation of graphene layer spacing by covalent bonds" }, role: { zh: "项目负责人", en: "Project Manager" }, organization: { zh: "中国地质大学（北京）材料科学与工程学院", en: "College of Materials Science and Engineering, China University of Geosciences (Beijing)" }, keywords: ["Lithium-ion battery", "DFT"] },
  ],

  research: [
    {
      code: "DEVICE / 01",
      title: { zh: "半导体先进节点器件", en: "Advanced-node Semiconductor Devices" },
      subtitle: "Advanced-node Devices",
      description: {
        zh: "研究极限尺度下新型器件结构、输运机制与可靠性，关注性能、功耗与可制造性之间的平衡。",
        en: "Novel device architectures, transport mechanisms, and reliability at aggressively scaled nodes, balancing performance, power, and manufacturability.",
      },
      detail: {
        zh: "此处可继续补充具体器件结构、关键物理问题、仿真方法、实验对照与阶段性结果。",
        en: "Add device structures, key physical questions, simulation methods, experimental comparisons, and interim results here.",
      },
      keywords: ["GAA", "Nanosheet", "Transport"],
    },
    {
      code: "MODELING / 02",
      title: { zh: "TCAD 建模与仿真", en: "TCAD Modeling & Simulation" },
      subtitle: "Technology CAD",
      description: {
        zh: "通过物理模型校准、工艺仿真与器件仿真，建立可与实验结果对照的计算研究流程。",
        en: "Physics-model calibration, process simulation, and device simulation in workflows validated against experimental results.",
      },
      detail: {
        zh: "此处可继续补充模型选择、参数校准、工艺流程、边界条件和验证数据。",
        en: "Add model selection, parameter calibration, process flows, boundary conditions, and validation data here.",
      },
      keywords: ["Process", "Device", "Calibration"],
    },
    {
      code: "ATOMISTIC / 03",
      title: { zh: "第一性原理计算", en: "First-principles Simulation" },
      subtitle: "First-principles Simulation",
      description: {
        zh: "从原子尺度理解材料、界面与缺陷的电子结构，并探索与器件级模型的跨尺度衔接。",
        en: "Electronic structures of semiconductor materials, interfaces, and defects, with multiscale links to device-level models.",
      },
      detail: {
        zh: "此处可继续补充材料体系、计算设置、界面或缺陷模型，以及与器件尺度模型的衔接方式。",
        en: "Add material systems, computational settings, interface or defect models, and links to device-scale models here.",
      },
      keywords: ["DFT", "Interface", "Defect"],
    },
    {
      code: "CO-DESIGN / 04",
      title: { zh: "DTCO 设计-工艺协同优化", en: "DTCO & Design-Process Collaborative Optimization" },
      subtitle: "Design–Technology Co-optimization",
      description: {
        zh: "将工艺、器件与电路指标纳入统一框架，用计算方法寻找先进技术节点中的可行优化路径。",
        en: "Joint process, device, and circuit metrics in computational frameworks for viable optimization paths at advanced technology nodes.",
      },
      detail: {
        zh: "此处可继续补充设计变量、约束条件、评价指标、优化算法与候选技术路径。",
        en: "Add design variables, constraints, evaluation metrics, optimization algorithms, and candidate technology paths here.",
      },
      keywords: ["PPA", "Optimization", "Co-design"],
    },
  ],

  publications: [
    {
    title: {
      zh: "Yi K, Li X*, Shi Z, et al. Al3+ doping-induced proton spatial inversion symmetry breaking in two-dimensional vermiculite: Intrinsic polarization and ferroelectric switching[J]. Appl. Phys. Lett. 2025",
      en: "Yi K, Li X*, Shi Z, et al. Al3+ doping-induced proton spatial inversion symmetry breaking in two-dimensional vermiculite: Intrinsic polarization and ferroelectric switching[J]. Appl. Phys. Lett. 2025",
    },
    url: "https://doi.org/10.xxxx/xxxxx",
  },
  {
    title: {
      zh: "Yi K, Li X*, Shi Z, et al. Simulation study on the performance of diamine molecules covalent bond in adjusting the interlayer spacing of graphene and promoting the diffusion of alkali metal ions[J]. Chem. Eng. Sci. 2025",
      en: "Yi K, Li X*, Shi Z, et al. Simulation study on the performance of diamine molecules covalent bond in adjusting the interlayer spacing of graphene and promoting the diffusion of alkali metal ions[J]. Chem. Eng. Sci. 2025",
    },
    url: "https://doi.org/10.xxxx/xxxxx",
  },
  {
    title: {
      zh: "Shi Z, Li X*, Yi K, et al. First-principles Study on Promoting the Performance of Graphene as Anode Materials for Alkali Metal Ion Batteries by Covalent Cross-linking of Rigid Molecules[J]. Phy. Chem. Chem. Phy. 2025",
      en: "Shi Z, Li X*, Yi K, et al. First-principles Study on Promoting the Performance of Graphene as Anode Materials for Alkali Metal Ion Batteries by Covalent Cross-linking of Rigid Molecules[J]. Phy. Chem. Chem. Phy. 2025",
    },
    url: "https://doi.org/10.xxxx/xxxxx",
  },
  {
    title: {
      zh: "Ce, M., Xue, Q., Wang, Y., Yi, K., Liu, X. H.*, & Wu, C.. CuO/CeO2 Nanocomposites With p–n Heterojunction for Photocatalytic CO2 Reduction to CH4[J]. ChemCatChem, 2025, 17(4): e202401485",
      en: "Ce, M., Xue, Q., Wang, Y., Yi, K., Liu, X. H.*, & Wu, C.. CuO/CeO2 Nanocomposites With p–n Heterojunction for Photocatalytic CO2 Reduction to CH4[J]. ChemCatChem, 2025, 17(4): e202401485",
    },
    url: "https://doi.org/10.xxxx/xxxxx",
  },
  ],

  // 获奖情况：按时间从近到远排列。示例字段：
  // { year: "2026", title: { zh: "竞赛名称", en: "Competition Name" }, result: { zh: "一等奖", en: "First Prize" }, issuer: { zh: "颁发单位", en: "Issuer" }, detail: { zh: "补充说明", en: "Details" } }
  awards: [
  {
    year: "2025",
    title: {
      zh: "青创北京2025年“挑战杯”首都大学生课外学术科技作品竞赛北京赛区",
      en: "Qingchuang Beijing 2025 “Challenge Cup” Capital University Students' Extracurricular Academic and Technological Works Competition — Beijing Region",
    },
    result: { zh: "二等奖", en: "Second Prize" },
  },
  {
    year: "2024",
    title: {
      zh: "中国国际大学生创新大赛（2024）北京赛区",
      en: "China International University Students' Innovation Competition 2024 — Beijing Region",
    },
    result: { zh: "二等奖", en: "Second Prize" },
  },
  {
    year: "2024",
    title: {
      zh: "中国国际大学生创新大赛（2024）北京赛区",
      en: "China International University Students' Innovation Competition 2024 — Beijing Region",
    },
    result: { zh: "二等奖", en: "Second Prize" },
  },
  {
    year: "2024",
    title: {
      zh: "第15届北京市大学生化学实验竞赛",
      en: "The 15th Beijing University Students' Chemistry Experiment Competition",
    },
    result: { zh: "一等奖", en: "First Prize" },
  },
  {
    year: "2024",
    title: {
      zh: "第十五届全国大学生数学竞赛（非数A类）",
      en: "The 15th National College Students' Mathematics Competition, Non-Mathematics Category A",
    },
    result: { zh: "三等奖", en: "Third Prize" },
  },
  {
    year: "2024",
    title: {
      zh: "第31届“地光杯”足球赛甲组（2024）",
      en: "The 31st “DiGuang Cup” Football Tournament, Group A",
    },
    result: { zh: "冠军", en: "Champion" },
  },
],

  links: [
    { label: "Google Scholar", url: "" },
    { label: "ORCID", url: "https://orcid.org/0009-0005-2339-2881" },
    { label: "GitHub", url: "https://github.com/XuanYaWangYiKunHe" },
    { label: "ResearchGate", url: "" },
    { label: "CV", url: "" },
  ],
  
  ui: {
    zh: {
      skip: "跳至主要内容", openNav: "打开导航", navAbout: "关于我", navResearch: "研究", navPublications: "成果", navAwards: "获奖", navContact: "联系",
      doctoralResearcher: "博士研究生", contactMe: "与我联系", viewWork: "查看研究成果", handanCampus: "\u90af\u90f8校区", affiliation: "所属单位", locationLabel: "地点",
      profileLabel: "PROFILE / 个人简介", researchStatus: "研究进行中", fudanCampus: "复旦 · 上海", currentFocus: "研究方向", emailLabel: "邮件", hobbiesLabel: "爱好",
      aboutMeTitle: "关于我",
      experienceTitle: "教育与项目经历", profileSummary: "PROFILE / 个人简介", educationTitle: "EDUCATION / 教育背景",
      projectsTitle: "PROJECTS / 项目经历", projectTime: "项目时间", projectNumber: "项目编号", projectLevel: "项目级别", valuePending: "待补充", projectEmpty: "项目经历已预留，可在 site-data.js 的 projects 中填写。",
      researchTitle: "研究方向", researchSubtitle: "从原子尺度物理到器件与设计空间，关注可验证、可迁移的计算方法。",
      publicationsTitle: "代表性成果", publicationsSubtitle: "论文、会议报告与进行中的研究工作。", publicationEmpty: "成果列表已预留。在 site-data.js 中添加论文后，页面会自动生成条目。",
      awardsTitle: "获奖情况", awardsSubtitle: "奖学金、荣誉称号与学术竞赛获奖情况。", awardEmpty: "奖项列表已预留。在 site-data.js 中添加奖项后，页面会自动生成条目。",
      contactTitle: "欢迎讨论", contactText: "对先进器件、计算仿真或潜在的学术合作感兴趣？欢迎通过邮件联系。", backTop: "回到顶部 ↑",
    },
    en: {
      skip: "Skip to content", openNav: "Open navigation", navAbout: "About", navResearch: "Research", navPublications: "Publications", navAwards: "Awards", navContact: "Contact",
      doctoralResearcher: "DOCTORAL RESEARCHER", contactMe: "Contact me", viewWork: "View research", handanCampus: "HANDAN CAMPUS", affiliation: "AFFILIATION", locationLabel: "LOCATION",
      profileLabel: "PROFILE / BIOGRAPHY", researchStatus: "Research in progress", fudanCampus: "FUDAN · SHANGHAI", currentFocus: "RESEARCH FOCUS", emailLabel: "EMAIL", hobbiesLabel: "INTERESTS",
      aboutMeTitle: "About Me",
      experienceTitle: "Education & Projects", profileSummary: "PROFILE / BIOGRAPHY", educationTitle: "EDUCATION / ACADEMIC TRAINING",
      projectsTitle: "PROJECTS / EXPERIENCE", projectTime: "TIME", projectNumber: "NUMBER", projectLevel: "LEVEL", valuePending: "To be added", projectEmpty: "This section is ready. Add entries to projects in site-data.js.",
      researchTitle: "Research", researchSubtitle: "From atomistic physics to devices and design spaces, with an emphasis on verifiable, transferable computational methods.",
      publicationsTitle: "Selected Work", publicationsSubtitle: "Publications, conference presentations, and research in progress.", publicationEmpty: "The publications section is ready. Add entries in site-data.js and they will appear here automatically.",
      awardsTitle: "Awards", awardsSubtitle: "Scholarships, honors, and academic competition awards.", awardEmpty: "The awards section is ready. Add entries in site-data.js and they will appear here automatically.",
      contactTitle: "Let’s discuss", contactText: "Interested in advanced devices, computational simulation, or potential academic collaboration? Feel free to get in touch by email.", backTop: "BACK TO TOP ↑",
    },
  },
};
