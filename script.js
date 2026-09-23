/* ===== ELEMEN DOM ===== */
const cardsGrid = document.getElementById("cardsGrid");
const cardsGridUker = document.getElementById("cardsGridUker");

const detailView = document.getElementById("detailView");
const detailTitle = document.getElementById("detailTitle");
const detailFrame = document.getElementById("detailFrame");
const backBtn = document.getElementById("backBtn");

const roBody = document.getElementById("roBody");
const ukerBody = document.getElementById("ukerBody");
const toggleRO = document.getElementById("toggleRO");
const toggleUker = document.getElementById("toggleUker");

const toggleKPI = document.getElementById("toggleKPI");
const kpiCtaCard = document.getElementById("kpiCtaCard");

const detailKpiWrap = document.getElementById("detailKpiWrap");
const downloadBtn = document.getElementById("downloadBtn");
const detailDivisionWrap = document.getElementById("detailDivisionWrap");

/* State navigasi halaman detail */
let currentDivisionId = null;   
let subDetailParentId = null;
let isMainKpiOpen = false;

function lockPageScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  document.body.style.overflow = lock ? "hidden" : "";
}

/* ===== KONFIGURASI GOOGLE SHEET KPI ===== */
const KPI_SHEET_ID = "1EM0CudIbfuRl31pGxA7f-u0rHEz6wfy-OfyUdLxm_8Q";
const KPI_SHEET_GID = "0";

const KPI_PUBLISH_KEY = "2PACX-1vTqBWenc9r5hcgH94VG-UpgiDdUbaCLtc57fFbIibtqmnetIa53Q1ovVX8DFzXuYeB78q5RqMlxl3Fw";

/* Elemen gambar di home*/
const detailImage = document.createElement("img");
detailImage.id = "detailImage";
detailImage.style.display = "none";
detailImage.style.width = "100%";
detailImage.style.height = "100%";
detailImage.style.objectFit = "contain";
detailImage.style.background = "linear-gradient(180deg, #0857c3 0%, #71c5e8 55%, #307FE2 100%)";
detailImage.style.padding = "24px";
detailImage.style.boxSizing = "border-box";
detailImage.style.maxWidth = "1100px";
detailImage.style.margin = "0 auto";
detailFrame.insertAdjacentElement("afterend", detailImage);

/* ===== HELPER URL FILE (Google Drive / lokal) ===== */
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

/* ===== DOWNLOAD PDF KPI ===== */
function resolveKpiDownloadUrl(gid, format) {
  format = format || "pdf";
  return `https://docs.google.com/spreadsheets/d/${KPI_SHEET_ID}/export?format=${format}&gid=${encodeURIComponent(gid)}`;
}

/* Ambil PDF export asli dari Google Sheets untuk 1 tab (gid) */
async function fetchSheetPdfBytes(gid) {
  const url =
    `https://docs.google.com/spreadsheets/d/${KPI_SHEET_ID}/export` +
    `?format=pdf&gid=${encodeURIComponent(gid)}` +
    `&fitw=true&scale=2` +
    `&sheetnames=false&printtitle=false&pagenumbers=false&gridlines=false` +
    `&top_margin=0.00&bottom_margin=0.00&left_margin=0.00&right_margin=0.00`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil PDF sheet (gid " + gid + ")");
  return await res.arrayBuffer();
}

function downloadPdfBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "KPI.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* Bangun PDF KPI: tabel dari sheet + header (logo, judul) + footer */
async function generateKpiPdf({ gid, title, subtitle, filename }) {
  if (downloadBtn.classList) downloadBtn.classList.add("is-loading");
  const originalLabel = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<span class="back-arrow">&#8595;</span> Menyiapkan PDF...';

  try {
    const [sheetPdfBytes, logoDanantaraBytes, logoBriBytes] = await Promise.all([
      fetchSheetPdfBytes(gid),
      fetch("images/Danantara_black.png").then(r => r.arrayBuffer()),
      fetch("images/bri_Blue.png").then(r => r.arrayBuffer())
    ]);

    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    const srcDoc = await PDFDocument.load(sheetPdfBytes);
    const outDoc = await PDFDocument.create();

    const danantaraImg = await outDoc.embedPng(logoDanantaraBytes);
    const briImg = await outDoc.embedPng(logoBriBytes);
    const fontBold = await outDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await outDoc.embedFont(StandardFonts.Helvetica);

    const HEADER_H = 70;
    const FOOTER_H = 26;
    const MARGIN_X = 30;
    const TABLE_MARGIN_X = 40;

    const srcPages = srcDoc.getPages();
    for (let i = 0; i < srcPages.length; i++) {
      const embedded = await outDoc.embedPage(srcPages[i]);
      const sheetW = embedded.width;
      const sheetH = embedded.height;

      // Ukuran halaman mengikuti ukuran tabel
      const pageWidth = sheetW + TABLE_MARGIN_X * 2;
      const pageHeight = sheetH + HEADER_H + FOOTER_H;
      const page = outDoc.addPage([pageWidth, pageHeight]);

      page.drawPage(embedded, {
        x: TABLE_MARGIN_X,
        y: FOOTER_H,
        width: sheetW,
        height: sheetH
      });

      // Logo Danantara
      const danW = 70;
      const danH = danantaraImg.height * (danW / danantaraImg.width);
      page.drawImage(danantaraImg, {
        x: MARGIN_X,
        y: pageHeight - HEADER_H + (HEADER_H - danH) / 2,
        width: danW,
        height: danH
      });

      //logo BRI
      const briW = 65;
      const briH = briImg.height * (briW / briImg.width);
      page.drawImage(briImg, {
        x: pageWidth - MARGIN_X - briW,
        y: pageHeight - HEADER_H + (HEADER_H - briH) / 2,
        width: briW,
        height: briH
      });

      // Header: judul & subjudul
      const titleSize = 13;
      const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (pageWidth - titleWidth) / 2,
        y: pageHeight - 26,
        size: titleSize,
        font: fontBold,
        color: rgb(0, 0, 0)
      });

      if (subtitle) {
        const subSize = 9;
        const subWidth = fontNormal.widthOfTextAtSize(subtitle, subSize);
        page.drawText(subtitle, {
          x: (pageWidth - subWidth) / 2,
          y: pageHeight - 42,
          size: subSize,
          font: fontNormal,
          color: rgb(0.2, 0.2, 0.2)
        });
      }

      // Footer: tanggal cetak & nomor halaman
      const pageNumText = `Halaman ${i + 1}`;
      const dateText = `Dicetak ${new Date().toLocaleDateString("id-ID")}`;
      const pnWidth = fontNormal.widthOfTextAtSize(pageNumText, 8);
      page.drawText(dateText, {
        x: MARGIN_X, y: 10, size: 8, font: fontNormal, color: rgb(0.45, 0.45, 0.45)
      });
      page.drawText(pageNumText, {
        x: pageWidth - MARGIN_X - pnWidth, y: 10, size: 8, font: fontNormal, color: rgb(0.45, 0.45, 0.45)
      });
    }

    const outBytes = await outDoc.save();
    downloadPdfBytes(outBytes, filename || "KPI.pdf");
  } catch (err) {
    console.error(err);
    alert("Gagal membuat PDF: " + err.message + "\nMenggunakan link download bawaan sebagai cadangan.");
    window.open(resolveKpiDownloadUrl(gid, "pdf"), "_blank");
  } finally {
    downloadBtn.innerHTML = originalLabel;
    if (downloadBtn.classList) downloadBtn.classList.remove("is-loading");
  }
}

function isImageFile(value) {
  if (!value) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
}

/* ===== DOWNLOAD PDF DETAIL JABATAN ===== */
function extractNumberFromFileId(fileId) {
  if (!fileId) return null;
  const match = String(fileId).match(/(\d+)(?=\.[a-zA-Z0-9]+$)/);
  return match ? match[1] : null;
}

function resolveDetailPdfForPoint(point) {
  if (point && point.pdfId) {
    return isLocalOrUrl(point.pdfId) ? point.pdfId : `files/${point.pdfId}.pdf`;
  }
  const num = extractNumberFromFileId(point && point.fileId);
  if (!num) return null;
  return `files/${num}.pdf`;
}

