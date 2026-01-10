<div align="center">

# 📊 HR Analytics Platform

### Xodimlar Davomati va Intizomini Tahlil Qilish Tizimi

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18-90C53F?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![JWT](https://img.shields.io/badge/JWT-Secure-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Professional HR Analytics Platform** - Excel asosida ishlaydigan zamonaviy React dashboard bo'lib, backend API va PostgreSQL bilan to'liq integratsiyalashgan. Xodimlarning davomat va intizom ko'rsatkichlarini real vaqtda tahlil qiling.

[🚀 Tezkor Boshlash](#-tezkor-boshlash) • [📦 O'rnatish](#-ornatish) • [📖 Qo'llanma](#-foydalanish) • [🏗️ Arxitektura](#-arxitektura)

</div>

---

## ✅ Status: Fully Integrated & Production Ready

✅ **Frontend** - React 18 + TypeScript + Vite (http://localhost:5173)
✅ **Backend** - Express.js + JWT Authentication (http://localhost:5001)  
✅ **Database** - Neon PostgreSQL with full schema
✅ **API Layer** - Centralized service for all backend calls
✅ **Authentication** - JWT tokens with auto-expiry
✅ **File Import** - Excel parsing + bulk database insert
✅ **Real-time Data** - Frontend synced with database

---

## 🚀 Tezkor Boshlash

### Talablar
- Node.js 22+
- PostgreSQL (Neon account)
- Git

### O'rnatish va Ishga Tushirish

```bash
# Backend-ni ishga tushirish
cd backend
npm install
npm run db:seed
npm run dev
# Server: http://localhost:5001

# Frontend-ni ishga tushirish (yangi terminal)
cd hr-analytics  
npm install
npm run dev
# App: http://localhost:5173
```

### Test Credentials
```
Admin:
  Username: admin
  Password: password123

Manager:
  Username: manager
  Password: password123

Accountant:
  Username: accountant
  Password: password123
```

---

## 📋 Documentation

| Document | Maqsad |
|----------|--------|
| **INTEGRATION_COMPLETE.md** | To'liq integratsiya tavsifi |
| **ARCHITECTURE.md** | Sistema arxitekturasi va diagrammalar |
| **API_USAGE_GUIDE.md** | API xizmatini React komponentalarda qo'llash |
| **DEVELOPMENT_CHECKLIST.md** | Keyingi bosqichlar va kod namunalari |
| **DATA_FLOW.md** | Ma'lumot oqimining arxitekturasi |
| **QUICK_START.md** | Tez ishlatiladigan qo'llanma |

---

## 🏗️ Arxitektura
- **English** - International support

### 📥 Smart Import System
| Xususiyat | Tavsif |
|-----------|--------|
| 📁 **Drag & Drop** | Excel/CSV fayllarni oson yuklash |
| 👁️ **Preview** | Import qilishdan oldin ko'rish |
| 🔍 **Auto-detect** | Ustunlarni avtomatik aniqlash |
| ✅ **Validation** | Xatoliklarni tekshirish |
| 📅 **Time Period** | Avtomatik yil aniqlash (row 7) |
| 🔄 **Cross-year** | 2 yillik davrlarni qo'llab-quvvatlash |

### 📊 Dashboard
- **Umumiy statistika** - Xodimlar, davomat, qoidabuzarliklar
- **Bo'lim filtri** - Multi-select bo'lim tanlash
- **Davr filtri** - Zamonaviy 2 oylik kalendar
- **TOP ro'yxatlar** - Eng ko'p kech qolganlar, erta ketganlar, kelmaganlar
- **Intizomli xodimlar** - Eng yaxshi ko'rsatkichli xodimlar
- **Bo'limlar tahlili** - Sortable jadval

### 📈 Grafiklar
| Grafik | Tavsif |
|--------|--------|
| 🥧 **Pie Chart** | Davomat holati taqsimoti |
| 📊 **Bar Chart** | Bo'limlar bo'yicha taqqoslash |
| 📈 **Area Chart** | Kunlik trend tahlili |
| 🗓️ **Heatmap** | Oylik davomat kalendari |

### 👥 Xodimlar Ro'yxati
- **Multi-select filter** - Bo'limlar bo'yicha
- **Sortable columns** - Barcha ustunlar bo'yicha tartiblash
- **Search** - Ism bo'yicha qidirish
- **Pagination** - Sahifalash
- **Export** - Ma'lumotlarni eksport qilish

### ⚙️ Admin Panel
- 🧹 **Reset** - Bazani to'liq tozalash
- 🔄 **Re-import** - Qayta yuklash
- ⏪ **Rollback** - Oxirgi importni bekor qilish
- 📦 **History** - Import tarixi

---

## 🛠️ Texnologiyalar

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind
</td>
</tr>
</table>

### Dependencies

| Paket | Versiya | Tavsif |
|-------|---------|--------|
| `react` | ^18.2.0 | UI Framework |
| `typescript` | ^5.2.2 | Type Safety |
| `vite` | ^7.3.0 | Build Tool |
| `tailwindcss` | ^3.4.0 | CSS Framework |
| `zustand` | ^4.4.7 | State Management |
| `recharts` | ^2.10.3 | Charts Library |
| `xlsx` | ^0.18.5 | Excel Parsing |
| `date-fns` | ^3.0.6 | Date Utilities |
| `@radix-ui/*` | latest | UI Components |
| `lucide-react` | ^0.303.0 | Icons |
| `react-day-picker` | latest | Date Picker |

---

## 📦 O'rnatish

### Talablar
- Node.js 18+ 
- npm 9+ yoki yarn 1.22+

### Qadamlar

```bash
# 1. Repository ni clone qiling
git clone https://github.com/Kamoliddin0606/Employee-Churn-Prediction.git

# 2. Loyiha papkasiga o'ting
cd Employee-Churn-Prediction/hr-analytics

# 3. Dependencies o'rnating
npm install

# 4. Development server ishga tushiring
npm run dev

# 5. Brauzerda oching
# http://localhost:5173
```

### Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```

---

## 📂 Loyiha Strukturasi

```
hr-analytics/
├── public/
│   └── gloriya-logo.png          # Kompaniya logosi
├── src/
│   ├── components/
│   │   ├── ui/                   # Shadcn UI komponentlari
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── date-range-picker.tsx  # Zamonaviy kalendar
│   │   │   ├── popover.tsx
│   │   │   └── ...
│   │   ├── Dashboard.tsx         # Asosiy dashboard
│   │   ├── Charts.tsx            # Grafiklar sahifasi
│   │   ├── EmployeeList.tsx      # Xodimlar ro'yxati
│   │   ├── FileImport.tsx        # Import komponenti
│   │   └── AdminPanel.tsx        # Sozlamalar
│   ├── i18n/
│   │   ├── translations.ts       # Tarjimalar (uz, ru, en)
│   │   └── index.ts              # Language context
│   ├── store/
│   │   └── useStore.ts           # Zustand store
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── utils/
│   │   ├── excelParser.ts        # Excel parsing logic
│   │   └── attendanceCalculator.ts
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   ├── App.tsx                   # Main app
│   └── main.tsx                  # Entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📋 Excel Fayl Formati

### Asosiy Ustunlar

| Ustun | Tavsif | Majburiy |
|-------|--------|----------|
| `Name` | Xodim F.I.SH | ✅ |
| `ID` | Unikal xodim ID | ✅ |
| `Department` | Bo'lim nomi | ✅ |
| `12-01`, `12-02`, ... | Sana ustunlari | ✅ |

### Time Period (7-qator)

Excel faylning 7-qatorida quyidagi formatda davr ko'rsatilishi kerak:

```
:Time Period: 2025-12-01 - 2025-12-31:
```

**Qo'llab-quvvatlanadigan formatlar:**
- `YYYY-MM-DD - YYYY-MM-DD` (tavsiya etiladi)
- `MM/DD/YYYY - MM/DD/YYYY`
- `DD.MM.YYYY - DD.MM.YYYY`

### Status Kodlari

| Kod | Tavsif | Rang | Qoidabuzarlik |
|-----|--------|------|---------------|
| `W` | Well - Tartibli | 🟢 Yashil | ❌ |
| `L` | Late - Kech qolgan | 🟡 Sariq | ✅ |
| `E` | Early - Erta ketgan | 🟠 To'q sariq | ✅ |
| `LE` | Late + Early | 🔴 Qizil | ✅ |
| `A` | Absent - Kelmagan | ⚫ Qora | ✅ |
| `NS` | No Schedule | ⚪ Kulrang | ❌ |
| `H` | Holiday - Bayram | 🔵 Ko'k | ❌ |

### Namuna Excel

```
Row 7: :Time Period: 2025-12-01 - 2025-12-31:

| Name                 | ID    | Department          | 12-01 | 12-02 | 12-03 |
|----------------------|-------|---------------------|-------|-------|-------|
| FERUZA SOBIRJONOVA   | 03765 | All Departments>ACC | L     | A     | W     |
| ZULAYXO PAZLIDDINOVA | 03261 | All Departments>HR  | W     | E     | LE    |
| SARDOR KARIMOV       | 04521 | All Departments>IT  | W     | W     | W     |
```

> **Eslatma:** `All Departments>` prefiksi avtomatik olib tashlanadi va bo'lim nomi UPPERCASE ga o'zgartiriladi.

---

## 🎨 UI/UX Xususiyatlari

### Dizayn
- ✅ **Modern** - Zamonaviy minimalist dizayn
- ✅ **Responsive** - Mobile, Tablet, Desktop
- ✅ **Dark/Light Mode** - Tema tanlash
- ✅ **Accessibility** - WCAG 2.1 standartlari

### Komponentlar
- 📅 **Date Range Picker** - 2 oylik yonma-yon kalendar
- 📊 **Interactive Charts** - Hover, click, zoom
- 🔍 **Smart Filters** - Multi-select, search
- 📋 **Sortable Tables** - Barcha ustunlar
- 🎯 **Collapsible Panels** - Yig'iladigan panellar

### Animatsiyalar
- Smooth transitions
- Loading states
- Hover effects
- Toast notifications

---

## 🔧 Konfiguratsiya

### Ish Vaqti Sozlamalari

`src/utils/attendanceCalculator.ts` faylida:

```typescript
const WORK_START = 9 * 60;        // 09:00
const WORK_END = 18 * 60;         // 18:00
const LATE_TOLERANCE = 5;         // 5 daqiqa
const EARLY_LEAVE_TOLERANCE = 10; // 10 daqiqa
```

### Til Qo'shish

`src/i18n/translations.ts` faylida yangi til qo'shing:

```typescript
export const translations = {
  uz: { /* O'zbek */ },
  ru: { /* Русский */ },
  en: { /* English */ },
  // Yangi til:
  tr: { /* Türkçe */ },
};
```

---

## 📊 Foydalanish

### 1. Import
1. **Import** sahifasiga o'ting
2. Excel faylni drag-and-drop qiling yoki tanlang
3. Preview jadvalni tekshiring
4. **Import** tugmasini bosing

### 2. Dashboard
1. Umumiy statistikani ko'ring
2. Bo'lim filtrini tanlang
3. Davr filtrini sozlang
4. TOP ro'yxatlarni tahlil qiling

### 3. Grafiklar
1. Davr filtrini tanlang
2. Turli grafiklarni ko'ring
3. Hover qilib batafsil ma'lumot oling

### 4. Xodimlar
1. Bo'lim bo'yicha filter
2. Ustun bo'yicha tartiblash
3. Ism bo'yicha qidirish

### 5. Sozlamalar
1. Bazani tozalash
2. Import tarixini ko'rish
3. Rollback qilish

---

## 🤝 Hissa Qo'shish

Loyihaga hissa qo'shishni xohlovchilar uchun:

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

---

## 📝 Changelog

### v1.0.0 (2025-01)
- ✅ Asosiy dashboard
- ✅ Excel import
- ✅ Ko'p tilli interfeys (uz, ru, en)
- ✅ Zamonaviy date range picker
- ✅ Bo'lim va davr filtrlari
- ✅ Sortable jadvallar
- ✅ Grafiklar va vizualizatsiya
- ✅ Admin panel

---

## � Litsenziya

MIT License - batafsil [LICENSE](LICENSE) faylida.

---

## 👨‍💻 Muallif

**Kamoliddin** - [GitHub](https://github.com/Kamoliddin0606)

---

<div align="center">

### ⭐ Loyiha yoqsa, yulduzcha qo'ying!

**HR Analytics Platform** © 2025

</div>
