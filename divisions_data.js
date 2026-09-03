// Data divisi dan poin-poin jabatan untuk halaman Regional Office 11
const divisions = [
 {
  "id": "rceo",
  "title": "RCEO",
  "downloadId": "files/RCEO.pdf",
  "points": [
    { "title": "REGIONAL CHIEF EXECUTIVE OFFICER (RCEO)", "fileId": "files/2.pdf" }
  ]
},
  {
    "id": "regional-sme-banking",
    "title": "REGIONAL SME BANKING",
    "downloadId": "files/Regional SME Banking.pdf",
    "points": [
      { "title": "REGIONAL SME BANKING HEAD", "fileId": "files/4.pdf" },
      { "title": "SMALL BUSINESS DEPARTMENT HEAD", "fileId": "files/5.pdf" },
      { "title": "MEDIUM BUSINESS DEPARTMENT HEAD", "fileId": "files/6.pdf" }
    ]
  },
  {
    "id": "regional-micro-banking",
    "title": "REGIONAL MICRO BANKING",
    "downloadId": "files/Regional Micro Banking Head.pdf",
    "kpiEnabled": true,
    "kpiGid": "519583074",
    "kpiHeight":480,
    "kpiLabel": "Penetapan Key Performance Indicator\nRegional Micro Banking Head Tahun 2026",
    "points": [
      { "title": "REGIONAL MICRO BANKING HEAD", "fileId": "files/8.pdf" },
      { "title": "MICRO BUSINESS DEPARTMENT HEAD", "fileId": "files/9.pdf" },
      { "title": "MICRO ECOSYSTEM 1 & 2 DEPARTMENT HEAD", "fileId": "files/10.pdf" },
      { "title": "MICRO BUSINESS AREA MANAGER", "fileId": "files/11.pdf" },
      { "title": "MICRO BUSINESS AREA ASISTEN", "fileId": "files/12.pdf" }
    ]
  },
  {
    "id": "regional-funding-retail-transaction-banking",
    "title": "REGIONAL FUNDING & RETAIL TRANSACTION BANKING",
    "downloadId": "files/Regional Funding and Retail Banking.pdf",
    "points": [
      { "title": "REGIONAL FUNDING TRANSACTION BANKING HEAD", "fileId": "files/14.pdf" },
      { "title": "MASS FUNDING DEPARTMENT HEAD", "fileId": "files/15.pdf" },
      { "title": "RETAIL PAYMENT & MERCHANT RELATIONSHIP DEPARTMENT HEAD", "fileId": "files/16.pdf" },
      { "title": "TEAM LEADER - FUNDING & RETAIL TRANSACTION SALES", "fileId": "images/17.jpg" }
    ]
  },
  {
    "id": "regional-consumer-banking",
    "title": "REGIONAL CONSUMER BANKING",
    "downloadId": "files/Regional Consumer Banking Head.pdf",
    "kpiEnabled": true,
    "kpiGid": "1194928475",
    "kpiHeight": 480,
    "kpiLabel": "Penetapan Key Performance Indicator\nRegional Consumer Banking Head (RCBH) Tahun 2026",
    "points": [
      { "title": "REGIONAL CONSUMER BANKING HEAD", "fileId": "files/19.pdf" },
      { "title": "MORTGAGE DEPARTMENT HEAD", "fileId": "files/20.pdf" },
      { "title": "SALARY BASED LOAN & CREDIT CARD DEPARTMENT HEAD", "fileId": "files/21.pdf" },
      { "title": "SBL CC - SECTION HEAD", "fileId": "files/22.pdf" }
    ]
  },
  {
    "id": "regional-risk-management",
    "title": "REGIONAL RISK MANAGEMENT",
    "downloadId": "files/Regional Risk Management.pdf",
    "points": [
      { "title": "REGIONAL RISK MANAGEMENT HEAD", "fileId": "files/24.pdf" },
      { "title": "TEAM LEADER - CREDIT RISK ANALYSIS", "fileId": "files/25.pdf" },
      { "title": "TEAM LEADER - RISK MANAGEMENT & COMPLIANCE", "fileId": "files/26.pdf" },
      { "title": "MICRO & RETAIL RISK & COMPLIANCE", "fileId": "files/27.pdf" }
    ]
  },
  {
    "id": "regional-operation-banking",
    "title": "REGIONAL BUSINESS SUPPORT HEAD",
    "downloadId": "files/Regional Business Support Head.pdf",
    "kpiEnabled": true,
    "kpiGid": "1696468939",
    "kpiHeight": 480,
    "kpiLabel": "Penetapan Key Performance Indicator\nRegional Business Support Head Tahun 2026",
    "points": [
      { "title": "REGIONAL OPERATION HEAD", "fileId": "files/29.pdf" },
      { "title": "OPERATION, NETWORK & SERVICE DEPARTMENT HEAD", "fileId": "files/30.pdf" },
      { "title": "ACCOUNTING SECTION HEAD", "fileId": "files/31.pdf" },
      { "title": "OPERATION, NETWORK & SERVICE SECTION HEAD", "fileId": "files/32.pdf" },
      { "title": "LOGISTIC & GENERAL AFFAIR DEPARTMENT HEAD", "fileId": "files/33.pdf" },
      { "title": "FIXED ASSETS MANAGEMENT & PROCUREMENT SECTION HEAD", "fileId": "files/34.pdf" },
      { "title": "SINERGY BACK OFFICE LOGISTIC SECTION HEAD", "fileId": "files/35.pdf" },
      { "title": "PUBLIC RELATION & PROTOCOL SECTION HEAD", "fileId": "files/36.pdf" },
      { "title": "SECRETARY RO", "fileId": "files/37.pdf" },
      { "title": "INFORMATION TECHNOLOGY & E CHANNEL DEPARTMENT HEAD", "fileId": "files/38.pdf" },
      { "title": "INFORMATION TECHNOLOGY SECTION HEAD", "fileId": "files/39.pdf" },
      { "title": "EDC SECTION HEAD", "fileId": "files/40.pdf" },
      { "title": "ATM/CRM SECTION HEAD", "fileId": "files/41.pdf" },
      { "title": "CREDIT OPERATIONAL DEPARTMENT HEAD", "fileId": "files/42.pdf" },
      { "title": "CREDIT OPERATIONAL SECTION HEAD", "fileId": "files/43.pdf" }
    ]
  }
];


