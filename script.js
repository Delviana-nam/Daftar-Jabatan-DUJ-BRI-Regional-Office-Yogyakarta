const cardsGrid = document.getElementById("cardsGrid");
const cardsGridUker = document.getElementById("cardsGridUker");
const sidebarList = document.getElementById("sidebarList");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuBtn = document.getElementById("menuBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

const detailView = document.getElementById("detailView");
const detailTitle = document.getElementById("detailTitle");
const detailFrame = document.getElementById("detailFrame");
const backBtn = document.getElementById("backBtn");

const roBody = document.getElementById("roBody");
const ukerBody = document.getElementById("ukerBody");
const toggleRO = document.getElementById("toggleRO");
const toggleUker = document.getElementById("toggleUker");

const kpiBody = document.getElementById("kpiBody");
const toggleKPI = document.getElementById("toggleKPI");

const detailKpiWrap = document.getElementById("detailKpiWrap");
const downloadBtn = document.getElementById("downloadBtn");

/* ====== KONFIGURASI GOOGLE SHEET KPI ======*/
const KPI_SHEET_ID = "1EM0CudIbfuRl31pGxA7f-u0rHEz6wfy-OfyUdLxm_8Q";
const KPI_SHEET_GID = "0";

/* Publish to web untuk menampilkan HANYA satu tab per kotak KPI, tanpa baris tab lain */
const KPI_PUBLISH_KEY = "2PACX-1vTqBWenc9r5hcgH94VG-UpgiDdUbaCLtc57fFbIibtqmnetIa53Q1ovVX8DFzXuYeB78q5RqMlxl3Fw";

/*img preview gambar */
const detailImage = document.createElement("img");
detailImage.id = "detailImage";
detailImage.style.display = "none";
detailImage.style.width = "100%";
detailImage.style.height = "100%";
detailImage.style.objectFit = "contain";
detailImage.style.background = "#fff";
detailImage.style.padding = "24px";
detailImage.style.boxSizing = "border-box";
detailImage.style.maxWidth = "1100px";
detailImage.style.margin = "0 auto";
detailFrame.insertAdjacentElement("afterend", detailImage);

/*upload files agar dapat di download*/
function isLocalOrUrl(value) {
  if (!value) return false;
  return value.startsWith("http") || value.includes("/") || value.includes(".");
}

function resolveDownloadUrl(id) {
  if (isLocalOrUrl(id)) {
    return id;
  }
  return `https://drive.usercontent.google.com/u/0/uc?id=${id}&export=download`;
}

function resolvePreviewUrl(id) {
  if (isLocalOrUrl(id)) {
    return id;
  }
  return `https://drive.google.com/file/d/${id}/preview`;
}

function isImageFile(value) {
  if (!value) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
}

/* download tugas tugas DUJ */
function extractNumberFromFileId(fileId) {
  if (!fileId) return null;
  const match = String(fileId).match(/(\d+)(?=\.[a-zA-Z0-9]+$)/);
  return match ? match[1] : null;
}

function resolveDetailPdfForPoint(point) {
  if (point && point.pdfId) {
    // Jika pdfId sudah berupa URL/path lengkap (mis. link Google Drive), pakai langsung.
    // Jika hanya angka biasa (mis. "55"), anggap itu nomor file lokal: files/55.pdf
    // (sama seperti nomor pada images/55.jpg) — BUKAN ID Google Drive.
    return isLocalOrUrl(point.pdfId) ? point.pdfId : `files/${point.pdfId}.pdf`;
  }
  const num = extractNumberFromFileId(point && point.fileId);
  if (!num) return null;
  return `files/${num}.pdf`;
}

/* ini agar judul sesuai dengan penulisan file */
function sanitizeFilename(name) {
  return String(name || "Dokumen").replace(/[\\/:*?"<>|]/g, "-").trim();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* SIDEBAR / DAFTAR ISI */
const sectionMap = {};
divisions.forEach(d => { sectionMap[d.id] = { body: roBody, btn: toggleRO }; });
divisionsUker.forEach(d => { sectionMap[d.id] = { body: ukerBody, btn: toggleUker }; });

function expandSection(id) {
  const sec = sectionMap[id];
  if (sec && sec.body.classList.contains("collapsed")) {
    sec.body.classList.remove("collapsed");
    sec.btn.setAttribute("aria-expanded", "true");
  }
}

function buildSidebarGroup(labelText, groupId, list) {
  const groupLi = document.createElement("li");
  groupLi.className = "sidebar-group";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "sidebar-group-toggle";
  toggleBtn.innerHTML = `<span>${labelText}</span><span class="chevron">&#9662;</span>`;

  const subUl = document.createElement("ul");
  subUl.className = "sidebar-subgroup";
  subUl.id = groupId;

  list.forEach(div => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + div.id;
    a.textContent = div.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      closeSidebar();
      showMain();
      expandSection(div.id);
      requestAnimationFrame(() => {
        document.getElementById(div.id).scrollIntoView({ behavior: "smooth" });
      });
    });
    li.appendChild(a);
    subUl.appendChild(li);
  });

  toggleBtn.addEventListener("click", () => {
    const willOpen = !subUl.classList.contains("open");
    subUl.classList.toggle("open", willOpen);
    toggleBtn.classList.toggle("open", willOpen);
  });

  groupLi.appendChild(toggleBtn);
  groupLi.appendChild(subUl);
  sidebarList.appendChild(groupLi);
}

buildSidebarGroup("DUJ RO Jogja", "group-ro", divisions);
buildSidebarGroup("DUJ Unit Kerja", "group-uker", divisionsUker);

/* 3. KPI */
function buildSidebarGroupKPI(labelText, groupId, linkText, onClick) {
  const groupLi = document.createElement("li");
  groupLi.className = "sidebar-group";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "sidebar-group-toggle";
  toggleBtn.innerHTML = `<span>${labelText}</span><span class="chevron">&#9662;</span>`;

  const subUl = document.createElement("ul");
  subUl.className = "sidebar-subgroup";
  subUl.id = groupId;

  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#kpiSection";
  a.textContent = linkText;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    onClick();
  });
  li.appendChild(a);
  subUl.appendChild(li);

  toggleBtn.addEventListener("click", () => {
    const willOpen = !subUl.classList.contains("open");
    subUl.classList.toggle("open", willOpen);
    toggleBtn.classList.toggle("open", willOpen);
  });

  groupLi.appendChild(toggleBtn);
  groupLi.appendChild(subUl);
  sidebarList.appendChild(groupLi);
}

