export const localeCookieName = "site_locale";
export const supportedLocales = ["en", "ur", "ar"] as const;

export type SiteLocale = (typeof supportedLocales)[number];

type LocaleContent = {
  lang: string;
  dir: "ltr" | "rtl";
  localeTag: string;
  label: string;
  nativeLabel: string;
  subtitle: string;
  bismillah: string;
  datesTitle: string;
  nav: {
    home: string;
    about: string;
    teachers: string;
    books: string;
    blog: string;
    quiz: string;
    contact: string;
    courses: string;
    admission: string;
    login: string;
    applyNow: string;
  };
  footer: {
    courses: string;
    explore: string;
    resources: string;
    followUs: string;
    followText: string;
    rights: string;
    whatsappChannel: string;
    whatsappChat: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
    clear: string;
    emptyTitle: string;
    emptyText: string;
    noMatches: string;
    viewAll: string;
    fullResults: string;
  };
  auth: {
    secureAccess: string;
    loginJourney: string;
    loginDescription: string;
    roleDashboards: string;
    roleDashboardsText: string;
    records: string;
    recordsText: string;
    nextSteps: string;
    nextStepsText: string;
    login: string;
    welcomeBack: string;
    useCredentials: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    admissionsSupport: string;
    admissionsSupportText: string;
    chatWhatsapp: string;
    joinChannel: string;
    visitYoutube: string;
    whatsappChat: string;
    whatsappChatText: string;
    whatsappChannel: string;
    whatsappChannelText: string;
    instagram: string;
    instagramText: string;
    facebook: string;
    facebookText: string;
  };
};

