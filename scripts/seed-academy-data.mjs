import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function normalizeConnectionString(value) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.trim().replace(/^['"]|['"]$/g, "").trim();

  try {
    const url = new URL(cleaned);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return cleaned.replace(/sslmode=(prefer|require|verify-ca)\b/i, "sslmode=verify-full");
  }
}

const connectionString =
  normalizeConnectionString(process.env.POSTGRES_URL_NON_POOLING) ||
  normalizeConnectionString(process.env.DATABASE_URL_UNPOOLED) ||
  normalizeConnectionString(process.env.POSTGRES_PRISMA_URL) ||
  normalizeConnectionString(process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error("Database connection string is missing.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultPassword = process.env.SEED_USER_PASSWORD || "Admin@123456";

const blogLocaleContentBySlug = {
  "consistent-quran-routine-at-home": {
    title: {
      en: "How to Build a Consistent Quran Routine at Home",
      ur: "گھر میں مستقل قرآن معمول کیسے بنائیں",
      ar: "كيف تبني روتيناً ثابتاً للقرآن في المنزل",
    },
    excerpt: {
      en: "A practical framework for families and solo learners to create a calm, repeatable Quran study rhythm that lasts.",
      ur: "خاندانوں اور انفرادی طلبہ کے لیے ایک عملی طریقہ جس سے پرسکون اور مستقل قرآن مطالعہ معمول بنایا جا سکے۔",
      ar: "إطار عملي للأسر والمتعلمين الأفراد لبناء روتين قرآني هادئ ومتكرر يدوم بإذن الله.",
    },
    content: {
      en: "Start with a fixed weekly plan, keep revision realistic, and stay in touch with the teacher for accountability.",
      ur: "ہفتہ وار مقررہ منصوبہ بنائیں، دہرائی کو حقیقت پسندانہ رکھیں، اور جواب دہی کے لیے استاد سے رابطہ برقرار رکھیں۔",
      ar: "ابدأ بخطة أسبوعية ثابتة، واجعل المراجعة واقعية، وابقَ على تواصل مع المعلم للمتابعة.",
    },
  },
  "tajweed-mistakes-new-learners-can-fix": {
    title: {
      en: "Three Tajweed Mistakes New Learners Can Fix Quickly",
      ur: "تجوید کی تین غلطیاں جو نئے طلبہ جلد درست کر سکتے ہیں",
      ar: "ثلاث أخطاء في التجويد يمكن للمتعلمين الجدد تصحيحها سريعاً",
    },
    excerpt: {
      en: "A teacher-guided look at common pronunciation issues and how structured correction builds confidence.",
      ur: "عام تلفظی غلطیوں اور منظم اصلاح کے ذریعے اعتماد بڑھانے پر استاد کی رہنمائی۔",
      ar: "نظرة تعليمية إلى أخطاء النطق الشائعة وكيف يبني التصحيح المنظم الثقة.",
    },
    content: {
      en: "Focus on makharij, madd, and heavy-light letter distinction during the early Tajweed stage.",
      ur: "تجوید کے ابتدائی مرحلے میں مخارج، مد، اور حروف کی تفخیم و ترقیق پر خاص توجہ دیں۔",
      ar: "ركز في المرحلة الأولى على المخارج والمد والتمييز بين الحروف المفخمة والمرققة.",
    },
  },
  "what-parents-should-expect-from-online-hifz": {
    title: {
      en: "What Parents Should Expect From an Online Hifz Program",
      ur: "آن لائن حفظ پروگرام سے والدین کو کیا توقع رکھنی چاہیے",
      ar: "ما الذي ينبغي أن يتوقعه الآباء من برنامج حفظ عبر الإنترنت",
    },
    excerpt: {
      en: "Parents should look for structured sabaq planning, revision accountability, and transparent reporting.",
      ur: "والدین کو منظم سبق پلاننگ، دہرائی کی پابندی، اور واضح پیش رفت رپورٹنگ دیکھنی چاہیے۔",
      ar: "ينبغي للآباء البحث عن خطة درس منظمة ومتابعة للمراجعة وتقارير تقدم واضحة.",
    },
    content: {
      en: "A serious Hifz program is measured through consistency, revision strength, and teacher-parent communication.",
      ur: "مضبوط حفظ پروگرام کی پہچان مستقل مزاجی، دہرائی کی مضبوطی، اور استاد و والدین کے رابطے سے ہوتی ہے۔",
      ar: "يقاس برنامج الحفظ الجاد بالاستمرار وقوة المراجعة والتواصل بين المعلم وولي الأمر.",
    },
  },
};

const bookLocaleContentBySlug = {
  "foundations-of-daily-adhkar": {
    title: {
      en: "Foundations of Daily Adhkar",
      ur: "روزانہ اذکار کی بنیادی رہنمائی",
      ar: "أسس الأذكار اليومية",
    },
    summary: {
      en: "A concise student companion for morning and evening adhkar with transliteration cues and reflections.",
      ur: "صبح و شام کے اذکار کے لیے مختصر طالب علم ساتھی، جس میں تلفظی اشارے اور مختصر نصیحتیں شامل ہیں۔",
      ar: "دليل مختصر للطالب في أذكار الصباح والمساء مع إشارات للنطق وتأملات قصيرة.",
    },
    featuredNote: {
      en: "Ideal for new students and families.",
      ur: "نئے طلبہ اور خاندانوں کے لیے بہترین۔",
      ar: "مناسب للطلاب الجدد والأسر.",
    },
  },
  "tajweed-essentials-workbook": {
    title: {
      en: "Tajweed Essentials Workbook",
      ur: "تجوید ضروریات ورک بک",
      ar: "كراسة أساسيات التجويد",
    },
    summary: {
      en: "Worksheet-style drills for makharij, madd, qalqalah, and common recitation mistakes.",
      ur: "مخارج، مد، قلقلة، اور عام قراءت کی غلطیوں کے لیے مشقی ورک شیٹس۔",
      ar: "تدريبات عملية في المخارج والمد والقلقلة والأخطاء الشائعة في التلاوة.",
    },
    featuredNote: {
      en: "Pairs with weekly Tajweed review.",
      ur: "ہفتہ وار تجوید جائزے کے ساتھ بہترین۔",
      ar: "مناسبة مع مراجعة التجويد الأسبوعية.",
    },
  },
};

const courseLocaleContentBySlug = {
  "qaida-foundation-program": {
    title: {
      en: "Qaida Foundation Program",
      ur: "قاعدہ فاؤنڈیشن پروگرام",
      ar: "برنامج تأسيس القاعدة",
    },
    description: {
      en: "A beginner course for Arabic letters, pronunciation, and smooth transition into Quran reading.",
      ur: "عربی حروف، درست تلفظ، اور قرآن پڑھنے کی مضبوط بنیاد کے لیے ابتدائی کورس۔",
      ar: "دورة للمبتدئين في الحروف العربية والنطق والانتقال السلس إلى قراءة القرآن.",
    },
    content: {
      en: "Arabic letters\nHarakat and joining rules\nBasic reading fluency",
      ur: "عربی حروف\nحرکات اور جوڑنے کے قواعد\nابتدائی روانی",
      ar: "الحروف العربية\nالحركات وقواعد الوصل\nطلاقة القراءة الأساسية",
    },
  },
  "nazra-quran-program": {
    title: {
      en: "Nazra Quran Program",
      ur: "ناظرہ قرآن پروگرام",
      ar: "برنامج قراءة القرآن نظراً",
    },
    description: {
      en: "A guided Quran reading course for students who have completed Qaida and want fluency with correction and supervision.",
      ur: "قاعدہ مکمل کرنے والے طلبہ کے لیے رہنمائی والا قرآن خوانی کورس، جس میں روانی، اصلاح، اور نگرانی شامل ہے۔",
      ar: "دورة قراءة قرآنية موجهة لمن أتموا القاعدة ويريدون الطلاقة مع التصحيح والإشراف.",
    },
    content: {
      en: "Daily Quran reading\nCorrection sessions\nFluency building",
      ur: "روزانہ قرآن خوانی\nاصلاحی نشستیں\nروانی پیدا کرنا",
      ar: "قراءة يومية للقرآن\nجلسات تصحيح\nبناء الطلاقة",
    },
  },
  "tajweed-improvement-track": {
    title: {
      en: "Tajweed Improvement Track",
      ur: "تجوید امپروومنٹ ٹریک",
      ar: "مسار تحسين التجويد",
    },
    description: {
      en: "A structured correction path for learners who want clearer recitation and stronger Tajweed application.",
      ur: "ان طلبہ کے لیے منظم اصلاحی راستہ جو بہتر قراءت اور مضبوط تجویدی اطلاق چاہتے ہیں۔",
      ar: "مسار تصحيح منظم للمتعلمين الذين يريدون تلاوة أوضح وتطبيقاً أقوى للتجويد.",
    },
    content: {
      en: "Makharij drills\nMadd practice\nSurah recitation feedback",
      ur: "مخارج کی مشق\nمد کی مشق\nسورہ قراءت فیڈبیک",
      ar: "تدريبات المخارج\nتدريب المد\nملاحظات على تلاوة السور",
    },
  },
  "hifz-support-revision-circle": {
    title: {
      en: "Hifz Support & Revision Circle",
      ur: "حفظ سپورٹ اور دہرائی حلقہ",
      ar: "حلقة دعم الحفظ والمراجعة",
    },
    description: {
      en: "Support for memorization students with sabaq planning, revision discipline, and teacher accountability.",
      ur: "حفظ کے طلبہ کے لیے سبق پلاننگ، دہرائی نظم، اور استاد کی نگرانی کے ساتھ معاونت۔",
      ar: "دعم لطلاب الحفظ من خلال تخطيط الدرس والانضباط في المراجعة ومتابعة المعلم.",
    },
    content: {
      en: "Sabaq planning\nRevision checkpoints\nParent progress guidance",
      ur: "سبق پلاننگ\nدہرائی چیک پوائنٹس\nوالدین کے لیے پیش رفت رہنمائی",
      ar: "تخطيط الدرس\nنقاط مراجعة\nإرشاد تقدم لأولياء الأمور",
    },
  },
  "tafseer-guidance-program": {
    title: {
      en: "Tafseer Guidance Program",
      ur: "تفسیر رہنمائی پروگرام",
      ar: "برنامج إرشاد التفسير",
    },
    description: {
      en: "A structured course for understanding themes, context, and practical guidance from selected Quran passages.",
      ur: "منتخب قرآنی مقامات کے موضوعات، پس منظر، اور عملی رہنمائی کو سمجھنے کے لیے ایک منظم کورس۔",
      ar: "دورة منظمة لفهم الموضوعات والسياق والهداية العملية من مقاطع قرآنية مختارة.",
    },
    content: {
      en: "Surah themes\nContext of revelation\nPractical lessons",
      ur: "سورہ کے موضوعات\nشان نزول اور پس منظر\nعملی اسباق",
      ar: "موضوعات السور\nسياق النزول\nدروس عملية",
    },
  },
  "dars-e-nizami-program": {
    title: {
      en: "Dars e Nizami Program",
      ur: "درس نظامی پروگرام",
      ar: "برنامج درس نظامي",
    },
    description: {
      en: "A long-term classical Islamic studies track covering Arabic, fiqh, usool, and text-based learning with teacher guidance.",
      ur: "عربی، فقہ، اصول، اور متنی تعلیم کے ساتھ کلاسیکی اسلامی علوم کے لیے طویل مدتی منظم پروگرام۔",
      ar: "مسار طويل المدى في العلوم الإسلامية الكلاسيكية يشمل العربية والفقه والأصول والتعلم من المتون بإرشاد المعلم.",
    },
    content: {
      en: "Nahw and Sarf\nFoundations of fiqh\nText reading",
      ur: "نحو و صرف\nفقہ کی بنیادیں\nمتن خوانی",
      ar: "النحو والصرف\nأسس الفقه\nقراءة المتون",
    },
  },
};

async function upsertUser({
  email,
  name,
  role,
  phone,
  image,
  teacherProfile,
  studentProfile,
}) {
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      phone,
      image,
      password: hashedPassword,
      teacherProfile: teacherProfile
        ? {
            upsert: {
              update: teacherProfile,
              create: teacherProfile,
            },
          }
        : undefined,
      studentProfile: studentProfile
        ? {
            upsert: {
              update: studentProfile,
              create: studentProfile,
            },
          }
        : undefined,
    },
    create: {
      email,
      name,
      role,
      phone,
      image,
      password: hashedPassword,
      teacherProfile: teacherProfile ? { create: teacherProfile } : undefined,
      studentProfile: studentProfile ? { create: studentProfile } : undefined,
    },
  });
}