function sanitizeFilename(name) {
  return String(name || "Dokumen").replace(/[\\/:*?"<>|]/g, "-").trim();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* Lookup semua divisi (RO & Uker) berdasarkan id */
const allDivisionsById = {};
divisions.forEach(d => { allDivisionsById[d.id] = d; });
divisionsUker.forEach(d => { allDivisionsById[d.id] = d; });

function eyeIconSvg() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3.2"/></svg>`;
}

/* ===== HALAMAN FULLSCREEN DIVISI ===== */
function openDivisionPage(id) {
  const div = allDivisionsById[id];
  if (!div) return;

  currentDivisionId = id;
  subDetailParentId = null;

  detailFrame.src = "";
  detailFrame.style.display = "none";
  detailImage.src = "";
  detailImage.style.display = "none";
  detailKpiWrap.style.display = "none";

  if (downloadBtn._kpiClickHandler) {
    downloadBtn.removeEventListener("click", downloadBtn._kpiClickHandler);
    downloadBtn._kpiClickHandler = null;
  }
  if (currentKpiDetailInstance) {
    currentKpiDetailInstance.destroy();
    currentKpiDetailInstance = null;
  }

  const isUker = divisionsUker.some(d => d.id === id);
  const pdfWrap = document.querySelector(".detail-pdf-wrap");
  pdfWrap.classList.remove("bg-hal3", "bg-hal4", "bg-kpi");
  pdfWrap.classList.add(isUker ? "bg-hal4" : "bg-hal3");
  detailView.classList.add("division-mode");

  const hasKpi = !!(div.kpiEnabled || (div.kpiGid && String(div.kpiGid).trim()));
  const hasPoints = !!(div.points && div.points.length);
  const showList = hasPoints || hasKpi;

  detailDivisionWrap.style.display = "block";
  detailTitle.textContent = div.title;

  const kpiItemHtml = hasKpi ? `
    <button type="button" class="division-kpi-box" id="divisionKpiBtn">
      <span class="division-kpi-arrow" aria-hidden="true">${arrowUpRightSvg()}</span>
      <span class="division-kpi-caption">Key Performance Indicator</span>
      <span class="division-kpi-desc">${escapeHtml(div.title)}</span>
    </button>` : "";

  if (showList) {
    const pointsHtml = (div.points || []).map((point, idx) => `
      <button type="button" class="division-point-item" data-idx="${idx}">
        <span class="division-point-label">${escapeHtml(point.title)}</span>
        <span class="division-point-arrow">${arrowUpRightSvg()}</span>
      </button>
    `).join("");

    detailDivisionWrap.innerHTML = `
      <div class="detail-division-inner">
        <h2 class="detail-division-title">${escapeHtml(div.title)}</h2>
        <div class="detail-division-toprow">
          <div class="detail-division-download-block">
            <p class="division-note">Silakan unduh berkas jabatan disini.</p>
            <a class="division-download-btn" href="${resolveDownloadUrl(div.downloadId)}" target="_blank" rel="noopener">DOWNLOAD</a>
          </div>
          ${kpiItemHtml}
        </div>
        <div class="division-point-list">${pointsHtml}</div>
      </div>
    `;

    detailDivisionWrap.querySelectorAll(".division-point-list .division-point-item[data-idx]").forEach(btn => {
      const idx = Number(btn.getAttribute("data-idx"));
      btn.addEventListener("click", () => openDetail(div.points[idx]));
    });
    if (hasKpi) {
      document.getElementById("divisionKpiBtn").addEventListener("click", () => openKpiDetail(div));
    }

    downloadBtn.style.display = "none";
    downloadBtn.href = "#";
    downloadBtn.removeAttribute("download");
    downloadBtn.removeAttribute("target");
  } else {
    detailDivisionWrap.innerHTML = `
      <div class="detail-division-inner">
        <div class="division-simple-card">
          <img src="${div.image || ''}" alt="${escapeHtml(div.title)}" onerror="this.style.display='none'">
          <h3>${escapeHtml(div.title)}</h3>
        </div>
        <p class="division-simple-note">Silakan unduh berkas jabatan disini.</p>
      </div>
    `;

    downloadBtn.href = resolveDownloadUrl(div.downloadId);
    downloadBtn.target = "_blank";
    downloadBtn.removeAttribute("download");
    downloadBtn.style.display = "flex";
  }

  detailView.classList.add("show");
  lockPageScroll(true);
}

/* ===== CARD PER DIVISI ===== */
function buildDivisionCard(div) {
  const card = document.createElement("div");
  card.className = "division-card";
  card.id = div.id;

  const pointsHtml = div.points.length
    ? `<p class="card-note">Silakan unduh berkas jabatan disini.</p><ul class="point-list"></ul>`
    : "";

  const hasKpi = !!(div.kpiEnabled || (div.kpiGid && String(div.kpiGid).trim()));
  const kpiLabel = (div.kpiLabel && String(div.kpiLabel).trim()) || ("Penetapan Key Performance Indicator\n" + div.title);
  const kpiLabelHtml = kpiLabel.split("\n").map(line => escapeHtml(line)).join("<br>");
  const kpiBadgeHtml = hasKpi
    ? `<button type="button" class="kpi-link-btn"><span>${kpiLabelHtml}</span><span class="kpi-link-arrow" aria-hidden="true">&#8250;</span></button>`
    : "";

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

/* ===== RENDER GRID CARD ===== */
const rceoDivision = divisions[0];
const otherDivisions = divisions.slice(1);

const rceoWrap = document.createElement("section");
rceoWrap.className = "rceo-wrap";
const rceoCard = buildDivisionCard(rceoDivision);
rceoWrap.appendChild(rceoCard);
cardsGrid.parentNode.insertBefore(rceoWrap, cardsGrid);

otherDivisions.forEach(div => {
  cardsGrid.appendChild(buildDivisionCard(div));
});

divisionsUker.forEach(div => {
  cardsGridUker.appendChild(buildDivisionCard(div));
});

// Samakan lebar card RCEO dengan card lain
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

/* ===== NAVIGASI TOPBAR ===== */
function closeAllNavDropdowns() {
  document.querySelectorAll(".topbar-nav-dropdown.open").forEach(d => d.classList.remove("open"));
}

function buildNavDropdown(containerEl, list) {
  if (!containerEl) return;
  containerEl.innerHTML = "";
  list.forEach(div => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + div.id;
    a.textContent = div.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllNavDropdowns();
      openDivisionPage(div.id);
    });
    li.appendChild(a);
    containerEl.appendChild(li);
  });
}