const localeContent: Record<SiteLocale, LocaleContent> = {
  en: {
    lang: "en",
    dir: "ltr",
    localeTag: "en-US",
    label: "English",
    nativeLabel: "English",
    subtitle: "Islamic Learning Platform",
    bismillah: "In the name of Allah, the Most Merciful, the Especially Merciful",
    datesTitle: "Today",
    nav: {
      home: "Home",
      about: "About",
      teachers: "Teachers",
      books: "Books",
      blog: "Blog",
      quiz: "Quiz",
      contact: "Contact",
      courses: "Courses",
      admission: "Admission",
      login: "Login",
      applyNow: "Apply Now",
    },
    footer: {
      courses: "Courses",
      explore: "Explore",
      resources: "Resources",
      followUs: "Follow Us",
      followText:
        "Connect with us for daily Islamic reminders, course updates, and academy announcements.",
      rights: "All rights reserved.",
      whatsappChannel: "WhatsApp Channel",
      whatsappChat: "WhatsApp Chat",
    },
    search: {
      placeholder: "Search...",
      ariaLabel: "Search website",
      clear: "Clear search",
      emptyTitle: "Search across the full website",
      emptyText: "Courses, teachers, books, and blog posts appear here instantly.",
      noMatches: "No instant matches found",
      viewAll: "View all results for",
      fullResults: "Open full search results page",
    },
    auth: {
      secureAccess: "Secure access",
      loginJourney: "Login to continue your Islamic learning journey",
      loginDescription:
        "Students, parents, teachers, and administrators can now move into dedicated dashboards for admissions, enrollments, progress tracking, and academy operations.",
      roleDashboards: "Role-based dashboards",
      roleDashboardsText:
        "Each account lands on the right space for study, teaching, or administration.",
      records: "Admissions and learning records",
      recordsText:
        "Stay close to submissions, course movement, and ongoing progress in one place.",
      nextSteps: "Structured next steps",
      nextStepsText:
        "From admission to enrollment to certificates, the experience now has a real system behind it.",
      login: "Login",
      welcomeBack: "Welcome back",
      useCredentials:
        "Use your academy credentials to continue with courses, admissions, and your private dashboard.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Reach out for admissions, course guidance, and academy updates",
      description:
        "If you want help choosing the right pathway or are preparing to enroll a child or family member, this is the best place to start.",
      admissionsSupport: "Admissions support",
      admissionsSupportText:
        "The academy now supports saved contact submissions as well, so you can either message us directly on social platforms or leave a structured inquiry for admissions and course guidance.",
      chatWhatsapp: "Chat on WhatsApp",
      joinChannel: "Join WhatsApp Channel",
      visitYoutube: "Visit YouTube",
      whatsappChat: "WhatsApp Chat",
      whatsappChatText: "Direct message for admissions, timings, and course guidance.",
      whatsappChannel: "WhatsApp Channel",
      whatsappChannelText: "Daily updates, reminders, and admission touchpoints.",
      instagram: "Instagram",
      instagramText: "Visual updates and academy highlights.",
      facebook: "Facebook",
      facebookText: "Community presence and announcements.",
    },
  },
  ur: {
    lang: "ur",
    dir: "rtl",
    localeTag: "ur-PK",
    label: "Urdu",
    nativeLabel: "اردو",
    subtitle: "اسلامی تعلیمی پلیٹ فارم",
    bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    datesTitle: "آج کی تاریخ",
    nav: {
      home: "ہوم",
      about: "تعارف",
      teachers: "اساتذہ",
      books: "کتب",
      blog: "بلاگ",
      quiz: "کوئز",
      contact: "رابطہ",
      courses: "کورسز",
      admission: "داخلہ",
      login: "لاگ اِن",
      applyNow: "ابھی اپلائی کریں",
    },
    footer: {
      courses: "کورسز",
      explore: "مزید دیکھیں",
      resources: "وسائل",
      followUs: "ہم سے جڑیں",
      followText:
        "روزانہ اسلامی یاد دہانیوں، کورس اپڈیٹس، اور اکیڈمی اعلانات کے لیے ہمارے ساتھ جڑیں۔",
      rights: "تمام حقوق محفوظ ہیں۔",
      whatsappChannel: "واٹس ایپ چینل",
      whatsappChat: "واٹس ایپ چیٹ",
    },
    search: {
      placeholder: "تلاش کریں...",
      ariaLabel: "ویب سائٹ تلاش",
      clear: "تلاش صاف کریں",
      emptyTitle: "پوری ویب سائٹ میں تلاش کریں",
      emptyText: "کورسز، اساتذہ، کتب، اور بلاگ پوسٹس یہاں فوراً نظر آئیں گی۔",
      noMatches: "کوئی فوری نتیجہ نہیں ملا",
      viewAll: "تمام نتائج دیکھیں",
      fullResults: "مکمل سرچ رزلٹس کھولیں",
    },
    auth: {
      secureAccess: "محفوظ رسائی",
      loginJourney: "اپنے اسلامی تعلیمی سفر کو جاری رکھنے کے لیے لاگ اِن کریں",
      loginDescription:
        "طلبہ، والدین، اساتذہ، اور منتظمین اب داخلہ، انرولمنٹ، پیش رفت، اور اکیڈمی انتظامات کے لیے اپنے مخصوص ڈیش بورڈز میں جا سکتے ہیں۔",
      roleDashboards: "رول کے مطابق ڈیش بورڈز",
      roleDashboardsText:
        "ہر اکاؤنٹ مطالعہ، تدریس، یا انتظامیہ کے لیے درست جگہ پر پہنچتا ہے۔",
      records: "داخلہ اور تعلیمی ریکارڈ",
      recordsText:
        "جمع شدہ فارم، کورس سرگرمی، اور جاری پیش رفت ایک ہی جگہ پر دیکھیں۔",
      nextSteps: "منظم اگلے مراحل",
      nextStepsText:
        "داخلہ سے لے کر سرٹیفکیٹ تک، اب پورا تجربہ ایک منظم نظام کے ساتھ موجود ہے۔",
      login: "لاگ اِن",
      welcomeBack: "خوش آمدید",
      useCredentials:
        "اپنے اکیڈمی اکاؤنٹ سے لاگ اِن کریں اور کورسز، داخلہ، اور اپنے نجی ڈیش بورڈ تک رسائی حاصل کریں۔",
    },
    contact: {
      eyebrow: "رابطہ",
      title: "داخلہ، کورس رہنمائی، اور اکیڈمی اپڈیٹس کے لیے ہم سے رابطہ کریں",
      description:
        "اگر آپ درست تعلیمی راستہ منتخب کرنے میں مدد چاہتے ہیں یا اپنے بچے یا خاندان کے کسی فرد کے داخلے کی تیاری کر رہے ہیں تو یہاں سے آغاز کریں۔",
      admissionsSupport: "داخلہ رہنمائی",
      admissionsSupportText:
        "اکیڈمی میں محفوظ رابطہ فارم کی سہولت بھی موجود ہے، لہٰذا آپ براہِ راست سوشل پلیٹ فارمز پر پیغام بھیج سکتے ہیں یا داخلہ اور کورس رہنمائی کے لیے باقاعدہ درخواست چھوڑ سکتے ہیں۔",
      chatWhatsapp: "واٹس ایپ پر چیٹ کریں",
      joinChannel: "واٹس ایپ چینل جوائن کریں",
      visitYoutube: "یوٹیوب دیکھیں",
      whatsappChat: "واٹس ایپ چیٹ",
      whatsappChatText: "داخلہ، اوقات، اور کورس رہنمائی کے لیے براہِ راست پیغام کریں۔",
      whatsappChannel: "واٹس ایپ چینل",
      whatsappChannelText: "روزانہ اپڈیٹس، یاد دہانیاں، اور داخلہ معلومات۔",
      instagram: "انسٹاگرام",
      instagramText: "ویژول اپڈیٹس اور اکیڈمی جھلکیاں۔",
      facebook: "فیس بک",
      facebookText: "کمیونٹی موجودگی اور اعلانات۔",
    },
  },
  ar: {
    lang: "ar",
    dir: "rtl",
    localeTag: "ar-SA",
    label: "Arabic",
    nativeLabel: "العربية",
    subtitle: "منصة تعليمية إسلامية",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    datesTitle: "تاريخ اليوم",
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      teachers: "المعلمون",
      books: "الكتب",
      blog: "المدونة",
      quiz: "الاختبار",
      contact: "اتصل بنا",
      courses: "الدورات",
      admission: "القبول",
      login: "تسجيل الدخول",
      applyNow: "قدّم الآن",
    },
    footer: {
      courses: "الدورات",
      explore: "استكشاف",
      resources: "الموارد",
      followUs: "تابعنا",
      followText:
        "تواصل معنا للحصول على التذكيرات الإسلامية اليومية وتحديثات الدورات وإعلانات الأكاديمية.",
      rights: "جميع الحقوق محفوظة.",
      whatsappChannel: "قناة واتساب",
      whatsappChat: "محادثة واتساب",
    },
    search: {
      placeholder: "ابحث...",
      ariaLabel: "البحث في الموقع",
      clear: "مسح البحث",
      emptyTitle: "ابحث في جميع أجزاء الموقع",
      emptyText: "ستظهر هنا الدورات والمعلمون والكتب والمقالات فوراً.",
      noMatches: "لا توجد نتائج فورية",
      viewAll: "عرض جميع النتائج لـ",
      fullResults: "افتح صفحة نتائج البحث الكاملة",
    },
    auth: {
      secureAccess: "دخول آمن",
      loginJourney: "سجّل الدخول لمتابعة رحلتك التعليمية الإسلامية",
      loginDescription:
        "يمكن للطلاب وأولياء الأمور والمعلمين والإداريين الانتقال الآن إلى لوحاتهم المخصصة للقبول والتسجيل ومتابعة التقدم وإدارة الأكاديمية.",
      roleDashboards: "لوحات بحسب الدور",
      roleDashboardsText:
        "يصل كل حساب إلى المساحة المناسبة للتعلم أو التدريس أو الإدارة.",
      records: "سجلات القبول والتعلم",
      recordsText:
        "ابقَ قريباً من الطلبات وحركة الدورات والتقدم المستمر في مكان واحد.",
      nextSteps: "خطوات منظمة",
      nextStepsText:
        "من القبول إلى الالتحاق إلى الشهادات، أصبحت التجربة الآن قائمة على نظام حقيقي.",
      login: "تسجيل الدخول",
      welcomeBack: "مرحباً بعودتك",
      useCredentials:
        "استخدم بيانات حساب الأكاديمية للوصول إلى الدورات والقبول ولوحتك الخاصة.",
    },
    contact: {
      eyebrow: "اتصل بنا",
      title: "تواصل معنا للقبول والإرشاد الدراسي وتحديثات الأكاديمية",
      description:
        "إذا كنت تريد مساعدة في اختيار المسار المناسب أو تستعد لتسجيل طفل أو أحد أفراد العائلة، فهذا أفضل مكان للبداية.",
      admissionsSupport: "دعم القبول",
      admissionsSupportText:
        "تدعم الأكاديمية الآن حفظ نماذج التواصل أيضاً، لذلك يمكنك مراسلتنا مباشرة عبر المنصات الاجتماعية أو إرسال استفسار منظم للقبول والإرشاد الدراسي.",
      chatWhatsapp: "تحدث عبر واتساب",
      joinChannel: "انضم إلى قناة واتساب",
      visitYoutube: "زيارة يوتيوب",
      whatsappChat: "محادثة واتساب",
      whatsappChatText: "رسالة مباشرة للقبول والمواعيد والإرشاد الدراسي.",
      whatsappChannel: "قناة واتساب",
      whatsappChannelText: "تحديثات يومية وتذكيرات ولمسات قبول مفيدة.",
      instagram: "إنستغرام",
      instagramText: "تحديثات مرئية ولمحات عن الأكاديمية.",
      facebook: "فيسبوك",
      facebookText: "حضور المجتمع والإعلانات.",
    },
  },
};

export function normalizeLocale(value?: string | null): SiteLocale {
  if (value && supportedLocales.includes(value as SiteLocale)) {
    return value as SiteLocale;
  }

  return "en";
}

export function getLocaleContent(locale: SiteLocale) {
  return localeContent[locale];
}

export function getLocaleFromCookies(
  cookieStore: Pick<{ get(name: string): { value: string } | undefined }, "get">
) {
  return normalizeLocale(cookieStore.get(localeCookieName)?.value);
}

function formatGregorianDate(locale: SiteLocale, date: Date) {
  const formatter = new Intl.DateTimeFormat(localeContent[locale].localeTag, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatter.format(date);
}

function formatHijriDate(locale: SiteLocale, date: Date) {
  const formatter = new Intl.DateTimeFormat(
    `${localeContent[locale].localeTag}-u-ca-islamic`,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return formatter.format(date);
}

export function getDualDates(locale: SiteLocale, date = new Date()) {
  return {
    hijri: formatHijriDate(locale, date),
    gregorian: formatGregorianDate(locale, date),
  };
}