// Data untuk section "Unit Kerja Operasional"
const divisionsUker = [
  {
    "id": "pemimpin-uker",
    "title": "PEMIMPIN UKER",
    "downloadId": "files/Pemimpin Unit Kerja.pdf",
    "points": [
      { "title": "PEMIMPIN CABANG", "fileId": "files/45.pdf" },
      { "title": "PEMIMPIN CABANG PEMBANTU", "fileId": "files/46.pdf" },
      { "title": "KEPALA UNIT", "fileId": "files/47.pdf" }
    ]
  },
  {
    "id": "manajer-uker",
    "title": "MANAJER UKER",
    "downloadId": "files/Manajer UKER.pdf",
    "kpiEnabled": true,
    "kpiGid": "1349675824",
    "kpiHeight": 480,
    "kpiLabel": "Penetapan Key Performance Indicator\nMicro Business Manager, Consumer Business Manager, Priority Business Manager Tahun 2026",
    "points": [
      { "title": "MANAJER BISNIS KECIL", "fileId": "files/52.pdf" },
      { "title": "MANAJER BISNIS MIKRO", "fileId": "files/54.pdf" },
      { "title": "MANAJER BISNIS MIKRO ER (MBA)", "fileId": "files/56.pdf" },
      { "title": "MANAJER BISNIS KONSUM", "fileId": "files/53.pdf" },
      { "title": "MANAJER BANKING PRIORITY", "fileId": "files/50.pdf" },
      { "title": "MANAJER DANA & TRANSAKSI", "fileId": "files/51.pdf" },
      { "title": "MANAJER OPERASIONAL", "fileId": "files/55.pdf" },
      { "title": "AST MANAJER OPERASIONAL & LAYANAN", "fileId": "files/49.pdf" }
    ]
  },
  {
    "id": "supervisor-uker",
    "title": "SUPERVISOR UKER",
    "downloadId": "files/Supervisor UNIT KERJA.pdf",
    "points": [
      { "title": "SPV OPERASIONAL & LAYANAN", "fileId": "files/58.pdf" },
      { "title": "SPV OPERASIONAL/LAYANAN ", "fileId": "files/59.pdf" },
      { "title": "SPV OPERASIONAL KREDIT", "fileId": "files/60.pdf" },
      { "title": "SPV PENUNJANG OPERASIONAL", "fileId": "files/61.pdf" }
    ]
  },
  {
    "id": "marketing",
    "title": "MARKETING",
    "downloadId": "files/Marketing.pdf",
    "kpiEnabled": true,
    "kpiGid": "679117388",
    "kpiHeight": 480,
    "kpiLabel": "Penetapan Key Performance Indicator\nMantri, RM Mikro, RM BRIGuna, RM KPR, RM Priority Tahun 2026",
    "points": [
      { "title": "RM BISNIS KECIL (SME)", "fileId": "files/66.pdf" },
      { "title": "RM DANA & TRANSAKSI", "fileId": "files/68.pdf" },
      { "title": "RM BISNIS KPR", "fileId": "files/67.pdf" },
      { "title": "RM BISNIS BRIGUNA", "fileId": "files/65.pdf" },
      { "title": "RM PRIORITY", "fileId": "files/69.pdf" },
      { "title": "MANTRI", "fileId": "files/64.pdf" },
      { "title": "RM CREDIT RESTRUCTURING & RECOVERY", "fileId": "files/63.pdf" }
    ]
  },
  {
    "id": "frontliner",
    "title": "FRONTLINER",
    "downloadId": "files/Frontliner.pdf",
    "points": [
      { "title": "PRIORITY BANKING ASISSTANT", "fileId": "files/71.pdf" },
      { "title": "CUSTOMER SERVICE (RITEL)", "fileId": "files/72.pdf" },
      { "title": "CUSTOMER SERVICE (UNIT)", "fileId": "files/73.pdf" },
      { "title": "TELLER (RITEL)", "fileId": "files/74.pdf" },
      { "title": "TELLER (UNIT)", "fileId": "files/75.pdf" },
      { "title": "UNIVERSAL BANKER", "fileId": "files/76.pdf" }
    ]
  },
  {
    "id": "support",
    "title": "SUPPORT",
    "downloadId": "files/Support.pdf",
    "points": [
      { "title": "PET OPERASIONAL KREDIT", "fileId": "files/79.pdf" },
      { "title": "PETUGAS TRANSAKSI", "fileId": "files/82.pdf" },
      { "title": "PETUGAS IT & ECHANNEL", "fileId": "files/80.pdf" },
      { "title": "PET PENUNJANG OPERASIONAL", "fileId": "files/84.pdf" },
      { "title": "SEKRETARIS", "fileId": "files/83.pdf" },
      { "title": "PET PENUNJANG BISNIS", "fileId": "files/81.pdf" },
      { "title": "PET PENUNJANG BISNIS KEAGENAN", "fileId": "files/78.pdf" }
    ]
  }
];