buildNavDropdown(document.getElementById("navDropdownRO"), divisions);
buildNavDropdown(document.getElementById("navDropdownUker"), divisionsUker);

document.querySelectorAll(".topbar-nav-dropdown").forEach(dropdown => {
  const btn = dropdown.querySelector(".topbar-nav-dropdown-btn");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !dropdown.classList.contains("open");
    closeAllNavDropdowns();
    dropdown.classList.toggle("open", willOpen);
  });
});

/* ===== MENU HAMBURGER (mobile) ===== */
const topbarEl = document.querySelector(".topbar");
const topbarToggle = document.getElementById("topbarToggle");
const MOBILE_MENU_QUERY = window.matchMedia("(max-width: 768px)");

function setMobileMenu(open) {
  if (!topbarEl || !topbarToggle) return;
  topbarEl.classList.toggle("menu-open", open);
  topbarToggle.setAttribute("aria-expanded", open ? "true" : "false");
  topbarToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  if (!open) closeAllNavDropdowns();
}

if (topbarToggle) {
  topbarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setMobileMenu(!topbarEl.classList.contains("menu-open"));
  });
}

// Klik di luar menu menutup dropdown & hamburger
document.addEventListener("click", () => {
  closeAllNavDropdowns();
  setMobileMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMobileMenu(false);
});

// Pindah ke layar lebar: pastikan menu mobile tertutup
MOBILE_MENU_QUERY.addEventListener("change", () => setMobileMenu(false));

