# 🌟 Katrina Hub - دليل خدمات وحرف أبناء الكنيسة (Full-Stack MERN Platform)

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-v18.3-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![JWT](https://img.shields.io/badge/JWT-Secure%20Auth-black?logo=jsonwebtokens)
![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-red)
![License](https://img.shields.io/badge/License-MIT-purple)

**منصة Katrina Hub المتكاملة لتوثيق وإدارة خدمات وحرف أبناء الكنيسة، مبنية بأحدث معايير الـ Full-Stack Web Development.**

[الميزات الرئيسية](#-الميزات-الرئيسية-features) • [الأمان والامتيازات](#-الأمان-وأفضل-الممارسات-security--best-practices) • [الهيكلية المعمارية](#-معمارية-المشروع-architecture) • [واجهات الـ API](#-توثيق-واجهات-البرمجة-api-documentation) • [التشغيل السريع](#-طريقة-التشغيل-locally) • [لوحة التحكم](#-بيانات-الدخول-للتجربة-demo-admin-credentials)

</div>

---

## 📖 نبذة عن المشروع (Overview)

منصة **Katrina Hub** هي نظام خدمات رقمي متطور يهدف إلى ربط أصحاب المهن والحرفيين الموثوقين بأفراد المجتمع الكنسي بكل سلاسة وموثوقية. بُنيت المنصة بأحدث معايير الـ **MERN Stack** المتطورة (MongoDB, Express, React, Node.js) وفق نمط المعمارية النظيفة (Clean Layered Architecture) مع تصميم استثنائي يدعم اللغة العربية (RTL) بشكل أصيل ومتجاوب مع كافة الأجهزة.

تتميز المنصة بنظام أمني صارم يفصل بدقة بين تصفح الجمهور العام والإدارة الكاملة عبر لوحة تحكم متقدمة ومحمية بـ JWT.

---

## 🛡 الأمان وأفضل الممارسات (Security & Best Practices)

تم تطبيق أقوى تدابير الأمن السيبراني لضمان سرية وسلامة البيانات ومنع الثغرات الشائعة (OWASP Top 10):

* **المصادقة المشفرة والجلسات الآمنة (JWT Auth):**
  - اعتماد تقنية `JSON Web Tokens` مع توقيع رقمي للمفاتيح وتحديد صلاحية انتهاء زمنية (`30d`).
  - عزل بيانات الدخول وحفظها في ترويسات مشفرة تمنع الاستيلاء على الجلسات.
* **تشفير كلمات المرور (Salt & Hash):**
  - استخدام خوارزمية `bcryptjs` مع توليد أملاح تشفير عشوائية (Salts) لمنع هجمات قواميس التخمين (Rainbow Tables).
* **حماية الترويسات والشبكة (Helmet & CORS):**
  - تفعيل `Helmet` لحقن ترويسات أمان HTTP التلقائية، ومنع هجمات Clickjacking، و Sniffing، و XSS.
  - فرض سياسات `CORS` دقيقة ومحددة تمنع استقبال الطلبات إلا من نطاق الواجهة الأمامية المصرح به حصرياً.
* **تقييد معدل الطلبات ومنع هجمات الحرمان (Rate Limiting & Anti-Spam):**
  - تطبيق `express-rate-limit` على واجهات التقييمات والبلاغات لمنع هجمات التكرار (Spam) وحماية تقييمات الفنيين، مع آلية حظر مؤقت لعنوان الـ IP عند محاولات التكرار غير الطبيعية.
* **تنقية المدخلات ومنع الحقن (NoSQL Injection & Sanitization):**
  - استخدام نماذج Mongoose مع Validation صارم لكافة الحقول لمنع تمرير استعلامات خبيثة إلى قاعدة البيانات.
* **فصل التقييمات عبر خط مراجعة إداري (Moderation Pipeline):**
  - المراجعات والتقييمات لا تُنشر تلقائياً؛ بل تمر بمرحلة فحص وتدقيق من قبل الأدمن لضمان المصداقية ومنع التقييمات الكيدية.
* **حماية الملفات والبيانات الحساسة:**
  - استبعاد كافة ملفات التكوين والبيئات الحساسة `.env` من مستودع Git عبر `.gitignore` دقيق.

---

## ✨ الميزات الرئيسية (Features)

### 1. البوابة العامة (Public Portal)
* **محرك بحث وتصفية متقدم:** فلترة ديناميكية وفورية بالاسم، التخصص الحرفي، أو المنطقة الجغرافية.
* **استعراض المهن:** شبكة بطاقات تفاعلية أنيقة تعرض المهن المتنوعة مع عدد مقدمي كل خدمة.
* **الأعلى تقييماً (Top Rated):** خوارزمية ذكية ترشح أفضل الفنيين بناءً على معدل التقييمات الإيجابية وعدد المراجعات الحقيقية.
* **ملف تفصيلي لمقدم الخدمة:** عرض نبذة العمل، سنوات الخبرة، ومعلومات الاتصال، مع زر اتصال هاتفي مباشر وزر مراسلة واتساب فورية بنقرة واحدة.
* **نظام التقييم بالنجوم:** إمكانية إضافة تقييم ومراجعة بالنجوم مع منع التكرار العشوائي وحماية الفنيين.
* **نظام بلاغات وشكاوى للمستخدمين:** نموذج فوري للإبلاغ عن أي ملاحظات أو بيانات غير صحيحة لمتابعتها إدارياً.
* **شريط إحصائيات حي:** عدادات حية تفاعلية توضح إجمالي المهن، مقدمي الخدمات، والمراجعات المعتمدة.

### 2. لوحة التحكم الإدارية (Admin Dashboard)
* **دخول إداري آمن ومحمي:** مصادقة متقدمة مع تحكم كامل في الصلاحيات.
* **لوحة مؤشرات الأداء (KPIs):** بطاقات إحصائية لإجمالي الخدمات المسجلة، التقييمات المعلقة بانتظار الاعتماد، والبلاغات المفتوحة.
* **إدارة مقدمي الخدمات (Providers CRUD):** إضافة فنيين جدد، تحديث بيانات، إيقاف/تفعيل الحسابات، وحذف الحسابات وسجلاتها التابعة.
* **إدارة المهن والتخصصات (Professions CRUD):** إضافة مهن وتصنيفات جديدة مع ربطها بأيقونات عصرية (Lucide Icons)، مع حماية تمنع حذف أي مهنة إذا كان يتبعها فنيون مسجلون.
* **نظام مراجعة واعتماد التقييمات (Review Moderation):** مراجعة التقييمات واعتمادها، مع إعادة احتساب المتوسط التراكمي للتقييم آلياً بواسطة الـ MongoDB Aggregation Pipeline.
* **إدارة ومتابعة البلاغات (Report Management):** فحص بلاغات المستخدمين، تغيير حالتها (محلول / قيد المتابعة)، أو اتخاذ إجراءات بحق المخالفين.

---

## 🏛 معمارية المشروع (Architecture)

```
services-directory/
├── server/                      # Node.js & Express RESTful API
│   ├── config/                  # ضبط الاتصال بقاعدة البيانات (db.js)
│   ├── controllers/             # منطق العمليات (Auth, Providers, Reviews, Reports)
│   ├── models/                  # نماذج Mongoose (User, Provider, Profession, Review, Report)
│   ├── routes/                  # مسارات الـ API العامة والخاصة المحمية
│   ├── middleware/              # حماية JWT ومعالجة الأخطاء والـ Rate Limiters
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
   git clone https://github.com/kirosaid-2006/services-directory.git
   cd services-directory
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

## 📄 الترخيص (License)
هذا المشروع مرخص بموجب رخصة [MIT License](LICENSE).
