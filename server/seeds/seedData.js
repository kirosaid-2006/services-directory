import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Profession from '../models/Profession.js';
import Provider from '../models/Provider.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/services_directory';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Database connected successfully');

    // Clean existing collections
    await User.deleteMany();
    await Profession.deleteMany();
    await Provider.deleteMany();
    await Review.deleteMany();
    await Report.deleteMany();

    // 1. Create Default Admin
    const adminUser = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`[Seed] Admin user created: (${adminUser.username} / admin123)`);

    // 2. Create Authentic Professions (Katrina Hub)
    const professionsData = [
      { name: 'سباكة', icon: 'fas fa-faucet', description: 'تأسيس وصيانة السباكة والصحي' },
      { name: 'كهرباء', icon: 'fas fa-bolt', description: 'أعمال الكهرباء واللوحات والإنارة' },
      { name: 'نجارة', icon: 'fas fa-hammer', description: 'تصنيع وصيانة الأثاث والمطابخ والأبواب' },
      { name: 'نقاشة ودهانات', icon: 'fas fa-paint-roller', description: 'دهانات وديكورات داخلية وخارجية' },
      { name: 'تكييف وتبريد', icon: 'fas fa-snowflake', description: 'صيانة وتركيب وشحن التكييفات' },
      { name: 'صيانة أجهزة منزلية', icon: 'fas fa-tools', description: 'صيانة الغسالات والثلاجات والبوتاجازات' },
      { name: 'أطباء ورعاية صحية', icon: 'fas fa-heartbeat', description: 'خدمات واستشارات طبية' },
      { name: 'خدمات سيارات', icon: 'fas fa-car', description: 'ميكانيكا وكهرباء وعفشة سيارات' },
      { name: 'نقل وتوصيل', icon: 'fas fa-truck', description: 'نقل أثاث وبضائع وشحن خفيف' },
      { name: 'تعليم وتدريس', icon: 'fas fa-graduation-cap', description: 'دروس ومتابعة تعليمية' },
      { name: 'حدادة وألوميتال', icon: 'fas fa-industry', description: 'شبابيك وأبواب ألوميتال وحديد كريتال' },
      { name: 'استشارات قانونية', icon: 'fas fa-scale-balanced', description: 'محاماة وصياغة عقود وتوثيق' }
    ];

    const createdProfessions = await Profession.insertMany(professionsData);
    console.log(`[Seed] Created ${createdProfessions.length} authentic professions (0 fake providers added).`);

    console.log('\n===========================================');
    console.log('🎉 KATRINA HUB SEEDING COMPLETED!');
    console.log('Admin Credentials: admin / admin123');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
