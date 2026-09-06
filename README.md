# 🌟 Katrina Hub 
<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-v18.3-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![License](https://img.shields.io/badge/License-MIT-purple)

**منصة Katrina Hub المتكاملة لتوثيق وإدارة خدمات وحرف أبناء الكنيسة، مبنية بأحدث معايير الـ Full-Stack Web Development.**

[الميزات](#-الميزات-الرئيسية-features) • [الهيكلية](#-معمارية-المشروع-architecture) • [واجهات الـ API](#-توثيق-واجهات-البرمجة-api-documentation) • [التشغيل السريع](#-طريقة-التشغيل-locally) • [لوحة التحكم](#-بيانات-الدخول-للتجربة)

</div>



## ✨ الميزات الرئيسية (Features)

### 1. البوابة العامة (Public Portal)
* **محرك بحث متقدم:** فلترة ديناميكية وفورية بالاسم، التخصص، أو المنطقة/المحافظة.
* **استعراض المهن:** شبكة بطاقات تفاعلية تعرض المهن المتنوعة مع عدد مقدمي كل خدمة.
* **الأعلى تقييماً:** قسم ذكي يرشح أفضل الفنيين بناءً على معدل التقييمات الإيجابية وعدد المراجعات.
* **ملف تفصيلي لمقدم الخدمة:** عرض كافة بيانات الاتصال، التقييمات السابقة، مع زر اتصال هاتفي مباشر وزر محادثة واتساب فورية بنقرة واحدة.
* **نظام تقييمات محمي:** إمكانية إضافة تقييم بالنجوم مع منع التكرار العشوائي (30-day IP Rate Limiter)، وتوجيه المراجعات للاعتماد الإداري أولاً.
* **نظام بلاغات وشكاوى:** نموذج للمستخدمين للإبلاغ عن أي مخالفة أو بيانات غير صحيحة.
* **شريط إحصائيات حي:** عدادات حية توضح إجمالي المهن، مقدمي الخدمات، والمراجعات المعتمدة.

### 2. لوحة التحكم الإدارية (Admin Dashboard)
* **دخول آمن ومحمي:** مصادقة قائمة على JSON Web Tokens (JWT) مع تشفير كلمات المرور بـ Salt & Bcrypt.
* **لوحة مؤشرات الأداء (KPIs):** بطاقات إحصائية لإجمالي الخدمات، التقييمات المعلقة، والبلاغات المفتوحة.
* **إدارة مقدمي الخدمات (Providers CRUD):** إضافة، تعديل بيانات، تفعيل/تعطيل الحسابات، وحذف الحسابات مع بياناتها التابعة.
* **إدارة المهن والتخصصات (Professions CRUD):** إضافة مهن جديدة واختيار أيقوناتها (Lucide Icons)، مع حماية تمنع حذف أي مهنة إذا كان يتبعها فنيون مسجلون.
* **نظام مراجعة التقييمات (Review Moderation):** اعتماد التقييمات المعلقة ونشرها فوراً مع إعادة احتساب المتوسط التراكمي لمقدم الخدمة تلقائياً (`aggregate`).
* **إدارة الشكاوى والبلاغات (Report Management):** متابعة بلاغات المستخدمين، تعيينها كـ محلولة، أو حذفها بعد المتابعة.

---

## 🏛 معمارية المشروع (Architecture)

```
services-directory-mern/
├── server/                      # Node.js & Express RESTful API
│   ├── config/                  # ضبط الاتصال بقاعدة البيانات (db.js)
│   ├── controllers/             # منطق العمليات (Auth, Providers, Reviews, etc.)
│   ├── models/                  # نماذج Mongoose (User, Provider, Profession, Review, Report)
│   ├── routes/                  # مسارات الـ API العامة والخاصة
│   ├── middleware/              # حماية JWT ومعالجة الأخطاء
│   ├── seeds/                   # سكريبت تهيئة البيانات الأولية (seedData.js)
│   ├── .env.example             # نموذج المتغيرات البيئية
│   └── server.js                # نقطة انطلاق الخادم الرئيسي
├── client/                      # React (Vite) Frontend Application
│   ├── src/
│   │   ├── components/          # المكونات المشتركة (Navbar, Footer, StarRating, Modals)
│   │   ├── context/             # إدارة حالة المصادقة (AuthContext.jsx)
│   │   ├── pages/               # الصفحات (Home, ProfessionDetail, AdminDashboard, etc.)
│   │   ├── services/            # وسيط الـ API والـ Axios Interceptors
│   │   ├── App.jsx              # مسارات React Router
│   │   └── main.jsx
│   ├── tailwind.config.js       # إعدادات التصميم والخطوط
│   └── vite.config.js           # إعدادات Vite والبروكسي
├── .github/workflows/ci.yml     # أتمتة الاختبار والبناء (GitHub Actions)
├── .gitignore                   # حماية الملفات الحساسة وعدم رفع .env
└── package.json                 # تشغيل السيرفر والفرونت معاً (Concurrently)
```

---

## 🔌 توثيق واجهات البرمجة (API Documentation)

### 🔐 المصادقة (Authentication)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | تسجيل دخول الأدمن واستخراج توكن JWT | Public |
| `GET` | `/api/auth/me` | التحقق من جلسة الأدمن الحالية | Private (Admin) |

### 🛠 المهن والتخصصات (Professions)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/professions` | جلب جميع المهن مع عدد الفنيين النشطين | Public |
| `GET` | `/api/professions/:id` | جلب تفاصيل مهنة محددة مع الفنيين التابعين لها | Public |
| `POST` | `/api/professions` | إضافة مهنة جديدة | Private (Admin) |
| `PUT` | `/api/professions/:id` | تعديل مهنة | Private (Admin) |
| `DELETE`| `/api/professions/:id` | حذف مهنة (إذا لم تكن مرتبطة بفنيين) | Private (Admin) |

### 👷 مقدمو الخدمات (Providers)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/providers` | جلب مقدمي الخدمات مع الفلترة والبحث | Public |
| `GET` | `/api/providers/top` | جلب مقدمي الخدمات الأعلى تقييماً للصفحة الرئيسية | Public |
| `GET` | `/api/providers/:id` | جلب الملف الكامل لمقدم الخدمة مع مراجعاته | Public |
| `POST` | `/api/providers` | إضافة مقدم خدمة جديد | Private (Admin) |
| `PUT` | `/api/providers/:id` | تعديل بيانات مقدم خدمة | Private (Admin) |
| `DELETE`| `/api/providers/:id` | حذف مقدم خدمة وجميع مراجعاته وبلاغاته | Private (Admin) |

### ⭐ التقييمات والمراجعات (Reviews)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/reviews` | إرسال تقييم لمقدم خدمة (Rate Limited) | Public |
| `GET` | `/api/reviews` | استعراض التقييمات (المعلقة والمعتمدة) | Private (Admin) |
| `PATCH`| `/api/reviews/:id/approve` | اعتماد تقييم ونشره وتحديث المتوسط تلقائياً | Private (Admin) |
| `DELETE`| `/api/reviews/:id` | حذف مراجعة | Private (Admin) |

### 🚩 البلاغات والشكاوى (Reports)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/reports` | إرسال شكوى أو بلاغ عن مقدم خدمة | Public |
| `GET` | `/api/reports` | استعراض كافة البلاغات | Private (Admin) |
| `PATCH`| `/api/reports/:id/resolve` | تغيير حالة البلاغ (محلول / مفتوح) | Private (Admin) |
| `DELETE`| `/api/reports/:id` | حذف بلاغ | Private (Admin) |

### 📊 الإحصائيات (Stats)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/stats` | إحصائيات حية وشاملة للمنصة | Public |

---

## 🚀 طريقة التشغيل (Locally)

### المتطلبات الأساسية
* **Node.js** (إصدار 18 أو أحدث)
* **MongoDB** (مثبت محلياً أو حساب مجاني على MongoDB Atlas)
* **Git**

### خطوات التثبيت:

1. **استنساخ المستودع (Clone the repository):**
   ```bash
   git clone https://github.com/your-username/services-directory-mern.git
   cd services-directory-mern
   ```

2. **تثبيت حزم الخادم والواجهة (Install dependencies):**
   ```bash
   # تثبيت حزم الجذر
   npm install

   # تثبيت حزم الباك إند
   cd server && npm install

   # تثبيت حزم الفرونت إند
   cd ../client && npm install
   cd ..
   ```

3. **إعداد المتغيرات البيئية (Environment Variables):**
   - في مجلد `server/`: أنشئ ملف `.env` واملأ المتغيرات استناداً إلى `server/.env.example`:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=mongodb://127.0.0.1:27017/services_directory
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRE=30d
     CLIENT_URL=http://localhost:5173
     ```
   - في مجلد `client/`: أنشئ ملف `.env`:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

4. **زرع البيانات الأولية تلقائياً (Database Seeding):**
   قم بتشغيل الأمر التالي لتهيئة المهن الأساسية، الفنيين التجريبيين، وحساب الأدمن:
   ```bash
   npm run seed
   ```

5. **تشغيل المشروع كاملاً بأمر واحد (Run Development Servers):**
   ```bash
   npm run dev
   ```
   - الواجهة الأمامية: `http://localhost:5173`
   - الخادم والـ API: `http://localhost:5000`

---

## 🔑 بيانات الدخول للتجربة (Demo Admin Credentials)

عند تشغيل سكريبت الـ `seed`، يتم تلقائياً إنشاء حساب المدير التالي لتجربة لوحة التحكم:
* **رابط صفحة الدخول:** `http://localhost:5173/admin/login`
* **اسم المستخدم (Username):** `admin`
* **كلمة المرور (Password):** `admin123`

---

## 🛡 الأمان وأفضل الممارسات (Security & Best Practices)

- **حماية البيانات الحساسة:** الكود المصدري خالي تماماً من أي كلمات مرور أو مفاتيح سرية، وتعتمد جميع الاتصالات على ملفات `.env` المحمية عبر `.gitignore`.
- **حماية الـ API:** تطبيق `Helmet` لإضافة ترويسات الأمان (HTTP Headers)، و `CORS` لمنع الطلبات غير المصرح بها، و `express-rate-limit` لمنع هجمات الـ DoS أو التكرار المفرط.
- **تشفير كلمات المرور:** استخدام مكتبة `bcryptjs` مع التوليد العشوائي للـ Salt قبل حفظ كلمات المرور.
- **التحقق وتصفية المدخلات:** تحقق كامل على مستوى نماذج Mongoose من صحة البيانات وحقول الإدخال.

---

## 📄 الترخيص (License)
هذا المشروع مرخص بموجب رخصة [MIT License](LICENSE).