buildSidebarGroupKPI("KPI", "group-kpi", "KPI Regional Office Area KC, KCP dan BRI Unit", () => {
  closeSidebar();
  showMain();

  /* box KPI*/
  if (kpiBody.classList.contains("collapsed")) {
    kpiBody.classList.remove("collapsed");
    toggleKPI.setAttribute("aria-expanded", "true");
  }

  requestAnimationFrame(() => {
    document.getElementById("kpiSection").scrollIntoView({ behavior: "smooth" });
  });
});

/* CARD PER DIVISI */
function buildDivisionCard(div) {
  const card = document.createElement("div");
  card.className = "division-card";
  card.id = div.id;

  const pointsHtml = div.points.length
    ? `<p class="card-note">Silakan unduh berkas jabatan disini.</p><ul class="point-list"></ul>`
    : "";

  // tabel otomatis live
  const hasKpi = !!(div.kpiEnabled || (div.kpiGid && String(div.kpiGid).trim()));
  const kpiLabel = (div.kpiLabel && String(div.kpiLabel).trim()) || ("Penetapan Key Performance Indicator\n" + div.title);
  const kpiLabelHtml = kpiLabel.split("\n").map(line => escapeHtml(line)).join("<br>");
  const kpiBadgeHtml = hasKpi
    ? `<button type="button" class="kpi-link-btn"><span>${kpiLabelHtml}</span><span class="kpi-link-arrow">&#8250;</span></button>`
    : "";

  // Urutan tampilan card
  card.innerHTML = `
    <img src="${div.image || ''}" alt="${div.title}" loading="lazy" onerror="this.style.display='none'">
    <h4>${div.title}</h4>
    <a class="download-btn" href="${resolveDownloadUrl(div.downloadId)}" target="_blank" rel="noopener">DOWNLOAD</a>
    ${kpiBadgeHtml}
    ${pointsHtml}
  `;

  if (hasKpi) {
    card.querySelector(".kpi-link-btn").addEventListener("click", () => openKpiDetail(div));
  }

  if (div.points.length) {
    const list = card.querySelector(".point-list");
    div.points.forEach(point => {
      const li = document.createElement("li");
      if (point.url) {
        const a = document.createElement("a");
        a.href = point.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = point.title;
        li.appendChild(a);
      } else {
        const btn = document.createElement("button");
        btn.textContent = point.title;
        btn.addEventListener("click", () => openDetail(point));
        li.appendChild(btn);
      }
      list.appendChild(li);
    });
  }

  return card;
}

