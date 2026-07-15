export type CourseCategory =
  | "Qaida"
  | "Nazra"
  | "Hifz"
  | "Tajweed"
  | "Tarjuma"
  | "Tafseer"
  | "Hadith"
  | "Fiqh"
  | "Arabic"
  | "Kids";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export type CourseStatus = "Draft" | "Published" | "Archived";

export type CourseTeacher = {
  name: string;
  slug: string;
  image: string;
  designation: string;
};

export type CourseSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type Course = {
  id: string;
  title: string;
  slug: string;

  shortDescription: string;
  description: string;
  rawDescription?: string;
  rawContent?: string;

  image: string;
  banner: string;
  thumbnail: string;

  category: CourseCategory;
  level: CourseLevel;
  status: CourseStatus;

  duration: string;
  language: string;

  students: number;
  lessons: number;
  rating: number;
  reviews: number;

  price: number;
  discountPrice?: number;

  certificate: boolean;
  featured: boolean;
  isPopular: boolean;
  isTrending: boolean;

  order: number;

  tags: string[];

  teacher: CourseTeacher;

  curriculum: string[];
  requirements: string[];
  outcomes: string[];

  seo: CourseSeo;

  createdAt: string;
  updatedAt: string;
};

export const courses: Course[] = [
  {
    id: "1",
    title: "Qaida Course",
    slug: "qaida-course",

    shortDescription:
      "Learn Noorani Qaida with correct pronunciation and step-by-step guidance.",

    description:
      "This beginner-friendly Qaida course helps students learn Arabic letters, joining rules, Harakat, Makharij, Madd, Tanween, and basic reading skills before starting the Holy Quran.",

    image: "/images/courses/qaida.webp",
    banner: "/images/courses/qaida-banner.webp",
    thumbnail: "/images/courses/qaida-thumb.webp",

    category: "Qaida",
    level: "Beginner",
    status: "Published",

    duration: "4 Weeks",
    language: "English • Urdu",

    students: 320,
    lessons: 28,
    rating: 4.9,
    reviews: 145,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: true,

    order: 1,

    tags: ["Qaida", "Noorani Qaida", "Quran Basics", "Kids", "Adults"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Quran & Islamic Studies Teacher",
    },

    curriculum: [
      "Arabic Letters",
      "Joining Letters",
      "Harakat",
      "Sukoon",
      "Madd",
      "Tanween",
      "Basic Makharij",
      "Noorani Qaida Revision",
    ],

    requirements: [
      "No previous knowledge required",
      "Stable internet connection",
      "Notebook for practice",
      "Regular attendance",
    ],

    outcomes: [
      "Recognize Arabic letters correctly",
      "Read basic Arabic words",
      "Understand basic pronunciation rules",
      "Prepare for Nazra Quran reading",
    ],

    seo: {
      title: "Online Qaida Course | Learn Noorani Qaida",
      description:
        "Learn Noorani Qaida online with proper pronunciation, Makharij, Harakat, and step-by-step guidance from expert Islamic teachers.",
      keywords: [
        "Qaida Course",
        "Noorani Qaida",
        "Learn Quran Online",
        "Quran Basics",
        "Online Islamic Classes",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "2",
    title: "Nazra Quran",
    slug: "nazra-quran",

    shortDescription:
      "Read the Holy Quran fluently with guided practice and correction.",

    description:
      "Nazra Quran course is designed for students who have completed Qaida and want to read the Holy Quran fluently with proper pronunciation, daily correction, and teacher supervision.",

    image: "/images/courses/nazra.webp",
    banner: "/images/courses/nazra-banner.webp",
    thumbnail: "/images/courses/nazra-thumb.webp",

    category: "Nazra",
    level: "Beginner",
    status: "Published",

    duration: "8 Weeks",
    language: "English • Urdu",

    students: 510,
    lessons: 48,
    rating: 5,
    reviews: 210,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: true,

    order: 2,

    tags: ["Nazra", "Quran Reading", "Quran Recitation", "Fluency"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Quran Recitation Teacher",
    },

    curriculum: [
      "Daily Quran Reading",
      "Correction of Mistakes",
      "Fluency Practice",
      "Basic Tajweed Awareness",
      "Revision Plan",
      "Teacher Evaluation",
    ],

    requirements: [
      "Qaida completion",
      "Ability to recognize Arabic letters",
      "Regular practice",
    ],

    outcomes: [
      "Read Quran fluently",
      "Avoid common reading mistakes",
      "Build confidence in recitation",
      "Prepare for Tajweed learning",
    ],

    seo: {
      title: "Online Nazra Quran Course",
      description:
        "Learn Nazra Quran online with daily reading practice, correction, and teacher supervision.",
      keywords: [
        "Nazra Quran",
        "Quran Reading",
        "Online Quran Reading",
        "Quran Recitation Course",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "3",
    title: "Hifz ul Quran",
    slug: "hifz-ul-quran",

    shortDescription:
      "Structured Quran memorization with revision and progress tracking.",

    description:
      "This Hifz course provides a structured Quran memorization plan with daily sabaq, sabqi, manzil, weekly tests, monthly evaluation, and teacher supervision.",

    image: "/images/courses/hifz.webp",
    banner: "/images/courses/hifz-banner.webp",
    thumbnail: "/images/courses/hifz-thumb.webp",

    category: "Hifz",
    level: "Intermediate",
    status: "Published",

    duration: "2 Years",
    language: "English • Urdu",

    students: 190,
    lessons: 500,
    rating: 5,
    reviews: 84,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: false,

    order: 3,

    tags: ["Hifz", "Quran Memorization", "Hafiz", "Revision"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Hifz Supervisor",
    },

    curriculum: [
      "Daily Sabaq",
      "Sabqi Revision",
      "Manzil Revision",
      "Weekly Memorization Tests",
      "Monthly Evaluation",
      "Final Revision Plan",
    ],

    requirements: [
      "Nazra Quran completion",
      "Strong daily commitment",
      "Parental support for children",
      "Regular revision habit",
    ],

    outcomes: [
      "Memorize Quran with structure",
      "Build strong revision routine",
      "Improve recitation accuracy",
      "Complete Hifz with teacher guidance",
    ],

    seo: {
      title: "Online Hifz ul Quran Course",
      description:
        "Memorize the Holy Quran online with a structured Hifz plan, revision schedule, and qualified teacher supervision.",
      keywords: [
        "Hifz Course",
        "Online Hifz",
        "Quran Memorization",
        "Hifz ul Quran",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "4",
    title: "Tajweed Master Course",
    slug: "tajweed-course",

    shortDescription:
      "Master Makharij, Sifaat, Ghunnah, Madd, and Quranic recitation rules.",

    description:
      "A complete Tajweed course designed to help students improve Quran recitation through Makharij, Sifaat, Ghunnah, Madd, Waqf, and practical recitation correction.",

    image: "/images/courses/tajweed.webp",
    banner: "/images/courses/tajweed-banner.webp",
    thumbnail: "/images/courses/tajweed-thumb.webp",

    category: "Tajweed",
    level: "Intermediate",
    status: "Published",

    duration: "10 Weeks",
    language: "English • Urdu",

    students: 260,
    lessons: 60,
    rating: 4.9,
    reviews: 123,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: true,

    order: 4,

    tags: ["Tajweed", "Makharij", "Sifaat", "Quran Recitation"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Tajweed Instructor",
    },

    curriculum: [
      "Makharij",
      "Sifaat",
      "Ghunnah",
      "Qalqalah",
      "Madd Rules",
      "Waqf Rules",
      "Practical Recitation",
    ],

    requirements: [
      "Basic Quran reading ability",
      "Regular recitation practice",
      "Notebook for Tajweed rules",
    ],

    outcomes: [
      "Apply Tajweed rules correctly",
      "Improve Quran recitation beauty",
      "Understand Makharij and Sifaat",
      "Avoid common recitation mistakes",
    ],

    seo: {
      title: "Online Tajweed Course",
      description:
        "Learn Tajweed online with Makharij, Sifaat, Ghunnah, Madd rules, and practical Quran recitation correction.",
      keywords: [
        "Tajweed Course",
        "Learn Tajweed Online",
        "Makharij",
        "Quran Recitation",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "5",
    title: "Quran Translation",
    slug: "quran-translation",

    shortDescription:
      "Understand Quran meanings with vocabulary, explanation, and lessons.",

    description:
      "This course helps students understand the meanings of the Quran through translation, vocabulary, explanation, and practical spiritual lessons.",

    image: "/images/courses/tarjuma.webp",
    banner: "/images/courses/tarjuma-banner.webp",
    thumbnail: "/images/courses/tarjuma-thumb.webp",

    category: "Tarjuma",
    level: "Intermediate",
    status: "Published",

    duration: "12 Weeks",
    language: "English • Urdu",

    students: 210,
    lessons: 72,
    rating: 4.8,
    reviews: 98,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: false,
    isTrending: true,

    order: 5,

    tags: ["Quran Translation", "Tarjuma", "Quran Meaning", "Vocabulary"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Quran Translation Teacher",
    },

    curriculum: [
      "Quranic Vocabulary",
      "Basic Sentence Meanings",
      "Surah-wise Translation",
      "Important Themes",
      "Practical Lessons",
    ],

    requirements: [
      "Basic Quran reading ability",
      "Interest in Quran meanings",
      "Notebook for vocabulary",
    ],

    outcomes: [
      "Understand Quranic meanings",
      "Learn important vocabulary",
      "Reflect on Quranic guidance",
      "Build foundation for Tafseer",
    ],

    seo: {
      title: "Online Quran Translation Course",
      description:
        "Learn Quran Translation online with vocabulary, clear explanation, and practical lessons.",
      keywords: [
        "Quran Translation",
        "Tarjuma Quran",
        "Understand Quran",
        "Quran Meaning",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "6",
    title: "Tafseer Course",
    slug: "tafseer-course",

    shortDescription:
      "Study Quran explanation with context, wisdom, and practical guidance.",

    description:
      "A structured Tafseer course designed to help students understand the explanation, background, themes, wisdom, and practical guidance of the Quran.",

    image: "/images/courses/tafseer.webp",
    banner: "/images/courses/tafseer-banner.webp",
    thumbnail: "/images/courses/tafseer-thumb.webp",

    category: "Tafseer",
    level: "Advanced",
    status: "Published",

    duration: "16 Weeks",
    language: "English • Urdu",

    students: 175,
    lessons: 90,
    rating: 4.9,
    reviews: 76,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: false,

    order: 6,

    tags: ["Tafseer", "Quran Explanation", "Quran Study", "Islamic Knowledge"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Tafseer Teacher",
    },

    curriculum: [
      "Introduction to Tafseer",
      "Context of Revelation",
      "Surah Themes",
      "Important Verses",
      "Practical Lessons",
      "Reflection and Application",
    ],

    requirements: [
      "Basic Quran understanding",
      "Interest in Islamic studies",
      "Regular attendance",
    ],

    outcomes: [
      "Understand Quranic themes",
      "Learn practical Quran guidance",
      "Build deeper connection with Quran",
      "Prepare for advanced Islamic studies",
    ],

    seo: {
      title: "Online Tafseer Course",
      description:
        "Study Quran Tafseer online with context, explanation, wisdom, and practical Islamic guidance.",
      keywords: [
        "Tafseer Course",
        "Online Tafseer",
        "Quran Explanation",
        "Islamic Studies",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "7",
    title: "Hadith Studies",
    slug: "hadith-studies",

    shortDescription:
      "Study selected authentic Hadith with explanation, context, and lessons.",

    description:
      "This Hadith course covers selected authentic Hadith with meaning, background, explanation, lessons, and practical application in daily life.",

    image: "/images/courses/hadith.webp",
    banner: "/images/courses/hadith-banner.webp",
    thumbnail: "/images/courses/hadith-thumb.webp",

    category: "Hadith",
    level: "All Levels",
    status: "Published",

    duration: "8 Weeks",
    language: "English • Urdu",

    students: 240,
    lessons: 50,
    rating: 4.9,
    reviews: 115,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: true,
    isTrending: true,

    order: 7,

    tags: ["Hadith", "Sunnah", "Islamic Studies", "Daily Life"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Hadith Teacher",
    },

    curriculum: [
      "Introduction to Hadith",
      "Selected Authentic Hadith",
      "Hadith Meanings",
      "Context and Explanation",
      "Practical Lessons",
    ],

    requirements: [
      "Interest in Hadith",
      "Basic Islamic knowledge",
      "Regular study habit",
    ],

    outcomes: [
      "Understand selected Hadith",
      "Learn Sunnah-based guidance",
      "Apply Hadith lessons in daily life",
      "Build Islamic character",
    ],

    seo: {
      title: "Online Hadith Course",
      description:
        "Study authentic Hadith online with explanation, context, and practical lessons for daily life.",
      keywords: [
        "Hadith Course",
        "Online Hadith",
        "Sunnah",
        "Islamic Studies",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },

  {
    id: "8",
    title: "Fiqh Essentials",
    slug: "fiqh-essentials",

    shortDescription:
      "Learn essential Islamic rulings for worship, daily life, and character.",

    description:
      "A practical Fiqh course covering essential rulings related to purification, prayer, fasting, zakat, daily life, and Islamic conduct.",

    image: "/images/courses/fiqh.webp",
    banner: "/images/courses/fiqh-banner.webp",
    thumbnail: "/images/courses/fiqh-thumb.webp",

    category: "Fiqh",
    level: "All Levels",
    status: "Published",

    duration: "10 Weeks",
    language: "English • Urdu",

    students: 180,
    lessons: 55,
    rating: 4.8,
    reviews: 88,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: false,
    isPopular: true,
    isTrending: false,

    order: 8,

    tags: ["Fiqh", "Prayer", "Taharah", "Islamic Rulings"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Fiqh Teacher",
    },

    curriculum: [
      "Taharah",
      "Prayer",
      "Fasting",
      "Zakat Basics",
      "Daily Life Rulings",
      "Islamic Manners",
    ],

    requirements: [
      "Basic Islamic interest",
      "Notebook for rulings",
      "Regular attendance",
    ],

    outcomes: [
      "Understand essential Fiqh",
      "Perform worship correctly",
      "Learn daily life Islamic rulings",
      "Improve Islamic practice",
    ],

    seo: {
      title: "Online Fiqh Essentials Course",
      description:
        "Learn essential Fiqh online including Taharah, Prayer, Fasting, Zakat basics, and daily Islamic rulings.",
      keywords: [
        "Fiqh Course",
        "Islamic Rulings",
        "Prayer",
        "Taharah",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "9",
    title: "Dars e Nizami",
    slug: "dars-e-nizami",

    shortDescription:
      "A structured classical Islamic studies pathway covering foundational Arabic and traditional texts.",

    description:
      "This Dars e Nizami course is designed for students seeking a structured route into classical Islamic learning through Arabic grammar, fiqh, usool, tafseer foundations, and guided text-based study.",

    image: "/images/courses/fiqh.webp",
    banner: "/images/courses/fiqh-banner.webp",
    thumbnail: "/images/courses/fiqh-thumb.webp",

    category: "Fiqh",
    level: "Advanced",
    status: "Published",

    duration: "2 Years",
    language: "English • Urdu",

    students: 95,
    lessons: 140,
    rating: 4.9,
    reviews: 41,

    price: 0,
    discountPrice: 0,

    certificate: true,
    featured: true,
    isPopular: false,
    isTrending: true,

    order: 9,

    tags: ["Dars e Nizami", "Islamic Studies", "Arabic", "Fiqh", "Tafseer"],

    teacher: {
      name: "Shaykh Abu Ibrahim",
      slug: "shaykh-abu-ibrahim",
      image: "/images/teachers/abu-ibrahim.webp",
      designation: "Dars e Nizami Instructor",
    },

    curriculum: [
      "Arabic Nahw and Sarf",
      "Foundations of Fiqh",
      "Usool al-Fiqh introduction",
      "Classical text reading",
      "Tafseer foundations",
      "Hadith study preparation",
    ],

    requirements: [
      "Comfortable Quran reading ability",
      "Serious interest in Islamic studies",
      "Regular study commitment",
      "Notebook for text-based learning",
    ],

    outcomes: [
      "Build a foundation in classical Islamic sciences",
      "Study guided Arabic and fiqh texts with structure",
      "Prepare for deeper tafseer and hadith learning",
      "Follow a long-term traditional learning pathway",
    ],

    seo: {
      title: "Online Dars e Nizami Course",
      description:
        "Study Dars e Nizami online with structured Arabic, fiqh, classical text reading, and foundational Islamic sciences.",
      keywords: [
        "Dars e Nizami",
        "Islamic Studies",
        "Arabic Grammar",
        "Fiqh Course",
      ],
    },

    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

export const featuredCourses = courses
  .filter((course) => course.featured && course.status === "Published")
  .sort((a, b) => a.order - b.order);

export const popularCourses = courses
  .filter((course) => course.isPopular && course.status === "Published")
  .sort((a, b) => b.students - a.students);

export const trendingCourses = courses
  .filter((course) => course.isTrending && course.status === "Published")
  .sort((a, b) => b.rating - a.rating);

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}