// Logo BRI (ke Home) & link Visi: scroll ke section terkait
document.querySelectorAll("[data-scroll-target]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    setMobileMenu(false);
    closeDetail();
    requestAnimationFrame(() => {
      const target = document.getElementById(link.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

/* ===== CARD AJAKAN KLIK KPI: buka laman detail KPI (sama seperti KPI per divisi) ===== */
const kpiMainEntry = {
  id: "kpi-utama",
  title: "Regional Office Area KC, KCP, dan BRI Unit",
  kpiGid: KPI_SHEET_GID,
  kpiLabel: "Penetapan Key Performance Indicator\nRegional Office, Area, Kantor Cabang, Kantor Cabang Pembantu, dan BRI Unit Tahun 2026",
  kpiHeight: 620
};

if (kpiCtaCard) {
  kpiCtaCard.addEventListener("click", () => openKpiDetail(kpiMainEntry));
}

/* ===== TABEL KPI LIVE (Google Sheet via iframe) ===== */
function kpiFrameShellHTML(title, subtitle) {
  return `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-brand">
          <img src="images/Danantara_black.png" alt="Logo Danantara" class="kpi-logo-danantara" onerror="console.warn('Logo tidak ditemukan:', this.src); this.style.display='none'">
        </div>
        <div class="kpi-brand kpi-brand-right">
          <img src="images/bri_Blue.png" alt="Logo BRI" class="kpi-logo-bri" onerror="console.warn('Logo tidak ditemukan:', this.src); this.style.display='none'">
        </div>
      </div>
      <h2 class="kpi-title">${title}<span>${subtitle}</span></h2>
      <div class="kpi-toolbar">
        <div class="kpi-toolbar-actions">
          <a class="kpi-action-btn kpi-open-sheets" href="#" target="_blank" rel="noopener">Buka Google Sheets</a>
          <button class="kpi-action-btn kpi-refresh-btn" type="button">Muat ulang</button>
        </div>
      </div>
      <div class="kpi-err"></div>
      <div class="kpi-table-scroll"><div class="kpi-empty">Memuat data…</div></div>
    </div>
  `;
}

const KPI_DEFAULT_HEIGHT = 700; 

function initKpiInstance(containerEl, opts) {
  const gid = opts.gid;
  const title = opts.title || "KPI Regional Office";
  const subtitle = opts.subtitle || "";
  const height = Number(opts.height) > 0 ? Number(opts.height) : KPI_DEFAULT_HEIGHT;

  containerEl.innerHTML = kpiFrameShellHTML(title, subtitle);

  const tableScroll = containerEl.querySelector(".kpi-table-scroll");
  const errBox = containerEl.querySelector(".kpi-err");
  const openSheetLink = containerEl.querySelector(".kpi-open-sheets");
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

    // Sheets harus sudah di-publish agar tab terkait tampil di iframe
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


/* Label KPI */
function splitKpiLabel(label, fallbackSubtitle) {
  const text = (label && String(label).trim()) || fallbackSubtitle || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    return { title: lines[0], subtitle: lines.slice(1).join("\n") };
  }

  return { title: "Penetapan Key Performance Indicator", subtitle: lines[0] || "" };
}

/* ===== HALAMAN DETAIL KPI PER DIVISI ===== */
let currentKpiDetailInstance = null;

function openKpiDetail(div) {
  isMainKpiOpen = (div === kpiMainEntry);
  subDetailParentId = detailView.classList.contains("division-mode") ? currentDivisionId : null;
  detailView.classList.remove("division-mode");
  document.querySelector(".detail-pdf-wrap").classList.remove("bg-hal3", "bg-hal4", "bg-kpi");
  document.querySelector(".detail-pdf-wrap").classList.add("bg-kpi");
  detailDivisionWrap.style.display = "none";

  detailTitle.textContent = "KPI - " + div.title;

  detailFrame.src = "";
  detailFrame.style.display = "none";
  detailImage.src = "";
  detailImage.style.display = "none";

  detailKpiWrap.style.display = "block";

  // Bersihkan handler lama agar event listener tidak menumpuk
  if (downloadBtn._kpiClickHandler) {
    downloadBtn.removeEventListener("click", downloadBtn._kpiClickHandler);
    downloadBtn._kpiClickHandler = null;
  }

  if (div.kpiGid && String(div.kpiGid).trim() !== "") {
    downloadBtn.href = "#";
    downloadBtn.removeAttribute("download");
    downloadBtn.removeAttribute("target");
    downloadBtn.style.display = "flex";

    const { title: kpiTitleForPdf, subtitle: kpiSubtitleForPdf } = splitKpiLabel(div.kpiLabel, div.title);
    const handler = (e) => {
      e.preventDefault();
      generateKpiPdf({
        gid: div.kpiGid,
        title: kpiTitleForPdf,
        subtitle: kpiSubtitleForPdf,
        filename: sanitizeFilename(div.title) + " - KPI.pdf"
      });
    };
    downloadBtn._kpiClickHandler = handler;
    downloadBtn.addEventListener("click", handler);
  } else {
    downloadBtn.href = "#";
    downloadBtn.style.display = "none";
  }

  if (currentKpiDetailInstance) currentKpiDetailInstance.destroy();
  const { title, subtitle } = splitKpiLabel(div.kpiLabel, div.title);
  currentKpiDetailInstance = initKpiInstance(document.getElementById("kpiFrameDetail"), {
    gid: div.kpiGid,
    title: title,
    subtitle: subtitle,
    height: div.kpiHeight
  });

  detailView.classList.add("show");
  lockPageScroll(true);
}


/* ===== HALAMAN DETAIL JABATAN ===== */
function openDetail(point) {
  // Jika dibuka dari halaman divisi, ingat divisinya supaya Back kembali ke sana
  subDetailParentId = detailView.classList.contains("division-mode") ? currentDivisionId : null;
  detailView.classList.remove("division-mode");
  document.querySelector(".detail-pdf-wrap").classList.remove("bg-hal3", "bg-hal4", "bg-kpi");
  detailDivisionWrap.style.display = "none";

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

  if (downloadBtn._kpiClickHandler) {
    downloadBtn.removeEventListener("click", downloadBtn._kpiClickHandler);
    downloadBtn._kpiClickHandler = null;
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
  lockPageScroll(true);
}

/* Tutup overlay detail & reset semua state (tanpa mengubah posisi scroll) */
function closeDetail() {
  if (downloadBtn._kpiClickHandler) {
    downloadBtn.removeEventListener("click", downloadBtn._kpiClickHandler);
    downloadBtn._kpiClickHandler = null;
  }
  detailView.classList.remove("show");
  detailView.classList.remove("division-mode");
  lockPageScroll(false);
  document.querySelector(".detail-pdf-wrap").classList.remove("bg-hal3", "bg-hal4", "bg-kpi");
  detailDivisionWrap.style.display = "none";
  detailDivisionWrap.innerHTML = "";
  detailFrame.src = "";
  detailImage.src = "";
  detailKpiWrap.style.display = "none";
  downloadBtn.style.display = "none";
  downloadBtn.href = "#";
  downloadBtn.removeAttribute("download");
  downloadBtn.removeAttribute("target");
  subDetailParentId = null;
  isMainKpiOpen = false;

  if (currentKpiDetailInstance) {
    currentKpiDetailInstance.destroy();
    currentKpiDetailInstance = null;
  }
}

/* Kembali ke halaman utama, langsung ke section divisi tadi (RO / Unit Kerja) */
function showMain() {
  closeDetail();

  const isUker = divisionsUker.some(d => d.id === currentDivisionId);
  const section = document.getElementById(isUker ? "showcaseUkerSection" : "showcaseROSection");
  if (!section) return;

  section.scrollIntoView({ behavior: "instant", block: "start" });
  requestAnimationFrame(() => section.scrollIntoView({ behavior: "instant", block: "start" }));
}

function goBack() {
  if (subDetailParentId) {
    openDivisionPage(subDetailParentId);
    return;
  }
  if (isMainKpiOpen) {
    closeDetail();
    const kpiSection = document.getElementById("kpiSection");
    if (kpiSection) {
      kpiSection.scrollIntoView({ behavior: "instant", block: "start" });
      requestAnimationFrame(() => kpiSection.scrollIntoView({ behavior: "instant", block: "start" }));
    }
    return;
  }
  showMain();
}

backBtn.addEventListener("click", goBack);

/* ===== ANIMASI SCROLL ===== */
(function setupHeroAnimation() {
  const heroContent = document.getElementById("heroBriContent");
  if (!heroContent) return;

  if (!("IntersectionObserver" in window)) {
    heroContent.classList.add("hero-animate");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroContent.classList.toggle("hero-animate", entry.isIntersecting);
    });
  }, { threshold: 0.3 });

  observer.observe(heroContent);
})();

// Visi
(function setupVisiScrollAnimation() {
  const visiSection = document.getElementById("visiSection");
  if (!visiSection || !("IntersectionObserver" in window)) {
    if (visiSection) visiSection.classList.add("in-view");
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visiSection.classList.toggle("in-view", entry.isIntersecting);
    });
  }, { threshold: 0.35 });
  observer.observe(visiSection);
})();

