import { prisma } from "@/lib/prisma";
import { blogs } from "@/data/blogs";
import { books } from "@/data/books";
import { courses } from "@/data/courses";
import { teachers } from "@/data/teachers";
import { normalizeSlug } from "@/utils/slug";

type LocaleMap = Partial<Record<"en" | "ur" | "ar", string>>;

const blogLocaleContent: Record<
  string,
  { title: LocaleMap; excerpt: LocaleMap; content: LocaleMap }
> = {
  "consistent-quran-routine-at-home": {
    title: {
      ur: "گھر میں مستقل قرآن معمول کیسے بنائیں",
      ar: "كيف تبني روتيناً ثابتاً للقرآن في المنزل",
    },
    excerpt: {
      ur: "خاندانوں اور انفرادی طلبہ کے لیے ایک عملی طریقہ جس سے پرسکون اور مستقل قرآن مطالعہ معمول بنایا جا سکے۔",
      ar: "إطار عملي للأسر والمتعلمين الأفراد لبناء روتين قرآني هادئ ومتكرر يدوم بإذن الله.",
    },
    content: {
      ur: "حقیقی ہفتہ وار شیڈول بنائیں، نظرثانی کے لیے مقرر وقت رکھیں، اور استاد کے ساتھ رابطہ واضح رکھیں۔ مستقل مزاجی چھوٹے مگر باقاعدہ قدموں سے بنتی ہے۔",
      ar: "ابدأ بجدول أسبوعي واقعي، وحدد وقتاً ثابتاً للمراجعة، واجعل التواصل مع المعلم واضحاً. الاستمرار يبنى بخطوات صغيرة ومنتظمة.",
    },
  },
  "tajweed-mistakes-new-learners-can-fix": {
    title: {
      ur: "تجوید کی تین غلطیاں جو نئے طلبہ جلد درست کر سکتے ہیں",
      ar: "ثلاث أخطاء في التجويد يمكن للمتعلمين الجدد تصحيحها سريعاً",
    },
    excerpt: {
      ur: "عام تلفظی غلطیوں پر استاد کی رہنمائی، مسلسل سماعت، اور مشق کے ذریعے چند ہفتوں میں واضح بہتری آ سکتی ہے۔",
      ar: "نظرة تعليمية إلى أخطاء النطق الشائعة وكيف يساعد التصحيح المنظم على زيادة الثقة خلال أسابيع.",
    },
    content: {
      ur: "تجوید کی ابتدا میں مخارج، مد کی مقدار، اور حروف کی تفخیم و ترقیق پر خاص توجہ دیں۔ درست سماعت اور بار بار تلاوت بہت مدد دیتی ہے۔",
      ar: "ركز في المرحلة الأولى على المخارج، ومقادير المد، والتمييز بين الحروف المفخمة والمرققة. السماع الصحيح والتكرار أساس التحسن.",
    },
  },
  "what-parents-should-expect-from-online-hifz": {
    title: {
      ur: "آن لائن حفظ پروگرام سے والدین کو کیا توقع رکھنی چاہیے",
      ar: "ما الذي ينبغي أن يتوقعه الآباء من برنامج حفظ عبر الإنترنت",
    },
    excerpt: {
      ur: "سبق، سبقی، منزل، اور جواب دہی کے نظام سے معلوم ہوتا ہے کہ حفظ پروگرام سنجیدہ ہے یا صرف عام کلاسز ہیں۔",
      ar: "من تخطيط الدرس إلى ضبط المراجعة، هذا ما يميز برنامج الحفظ الجاد عن الحصص العادية.",
    },
    content: {
      ur: "کامیاب حفظ سفر کے لیے سبق کی منصوبہ بندی، روزانہ مراجعت، والدین کی نگرانی، اور استاد کی مسلسل رہنمائی ضروری ہے۔",
      ar: "رحلة الحفظ الناجحة تحتاج إلى خطة للدرس، ومراجعة يومية، ومتابعة من ولي الأمر، وثبات في توجيه المعلم.",
    },
  },
};

const bookLocaleContent: Record<
  string,
  { title: LocaleMap; summary: LocaleMap; featuredNote: LocaleMap; format?: LocaleMap }