/* RCEO sendiri ditengah atas grid Regional Office */
const rceoDivision = divisions[0];
const otherDivisions = divisions.slice(1);

const rceoWrap = document.createElement("section");
rceoWrap.className = "rceo-wrap";
const rceoCard = buildDivisionCard(rceoDivision);
rceoWrap.appendChild(rceoCard);
cardsGrid.parentNode.insertBefore(rceoWrap, cardsGrid);

/*grid card Regional Office*/
otherDivisions.forEach(div => {
  cardsGrid.appendChild(buildDivisionCard(div));
});

/*grid card Unit Kerja Operasional*/
divisionsUker.forEach(div => {
  cardsGridUker.appendChild(buildDivisionCard(div));
});

/*card RCEO*/
function syncRceoCardWidth() {
  const sampleCard = cardsGrid.querySelector(".division-card");
  if (sampleCard) {
    const width = sampleCard.getBoundingClientRect().width;
    rceoCard.style.width = width + "px";
  }
}
window.addEventListener("resize", syncRceoCardWidth);
window.addEventListener("load", syncRceoCardWidth);
syncRceoCardWidth();

/* SIDEBAR */
function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
}
function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
}
menuBtn.addEventListener("click", openSidebar);
closeSidebarBtn.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

/* Trought up/ down */
function setupToggle(btn, body, onOpen) {
  btn.addEventListener("click", () => {
    const willCollapse = !body.classList.contains("collapsed");
    body.classList.toggle("collapsed", willCollapse);
    btn.setAttribute("aria-expanded", String(!willCollapse));
    if (!willCollapse && typeof onOpen === "function") {
      onOpen();
    }
  });
}
setupToggle(toggleRO, roBody);
setupToggle(toggleUker, ukerBody);
setupToggle(toggleKPI, kpiBody);


/* FRAME KPI LIVE DARI GOOGLE SHEET */
function kpiFrameShellHTML(title, subtitle) {
  return `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-brand">
          <img src="images/Danantara_black.png" alt="Logo Danantara" class="kpi-logo-danantara" onerror="console.warn('Logo tidak ditemukan:', this.src); this.style.display='none'">
        </div>
        <div class="kpi-brand kpi-brand-right">
          <img src="images/bri_blue.png" alt="Logo BRI" class="kpi-logo-bri" onerror="console.warn('Logo tidak ditemukan:', this.src); this.style.display='none'">
        </div>
      </div>
      <h2 class="kpi-title">${title}<span>${subtitle}</span></h2>
      <div class="kpi-toolbar">
        <div class="kpi-toolbar-actions">
          <a class="kpi-action-btn kpi-open-sheet" href="#" target="_blank" rel="noopener">Buka Google Sheet</a>
          <button class="kpi-action-btn kpi-refresh-btn" type="button">Muat ulang</button>
        </div>
      </div>
      <div class="kpi-err"></div>
      <div class="kpi-table-scroll"><div class="kpi-empty">Memuat data…</div></div>
    </div>
  `;
}

const KPI_DEFAULT_HEIGHT = 700; 

