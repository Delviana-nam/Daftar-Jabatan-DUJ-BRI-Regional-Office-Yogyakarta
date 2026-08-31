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
const kpiImage = document.getElementById("kpiImage");
const kpiImagePath = "images/KPI.jpg";

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

buildSidebarGroup("1. DUJ RO Jogja", "group-ro", divisions);
buildSidebarGroup("2. DUJ Unit Kerja", "group-uker", divisionsUker);

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

buildSidebarGroupKPI("3. KPI", "group-kpi", "KPI Regional Office Area KC, KCP dan BRI Unit", () => {
  closeSidebar();
  showMain();

  /* box KPI*/
  if (kpiBody.classList.contains("collapsed")) {
    kpiBody.classList.remove("collapsed");
    toggleKPI.setAttribute("aria-expanded", "true");
  }
  if (!kpiFrame.src) {
    kpiFrame.src = resolvePreviewUrl(kpiPdfPath);
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

  card.innerHTML = `
    <img src="${div.image || ''}" alt="${div.title}" loading="lazy" onerror="this.style.display='none'">
    <h4>${div.title}</h4>
    <a class="download-btn" href="${resolveDownloadUrl(div.downloadId)}" target="_blank" rel="noopener">DOWNLOAD</a>
    ${pointsHtml}
  `;

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

/*grid card Regional Office8*/
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
kpiImage.src = resolvePreviewUrl(kpiImagePath);


/*TAMPILAN DETAIL JABATAN*/
function openDetail(point) {
  detailTitle.textContent = point.title;

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

  detailView.classList.add("show");
  window.scrollTo(0, 0);
}

function showMain() {
  detailView.classList.remove("show");
  detailFrame.src = "";
  detailImage.src = "";
}

backBtn.addEventListener("click", showMain);