> = {
  "foundations-of-daily-adhkar": {
    title: {
      ur: "روزانہ اذکار کی بنیادی رہنمائی",
      ar: "أسس الأذكار اليومية",
    },
    summary: {
      ur: "صبح و شام کے اذکار کے لیے مختصر طالب علم ساتھی، جس میں تلفظی اشارے اور مختصر نصیحتیں شامل ہیں۔",
      ar: "دليل مختصر للطالب في أذكار الصباح والمساء مع إشارات للنطق وتأملات قصيرة.",
    },
    featuredNote: {
      ur: "نئے طلبہ اور خاندانوں کے لیے بہترین",
      ar: "مناسب للطلاب الجدد والأسر",
    },
    format: {
      ur: "پی ڈی ایف گائیڈ",
      ar: "دليل PDF",
    },
  },
  "tajweed-essentials-workbook": {
    title: {
      ur: "تجوید ضروریات ورک بک",
      ar: "كراسة أساسيات التجويد",
    },
    summary: {
      ur: "مخارج، مد، قلقلة، اور لائیو تلاوت کی عام غلطیوں پر مشتمل مشقی صفحات اور مثالیں۔",
      ar: "أوراق تدريب وأمثلة في المخارج والمد والقلقلة والأخطاء الشائعة في التلاوة المباشرة.",
    },
    featuredNote: {
      ur: "ہفتہ وار جائزہ اسباق کے ساتھ مفید",
      ar: "مناسبة مع دروس التقييم الأسبوعية",
    },
    format: {
      ur: "مشق ورک بک",
      ar: "كراسة تدريب",
    },
  },
  "fiqh-of-purification-and-prayer": {
    title: {
      ur: "طہارت اور نماز کا فقہ",
      ar: "فقه الطهارة والصلاة",
    },
    summary: {
      ur: "طہارت، نماز، اور روزمرہ عبادات کی ضروری باتوں پر آسان رہنما کتابچہ۔",
      ar: "كتيب ميسر في الطهارة والصلاة وأساسيات العبادة اليومية.",
    },
    featuredNote: {
      ur: "رہنمائی کے ساتھ کلاس روم استعمال کے لیے منظم",
      ar: "منظم للاستخدام التعليمي الموجه",
    },
    format: {
      ur: "مطالعہ نوٹس",
      ar: "ملاحظات دراسية",
    },
  },
  "aqidah-for-young-hearts": {
    title: {
      ur: "نوجوان دلوں کے لیے عقیدہ",
      ar: "العقيدة للقلوب الناشئة",
    },
    summary: {
      ur: "بنیادی عقائد کا نرم تعارف، سادہ زبان، یاد رہنے والے موضوعات، اور عمر کے مطابق وضاحت کے ساتھ۔",
      ar: "مدخل لطيف إلى أصول الإيمان بلغة واضحة وموضوعات سهلة التذكر وشرح مناسب للعمر.",
    },
    featuredNote: {
      ur: "ہفتہ وار طلبہ حلقوں میں مقبول",
      ar: "محبوب في حلقات الطلاب الأسبوعية",
    },
    format: {
      ur: "تصویری قاری",
      ar: "قارئ مصور",
    },
  },
};

const courseLocaleContent: Record<
  string,
  { title: LocaleMap; description: LocaleMap; content: LocaleMap }
