const cardsGrid = document.getElementById("cardsGrid");
const sidebarList = document.getElementById("sidebarList");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuBtn = document.getElementById("menuBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

const detailView = document.getElementById("detailView");
const detailTitle = document.getElementById("detailTitle");
const detailFrame = document.getElementById("detailFrame");
const backBtn = document.getElementById("backBtn");

//img preview gambar
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

//upload files agar dapat di download
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

// side bar
divisions.forEach(div => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#" + div.id;
  a.textContent = div.title;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebar();
    showMain();
    document.getElementById(div.id).scrollIntoView({ behavior: "smooth" });
  });
  li.appendChild(a);
  sidebarList.appendChild(li);
});

// Card per divisi
function buildDivisionCard(div) {
  const card = document.createElement("div");
  card.className = "division-card";
  card.id = div.id;

  const pointsHtml = div.points.length
    ? `<p class="card-note">Silakan unduh berkas jabatan disini.</p><ul class="point-list"></ul>`
    : "";

  card.innerHTML = `
    <img src="${div.image}" alt="${div.title}" loading="lazy" onerror="this.style.display='none'">
    <h4>${div.title}</h4>
    <a class="download-btn" href="${resolveDownloadUrl(div.downloadId)}" target="_blank" rel="noopener">DOWNLOAD</a>
    ${pointsHtml}
  `;

  if (div.points.length) {
    const list = card.querySelector(".point-list");
    div.points.forEach(point => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = point.title;
      btn.addEventListener("click", () => openDetail(point));
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  return card;
}

// RCEO sendiri ditengah atas grid
const rceoDivision = divisions[0];
const otherDivisions = divisions.slice(1);

const rceoWrap = document.createElement("section");
rceoWrap.className = "rceo-wrap";
const rceoCard = buildDivisionCard(rceoDivision);
rceoWrap.appendChild(rceoCard);
cardsGrid.parentNode.insertBefore(rceoWrap, cardsGrid);

//grid card yang lainnya
otherDivisions.forEach(div => {
  cardsGrid.appendChild(buildDivisionCard(div));
});

//samain lebar card
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

// BUKA / TUTUP SIDEBAR
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

// TAMPILAN DETAIL JABATAN
function openDetail(point) {
  detailTitle.textContent = point.title;


  if (isImageFile(point.fileId)) { //kalau dari gdrive
    detailFrame.src = "";
    detailFrame.style.display = "none";
    detailImage.src = resolvePreviewUrl(point.fileId);
    detailImage.style.display = "block";
  } else { //kalau dari local
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