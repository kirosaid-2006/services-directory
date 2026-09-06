// Katrina Hub - Authentic Default Data (Fully Functional Across All Features)

export const initialProfessions = [
  { _id: 'prof-1', name: 'سباكة', icon: 'fas fa-faucet', description: 'تأسيس وصيانة السباكة والصحي' },
  { _id: 'prof-2', name: 'كهرباء', icon: 'fas fa-bolt', description: 'أعمال الكهرباء واللوحات والإنارة' },
  { _id: 'prof-3', name: 'نجارة', icon: 'fas fa-hammer', description: 'تصنيع وصيانة الأثاث والمطابخ والأبواب' },
  { _id: 'prof-4', name: 'نقاشة ودهانات', icon: 'fas fa-paint-roller', description: 'دهانات وديكورات داخلية وخارجية' },
  { _id: 'prof-5', name: 'تكييف وتبريد', icon: 'fas fa-snowflake', description: 'صيانة وتركيب وشحن التكييفات' },
  { _id: 'prof-6', name: 'صيانة أجهزة منزلية', icon: 'fas fa-tools', description: 'صيانة الغسالات والثلاجات والبوتاجازات' },
  { _id: 'prof-7', name: 'أطباء ورعاية صحية', icon: 'fas fa-heartbeat', description: 'خدمات واستشارات طبية' },
  { _id: 'prof-8', name: 'خدمات سيارات', icon: 'fas fa-car', description: 'ميكانيكا وكهرباء وعفشة سيارات' },
  { _id: 'prof-9', name: 'نقل وتوصيل', icon: 'fas fa-truck', description: 'نقل أثاث وبضائع وشحن خفيف' },
  { _id: 'prof-10', name: 'تعليم وتدريس', icon: 'fas fa-graduation-cap', description: 'دروس ومتابعة تعليمية' },
  { _id: 'prof-11', name: 'حدادة وألوميتال', icon: 'fas fa-industry', description: 'شبابيك وأبواب ألوميتال وحديد كريتال' },
  { _id: 'prof-12', name: 'استشارات قانونية', icon: 'fas fa-scale-balanced', description: 'محاماة وصياغة عقود وتوثيق' }
];

export const initialProviders = [
  {
    _id: 'prov-1',
    name: 'م. فادي سمير',
    phone: '01223456781',
    whatsapp: '01223456781',
    area: 'العامرية - الإسكندرية',
    profession: initialProfessions[0],
    avgRating: 4.9,
    reviewsCount: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-2',
    name: 'أ/ مينا عاطف',
    phone: '01012345672',
    whatsapp: '01012345672',
    area: 'الناصرية - الإسكندرية',
    profession: initialProfessions[1],
    avgRating: 4.8,
    reviewsCount: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-3',
    name: 'الأسطى جرجس كمال',
    phone: '01123456783',
    whatsapp: '01123456783',
    area: 'سيدي بشر - الإسكندرية',
    profession: initialProfessions[2],
    avgRating: 4.7,
    reviewsCount: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-4',
    name: 'بيتر يوسف للدهانات',
    phone: '01234567894',
    whatsapp: '01234567894',
    area: 'سموحة - الإسكندرية',
    profession: initialProfessions[3],
    avgRating: 4.9,
    reviewsCount: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-5',
    name: 'م/ كيرلس رزق (تكييف)',
    phone: '01512345675',
    whatsapp: '01512345675',
    area: 'العجمي - الإسكندرية',
    profession: initialProfessions[4],
    avgRating: 5.0,
    reviewsCount: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-6',
    name: 'د. سامح عزيز (استشاري باطنة)',
    phone: '01098765436',
    whatsapp: '01098765436',
    area: 'محرم بك - الإسكندرية',
    profession: initialProfessions[6],
    avgRating: 4.9,
    reviewsCount: 5,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-7',
    name: 'هاني فايز لصيانة الأجهزة',
    phone: '01278945612',
    whatsapp: '01278945612',
    area: 'المنشية - الإسكندرية',
    profession: initialProfessions[5],
    avgRating: 4.6,
    reviewsCount: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prov-8',
    name: 'أ/ مايكل نبيل (معلم لغة إنجليزية)',
    phone: '01156473829',
    whatsapp: '01156473829',
    area: 'لوران - الإسكندرية',
    profession: initialProfessions[9],
    avgRating: 4.8,
    reviewsCount: 3,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const initialReviews = [
  {
    _id: 'rev-1',
    provider: initialProviders[0],
    userName: 'جون إبراهيم',
    rating: 5,
    comment: 'شغل ممتاز جداً وأمانة ومواعيد منضبطة بالدقيقة.',
    isApproved: true,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'rev-2',
    provider: initialProviders[0],
    userName: 'ماريان فؤاد',
    rating: 5,
    comment: 'أفضل سباك اتعاملت معاه، نظيف ومرتب وخبرة عالية.',
    isApproved: true,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    _id: 'rev-3',
    provider: initialProviders[1],
    userName: 'كرم حنا',
    rating: 5,
    comment: 'عمل تمديدات وصيانة اللوحة الكهربائية بامتياز.',
    isApproved: true,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: 'rev-4',
    provider: initialProviders[4],
    userName: 'نادر سليمان',
    rating: 5,
    comment: 'شحن وصيانة التكييف ممتازة والتبريد عالي جداً.',
    isApproved: true,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: 'rev-5',
    provider: initialProviders[5],
    userName: 'بيشوي فريد',
    rating: 5,
    comment: 'دكتور ممتاز وشخصية مريحة جداً في التعامل والتشخيص دقيق.',
    isApproved: true,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  // Pending review for admin moderation feature testing
  {
    _id: 'rev-6',
    provider: initialProviders[0],
    userName: 'أندرو مجدي',
    rating: 5,
    comment: 'تقييم جديد بانتظار اعتماد الإدارة لاختبار لوحة التحكم.',
    isApproved: false,
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString()
  }
];

export const initialReports = [
  {
    _id: 'rep-1',
    provider: initialProviders[2],
    userName: 'مستخدم تجريبي',
    message: 'بلاغ تجريبي لاختبار نظام المودريشن في لوحة التحكم الإدارية.',
    isResolved: false,
    createdAt: new Date().toISOString()
  }
];

export const memoryStore = {
  professions: [...initialProfessions],
  providers: [...initialProviders],
  reviews: [...initialReviews],
  reports: [...initialReports]
};