/*KPI Live */
function initKpiInstance(containerEl, opts) {
  const gid = opts.gid;
  const title = opts.title || "KPI Regional Office";
  const subtitle = opts.subtitle || "";
  const height = Number(opts.height) > 0 ? Number(opts.height) : KPI_DEFAULT_HEIGHT;

  containerEl.innerHTML = kpiFrameShellHTML(title, subtitle);

  const tableScroll = containerEl.querySelector(".kpi-table-scroll");
  const errBox = containerEl.querySelector(".kpi-err");
  const openSheetLink = containerEl.querySelector(".kpi-open-sheet");
  const refreshBtn = containerEl.querySelector(".kpi-refresh-btn");

  openSheetLink.href = `https://docs.google.com/spreadsheets/d/${KPI_SHEET_ID}/edit#gid=${gid}`;

  let destroyed = false;

  function showErr(msg) {
    errBox.innerHTML = msg ? `<div class="kpi-err-box">${msg}</div>` : "";
  }

  function load() {
    if (destroyed) return;
    if (gid === undefined || gid === null || String(gid).trim() === "") {
      tableScroll.innerHTML = `<div class="kpi-empty">GID tab Google Sheet belum diisi di divisions_data.js (kpiGid). Isi dengan angka GID dari URL tab sheet-nya (…#gid=XXXXXXX).</div>`;
      return;
    }
    showErr("");

    // google sheetnya di publish agar dapat terlihat di iframe sesuai tab/bagian yang di ingin kan
    const src = `https://docs.google.com/spreadsheets/d/e/${KPI_PUBLISH_KEY}/pubhtml?gid=${encodeURIComponent(gid)}&single=true&widget=false&headers=false&chrome=false&_=${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.className = "kpi-sheet-iframe";
    iframe.style.height = height + "px";
    iframe.loading = "lazy";
    iframe.title = title;
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.onerror = function () {
      showErr('Tidak bisa memuat tabel dari Google Sheet. Pastikan sheet sudah di-"Publish to web" (File > Share > Publish to web) dan GID tab benar.');
    };
    iframe.src = src;

    tableScroll.innerHTML = "";
    tableScroll.appendChild(iframe);
  }

  refreshBtn.addEventListener("click", load);
  load();

  return {
    reload: load,
    destroy: function () { destroyed = true; }
  };
}


/* urutan tataletak stiap card */
function splitKpiLabel(label, fallbackSubtitle) {
  const text = (label && String(label).trim()) || fallbackSubtitle || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    return { title: lines[0], subtitle: lines.slice(1).join("\n") };
  }

  return { title: "Penetapan Key Performance Indicator", subtitle: lines[0] || "" };
}

/*  (section "3. KPI") */
initKpiInstance(document.getElementById("kpiFrameMain"), {
  gid: KPI_SHEET_GID,
  title: "Penetapan Key Performance Indicator",
  subtitle: "Regional Office, Area, Kantor Cabang, Kantor Cabang Pembantu, dan BRI Unit Tahun 2026",
  height: 620
});

/* buat KPI per-card */
let currentKpiDetailInstance = null;

function openKpiDetail(div) {
  detailTitle.textContent = "KPI - " + div.title;

  detailFrame.src = "";
  detailFrame.style.display = "none";
  detailImage.src = "";
  detailImage.style.display = "none";

  detailKpiWrap.style.display = "block";
  downloadBtn.style.display = "none";
  downloadBtn.href = "#";

  if (currentKpiDetailInstance) currentKpiDetailInstance.destroy();
  const { title, subtitle } = splitKpiLabel(div.kpiLabel, div.title);
  currentKpiDetailInstance = initKpiInstance(document.getElementById("kpiFrameDetail"), {
    gid: div.kpiGid,
    title: title,
    subtitle: subtitle,
    height: div.kpiHeight
  });

  detailView.classList.add("show");
  window.scrollTo(0, 0);
}


/*TAMPILAN DETAIL JABATAN*/
function openDetail(point) {
  detailTitle.textContent = point.title;

  detailKpiWrap.style.display = "none";

  if (isImageFile(point.fileId)) {
    detailFrame.src = "";
    detailFrame.style.display = "none";
    detailImage.src = resolvePreviewUrl(point.fileId);
    detailImage.style.display = "block";
  } else {
    detailImage.src = "";
    detailImage.style.display = "none";
    detailFrame.style.display = "block";
    detailFrame.src = resolvePreviewUrl(point.fileId);
  }

  const pdfPath = resolveDetailPdfForPoint(point);
  if (pdfPath) {
    downloadBtn.href = pdfPath;
    downloadBtn.setAttribute("download", sanitizeFilename(point.title) + ".pdf");
    downloadBtn.style.display = "flex";
  } else {
    downloadBtn.removeAttribute("download");
    downloadBtn.href = "#";
    downloadBtn.style.display = "none";
  }

  detailView.classList.add("show");
  window.scrollTo(0, 0);
}

function showMain() {
  detailView.classList.remove("show");
  detailFrame.src = "";
  detailImage.src = "";
  detailKpiWrap.style.display = "none";
  downloadBtn.style.display = "none";
  downloadBtn.href = "#";
  downloadBtn.removeAttribute("download");
  if (currentKpiDetailInstance) {
    currentKpiDetailInstance.destroy();
    currentKpiDetailInstance = null;
  }
}

backBtn.addEventListener("click", showMain);
