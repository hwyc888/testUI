(function () {
  "use strict";

  var students = [
    { id: "BM20261121001", name: "林子涵", gender: "女", phone: "138****2056", school: "漳州市实验中学", major: "计算机应用", source: "学校推荐", date: "2026-11-21", status: "待审核", color: "indigo" },
    { id: "BM20261121002", name: "陈宇轩", gender: "男", phone: "159****3812", school: "龙海区第一中学", major: "电子商务", source: "线上报名", date: "2026-11-21", status: "已录取", color: "mint" },
    { id: "BM20261120018", name: "黄思妍", gender: "女", phone: "136****7490", school: "漳浦县绥安中学", major: "幼儿保育", source: "现场咨询", date: "2026-11-20", status: "待审核", color: "coral" },
    { id: "BM20261120017", name: "吴俊杰", gender: "男", phone: "187****1208", school: "云霄县第二中学", major: "计算机应用", source: "线上报名", date: "2026-11-20", status: "已录取", color: "gold" },
    { id: "BM20261119032", name: "蔡佳怡", gender: "女", phone: "150****6331", school: "漳州市实验中学", major: "会计事务", source: "学校推荐", date: "2026-11-19", status: "已退回", color: "coral" },
    { id: "BM20261119031", name: "郑浩然", gender: "男", phone: "181****9043", school: "平和县第三中学", major: "新能源汽车运用与维修", source: "线上报名", date: "2026-11-19", status: "待审核", color: "indigo" },
    { id: "BM20261118009", name: "许梦琪", gender: "女", phone: "139****2817", school: "南靖县实验中学", major: "电子商务", source: "现场咨询", date: "2026-11-18", status: "已录取", color: "mint" },
    { id: "BM20261117006", name: "周文博", gender: "男", phone: "133****5106", school: "华安县华丰中学", major: "机电技术应用", source: "学校推荐", date: "2026-11-17", status: "待审核", color: "gold" },
    { id: "BM20261116021", name: "杨可欣", gender: "女", phone: "185****7022", school: "漳州市第八中学", major: "幼儿保育", source: "线上报名", date: "2026-11-16", status: "已录取", color: "coral" },
    { id: "BM20261115014", name: "郭子睿", gender: "男", phone: "137****8851", school: "诏安县四都中学", major: "计算机应用", source: "现场咨询", date: "2026-11-15", status: "待审核", color: "indigo" }
  ];

  var majors = [
    { name: "计算机应用", category: "信息技术类", enrolled: 186, plan: 220, percent: 85, icon: "laptop", color: "blue", desc: "软件应用、网络技术与数字技能" },
    { name: "电子商务", category: "财经商贸类", enrolled: 142, plan: 180, percent: 79, icon: "cart", color: "teal", desc: "电商运营、直播营销与客户服务" },
    { name: "幼儿保育", category: "教育类", enrolled: 128, plan: 160, percent: 80, icon: "heart", color: "amber", desc: "幼儿照护、保育与活动组织" },
    { name: "会计事务", category: "财经商贸类", enrolled: 96, plan: 140, percent: 69, icon: "calculator", color: "violet", desc: "财务核算、税务基础与数字财务" },
    { name: "机电技术应用", category: "装备制造类", enrolled: 114, plan: 150, percent: 76, icon: "settings", color: "blue", desc: "机电设备安装、调试与维护" },
    { name: "新能源汽车运用与维修", category: "交通运输类", enrolled: 88, plan: 120, percent: 73, icon: "car", color: "teal", desc: "新能源车辆检测、维护与服务" }
  ];

  var currentPage = "dashboard";
  var currentTablePage = 1;
  var pageSize = 6;
  var pageContent = document.getElementById("pageContent");
  var modalRoot = document.getElementById("modalRoot");
  var toastRoot = document.getElementById("toastRoot");
  var authRoot = document.getElementById("authRoot");
  var studentRoot = document.getElementById("studentRoot");
  var adminShell = document.getElementById("adminShell");
  var currentUser = null;
  var sidebar = document.getElementById("sidebar");
  var mobileBackdrop = document.getElementById("mobileBackdrop");

  var iconPaths = {
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
    users: '<path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20"/><circle cx="9.5" cy="7.5" r="3.5"/><path d="M17 4.2a3.5 3.5 0 0 1 0 6.7M21 20v-1.6a3.4 3.4 0 0 0-2.5-3.3"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h7"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1)"/>',
    life: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.1 1-1.8 1.4-1.8 2.7M12 17h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
    chevron: '<path d="m7 10 5 5 5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    filter: '<path d="M4 5h16M7 12h10m-7 7h4"/>',
    laptop: '<rect x="4" y="4" width="16" height="12" rx="1.5"/><path d="M2 20h20M9 16l-1 4m7-4 1 4"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l2.5 12.5a2 2 0 0 0 2 1.5h9a2 2 0 0 0 2-1.6L21 8H5"/>',
    heart: '<path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2m4 0h2m-8 4h2m4 0h2"/>',
    car: '<path d="m5 11 1.5-5h11L19 11l2 2v5h-2v-2H5v2H3v-5l2-2Z"/><path d="M6 11h12M7 14h.01M17 14h.01"/>',
    edit: '<path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M11 18h2"/>'
  };

  function icon(name, className) {
    return '<svg class="' + (className || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (iconPaths[name] || iconPaths.grid) + '</svg>';
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function pageHeading(title, description, actions) {
    return '<div class="page-heading"><div><div class="eyebrow">ADMISSION MANAGEMENT</div><h1>' + title + '</h1><p>' + description + '</p></div><div class="heading-actions">' + (actions || "") + '</div></div>';
  }

  function seasonChip() {
    return '<div class="season-chip"><span></span>2026 招生季</div>';
  }

  function statCard(label, value, foot, iconName, color, trendClass) {
    return '<article class="stat-card"><div class="stat-top"><span class="stat-label">' + label + '</span><span class="stat-icon ' + color + '">' + icon(iconName) + '</span></div><div class="stat-value">' + value + '</div><div class="stat-foot"><span class="' + (trendClass || "trend-neutral") + '">' + foot + '</span></div></article>';
  }

  function statusTag(status) {
    var cls = status === "已录取" ? "status-approved" : status === "已退回" ? "status-returned" : "status-pending";
    return '<span class="status ' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function studentRows(list, auditMode) {
    if (!list.length) {
      return '<tr><td colspan="7"><div class="empty-state">' + icon("users") + '<div>没有找到符合条件的报名记录</div></div></td></tr>';
    }
    return list.map(function (student) {
      var actions = auditMode
        ? '<button class="text-action" data-action="approve" data-id="' + student.id + '">通过</button><button class="text-action" data-action="reject" data-id="' + student.id + '">退回</button>'
        : '<button class="text-action" data-action="view" data-id="' + student.id + '">查看详情</button>';
      return '<tr>' +
        '<td><div class="student-cell"><span class="student-avatar ' + student.color + '">' + escapeHtml(student.name.slice(0, 1)) + '</span><div class="student-info"><strong>' + escapeHtml(student.name) + '</strong><span>' + escapeHtml(student.gender) + ' · ' + escapeHtml(student.id) + '</span></div></div></td>' +
        '<td>' + escapeHtml(student.school) + '</td><td>' + escapeHtml(student.major) + '</td><td>' + escapeHtml(student.phone) + '</td>' +
        '<td>' + escapeHtml(student.date) + '</td><td>' + statusTag(student.status) + '</td><td><div class="row-actions">' + actions + '</div></td></tr>';
    }).join("");
  }

  function chartMarkup() {
    return '<div class="chart-wrap"><div class="chart-summary"><strong>1,284</strong><span>↗ 12.8%</span><span style="color:#a1aaba;font-weight:500">较上月</span></div>' +
      '<svg class="trend-chart" viewBox="0 0 700 205" role="img" aria-label="近七个月报名趋势图">' +
      '<defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6d8be9" stop-opacity=".22"/><stop offset="100%" stop-color="#6d8be9" stop-opacity="0"/></linearGradient></defs>' +
      '<line class="chart-grid-line" x1="42" y1="24" x2="680" y2="24"/><line class="chart-grid-line" x1="42" y1="68" x2="680" y2="68"/><line class="chart-grid-line" x1="42" y1="112" x2="680" y2="112"/><line class="chart-grid-line" x1="42" y1="156" x2="680" y2="156"/>' +
      '<text class="chart-axis-label" x="5" y="27">300</text><text class="chart-axis-label" x="5" y="71">200</text><text class="chart-axis-label" x="5" y="115">100</text><text class="chart-axis-label" x="13" y="159">0</text>' +
      '<path class="chart-area" d="M45 139 C82 131 103 117 145 121 S206 91 245 100 S307 71 345 83 S410 54 445 67 S510 39 545 52 S615 28 675 34 L675 158 L45 158Z"/>' +
      '<path class="chart-line-secondary" d="M45 148 C83 143 105 136 145 139 S207 120 245 127 S307 104 345 112 S410 91 445 98 S510 81 545 89 S615 71 675 76"/>' +
      '<path class="chart-line" d="M45 139 C82 131 103 117 145 121 S206 91 245 100 S307 71 345 83 S410 54 445 67 S510 39 545 52 S615 28 675 34"/>' +
      '<circle cx="675" cy="34" r="4.5" fill="#fff" stroke="#5576e4" stroke-width="2.5"/>' +
      '<text class="chart-axis-label" x="45" y="185">5月</text><text class="chart-axis-label" x="145" y="185">6月</text><text class="chart-axis-label" x="245" y="185">7月</text><text class="chart-axis-label" x="345" y="185">8月</text><text class="chart-axis-label" x="445" y="185">9月</text><text class="chart-axis-label" x="545" y="185">10月</text><text class="chart-axis-label" x="675" y="185" text-anchor="end">11月</text></svg></div>';
  }

  function progressCard() {
    var items = [
      { name: "计算机应用", count: "186 / 220", percent: 85, color: "" },
      { name: "幼儿保育", count: "128 / 160", percent: 80, color: "teal" },
      { name: "电子商务", count: "142 / 180", percent: 79, color: "amber" },
      { name: "机电技术应用", count: "114 / 150", percent: 76, color: "violet" }
    ];
    return '<section class="card"><div class="card-header"><div class="card-title"><div><h2>专业招生进度</h2><p>各专业计划完成情况</p></div></div><button class="card-action" data-page="majors">全部专业 ' + icon("arrow") + '</button></div><div class="progress-list">' +
      items.map(function (item) {
        return '<div><div class="progress-item-top"><strong>' + item.name + '</strong><span>' + item.percent + '%</span></div><div class="progress-track"><div class="progress-fill ' + item.color + '" style="width:' + item.percent + '%"></div></div><div class="progress-note"><span>已报名</span><span>' + item.count + ' 人</span></div></div>';
      }).join("") + '</div></section>';
  }

  function tableCard(list, options) {
    var opts = options || {};
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / pageSize));
    if (currentTablePage > pages) currentTablePage = pages;
    var start = (currentTablePage - 1) * pageSize;
    var visible = list.slice(start, start + pageSize);
    var headers = '<thead><tr><th>学生信息</th><th>毕业学校</th><th>意向专业</th><th>联系电话</th><th>报名日期</th><th>审核状态</th><th>操作</th></tr></thead>';
    var footer = '<div class="table-footer"><span>显示 ' + (total ? start + 1 : 0) + '–' + Math.min(start + pageSize, total) + ' 条，共 ' + total + ' 条记录</span><div class="pagination">' +
      '<button class="page-btn" data-action="page-prev" ' + (currentTablePage <= 1 ? "disabled" : "") + ' aria-label="上一页">' + icon("chevron") + '</button>' +
      Array.from({ length: pages }, function (_, index) { return '<button class="page-btn ' + (currentTablePage === index + 1 ? "active" : "") + '" data-action="page" data-page-number="' + (index + 1) + '">' + (index + 1) + '</button>'; }).join("") +
      '<button class="page-btn" data-action="page-next" ' + (currentTablePage >= pages ? "disabled" : "") + ' aria-label="下一页">' + icon("chevron") + '</button></div></div>';
    return '<section class="card table-card"><div class="table-toolbar"><div class="table-toolbar-left"><div class="card-title"><div><h2>' + (opts.title || "最新报名记录") + '</h2><p>' + (opts.subtitle || "查看并管理近期提交的报名信息") + '</p></div></div></div><div class="table-toolbar-right">' +
      '<label class="table-search">' + icon("search") + '<input id="tableSearch" type="search" placeholder="搜索姓名、学校或编号..." value="' + escapeHtml(opts.search || "") + '" /></label>' +
      '<select id="statusFilter" class="select-control" aria-label="筛选审核状态"><option value="">全部状态</option><option value="待审核"' + (opts.status === "待审核" ? " selected" : "") + '>待审核</option><option value="已录取"' + (opts.status === "已录取" ? " selected" : "") + '>已录取</option><option value="已退回"' + (opts.status === "已退回" ? " selected" : "") + '>已退回</option></select>' +
      (opts.showExport ? '<button class="btn btn-secondary" data-action="export">' + icon("download") + '导出</button>' : '') +
      '</div></div><div class="table-wrap"><table class="data-table">' + headers + '<tbody id="studentTableBody">' + studentRows(visible, !!opts.auditMode) + '</tbody></table></div>' + footer + '</section>';
  }

  function getFilteredStudents(mode) {
    var search = (document.getElementById("tableSearch") || {}).value || "";
    var status = (document.getElementById("statusFilter") || {}).value || "";
    var query = search.trim().toLowerCase();
    return students.filter(function (student) {
      var matchesMode = mode === "audit" ? student.status === "待审核" : true;
      var matchesStatus = !status || student.status === status;
      var matchesSearch = !query || [student.name, student.school, student.major, student.id, student.phone].join(" ").toLowerCase().indexOf(query) !== -1;
      return matchesMode && matchesStatus && matchesSearch;
    });
  }

  function renderDashboard() {
    var recent = students.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 5);
    return pageHeading("招生工作总览", "早上好，欢迎回来。这里是本年度招生工作的实时概况。", seasonChip() +
      '<button class="btn btn-secondary" data-action="export">' + icon("download") + '导出报表</button>') +
      '<section class="stats-grid">' +
      statCard("累计报名人数", String(students.length), '<span class="trend-neutral">来自学生端真实提交</span>', "users", "blue") +
      statCard("待审核报名", String(students.filter(function (item) { return item.status === "待审核"; }).length), '<span class="trend-neutral">需要及时处理</span>', "clipboard", "amber") +
      statCard("已录取人数", String(students.filter(function (item) { return item.status === "已录取"; }).length), '<span class="trend-neutral">已完成审核录取</span>', "check", "teal") +
      statCard("待处理比例", students.length ? Math.round(students.filter(function (item) { return item.status === "待审核"; }).length / students.length * 100) + "%" : "0%", '<span class="trend-neutral">当前报名审核占比</span>', "chart", "violet") +
      '</section>' +
      '<div class="dashboard-grid"><section class="card"><div class="card-header"><div class="card-title"><div><h2>报名趋势</h2><p>近七个月报名人数变化</p></div></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>今年报名</span><span class="legend-item"><i class="legend-dot secondary"></i>去年同期</span></div></div>' + chartMarkup() + '</section>' + progressCard() + '</div>' +
      tableCard(recent, { title: "最新报名记录", subtitle: "最近提交的学生报名信息", showExport: true }) +
      '<div style="height:16px"></div><div class="content-grid"><section class="card panel"><h2>招生工作提醒</h2><p class="panel-subtitle">建议优先处理以下事项，确保报名流程顺畅。</p><div class="metric-list"><div class="metric-row"><span>待审核报名资料</span><strong>' + students.filter(function (item) { return item.status === "待审核"; }).length + ' 份</strong></div><div class="metric-row"><span>待补充材料</span><strong>' + students.filter(function (item) { return item.status === "已退回"; }).length + ' 份</strong></div><div class="metric-row"><span>本周新增报名</span><strong>218 人</strong></div></div></section><section class="card panel"><h2>快捷操作</h2><p class="panel-subtitle">常用功能快速入口</p><div class="metric-list"><div class="metric-row"><span>待审核报名</span><button class="text-action" data-page="audit">立即处理 →</button></div><div class="metric-row"><span>进入报名审核</span><button class="text-action" data-page="audit">开始审核 →</button></div><div class="metric-row"><span>查看招生统计</span><button class="text-action" data-page="analytics">查看报表 →</button></div></div></section></div>';
  }

  function renderStudents() {
    return pageHeading("学生报名管理", "统一管理学生报名信息，快速查询、筛选和维护报名档案。", '<button class="btn btn-secondary" data-action="export">' + icon("download") + '导出名单</button>') +
      '<div id="studentsTableRegion">' + tableCard(students.slice(), { title: "报名学生名单", subtitle: "所有报名记录均可在此查询和管理", showExport: true }) + '</div>';
  }

  function renderAudit() {
    var pending = students.filter(function (student) { return student.status === "待审核"; });
    return pageHeading("报名审核", "核对学生报名资料，及时完成审核并更新录取状态。", seasonChip() + '<button class="btn btn-secondary" data-action="export">' + icon("download") + '导出待审核名单</button>') +
      '<section class="stats-grid">' +
      statCard("待审核", String(pending.length), "等待管理员处理", "clock", "amber") +
      statCard("今日已通过", "24", '<span class="trend-up">↗ 6</span> 较昨日增加', "check", "teal") +
      statCard("今日已退回", "3", "需联系学生补充资料", "edit", "blue") +
      statCard("平均审核时长", "2.4h", "保持高效审核", "chart", "violet") +
      '</section><div style="height:16px"></div><div id="studentsTableRegion">' + tableCard(pending, { title: "待审核报名", subtitle: "请核对信息后选择通过或退回", auditMode: true, status: "待审核" }) + '</div>';
  }

  function renderMajors() {
    return pageHeading("专业管理", "查看各专业招生计划、报名人数与当前完成进度。", '<button class="btn btn-primary" data-action="major-info">' + icon("plus") + '新增专业</button>') +
      '<section class="stats-grid">' +
      statCard("开设专业", "12", "覆盖多个专业类别", "book", "blue") +
      statCard("招生计划", "1,640", "本年度计划总人数", "clipboard", "amber") +
      statCard("已报名人数", "1,284", '<span class="trend-up">78.4%</span> 计划完成率', "users", "teal") +
      statCard("剩余名额", "356", "可继续接受报名", "chart", "violet") +
      '</section><div class="major-grid">' + majors.map(function (major) {
        return '<article class="major-card"><div class="major-card-top"><span class="major-icon">' + icon(major.icon) + '</span><span class="status status-approved">' + major.category + '</span></div><h3>' + major.name + '</h3><p>' + major.desc + '</p><div class="major-meta"><span>已报名 ' + major.enrolled + ' 人</span><strong>' + major.percent + '%</strong></div><div class="progress-track" style="margin-top:9px"><div class="progress-fill ' + major.color + '" style="width:' + major.percent + '%"></div></div><div class="progress-note"><span>招生计划 ' + major.plan + ' 人</span><span>剩余 ' + (major.plan - major.enrolled) + ' 人</span></div></article>';
      }).join("") + '</div>';
  }

  function renderAnalytics() {
    return pageHeading("数据统计", "从报名趋势、专业分布和审核进度，多维度了解招生情况。", seasonChip() + '<button class="btn btn-secondary" data-action="export">' + icon("download") + '导出数据</button>') +
      '<section class="stats-grid">' +
      statCard("累计报名", "1,284", '<span class="trend-up">+12.8%</span> 同比增长', "users", "blue") +
      statCard("录取转化率", "78.3%", '<span class="trend-up">+4.6%</span> 同比提升', "check", "teal") +
      statCard("平均每日报名", "42", "近30天平均值", "calendar", "amber") +
      statCard("专业计划完成", "78.4%", "总体招生进度", "chart", "violet") +
      '</section><div class="analytics-grid"><section class="card"><div class="card-header"><div class="card-title"><div><h2>报名人数趋势分析</h2><p>按月份统计的报名人数变化</p></div></div></div>' + chartMarkup() + '</section><section class="card panel"><h2>招生数据概览</h2><p class="panel-subtitle">本年度关键指标</p><div class="metric-list"><div class="metric-row"><span>男生报名</span><strong>682 人 · 53.1%</strong></div><div class="metric-row"><span>女生报名</span><strong>602 人 · 46.9%</strong></div><div class="metric-row"><span>线上报名</span><strong>716 人</strong></div><div class="metric-row"><span>学校推荐</span><strong>382 人</strong></div><div class="metric-row"><span>现场咨询</span><strong>186 人</strong></div></div></section></div>';
  }

  function renderSettings() {
    return pageHeading("系统设置", "管理招生工作台的基础信息、通知偏好与账户安全。", '<button class="btn btn-primary" data-action="save-settings">' + icon("check") + '保存设置</button>') +
      '<div class="settings-grid"><section class="card panel"><h2>基础信息</h2><p class="panel-subtitle">设置招生系统的基本展示信息</p><div class="form-field"><label>系统名称</label><input value="校园招生管理系统" /></div><div style="height:13px"></div><div class="form-field"><label>招生年度</label><select><option>2026 年</option><option>2027 年</option></select></div><div style="height:13px"></div><div class="form-field"><label>管理单位</label><input value="学校招生办公室" /></div></section><section class="card panel"><h2>通知与提醒</h2><p class="panel-subtitle">选择希望接收的工作提醒</p><div class="setting-row"><div><strong>新报名提醒</strong><span>有学生提交报名时通知管理员</span></div><button class="switch on" data-action="switch" aria-label="切换新报名提醒"></button></div><div class="setting-row"><div><strong>待审核提醒</strong><span>待审核记录超过 24 小时提醒</span></div><button class="switch on" data-action="switch" aria-label="切换待审核提醒"></button></div><div class="setting-row"><div><strong>每周数据简报</strong><span>每周汇总招生数据与变化趋势</span></div><button class="switch" data-action="switch" aria-label="切换每周数据简报"></button></div></section><section class="card panel"><h2>账户安全</h2><p class="panel-subtitle">保护管理端账户与数据安全</p><div class="setting-row"><div><strong>登录账户</strong><span>' + escapeHtml(currentUser ? currentUser.username : "") + '</span></div><button class="text-action" data-action="account">账户信息</button></div><div class="setting-row"><div><strong>登录密码</strong><span>定期更新密码以保障账户安全</span></div><button class="text-action" data-action="password">修改密码</button></div></section><section class="card panel"><h2>系统运行信息</h2><p class="panel-subtitle">当前线上系统配置</p><div class="metric-list"><div class="metric-row"><span>系统版本</span><strong>1.1.0</strong></div><div class="metric-row"><span>前端运行模式</span><strong>Cloudflare Pages Functions</strong></div><div class="metric-row"><span>数据存储</span><strong>Cloudflare D1 数据库</strong></div></div></section></div>';
  }

  function renderPage(page) {
    currentPage = page;
    currentTablePage = 1;
    var pageNames = { dashboard: "数据总览", students: "学生报名", audit: "报名审核", majors: "专业管理", analytics: "数据统计", settings: "系统设置" };
    document.getElementById("breadcrumbCurrent").textContent = pageNames[page] || "数据总览";
    document.querySelectorAll(".nav-item[data-page]").forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("data-page") === page);
    });
    if (page === "dashboard") pageContent.innerHTML = renderDashboard();
    else if (page === "students") pageContent.innerHTML = renderStudents();
    else if (page === "audit") pageContent.innerHTML = renderAudit();
    else if (page === "majors") pageContent.innerHTML = renderMajors();
    else if (page === "analytics") pageContent.innerHTML = renderAnalytics();
    else pageContent.innerHTML = renderSettings();
    var pendingCount = students.filter(function (student) { return student.status === "待审核"; }).length;
    var countNode = document.querySelector('.nav-item[data-page="students"] .nav-count');
    if (countNode) countNode.textContent = students.length;
    var dot = document.querySelector('.nav-item[data-page="audit"] .nav-dot');
    if (dot) dot.style.display = pendingCount ? "block" : "none";
    closeSidebar();
  }

  function refreshTable() {
    var region = document.getElementById("studentsTableRegion");
    if (!region) return;
    var mode = currentPage === "audit" ? "audit" : "all";
    var filtered = getFilteredStudents(mode);
    var body = document.getElementById("studentTableBody");
    if (!body) return;
    var pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentTablePage > pages) currentTablePage = pages;
    var start = (currentTablePage - 1) * pageSize;
    body.innerHTML = studentRows(filtered.slice(start, start + pageSize), mode === "audit");
    var footerText = region.querySelector(".table-footer > span");
    if (footerText) footerText.textContent = "显示 " + (filtered.length ? start + 1 : 0) + "–" + Math.min(start + pageSize, filtered.length) + " 条，共 " + filtered.length + " 条记录";
    var pagination = region.querySelector(".pagination");
    if (pagination) {
      pagination.innerHTML = '<button class="page-btn" data-action="page-prev" ' + (currentTablePage <= 1 ? "disabled" : "") + ' aria-label="上一页">' + icon("chevron") + '</button>' +
        Array.from({ length: pages }, function (_, index) { return '<button class="page-btn ' + (currentTablePage === index + 1 ? "active" : "") + '" data-action="page" data-page-number="' + (index + 1) + '">' + (index + 1) + '</button>'; }).join("") +
        '<button class="page-btn" data-action="page-next" ' + (currentTablePage >= pages ? "disabled" : "") + ' aria-label="下一页">' + icon("chevron") + '</button>';
    }
  }

  function openModal(title, subtitle, body, onReady) {
    modalRoot.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><div><h2 id="modalTitle">' + title + '</h2><p>' + subtitle + '</p></div><button class="icon-button" data-close-modal aria-label="关闭">' + icon("x") + '</button></div>' + body + '</div>';
    modalRoot.onclick = function (event) {
      if (event.target === modalRoot || event.target.closest("[data-close-modal]")) closeModal();
    };
    if (onReady) onReady();
  }

  function closeModal() {
    modalRoot.innerHTML = "";
    modalRoot.onclick = null;
  }

  function openNewStudentModal() {
    var body = '<form id="newStudentForm"><div class="modal-body"><div class="form-grid">' +
      '<div class="form-field"><label for="studentName">学生姓名 *</label><input id="studentName" name="name" required maxlength="20" placeholder="请输入学生姓名" /></div>' +
      '<div class="form-field"><label for="studentGender">性别</label><select id="studentGender" name="gender"><option>女</option><option>男</option></select></div>' +
      '<div class="form-field"><label for="studentPhone">联系电话 *</label><input id="studentPhone" name="phone" required inputmode="tel" pattern="[0-9]{11}" maxlength="11" placeholder="请输入 11 位手机号" /></div>' +
      '<div class="form-field"><label for="studentSchool">毕业学校 *</label><input id="studentSchool" name="school" required placeholder="请输入毕业学校" /></div>' +
      '<div class="form-field"><label for="studentMajor">意向专业 *</label><select id="studentMajor" name="major">' + majors.map(function (major) { return '<option>' + major.name + '</option>'; }).join("") + '</select></div>' +
      '<div class="form-field"><label for="studentSource">报名来源</label><select id="studentSource" name="source"><option>线上报名</option><option>学校推荐</option><option>现场咨询</option></select></div>' +
      '<div class="form-field full"><label for="studentNote">备注信息</label><textarea id="studentNote" name="note" placeholder="可填写补充说明（选填）"></textarea></div>' +
      '</div></div><div class="modal-actions"><button type="button" class="btn btn-secondary" data-close-modal>取消</button><button type="submit" class="btn btn-primary">' + icon("check") + '提交报名</button></div></form>';
    openModal("新增学生报名", "填写学生基础资料，提交后将进入待审核列表。", body, function () {
      var form = document.getElementById("newStudentForm");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        var name = String(data.get("name") || "").trim();
        var phone = String(data.get("phone") || "").trim();
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          showToast("请输入有效的 11 位手机号码");
          return;
        }
        var now = new Date();
        var date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
        students.unshift({
          id: "BM" + date.replace(/-/g, "") + String(Date.now()).slice(-5),
          name: name,
          gender: String(data.get("gender")),
          phone: phone.slice(0, 3) + "****" + phone.slice(-4),
          school: String(data.get("school")).trim(),
          major: String(data.get("major")),
          source: String(data.get("source")),
          date: date,
          status: "待审核",
          color: ["indigo", "mint", "coral", "gold"][students.length % 4]
        });
        closeModal();
        renderPage(currentPage === "dashboard" ? "dashboard" : "students");
        showToast("报名信息已添加，等待审核");
      });
    });
    setTimeout(function () { var field = document.getElementById("studentName"); if (field) field.focus(); }, 0);
  }

  function openStudentDetail(id) {
    var student = students.find(function (item) { return item.id === id; });
    if (!student) return;
    var items = [
      ["报名编号", student.id], ["学生姓名", student.name], ["性别", student.gender],
      ["联系电话", student.phone], ["毕业学校", student.school], ["意向专业", student.major],
      ["报名来源", student.source], ["报名日期", student.date], ["审核状态", student.status]
    ];
    var body = '<div class="modal-body"><div class="detail-list">' + items.map(function (item) {
      return '<div class="detail-item"><span>' + item[0] + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join("") + '</div></div><div class="modal-actions"><button class="btn btn-secondary" data-close-modal>关闭</button>' +
      (student.status === "待审核" ? '<button class="btn btn-primary" data-action="approve" data-id="' + student.id + '">' + icon("check") + '审核通过</button>' : '') + '</div>';
    openModal("学生报名详情", "此记录由学生端提交，审核结果将同步反馈给学生。", body);
  }

  async function updateStudentStatus(id, status, adminNote) {
    var student = students.find(function (item) { return item.id === id; });
    if (!student) return;
    try {
      await apiRequest("/api/applications/" + encodeURIComponent(id), {
        method: "PATCH",
        body: JSON.stringify({ status: status, admin_note: adminNote || "" })
      });
      closeModal();
      await loadAdminApplications();
      renderPage(currentPage);
      showToast(student.name + " 的报名状态已更新为“" + status + "”");
    } catch (error) {
      showToast(error.message);
    }
  }

  function openRejectModal(id) {
    var student = students.find(function (item) { return item.id === id; });
    if (!student) return;
    var body = '<form id="rejectApplicationForm"><div class="modal-body"><div class="form-field"><label for="rejectNote">退回原因 / 补充材料说明</label><textarea id="rejectNote" name="admin_note" maxlength="300" required placeholder="请清楚说明需要学生补充或修改的内容"></textarea></div></div><div class="modal-actions"><button type="button" class="btn btn-secondary" data-close-modal>取消</button><button type="submit" class="btn btn-primary">确认退回</button></div></form>';
    openModal("退回报名资料", "请填写退回原因，学生登录后可以查看并重新提交。", body, function () {
      document.getElementById("rejectApplicationForm").addEventListener("submit", function (event) {
        event.preventDefault();
        var note = document.getElementById("rejectNote").value.trim();
        if (!note) { showToast("请填写退回原因"); return; }
        updateStudentStatus(id, "已退回", note);
      });
    });
  }

  function exportCSV() {
    var rows = [["报名编号", "学生姓名", "性别", "联系电话", "毕业学校", "意向专业", "报名来源", "报名日期", "审核状态"]];
    students.forEach(function (student) {
      rows.push([student.id, student.name, student.gender, student.phone, student.school, student.major, student.source, student.date, student.status]);
    });
    var csv = "\uFEFF" + rows.map(function (row) {
      return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "学生报名名单.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("报名名单已导出为 CSV 文件");
  }

  function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = '<span class="toast-mark">' + icon("check") + '</span><span>' + escapeHtml(message) + '</span>';
    toastRoot.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 2800);
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    mobileBackdrop.classList.remove("show");
  }

  function toggleSidebar() {
    sidebar.classList.toggle("open");
    mobileBackdrop.classList.toggle("show");
  }


  async function apiRequest(path, options) {
    var opts = options || {};
    var headers = Object.assign({}, opts.headers || {});
    if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
    var response = await fetch(path, Object.assign({}, opts, {
      credentials: "same-origin",
      headers: headers
    }));
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.error || "请求失败，请稍后重试");
    return data;
  }

  function maskPhone(phone) {
    var value = String(phone || "");
    return /^1[3-9]\d{9}$/.test(value) ? value.slice(0, 3) + "****" + value.slice(-4) : value;
  }

  async function initializeApp() {
    authRoot.hidden = true;
    studentRoot.hidden = true;
    adminShell.hidden = true;
    try {
      var session = await apiRequest("/api/auth/me");
      await enterApp(session.user);
      return;
    } catch (error) {
      // An absent session is expected before login.
    }
    try {
      var setup = await apiRequest("/api/auth/setup");
      renderAuthScreen(setup.initialized ? "login" : "setup", "admin");
    } catch (error) {
      renderAuthScreen("login", "admin", "登录服务暂时不可用，请刷新页面后重试");
    }
  }

  function renderAuthScreen(mode, role, initialError) {
    var activeRole = role || "admin";
    authRoot.hidden = false;
    studentRoot.hidden = true;
    adminShell.hidden = true;

    var heading = mode === "setup" ? "初始化管理员账号" : mode === "register" ? "创建学生账号" : "欢迎登录";
    var description = mode === "setup"
      ? "首次使用请先创建学校招生管理员账号。初始化仅允许完成一次。"
      : mode === "register"
        ? "注册学生账号后，即可在线填写报名资料并查询审核进度。"
        : "登录校园招生管理平台，继续处理招生工作。";

    var fields = "";
    if (mode === "setup") {
      fields = '<div class="auth-field"><label for="setupKey">一次性初始化密钥</label><input id="setupKey" name="setup_key" type="password" autocomplete="off" required placeholder="请输入系统初始化密钥" /></div>' +
        '<div class="auth-field"><label for="authName">管理员姓名</label><input id="authName" name="full_name" required maxlength="30" placeholder="请输入管理员姓名" /></div>' +
        '<div class="auth-field"><label for="authUsername">管理员账号</label><input id="authUsername" name="username" required minlength="3" maxlength="32" pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,31}" autocomplete="username" placeholder="例如：admin" /></div>' +
        '<div class="auth-field"><label for="authPassword">设置登录密码</label><input id="authPassword" name="password" type="password" required minlength="12" maxlength="128" autocomplete="new-password" placeholder="至少 12 位，建议字母、数字和符号组合" /></div>' +
        '<div class="auth-field"><label for="authConfirm">确认登录密码</label><input id="authConfirm" name="confirm_password" type="password" required minlength="12" maxlength="128" autocomplete="new-password" placeholder="请再次输入密码" /></div>';
    } else if (mode === "register") {
      fields = '<div class="auth-field"><label for="authName">学生姓名</label><input id="authName" name="full_name" required maxlength="30" autocomplete="name" placeholder="请输入学生姓名" /></div>' +
        '<div class="auth-field"><label for="authPhone">手机号码（登录账号）</label><input id="authPhone" name="phone" required inputmode="tel" pattern="1[3-9][0-9]{9}" maxlength="11" autocomplete="tel" placeholder="请输入本人手机号" /></div>' +
        '<div class="auth-field"><label for="authPassword">设置密码</label><input id="authPassword" name="password" type="password" required minlength="8" maxlength="128" autocomplete="new-password" placeholder="至少 8 位" /></div>' +
        '<div class="auth-field"><label for="authConfirm">确认密码</label><input id="authConfirm" name="confirm_password" type="password" required minlength="8" maxlength="128" autocomplete="new-password" placeholder="请再次输入密码" /></div>';
    } else {
      fields = '<div class="auth-field"><label for="authUsername">' + (activeRole === "admin" ? "管理员账号" : "手机号码") + '</label><input id="authUsername" name="username" required autocomplete="username" ' +
        (activeRole === "student" ? 'inputmode="tel" maxlength="11" placeholder="请输入注册时使用的手机号"' : 'placeholder="请输入管理员账号"') + ' /></div>' +
        '<div class="auth-field"><label for="authPassword">登录密码</label><input id="authPassword" name="password" type="password" required maxlength="128" autocomplete="current-password" placeholder="请输入登录密码" /></div>';
    }

    authRoot.innerHTML = '<div class="auth-page">' +
      '<section class="auth-showcase"><div class="auth-brand"><div class="brand-mark">' +
      '<svg viewBox="0 0 40 40" fill="none"><path d="M5 13.5 20 6l15 7.5L20 21 5 13.5Z" fill="currentColor"/><path d="M11 17v8.2c0 2.4 4 4.8 9 4.8s9-2.4 9-4.8V17l-9 4.5L11 17Z" fill="currentColor" opacity=".72"/></svg>' +
      '</div><div><strong>校园招生管理系统</strong><span>ADMISSION PORTAL</span></div></div>' +
      '<div class="auth-showcase-copy"><div class="eyebrow">SMART CAMPUS · ADMISSION</div><h1>让每一次报名<br>都清晰、有序、可追踪</h1><p>连接学生与学校招生办公室，在线完成报名资料提交、进度查询与审核管理，让招生服务更简单。</p></div>' +
      '<div class="auth-feature-list"><div class="auth-feature"><strong>在线自主报名</strong><span>学生随时填写报名资料</span></div><div class="auth-feature"><strong>审核进度可查</strong><span>报名状态实时查看</span></div><div class="auth-feature"><strong>统一招生管理</strong><span>后台集中处理报名信息</span></div></div>' +
      '<div class="auth-copyright">© 2026 校园招生管理系统 · 安全连接 · 高效服务</div></section>' +
      '<section class="auth-panel"><div class="auth-card"><div class="auth-card-heading"><div class="eyebrow">WELCOME TO ADMISSION PORTAL</div><h2>' + heading + '</h2><p>' + description + '</p></div>' +
      (mode === "login" ? '<div class="auth-tabs"><button class="auth-tab ' + (activeRole === "admin" ? "active" : "") + '" type="button" data-auth-role="admin">管理员登录</button><button class="auth-tab ' + (activeRole === "student" ? "active" : "") + '" type="button" data-auth-role="student">学生登录</button></div>' : '') +
      (mode === "setup" ? '<div class="setup-notice">首次初始化管理员后，其他用户不能再通过此入口创建管理员账号。请妥善保管管理员密码。</div><div style="height:14px"></div>' : '') +
      '<div id="authError" class="auth-error ' + (initialError ? "show" : "") + '">' + escapeHtml(initialError || "") + '</div>' +
      '<form id="authForm" class="auth-form">' + fields +
      '<button type="submit" class="btn btn-primary auth-submit">' + (mode === "setup" ? "创建管理员并进入系统" : mode === "register" ? "注册并进入学生端" : "登录系统") + '</button></form>' +
      '<div class="auth-footer-row">' +
      (mode === "login" ? (activeRole === "student" ? '<span>还没有学生账号？</span><button type="button" class="auth-inline-link" data-auth-mode="register">立即注册</button>' : '<span>学生请使用学生端入口</span><button type="button" class="auth-inline-link" data-auth-role="student">学生登录 →</button>') :
        mode === "register" ? '<span>已经注册过账号？</span><button type="button" class="auth-inline-link" data-auth-mode="login">返回登录</button>' :
        '<span>初始化完成后使用管理员账号登录</span><span>一次性操作</span>') +
      '</div></div></section></div>';

    authRoot.querySelectorAll("[data-auth-role]").forEach(function (button) {
      button.addEventListener("click", function () { renderAuthScreen("login", button.getAttribute("data-auth-role")); });
    });
    authRoot.querySelectorAll("[data-auth-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextMode = button.getAttribute("data-auth-mode");
        renderAuthScreen(nextMode, nextMode === "register" ? "student" : "student");
      });
    });

    var form = document.getElementById("authForm");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var submit = form.querySelector('button[type="submit"]');
      var errorNode = document.getElementById("authError");
      errorNode.classList.remove("show");
      submit.disabled = true;
      submit.textContent = "正在处理...";
      var data = new FormData(form);
      try {
        var result;
        if (mode === "setup") {
          var password = String(data.get("password") || "");
          if (password !== String(data.get("confirm_password") || "")) throw new Error("两次输入的密码不一致");
          result = await apiRequest("/api/auth/setup", {
            method: "POST",
            headers: { "X-Setup-Key": String(data.get("setup_key") || "") },
            body: JSON.stringify({
              username: data.get("username"),
              full_name: data.get("full_name"),
              password: password
            })
          });
        } else if (mode === "register") {
          var registerPassword = String(data.get("password") || "");
          if (registerPassword !== String(data.get("confirm_password") || "")) throw new Error("两次输入的密码不一致");
          result = await apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
              full_name: data.get("full_name"),
              phone: data.get("phone"),
              password: registerPassword
            })
          });
        } else {
          result = await apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              username: data.get("username"),
              password: data.get("password"),
              role: activeRole
            })
          });
        }
        await enterApp(result.user);
      } catch (error) {
        errorNode.textContent = error.message || "操作失败，请重试";
        errorNode.classList.add("show");
        submit.disabled = false;
        submit.textContent = mode === "setup" ? "创建管理员并进入系统" : mode === "register" ? "注册并进入学生端" : "登录系统";
      }
    });
  }

  async function enterApp(user) {
    currentUser = user;
    authRoot.hidden = true;
    modalRoot.innerHTML = "";
    if (user.role === "student") {
      adminShell.hidden = true;
      await loadStudentPortal(user);
      return;
    }
    studentRoot.hidden = true;
    adminShell.hidden = false;
    var topName = document.querySelector(".top-user strong");
    if (topName) topName.textContent = user.full_name || "招生管理员";
    await loadAdminApplications();
    renderPage("dashboard");
  }

  async function loadAdminApplications() {
    try {
      var result = await apiRequest("/api/applications");
      students = (result.applications || []).map(function (row, index) {
        return {
          id: row.id,
          name: row.student_name,
          gender: row.gender,
          phone: maskPhone(row.phone),
          school: row.school,
          major: row.major,
          source: row.source,
          date: String(row.created_at || "").slice(0, 10),
          status: row.status,
          adminNote: row.admin_note || "",
          color: ["indigo", "mint", "coral", "gold"][index % 4]
        };
      });
    } catch (error) {
      students = [];
      showToast("报名数据加载失败：" + error.message);
    }
  }

  function studentProgress(status) {
    var submitted = !!status;
    var reviewed = status === "已录取" || status === "已退回";
    return '<div class="student-progress"><span class="student-progress-step ' + (submitted ? "done" : "") + '">资料已提交</span><i class="student-progress-line"></i><span class="student-progress-step ' + (reviewed ? "done" : "") + '">学校审核</span><i class="student-progress-line"></i><span class="student-progress-step ' + (status === "已录取" ? "done" : "") + '">录取结果</span></div>';
  }

  async function loadStudentPortal(user) {
    studentRoot.hidden = false;
    adminShell.hidden = true;
    var result;
    try {
      result = await apiRequest("/api/applications");
      renderStudentPortal(user, result.application || null);
    } catch (error) {
      studentRoot.innerHTML = '<div class="student-page"><div class="student-content"><div class="card panel"><h2>学生端暂时无法加载</h2><p class="panel-subtitle">' + escapeHtml(error.message) + '</p><button class="btn btn-secondary" data-student-action="logout">退出登录</button></div></div></div>';
    }
  }

  function renderStudentPortal(user, application) {
    var status = application ? application.status : "";
    var statusTitle = status === "已录取" ? "报名审核已通过" : status === "已退回" ? "报名资料需要补充" : status === "待审核" ? "报名资料已提交，等待学校审核" : "欢迎进入学生报名中心";
    var statusDescription = status === "已录取" ? "学校已完成审核，请留意后续录取通知。" :
      status === "已退回" ? (application.admin_note ? "审核意见：" + escapeHtml(application.admin_note) : "请根据学校反馈补充或修改报名资料后重新提交。") :
      status === "待审核" ? "招生办公室正在核对报名资料，请耐心等待。" :
      "目前还没有报名记录，请填写下方信息完成自主报名。";
    var statusColor = status === "已录取" ? "teal" : status === "已退回" ? "amber" : "blue";
    var statusIcon = status === "已录取" ? "check" : status === "已退回" ? "edit" : status === "待审核" ? "clock" : "clipboard";
    var statusLabel = status || "尚未报名";
    var applicationSummary = application ? '<section class="student-card"><div class="student-card-heading"><div><h2>我的报名记录</h2><p>以下为你提交的报名资料与当前审核状态</p></div>' + statusTag(status) + '</div><div class="student-info-grid">' +
      '<div class="student-info-item"><span>学生姓名</span><strong>' + escapeHtml(application.student_name) + '</strong></div>' +
      '<div class="student-info-item"><span>性别</span><strong>' + escapeHtml(application.gender) + '</strong></div>' +
      '<div class="student-info-item"><span>联系电话</span><strong>' + escapeHtml(maskPhone(application.phone)) + '</strong></div>' +
      '<div class="student-info-item"><span>毕业学校</span><strong>' + escapeHtml(application.school) + '</strong></div>' +
      '<div class="student-info-item"><span>意向专业</span><strong>' + escapeHtml(application.major) + '</strong></div>' +
      '<div class="student-info-item"><span>提交日期</span><strong>' + escapeHtml(String(application.created_at || "").slice(0, 10)) + '</strong></div>' +
      '</div>' + studentProgress(status) + '</section>' :
      '<section class="student-card"><div class="student-empty">' + icon("clipboard") + '<div>你还没有提交报名资料</div><span>填写下方表单后，招生办公室即可收到你的报名信息。</span></div></section>';

    var applicationForm = status === "已录取" ? '<section class="student-card"><div class="student-note">你的报名已完成录取审核，资料暂不可自行修改。如需更正，请联系学校招生办公室。</div></section>' :
      '<section class="student-card"><div class="student-card-heading"><div><h2>' + (application ? "修改 / 重新提交报名资料" : "填写报名资料") + '</h2><p>请认真核对信息，提交后学校招生办公室将进行审核。</p></div></div>' +
      '<form id="studentApplicationForm"><div class="student-form-grid">' +
      '<div class="student-form-field"><label for="applyName">学生姓名 *</label><input id="applyName" name="student_name" required maxlength="30" value="' + escapeHtml(application ? application.student_name : user.full_name) + '" placeholder="请输入学生姓名" /></div>' +
      '<div class="student-form-field"><label for="applyGender">性别 *</label><select id="applyGender" name="gender" required><option value="">请选择</option><option value="男"' + (application && application.gender === "男" ? " selected" : "") + '>男</option><option value="女"' + (application && application.gender === "女" ? " selected" : "") + '>女</option></select></div>' +
      '<div class="student-form-field"><label for="applyPhone">联系电话 *</label><input id="applyPhone" name="phone" required inputmode="tel" pattern="1[3-9][0-9]{9}" maxlength="11" value="' + escapeHtml(application ? application.phone : user.username) + '" placeholder="请输入 11 位手机号" /></div>' +
      '<div class="student-form-field"><label for="applySchool">毕业学校 *</label><input id="applySchool" name="school" required maxlength="100" value="' + escapeHtml(application ? application.school : "") + '" placeholder="请输入毕业学校名称" /></div>' +
      '<div class="student-form-field full"><label for="applyMajor">意向专业 *</label><select id="applyMajor" name="major" required><option value="">请选择意向专业</option>' +
      majors.map(function (major) { return '<option value="' + escapeHtml(major.name) + '"' + (application && application.major === major.name ? " selected" : "") + '>' + escapeHtml(major.name) + '</option>'; }).join("") +
      '</select></div></div><div class="student-form-actions"><button type="submit" class="btn btn-primary">' + icon("check") + (application ? "保存并重新提交" : "提交报名资料") + '</button></div></form></section>';

    studentRoot.innerHTML = '<div class="student-page"><header class="student-topbar"><div class="student-topbar-brand"><div class="brand-mark">' +
      '<svg viewBox="0 0 40 40" fill="none"><path d="M5 13.5 20 6l15 7.5L20 21 5 13.5Z" fill="currentColor"/><path d="M11 17v8.2c0 2.4 4 4.8 9 4.8s9-2.4 9-4.8V17l-9 4.5L11 17Z" fill="currentColor" opacity=".72"/></svg>' +
      '</div><div><strong>学生报名服务中心</strong><span>STUDENT ADMISSION PORTAL</span></div></div><div class="student-topbar-actions"><div class="student-user-chip"><span class="avatar avatar-indigo">' + escapeHtml(String(user.full_name || "学").slice(0, 1)) + '</span>' + escapeHtml(user.full_name) + '</div><button class="btn btn-secondary" data-student-action="password">修改密码</button><button class="btn btn-secondary" data-student-action="logout">退出登录</button></div></header>' +
      '<main class="student-content"><div class="student-welcome"><div><div class="eyebrow">STUDENT CENTER</div><h1>你好，' + escapeHtml(user.full_name) + '</h1><p>欢迎使用学生报名服务中心，你可以在这里提交报名资料并跟踪审核进度。</p></div><div class="season-chip"><span></span>2026 招生季</div></div>' +
      '<section class="student-status-card"><div class="student-status-icon">' + icon(statusIcon) + '</div><div class="student-status-copy"><strong>' + statusTitle + '</strong><span>' + statusDescription + '</span></div><div class="student-status-side"><strong>' + statusLabel + '</strong><span>当前报名状态</span></div></section>' +
      applicationSummary + applicationForm + '<div class="student-note">温馨提示：请确保联系电话准确有效。报名资料仅用于学校招生审核，请勿在公共设备上保存账号密码。</div></main></div>';

    studentRoot.onclick = function (event) {
      var action = event.target.closest("[data-student-action]");
      if (!action) return;
      var type = action.getAttribute("data-student-action");
      if (type === "logout") logout();
      if (type === "password") openChangePasswordModal();
    };
    var form = document.getElementById("studentApplicationForm");
    if (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        submit.textContent = "正在提交...";
        var data = new FormData(form);
        try {
          var response = await apiRequest("/api/applications", {
            method: "POST",
            body: JSON.stringify({
              student_name: data.get("student_name"),
              gender: data.get("gender"),
              phone: data.get("phone"),
              school: data.get("school"),
              major: data.get("major")
            })
          });
          showToast(response.message || "报名资料已提交");
          await loadStudentPortal(user);
        } catch (error) {
          showToast(error.message);
          submit.disabled = false;
          submit.innerHTML = icon("check") + (application ? "保存并重新提交" : "提交报名资料");
        }
      });
    }
  }

  async function openChangePasswordModal() {
    var body = '<form id="changePasswordForm"><div class="modal-body"><div class="form-grid">' +
      '<div class="form-field full"><label for="oldPassword">当前密码</label><input id="oldPassword" name="old_password" type="password" required autocomplete="current-password" /></div>' +
      '<div class="form-field full"><label for="newPassword">新密码</label><input id="newPassword" name="new_password" type="password" required minlength="8" maxlength="128" autocomplete="new-password" placeholder="至少 8 位" /></div>' +
      '<div class="form-field full"><label for="confirmNewPassword">确认新密码</label><input id="confirmNewPassword" type="password" required minlength="8" maxlength="128" autocomplete="new-password" /></div>' +
      '</div></div><div class="modal-actions"><button type="button" class="btn btn-secondary" data-close-modal>取消</button><button type="submit" class="btn btn-primary">更新密码</button></div></form>';
    openModal("修改登录密码", "修改后当前账号的其他登录会话将失效。", body, function () {
      document.getElementById("changePasswordForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        var form = event.currentTarget;
        var data = new FormData(form);
        var newPassword = String(data.get("new_password") || "");
        if (newPassword !== document.getElementById("confirmNewPassword").value) {
          showToast("两次输入的新密码不一致");
          return;
        }
        try {
          await apiRequest("/api/auth/change-password", {
            method: "POST",
            body: JSON.stringify({ old_password: data.get("old_password"), new_password: newPassword })
          });
          closeModal();
          showToast("密码已更新");
        } catch (error) {
          showToast(error.message);
        }
      });
    });
  }

  async function logout() {
    try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch (error) { /* Clear local view even if the session expired. */ }
    currentUser = null;
    students = [];
    modalRoot.innerHTML = "";
    renderAuthScreen("login", "admin");
  }

  document.querySelectorAll("[data-icon]").forEach(function (node) {
    node.innerHTML = icon(node.getAttribute("data-icon"));
  });

  document.addEventListener("click", function (event) {
    var nav = event.target.closest("[data-page]");
    if (nav) {
      event.preventDefault();
      renderPage(nav.getAttribute("data-page"));
      return;
    }
    var action = event.target.closest("[data-action]");
    if (!action) return;
    var type = action.getAttribute("data-action");
    var id = action.getAttribute("data-id");
    if (type === "new") openNewStudentModal();
    else if (type === "export") exportCSV();
    else if (type === "view") openStudentDetail(id);
    else if (type === "approve") updateStudentStatus(id, "已录取");
    else if (type === "reject") openRejectModal(id);
    else if (type === "menu") toggleSidebar();
    else if (type === "notifications") showToast("当前没有新的系统通知");
    else if (type === "help") showToast("使用指南：从学生报名开始，按流程完成资料审核");
    else if (type === "profile") showToast("当前登录身份：招生管理员");
    else if (type === "page") { currentTablePage = Number(action.getAttribute("data-page-number")) || 1; refreshTable(); }
    else if (type === "page-prev") { currentTablePage = Math.max(1, currentTablePage - 1); refreshTable(); }
    else if (type === "page-next") { currentTablePage += 1; refreshTable(); }
    else if (type === "switch") { action.classList.toggle("on"); }
    else if (type === "save-settings") showToast("设置已保存（演示状态）");
    else if (type === "major-info") showToast("专业维护功能将在接入后台后开放");
    else if (type === "account") showToast("账户信息由学校系统管理员维护");
    else if (type === "password") openChangePasswordModal();
    else if (type === "logout") logout();
  });

  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "tableSearch") {
      currentTablePage = 1;
      refreshTable();
    }
    if (event.target && event.target.id === "globalSearch") {
      var query = event.target.value.trim();
      if (query && currentPage !== "students") {
        renderPage("students");
        var field = document.getElementById("tableSearch");
        if (field) { field.value = query; refreshTable(); }
      } else if (currentPage === "students") {
        var tableField = document.getElementById("tableSearch");
        if (tableField) { tableField.value = query; currentTablePage = 1; refreshTable(); }
      }
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "statusFilter") {
      currentTablePage = 1;
      refreshTable();
    }
  });

  mobileBackdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { closeModal(); closeSidebar(); }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      var search = document.getElementById("globalSearch");
      if (search) search.focus();
    }
  });

  initializeApp();
})();