> = {
  "qaida-course": {
    title: {
      ur: "قاعدہ کورس",
      ar: "دورة القاعدة",
    },
    description: {
      ur: "یہ ابتدائی قاعدہ کورس طلبہ کو عربی حروف، جوڑنے کے قواعد، حرکات، مخارج، مد، تنوین، اور قرآن شروع کرنے سے پہلے بنیادی قراءت سکھاتا ہے۔",
      ar: "تساعد هذه الدورة المبتدئين على تعلم الحروف العربية، وقواعد الوصل، والحركات، والمخارج، والمد، والتنوين، ومهارات القراءة الأساسية قبل البدء بالقرآن الكريم.",
    },
    content: {
      ur: "عربی حروف\nحروف جوڑنا\nحرکات\nسکون\nمد\nتنوین\nبنیادی مخارج\nنورانی قاعدہ دہرائی",
      ar: "الحروف العربية\nوصل الحروف\nالحركات\nالسكون\nالمد\nالتنوين\nالمخارج الأساسية\nمراجعة القاعدة النورانية",
    },
  },
  "nazra-quran": {
    title: {
      ur: "ناظرہ قرآن",
      ar: "دورة قراءة القرآن نظراً",
    },
    description: {
      ur: "ناظرہ قرآن کورس ان طلبہ کے لیے ہے جو قاعدہ مکمل کر چکے ہیں اور درست تلفظ، روزانہ اصلاح، اور استاد کی نگرانی کے ساتھ قرآن روانی سے پڑھنا چاہتے ہیں۔",
      ar: "صممت دورة القراءة نظراً للطلاب الذين أتموا القاعدة ويريدون قراءة القرآن بطلاقة مع تصحيح يومي وإشراف المعلم.",
    },
    content: {
      ur: "روزانہ قرآن پڑھنا\nغلطیوں کی اصلاح\nروانی کی مشق\nبنیادی تجوید شعور\nدہرائی منصوبہ\nاستاد کی جانچ",
      ar: "قراءة يومية للقرآن\nتصحيح الأخطاء\nتدريب الطلاقة\nوعي أساسي بالتجويد\nخطة مراجعة\nتقييم المعلم",
    },
  },
  "hifz-ul-quran": {
    title: {
      ur: "حفظ القرآن",
      ar: "حفظ القرآن",
    },
    description: {
      ur: "یہ حفظ کورس روزانہ سبق، سبقی، منزل، ہفتہ وار ٹیسٹ، ماہانہ جائزہ، اور استاد کی نگرانی کے ساتھ منظم حفظ منصوبہ فراہم کرتا ہے۔",
      ar: "توفر هذه الدورة خطة منظمة لحفظ القرآن تشمل الدرس اليومي، والمراجعة القريبة، والمنزل، والاختبارات الأسبوعية، والتقييم الشهري، وإشراف المعلم.",
    },
    content: {
      ur: "روزانہ سبق\nسبقی دہرائی\nمنزل دہرائی\nہفتہ وار حفظ ٹیسٹ\nماہانہ جائزہ\nحتمی دہرائی منصوبہ",
      ar: "الدرس اليومي\nمراجعة قريبة\nمراجعة المنزل\nاختبارات حفظ أسبوعية\nتقييم شهري\nخطة مراجعة نهائية",
    },
  },
  "tajweed-course": {
    title: {
      ur: "تجوید ماسٹر کورس",
      ar: "دورة إتقان التجويد",
    },
    description: {
      ur: "مکمل تجوید کورس جو مخارج، صفات، غنہ، مد، وقف، اور عملی تلاوت کی اصلاح کے ذریعے قراءت بہتر بناتا ہے۔",
      ar: "دورة تجويد كاملة لتحسين التلاوة من خلال المخارج والصفات والغنة والمد والوقف والتصحيح العملي.",
    },
    content: {
      ur: "مخارج\nصفات\nغنہ\nقلقلہ\nمد کے قواعد\nوقف کے قواعد\nعملی تلاوت",
      ar: "المخارج\nالصفات\nالغنة\nالقلقلة\nأحكام المد\nأحكام الوقف\nتلاوة تطبيقية",
    },
  },
  "quran-translation": {
    title: {
      ur: "قرآن ترجمہ",
      ar: "ترجمة القرآن",
    },
    description: {
      ur: "یہ کورس ترجمہ، الفاظ، وضاحت، اور عملی روحانی اسباق کے ذریعے طلبہ کو قرآن کے معانی سمجھنے میں مدد دیتا ہے۔",
      ar: "تساعد هذه الدورة الطلاب على فهم معاني القرآن من خلال الترجمة والمفردات والشرح والدروس الإيمانية العملية.",
    },
    content: {
      ur: "قرآنی الفاظ\nبنیادی جملوں کے معانی\nسورہ وار ترجمہ\nاہم موضوعات\nعملی اسباق",
      ar: "مفردات قرآنية\nمعاني الجمل الأساسية\nترجمة حسب السور\nموضوعات مهمة\nدروس عملية",
    },
  },
  "tafseer-course": {
    title: {
      ur: "تفسیر کورس",
      ar: "دورة التفسير",
    },
    description: {
      ur: "منظم تفسیر کورس جو قرآن کی وضاحت، پس منظر، موضوعات، حکمت، اور عملی رہنمائی سمجھنے میں مدد دیتا ہے۔",
      ar: "دورة تفسير منظمة تساعد الطلاب على فهم الشرح والخلفية والموضوعات والحكم والهداية العملية في القرآن.",
    },
    content: {
      ur: "تفسیر کا تعارف\nشان نزول کا پس منظر\nسورت کے موضوعات\nاہم آیات\nعملی اسباق\nغور و فکر اور اطلاق",
      ar: "مقدمة في التفسير\nسياق النزول\nموضوعات السور\nآيات مهمة\nدروس عملية\nتدبر وتطبيق",
    },
  },
  "hadith-studies": {
    title: {
      ur: "حدیث اسٹڈیز",
      ar: "دراسات الحديث",
    },
    description: {
      ur: "یہ حدیث کورس منتخب مستند احادیث کو معنی، پس منظر، شرح، اسباق، اور روزمرہ زندگی میں عملی اطلاق کے ساتھ پڑھاتا ہے۔",
      ar: "تتناول هذه الدورة أحاديث مختارة صحيحة مع المعنى والخلفية والشرح والدروس والتطبيق العملي في الحياة اليومية.",
    },
    content: {
      ur: "حدیث کا تعارف\nمنتخب مستند احادیث\nحدیث کے معانی\nپس منظر اور شرح\nعملی اسباق",
      ar: "مقدمة في الحديث\nأحاديث صحيحة مختارة\nمعاني الحديث\nالسياق والشرح\nدروس عملية",
    },
  },
  "fiqh-essentials": {
    title: {
      ur: "فقہ ضروریات",
      ar: "أساسيات الفقه",
    },
    description: {
      ur: "عملی فقہ کورس جو طہارت، نماز، روزہ، زکوٰۃ، روزمرہ زندگی، اور اسلامی آداب کے ضروری مسائل پڑھاتا ہے۔",
      ar: "دورة فقهية عملية تغطي أحكام الطهارة والصلاة والصيام والزكاة والحياة اليومية والآداب الإسلامية.",
    },
    content: {
      ur: "طہارت\nنماز\nروزہ\nزکوٰۃ کی بنیادیں\nروزمرہ مسائل\nاسلامی آداب",
      ar: "الطهارة\nالصلاة\nالصيام\nأساسيات الزكاة\nأحكام الحياة اليومية\nالآداب الإسلامية",
    },
  },
  "dars-e-nizami": {
    title: {
      ur: "درس نظامی",
      ar: "درس نظامي",
    },
    description: {
      ur: "درس نظامی کورس ان طلبہ کے لیے ہے جو عربی قواعد، فقہ، اصول، تفسیر کی بنیاد، اور متون کے منظم مطالعہ کے ذریعے کلاسیکی اسلامی تعلیم حاصل کرنا چاہتے ہیں۔",
      ar: "صممت دورة درس نظامي للطلاب الراغبين في مسار منظم للتعلم الإسلامي الكلاسيكي من خلال النحو والصرف والفقه والأصول وأسس التفسير ودراسة المتون.",
    },
    content: {
      ur: "عربی نحو و صرف\nفقہ کی بنیادیں\nاصول الفقہ تعارف\nکلاسیکی متن خوانی\nتفسیر کی بنیادیں\nحدیث مطالعہ کی تیاری",
      ar: "النحو والصرف العربي\nأسس الفقه\nمدخل إلى أصول الفقه\nقراءة المتون الكلاسيكية\nأسس التفسير\nالتهيئة لدراسة الحديث",
    },
  },
};