async function upsertBlog({ slug, ...data }) {
  const localeContent = blogLocaleContentBySlug[slug] || data.localeContent;

  return prisma.blog.upsert({
    where: { slug },
    update: { ...data, localeContent },
    create: { slug, ...data, localeContent },
  });
}

async function upsertBook({ slug, ...data }) {
  const localeContent = bookLocaleContentBySlug[slug] || data.localeContent;

  return prisma.libraryBook.upsert({
    where: { slug },
    update: { ...data, localeContent },
    create: { slug, ...data, localeContent },
  });
}

async function upsertCourse({ slug, ...data }) {
  const localeContent = courseLocaleContentBySlug[slug] || data.localeContent;

  return prisma.course.upsert({
    where: { slug },
    update: { ...data, localeContent },
    create: { slug, ...data, localeContent },
  });
}

async function upsertLesson(courseId, order, title, content) {
  const slug = `${courseId}-${order}`;

  return prisma.lesson.upsert({
    where: {
      courseId_slug: {
        courseId,
        slug,
      },
    },
    update: {
      title,
      content,
      order,
    },
    create: {
      courseId,
      slug,
      title,
      content,
      order,
      duration: 45,
    },
  });
}

async function main() {
  const superAdmin = await upsertUser({
    email: (process.env.SUPER_ADMIN_EMAIL || "admin@shaykhabuibrahim.com").toLowerCase(),
    name: process.env.SUPER_ADMIN_NAME || "Super Admin",
    role: "SUPER_ADMIN",
    phone: "+92 300 0000000",
  });

  const teacher = await upsertUser({
    email: "teacher@shaykhabuibrahim.com",
    name: "Shaykh Abu Ibrahim",
    role: "TEACHER",
    phone: "+92 301 1111111",
    image: "/images/logo-transparent.webp",
    teacherProfile: {
      bio: "Senior Quran and Tajweed instructor for online students.",
      expertise: "Quran, Tajweed, Hifz",
      headline: "Senior Quran Instructor",
    },
  });

  const student = await upsertUser({
    email: "student@shaykhabuibrahim.com",
    name: "Muhammad Ahmed",
    role: "STUDENT",
    phone: "+92 302 2222222",
    studentProfile: {
      phone: "+92 302 2222222",
      guardianName: "Usman Ahmed",
      guardianPhone: "+92 303 2222222",
      timezone: "Asia/Karachi",
      ageGroup: "13-16",
    },
  });

  const parent = await upsertUser({
    email: "parent@shaykhabuibrahim.com",
    name: "Ayesha Tariq",
    role: "PARENT",
    phone: "+92 304 3333333",
    studentProfile: {
      phone: "+92 304 3333333",
      guardianName: "Ayesha Tariq",
      guardianPhone: "+92 304 3333333",
      timezone: "Europe/London",
      ageGroup: "7-12",
    },
  });

  const quranCategory = await prisma.blogCategory.upsert({
    where: { slug: "quran" },
    update: { name: "Quran" },
    create: { slug: "quran", name: "Quran" },
  });

  const tajweedCategory = await prisma.blogCategory.upsert({
    where: { slug: "tajweed" },
    update: { name: "Tajweed" },
    create: { slug: "tajweed", name: "Tajweed" },
  });

  const parentingCategory = await prisma.blogCategory.upsert({
    where: { slug: "parenting" },
    update: { name: "Parenting" },
    create: { slug: "parenting", name: "Parenting" },
  });

  await upsertBlog({
    slug: "consistent-quran-routine-at-home",
    title: "How to Build a Consistent Quran Routine at Home / گھر میں مستقل قرآن روٹین کیسے بنائیں",
    excerpt:
      "English Summary\nA practical framework for families and solo learners to create a calm, repeatable Quran study rhythm that lasts.\n\nUrdu Summary\nخاندانوں اور انفرادی طلبہ کے لیے ایک عملی طریقہ کار جو پُرسکون اور مستقل قرآن مطالعہ روٹین بنانے میں مدد دے۔",
    content:
      "English Content\nStart with a fixed weekly plan, keep revision realistic, and stay in touch with the teacher for accountability.\n\nUrdu Content\nہفتہ وار مقررہ منصوبہ بنائیں، ریویژن کو حقیقت پسندانہ رکھیں، اور استاد کے ساتھ رابطہ برقرار رکھیں۔",
    status: "PUBLISHED",
    authorId: superAdmin.id,
    categoryId: quranCategory.id,
  });

  await upsertBlog({
    slug: "tajweed-mistakes-new-learners-can-fix",
    title: "Three Tajweed Mistakes New Learners Can Fix Quickly / نئی تجوید کی تین غلطیاں",
    excerpt:
      "English Summary\nA teacher-guided look at common pronunciation issues and how structured correction builds confidence.\n\nUrdu Summary\nعام تلفظی غلطیوں اور منظم اصلاح کے ذریعے اعتماد بڑھانے پر استاد کی رہنمائی۔",
    content:
      "English Content\nFocus on makharij, madd, and heavy-light letter distinction during the early Tajweed stage.\n\nUrdu Content\nتجوید کے ابتدائی مرحلے میں مخارج، مد، اور حروف کی تفخیم و ترقیق پر خاص توجہ دیں۔",
    status: "PUBLISHED",
    authorId: teacher.id,
    categoryId: tajweedCategory.id,
  });

  await upsertBlog({
    slug: "what-parents-should-expect-from-online-hifz",
    title:
      "What Parents Should Expect From an Online Hifz Program / آن لائن حفظ پروگرام سے والدین کیا توقع رکھیں",
    excerpt:
      "English Summary\nParents should look for structured sabaq planning, revision accountability, and transparent reporting.\n\nUrdu Summary\nوالدین کو منظم سبق پلاننگ، ریویژن کی پابندی، اور واضح پیش رفت رپورٹنگ دیکھنی چاہیے۔",
    content:
      "English Content\nA serious Hifz program is measured through consistency, revision strength, and teacher-parent communication.\n\nUrdu Content\nمضبوط حفظ پروگرام کی پہچان مستقل مزاجی، ریویژن کی مضبوطی، اور استاد و والدین کے رابطے سے ہوتی ہے۔",
    status: "PUBLISHED",
    authorId: superAdmin.id,
    categoryId: parentingCategory.id,
  });

  await upsertBook({
    slug: "foundations-of-daily-adhkar",
    title: "Foundations of Daily Adhkar / روزانہ اذکار کی بنیادیں",
    category: "Character",
    format: "PDF Guide",
    pages: 42,
    summary:
      "English Summary\nA concise student companion for morning and evening adhkar with transliteration cues and reflections.\n\nUrdu Summary\nصبح و شام کے اذکار کے لیے مختصر رہنما جس میں تلفظی اشارے اور مختصر نصیحتیں شامل ہیں۔",
    featuredNote:
      "English Featured Note\nIdeal for new students and families.\n\nUrdu Featured Note\nنئے طلبہ اور خاندانوں کے لیے بہترین۔",
    status: "PUBLISHED",
  });

  await upsertBook({
    slug: "tajweed-essentials-workbook",
    title: "Tajweed Essentials Workbook / تجوید ضروریات ورک بک",
    category: "Quran",
    format: "Practice Workbook",
    pages: 64,
    summary:
      "English Summary\nWorksheet-style drills for makharij, madd, qalqalah, and common recitation mistakes.\n\nUrdu Summary\nمخارج، مد، قلقلہ، اور عام قرأت کی غلطیوں کے لیے مشقی ورک شیٹس۔",
    featuredNote:
      "English Featured Note\nPairs with weekly Tajweed review.\n\nUrdu Featured Note\nہفتہ وار تجوید ریویو کے ساتھ بہترین۔",
    status: "PUBLISHED",
  });

  const qaidaCourse = await upsertCourse({
    slug: "qaida-foundation-program",
    title: "Qaida Foundation Program / قائدہ فاؤنڈیشن پروگرام",
    description:
      "English Description\nA beginner course for Arabic letters, pronunciation, and smooth transition into Quran reading.\n\nUrdu Description\nعربی حروف، درست تلفظ، اور قرآن پڑھنے کی مضبوط بنیاد کے لیے ابتدائی کورس۔",
    content:
      "English Curriculum / Notes\nArabic letters\nHarakat and joining rules\nBasic reading fluency\n\nUrdu Curriculum / Notes\nعربی حروف\nحرکات اور جوڑنے کے قواعد\nابتدائی روانی",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "Beginner",
    duration: "6 Weeks",
    price: 26,
    featured: true,
  });

  const tajweedCourse = await upsertCourse({
    slug: "tajweed-improvement-track",
    title: "Tajweed Improvement Track / تجوید امپروومنٹ ٹریک",
    description:
      "English Description\nA structured correction path for learners who want clearer recitation and stronger Tajweed application.\n\nUrdu Description\nان طلبہ کے لیے منظم اصلاحی راستہ جو بہتر قرأت اور مضبوط تجویدی اطلاق چاہتے ہیں۔",
    content:
      "English Curriculum / Notes\nMakharij drills\nMadd practice\nSurah recitation feedback\n\nUrdu Curriculum / Notes\nمخارج کی مشق\nمد کی مشق\nسورہ قرأت فیڈ بیک",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "Intermediate",
    duration: "8 Weeks",
    price: 52,
    featured: true,
  });

  const hifzCourse = await upsertCourse({
    slug: "hifz-support-revision-circle",
    title: "Hifz Support & Revision Circle / حفظ سپورٹ اور ریویژن سرکل",
    description:
      "English Description\nSupport for memorization students with sabaq planning, revision discipline, and teacher accountability.\n\nUrdu Description\nحفظ کے طلبہ کے لیے سبق پلاننگ، ریویژن نظم، اور استاد کی نگرانی کے ساتھ معاونت۔",
    content:
      "English Curriculum / Notes\nSabaq planning\nRevision checkpoints\nParent progress guidance\n\nUrdu Curriculum / Notes\nسبق پلاننگ\nریویژن چیک پوائنٹس\nوالدین کے لیے پیش رفت رہنمائی",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "All Levels",
    duration: "Ongoing",
    price: 78,
    featured: false,
  });

  const nazraCourse = await upsertCourse({
    slug: "nazra-quran-program",
    title: "Nazra Quran Program / ناظرہ قرآن پروگرام",
    description:
      "English Description\nA guided Quran reading course for students who have completed Qaida and want fluency with correction and supervision.\n\nUrdu Description\nان طلبہ کے لیے رہنمائی والا قرآن خوانی کورس جو قائدہ مکمل کر چکے ہوں اور روانی، اصلاح، اور نگرانی کے ساتھ ناظرہ پڑھنا چاہتے ہوں۔",
    content:
      "English Curriculum / Notes\nDaily Quran reading\nCorrection sessions\nFluency building\n\nUrdu Curriculum / Notes\nروزانہ قرآن خوانی\nاصلاحی نشستیں\nروانی پیدا کرنا",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "Beginner",
    duration: "8 Weeks",
    price: 40,
    featured: true,
  });

  const tafseerCourse = await upsertCourse({
    slug: "tafseer-guidance-program",
    title: "Tafseer Guidance Program / تفسیر رہنمائی پروگرام",
    description:
      "English Description\nA structured course for understanding themes, context, and practical guidance from selected Quran passages.\n\nUrdu Description\nمنتخب قرآنی مقامات کے موضوعات، پس منظر، اور عملی رہنمائی کو سمجھنے کے لیے ایک منظم کورس۔",
    content:
      "English Curriculum / Notes\nSurah themes\nContext of revelation\nPractical lessons\n\nUrdu Curriculum / Notes\nسورہ کے موضوعات\nشان نزول اور پس منظر\nعملی اسباق",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "Advanced",
    duration: "16 Weeks",
    price: 65,
    featured: true,
  });

  const darsENizamiCourse = await upsertCourse({
    slug: "dars-e-nizami-program",
    title: "Dars e Nizami Program / درس نظامی پروگرام",
    description:
      "English Description\nA long-term classical Islamic studies track covering Arabic, fiqh, usool, and text-based learning with teacher guidance.\n\nUrdu Description\nعربی، فقہ، اصول، اور متنی تعلیم کے ساتھ کلاسیکی اسلامی علوم کے لیے طویل مدتی منظم پروگرام۔",
    content:
      "English Curriculum / Notes\nNahw and Sarf\nFoundations of fiqh\nText reading\n\nUrdu Curriculum / Notes\nنحو و صرف\nفقہ کی بنیادیں\nمتن خوانی",
    status: "PUBLISHED",
    teacherId: teacher.id,
    level: "Advanced",
    duration: "2 Years",
    price: 95,
    featured: true,
  });

  await Promise.all([
    upsertLesson(qaidaCourse.id, 1, "Arabic Letters and Sounds", "Letter recognition and articulation."),
    upsertLesson(qaidaCourse.id, 2, "Harakat and Joining Rules", "Learning vowels and connected reading."),
    upsertLesson(nazraCourse.id, 1, "Daily Reading Flow", "Fluency-focused guided recitation."),
    upsertLesson(nazraCourse.id, 2, "Correction and Confidence", "Correcting mistakes with teacher feedback."),
    upsertLesson(tajweedCourse.id, 1, "Makharij Drill Session", "Daily articulation practice."),
    upsertLesson(tajweedCourse.id, 2, "Madd and Qalqalah Practice", "Controlled recitation rhythm."),
    upsertLesson(hifzCourse.id, 1, "Sabaq Planning", "Weekly memorization planning."),
    upsertLesson(hifzCourse.id, 2, "Revision Accountability", "Monitoring revision consistency."),
    upsertLesson(tafseerCourse.id, 1, "Theme Mapping", "Understanding major Quranic themes."),
    upsertLesson(tafseerCourse.id, 2, "Applied Reflection", "Turning tafseer into practical lessons."),
    upsertLesson(darsENizamiCourse.id, 1, "Nahw and Sarf Foundations", "Core Arabic grammar preparation."),
    upsertLesson(darsENizamiCourse.id, 2, "Fiqh Text Reading", "Introductory classical study workflow."),
  ]);

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: qaidaCourse.id,
      },
    },
    update: {
      status: "ACTIVE",
      progress: 45,
    },
    create: {
      studentId: student.id,
      courseId: qaidaCourse.id,
      status: "ACTIVE",
      progress: 45,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: tajweedCourse.id,
      },
    },
    update: {
      status: "PENDING",
      progress: 10,
    },
    create: {
      studentId: student.id,
      courseId: tajweedCourse.id,
      status: "PENDING",
      progress: 10,
    },
  });

  await prisma.admission.upsert({
    where: { id: "seed-admission-1" },
    update: {
      name: "Muhammad Ahmed",
      email: student.email,
      phone: "+92 302 2222222",
      guardianName: "Usman Ahmed",
      guardianPhone: "+92 303 2222222",
      timezone: "Asia/Karachi",
      ageGroup: "13-16",
      course: qaidaCourse.title,
      courseId: qaidaCourse.id,
      message: "Interested in structured Qaida and Tajweed learning.",
      status: "NEW",
      userId: student.id,
    },
    create: {
      id: "seed-admission-1",
      name: "Muhammad Ahmed",
      email: student.email,
      phone: "+92 302 2222222",
      guardianName: "Usman Ahmed",
      guardianPhone: "+92 303 2222222",
      timezone: "Asia/Karachi",
      ageGroup: "13-16",
      course: qaidaCourse.title,
      courseId: qaidaCourse.id,
      message: "Interested in structured Qaida and Tajweed learning.",
      status: "NEW",
      userId: student.id,
    },
  });

  await prisma.admission.upsert({
    where: { id: "seed-admission-2" },
    update: {
      name: "Ayesha Tariq",
      email: parent.email,
      phone: "+92 304 3333333",
      guardianName: "Ayesha Tariq",
      guardianPhone: "+92 304 3333333",
      timezone: "Europe/London",
      ageGroup: "7-12",
      course: tajweedCourse.title,
      courseId: tajweedCourse.id,
      message: "Need evening classes for my child.",
      status: "REVIEWING",
      userId: parent.id,
    },
    create: {
      id: "seed-admission-2",
      name: "Ayesha Tariq",
      email: parent.email,
      phone: "+92 304 3333333",
      guardianName: "Ayesha Tariq",
      guardianPhone: "+92 304 3333333",
      timezone: "Europe/London",
      ageGroup: "7-12",
      course: tajweedCourse.title,
      courseId: tajweedCourse.id,
      message: "Need evening classes for my child.",
      status: "REVIEWING",
      userId: parent.id,
    },
  });

  await prisma.contactSubmission.upsert({
    where: { id: "seed-contact-1" },
    update: {
      name: "Fatima Noor",
      email: "fatima.noor@example.com",
      phone: "+92 305 4444444",
      subject: "Fee structure",
      message: "Please share monthly fee details for Tajweed classes.",
      userId: parent.id,
    },
    create: {
      id: "seed-contact-1",
      name: "Fatima Noor",
      email: "fatima.noor@example.com",
      phone: "+92 305 4444444",
      subject: "Fee structure",
      message: "Please share monthly fee details for Tajweed classes.",
      userId: parent.id,
    },
  });

  await prisma.contactSubmission.upsert({
    where: { id: "seed-contact-2" },
    update: {
      name: "Yusuf Ali",
      email: "yusuf.ali@example.com",
      phone: "+92 306 5555555",
      subject: "Trial class request",
      message: "Looking for a trial class before full enrollment.",
    },
    create: {
      id: "seed-contact-2",
      name: "Yusuf Ali",
      email: "yusuf.ali@example.com",
      phone: "+92 306 5555555",
      subject: "Trial class request",
      message: "Looking for a trial class before full enrollment.",
    },
  });

  const assignment = await prisma.assignment.upsert({
    where: { id: "seed-assignment-1" },
    update: {
      title: "Qaida revision worksheet",
      description: "Complete the joining rules and reading fluency practice.",
      courseId: qaidaCourse.id,
      teacherId: teacher.id,
      dueDate: new Date("2026-07-15T00:00:00.000Z"),
    },
    create: {
      id: "seed-assignment-1",
      title: "Qaida revision worksheet",
      description: "Complete the joining rules and reading fluency practice.",
      courseId: qaidaCourse.id,
      teacherId: teacher.id,
      dueDate: new Date("2026-07-15T00:00:00.000Z"),
    },
  });

  await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment.id,
        studentId: student.id,
      },
    },
    update: {
      submittedAt: new Date("2026-07-08T09:00:00.000Z"),
      status: "REVIEWED",
      content: "Completed reading worksheet and pronunciation drill.",
      grade: 92,
      feedback: "Strong progress. Keep reviewing joining rules.",
      reviewedById: teacher.id,
      reviewedAt: new Date("2026-07-08T11:30:00.000Z"),
    },
    create: {
      assignmentId: assignment.id,
      studentId: student.id,
      submittedAt: new Date("2026-07-08T09:00:00.000Z"),
      status: "REVIEWED",
      content: "Completed reading worksheet and pronunciation drill.",
      grade: 92,
      feedback: "Strong progress. Keep reviewing joining rules.",
      reviewedById: teacher.id,
      reviewedAt: new Date("2026-07-08T11:30:00.000Z"),
    },
  });

  await prisma.payment.upsert({
    where: { referenceId: "PAY-QAIDA-001" },
    update: {
      userId: student.id,
      courseId: qaidaCourse.id,
      amount: 26,
      currency: "USD",
      provider: "Stripe",
      status: "PAID",
      paidAt: new Date("2026-07-06T08:15:00.000Z"),
    },
    create: {
      userId: student.id,
      courseId: qaidaCourse.id,
      amount: 26,
      currency: "USD",
      provider: "Stripe",
      referenceId: "PAY-QAIDA-001",
      status: "PAID",
      paidAt: new Date("2026-07-06T08:15:00.000Z"),
    },
  });

  await prisma.payment.upsert({
    where: { referenceId: "PAY-TAJWEED-002" },
    update: {
      userId: parent.id,
      courseId: tajweedCourse.id,
      amount: 52,
      currency: "USD",
      provider: "Bank Transfer",
      status: "PENDING",
    },
    create: {
      userId: parent.id,
      courseId: tajweedCourse.id,
      amount: 52,
      currency: "USD",
      provider: "Bank Transfer",
      referenceId: "PAY-TAJWEED-002",
      status: "PENDING",
    },
  });

  await prisma.certificate.upsert({
    where: { verificationId: "CERT-QAIDA-2026-001" },
    update: {
      certificateNo: "QAIDA-2026-001",
      studentName: student.name || "Muhammad Ahmed",
      courseName: qaidaCourse.title,
      teacherName: teacher.name,
      studentId: student.id,
      courseId: qaidaCourse.id,
      issuedById: superAdmin.id,
      issuedAt: new Date("2026-07-01T10:00:00.000Z"),
    },
    create: {
      certificateNo: "QAIDA-2026-001",
      verificationId: "CERT-QAIDA-2026-001",
      studentName: student.name || "Muhammad Ahmed",
      courseName: qaidaCourse.title,
      teacherName: teacher.name,
      studentId: student.id,
      courseId: qaidaCourse.id,
      issuedById: superAdmin.id,
      issuedAt: new Date("2026-07-01T10:00:00.000Z"),
    },
  });

  await prisma.notification.upsert({
    where: { id: "seed-notification-1" },
    update: {
      userId: student.id,
      title: "Enrollment confirmed",
      message: "Your Qaida Foundation Program seat is active.",
      type: "GENERAL",
    },
    create: {
      id: "seed-notification-1",
      userId: student.id,
      title: "Enrollment confirmed",
      message: "Your Qaida Foundation Program seat is active.",
      type: "GENERAL",
    },
  });

  await prisma.notification.upsert({
    where: { id: "seed-notification-2" },
    update: {
      userId: student.id,
      title: "Worksheet reviewed",
      message: "Your Qaida revision worksheet has been reviewed with feedback.",
      type: "ASSIGNMENT",
    },
    create: {
      id: "seed-notification-2",
      userId: student.id,
      title: "Worksheet reviewed",
      message: "Your Qaida revision worksheet has been reviewed with feedback.",
      type: "ASSIGNMENT",
    },
  });

  console.log("Academy database seeded successfully.");
  console.log(`Super admin: ${superAdmin.email}`);
  console.log(`Teacher: ${teacher.email}`);
  console.log(`Student: ${student.email}`);
  console.log(`Parent: ${parent.email}`);
  console.log(`Seed password for bootstrap users: ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