// Showcase RO, Uker, dan KPI
(function setupShowcaseStarAnimation() {
  const sections = [
    document.getElementById("showcaseROSection"),
    document.getElementById("showcaseUkerSection"),
    document.getElementById("kpiSection")
  ].filter(Boolean);
  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) {
    sections.forEach(sec => sec.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  sections.forEach(sec => observer.observe(sec));
})();

/* ===== SHOWCASE DIVISI (kartu RO & Uker) ===== */
(function setupShowcaseGrids() {
  const showcaseROGrid = document.getElementById("showcaseROGrid");
  const showcaseUkerGrid = document.getElementById("showcaseUkerGrid");
  const showcaseRceoBanner = document.getElementById("showcaseRceoBanner");

  function goToDivisionCard(id) {
    openDivisionPage(id);
  }

  // Banner RCEO terpisah dari grid
  function buildRceoBanner(containerEl, div) {
    if (!containerEl || !div) return;
    const banner = document.createElement("article");
    banner.className = "showcase-rceo-banner";
    banner.tabIndex = 0;
    banner.setAttribute("role", "button");
    banner.setAttribute("aria-label", "Buka bagian " + div.title);
    banner.innerHTML = `
      <span>
        <span class="showcase-rceo-label">STRUKTUR TERTINGGI REGIONAL OFFICE</span>
        <span class="showcase-rceo-title">${escapeHtml(div.title)}</span>
      </span>
      <button type="button" class="showcase-arrow" aria-label="Menuju card ${escapeHtml(div.title)}">&#8594;</button>
    `;
    const go = () => goToDivisionCard(div.id);
    banner.querySelector(".showcase-arrow").addEventListener("click", (e) => {
      e.stopPropagation();
      go();
    });
    banner.addEventListener("click", go);
    banner.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
    containerEl.appendChild(banner);
  }

  function buildShowcaseGrid(gridEl, list) {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    list.forEach((div, index) => {
      const card = document.createElement("article");
      card.className = "showcase-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Buka bagian " + div.title);

      card.innerHTML = `
        <span class="showcase-num">${String(index + 1).padStart(2, "0")}</span>
        <h3 class="showcase-card-title">${escapeHtml(div.title)}</h3>
        <button type="button" class="showcase-arrow" aria-label="Menuju card ${escapeHtml(div.title)}">&#8594;</button>
      `;

      const go = () => goToDivisionCard(div.id);

      card.querySelector(".showcase-arrow").addEventListener("click", (e) => {
        e.stopPropagation();
        go();
      });
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });

      gridEl.appendChild(card);
    });
  }

  const roDivisionsWithoutRceo = divisions.filter(d => d.id !== "rceo");
  const rceoDivision = divisions.find(d => d.id === "rceo");

  buildRceoBanner(showcaseRceoBanner, rceoDivision);
  buildShowcaseGrid(showcaseROGrid, roDivisionsWithoutRceo);
  buildShowcaseGrid(showcaseUkerGrid, divisionsUker);

  // Tombol "Klik Untuk Lihat Divisi Lainnya": buka section & scroll ke sana
  document.querySelectorAll(".showcase-more-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const body = document.getElementById(targetId);
      if (!body) return;

      closeDetail();
      if (body.classList.contains("collapsed")) {
        body.classList.remove("collapsed");
        const toggleBtn = targetId === "roBody" ? toggleRO : toggleUker;
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
      }

      requestAnimationFrame(() => {
        const topbar = document.querySelector(".topbar");
        let box = body.previousElementSibling;
        while (box && !box.classList.contains("section-title-box")) {
          box = box.previousElementSibling;
        }
        const anchor = box || body;
        const offset = (topbar ? topbar.offsetHeight : 0) + 8;
        const y = window.scrollY + anchor.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
      });
    });
  });
})();

/* ===== TEMA TOPBAR (terang/gelap mengikuti background) ===== */
(function setupTopbarThemeSwitch() {
  const topbar = document.querySelector(".topbar");
  const lightSections = document.querySelectorAll('[data-header-theme="light"]');
  if (!topbar || !lightSections.length) return;

  function updateTheme() {
    const probeY = topbar.offsetHeight / 2;
    let isLight = false;
    lightSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom >= probeY) isLight = true;
    });
    topbar.classList.toggle("topbar-light", isLight);
  }

  updateTheme();
  window.addEventListener("scroll", updateTheme, { passive: true });
  window.addEventListener("resize", updateTheme);
})();

/* ===== SLIDESHOW BACKGROUND HOME ===== */
(function setupHeroBgSlider() {
  const slides = document.querySelectorAll(".home-hero-bg-slide");
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 5000);
})();

function arrowUpRightSvg() {
  return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`;
}