function buildSection(heading: string, value: string) {
  return `${heading}\n${value}`;
}

function buildLocalizedSection(
  fallback: string,
  localized: LocaleMap | undefined,
  headings: Record<"en" | "ur" | "ar", string>
) {
  const values: LocaleMap = {
    en: fallback,
    ...(localized || {}),
  };

  return (["en", "ur", "ar"] as const)
    .map((locale) => {
      const value = values[locale]?.trim();
      return value ? `${headings[locale]}\n${value}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function buildCourseDescription(description: string, localized?: LocaleMap) {
  return buildLocalizedSection(description, localized, {
    en: "English Description",
    ur: "Urdu Description",
    ar: "Arabic Description",
  });
}

function buildCourseContent(lines: string[], localized?: LocaleMap) {
  return buildLocalizedSection(lines.join("\n"), localized, {
    en: "English Curriculum / Notes",
    ur: "Urdu Curriculum / Notes",
    ar: "Arabic Curriculum / Notes",
  });
}

function buildBlogField(
  fallback: string,
  localized: LocaleMap | undefined,
  headings: Record<"en" | "ur" | "ar", string>
) {
  return buildLocalizedSection(fallback, localized, headings);
}

function buildTeacherEmail(slug: string) {
  return `${slug}@shaykhabuibrahim.com`;
}

function buildTeacherExpertise(teacher: (typeof teachers)[number]) {
  return [teacher.specialty, ...teacher.badges, ...teacher.languages].join(", ");
}

export async function importStaticContentToDatabase(authorId?: string) {
  const teacherUsers = new Map<string, string>();

  for (const teacher of teachers) {
    const email = buildTeacherEmail(teacher.slug);
    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: teacher.name,
        role: "TEACHER",
        teacherProfile: {
          upsert: {
            update: {
              bio: teacher.summary,
              headline: teacher.designation,
              expertise: buildTeacherExpertise(teacher),
            },
            create: {
              bio: teacher.summary,
              headline: teacher.designation,
              expertise: buildTeacherExpertise(teacher),
            },
          },
        },
      },
      create: {
        email,
        name: teacher.name,
        role: "TEACHER",
        teacherProfile: {
          create: {
            bio: teacher.summary,
            headline: teacher.designation,
            expertise: buildTeacherExpertise(teacher),
          },
        },
      },
    });

    teacherUsers.set(normalizeSlug(teacher.name), user.id);
  }

  for (const post of blogs) {
    const categorySlug = normalizeSlug(post.category);
    const category = await prisma.blogCategory.upsert({
      where: {
        slug: categorySlug,
      },
      update: {
        name: post.category,
      },
      create: {
        name: post.category,
        slug: categorySlug,
      },
    });

    const authorSlug = normalizeSlug(post.author);
    const matchedAuthorId = teacherUsers.get(authorSlug) || authorId || null;

    await prisma.blog.upsert({
      where: {
        slug: post.slug,
      },
      update: {
        title: post.title,
        excerpt: buildBlogField(post.excerpt, blogLocaleContent[post.slug]?.excerpt, {
          en: "English Summary",
          ur: "Urdu Summary",
          ar: "Arabic Summary",
        }),
        content: buildBlogField(
          `${post.excerpt}\n\n${post.tags.join(", ")}`,
          blogLocaleContent[post.slug]?.content,
          {
            en: "English Content",
            ur: "Urdu Content",
            ar: "Arabic Content",
          }
        ),
        localeContent: {
          title: { en: post.title, ...(blogLocaleContent[post.slug]?.title || {}) },
          excerpt: { en: post.excerpt, ...(blogLocaleContent[post.slug]?.excerpt || {}) },
          content: {
            en: `${post.excerpt}\n\n${post.tags.join(", ")}`,
            ...(blogLocaleContent[post.slug]?.content || {}),
          },
        },
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: buildBlogField(post.excerpt, blogLocaleContent[post.slug]?.excerpt, {
          en: "English Summary",
          ur: "Urdu Summary",
          ar: "Arabic Summary",
        }),
        content: buildBlogField(
          `${post.excerpt}\n\n${post.tags.join(", ")}`,
          blogLocaleContent[post.slug]?.content,
          {
            en: "English Content",
            ur: "Urdu Content",
            ar: "Arabic Content",
          }
        ),
        localeContent: {
          title: { en: post.title, ...(blogLocaleContent[post.slug]?.title || {}) },
          excerpt: { en: post.excerpt, ...(blogLocaleContent[post.slug]?.excerpt || {}) },
          content: {
            en: `${post.excerpt}\n\n${post.tags.join(", ")}`,
            ...(blogLocaleContent[post.slug]?.content || {}),
          },
        },
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: matchedAuthorId,
      },
    });
  }

  for (const book of books) {
    const localeContent = bookLocaleContent[book.slug];
    await prisma.libraryBook.upsert({
      where: {
        slug: book.slug,
      },
      update: {
        title: book.title,
        category: book.category,
        format: buildLocalizedSection(book.format, localeContent?.format, {
          en: "English",
          ur: "Urdu",
          ar: "Arabic",
        }),
        pages: book.pages,
        summary: buildBlogField(book.summary, localeContent?.summary, {
          en: "English Summary",
          ur: "Urdu Summary",
          ar: "Arabic Summary",
        }),
        featuredNote: buildBlogField(book.featuredNote, localeContent?.featuredNote, {
          en: "English Featured Note",
          ur: "Urdu Featured Note",
          ar: "Arabic Featured Note",
        }),
        localeContent: {
          title: { en: book.title, ...(localeContent?.title || {}) },
          summary: { en: book.summary, ...(localeContent?.summary || {}) },
          featuredNote: {
            en: book.featuredNote,
            ...(localeContent?.featuredNote || {}),
          },
        },
        status: "PUBLISHED",
      },
      create: {
        title: book.title,
        slug: book.slug,
        category: book.category,
        format: buildLocalizedSection(book.format, localeContent?.format, {
          en: "English",
          ur: "Urdu",
          ar: "Arabic",
        }),
        pages: book.pages,
        summary: buildBlogField(book.summary, localeContent?.summary, {
          en: "English Summary",
          ur: "Urdu Summary",
          ar: "Arabic Summary",
        }),
        featuredNote: buildBlogField(book.featuredNote, localeContent?.featuredNote, {
          en: "English Featured Note",
          ur: "Urdu Featured Note",
          ar: "Arabic Featured Note",
        }),
        localeContent: {
          title: { en: book.title, ...(localeContent?.title || {}) },
          summary: { en: book.summary, ...(localeContent?.summary || {}) },
          featuredNote: {
            en: book.featuredNote,
            ...(localeContent?.featuredNote || {}),
          },
        },
        status: "PUBLISHED",
      },
    });
  }

  for (const course of courses) {
    const teacherId = teacherUsers.get(normalizeSlug(course.teacher.name)) || null;
    const localeContent = courseLocaleContent[course.slug];
    const createdCourse = await prisma.course.upsert({
      where: {
        slug: course.slug,
      },
      update: {
        title: course.title,
        description: buildCourseDescription(course.description, localeContent?.description),
        content: buildCourseContent(course.curriculum, localeContent?.content),
        localeContent: {
          title: { en: course.title, ...(localeContent?.title || {}) },
          description: { en: course.description, ...(localeContent?.description || {}) },
          content: { en: course.curriculum.join("\n"), ...(localeContent?.content || {}) },
        },
        status: "PUBLISHED",
        teacherId,
        level: course.level,
        duration: course.duration,
        price: course.price,
        featured: course.featured,
      },
      create: {
        title: course.title,
        slug: course.slug,
        description: buildCourseDescription(course.description, localeContent?.description),
        content: buildCourseContent(course.curriculum, localeContent?.content),
        localeContent: {
          title: { en: course.title, ...(localeContent?.title || {}) },
          description: { en: course.description, ...(localeContent?.description || {}) },
          content: { en: course.curriculum.join("\n"), ...(localeContent?.content || {}) },
        },
        status: "PUBLISHED",
        teacherId,
        level: course.level,
        duration: course.duration,
        price: course.price,
        featured: course.featured,
      },
    });

    for (const [index, line] of course.curriculum.entries()) {
      const lessonSlug = normalizeSlug(`${createdCourse.slug}-${index + 1}`);
      await prisma.lesson.upsert({
        where: {
          courseId_slug: {
            courseId: createdCourse.id,
            slug: lessonSlug,
          },
        },
        update: {
          title: line,
          content: line,
          order: index + 1,
        },
        create: {
          courseId: createdCourse.id,
          slug: lessonSlug,
          title: line,
          content: line,
          order: index + 1,
          duration: 45,
        },
      });
    }
  }
}
