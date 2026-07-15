import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { StructuredEditor } from "@/components/admin/StructuredEditor";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { resolveLocalizedInlineText } from "@/lib/content-localization";
import { auth, getDashboardPath } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/dashboard";
import { getLocaleFromCookies, type SiteLocale } from "@/lib/locale";
import { getAdminBlogs } from "@/services/blog/blog.service";
import { getAdminBooks } from "@/services/book/book.service";
import { getAdminCourses } from "@/services/course/course.service";
import {
  getHomepageHeroSettings,
  getSiteSettings,
} from "@/services/settings/site-settings.service";
import {
  createBookAction,
  createBlogAction,
  createAssignmentAction,
  createCourseAction,
  createEnrollmentAction,
  createLessonAction,
  createMediaRecordAction,
  createPaymentAction,
  deleteBookAction,
  deleteBlogAction,
  deleteCourseAction,
  issueCertificateAction,
  saveHomepageHeroSettingsAction,
  saveSiteSettingsAction,
  seedDemoContentAction,
  updateAdmissionStatusAction,
  updateBookAction,
  updateBlogAction,
  updateCourseAction,
} from "./actions";
import styles from "./page.module.css";

type AdmissionItem = {
  id: string;
  name: string;
  course?: string | null;
  status?: string | null;
  createdAt?: Date | string | null;
};

type ContactItem = {
  id: string;
  name: string;
  email?: string | null;
  subject?: string | null;
  createdAt?: Date | string | null;
};

type SubmissionItem = {
  id: string;
  status?: string | null;
  updatedAt?: Date | string | null;
  assignment?: {
    title?: string | null;
  } | null;
  student?: {
    name?: string | null;
  } | null;
};

type PaymentItem = {
  id: string;
  amount?: { toNumber(): number } | number | null;
  currency?: string | null;
  status?: string | null;
  createdAt?: Date | string | null;
  user?: {
    name?: string | null;
  } | null;
  course?: {
    title?: string | null;
  } | null;
};

type CertificateItem = {
  id: string;
  certificateNo?: string | null;
  verificationId?: string | null;
  studentName?: string | null;
  courseName?: string | null;
  teacherName?: string | null;
  issuedAt?: Date | string | null;
};

type DashboardData = {
  users: number;
  admissions: AdmissionItem[];
  courses: unknown[];
  submissions: SubmissionItem[];
  payments: PaymentItem[];
  certificates: CertificateItem[];
  contacts: ContactItem[];
};

type WorkspaceView =
  | "overview"
  | "operations"
  | "blogs"
  | "courses"
  | "books"
  | "settings";

type Notice = {
  tone: "success" | "error";
  text: string;
};

const workspaceViews: WorkspaceView[] = [
  "overview",
  "operations",
  "blogs",
  "courses",
  "books",
  "settings",
];

function normalizeWorkspaceView(value?: string): WorkspaceView {
  return workspaceViews.includes(value as WorkspaceView)
    ? (value as WorkspaceView)
    : "overview";
}

function getAdminCopy(locale: SiteLocale) {
  if (locale === "ur" || locale === "ar") {
    return {
      workspace: "ایڈمن ورک اسپیس",
      sidebarTitle: "انتظامی پینل",
      role: "رول",
      views: {
        overview: "ڈیش بورڈ",
        operations: "آپریشنز",
        blogs: "بلاگز",
        courses: "کورسز",
        books: "کتب",
      },
      heroEyebrow: "اکیڈمی کنٹرول سینٹر",
      heroTitle: "منظم اور پروفیشنل ایڈمن ورک اسپیس",
      heroText:
        "اب ہر شعبہ الگ ورک اسپیس میں رکھا گیا ہے تاکہ ٹیم بلاگز، کورسز، کتب، اور آپریشنل کام واضح انداز میں سنبھال سکے۔",
      heroBadge: "لائیو سسٹم",
      signedInAs: "سائن اِن بطور",
      health: "ورک اسپیس ہیلتھ",
      liveItems: "لائیو آئٹمز",
      admissionsQueue: "داخلہ قطار",
      contactsQueue: "رابطہ پیغامات",
      contentDrafts: "کانٹینٹ ڈرافٹس",
      stats: {
        users: "کل صارفین",
        library: "کل کانٹینٹ",
        payments: "ادائیگیاں",
        certificates: "سرٹیفکیٹس",
      },
      statsText: {
        users: "رجسٹرڈ طلبہ، اساتذہ، ایڈمنز، اور والدین۔",
        library: "بلاگز، کورسز، اور کتب کی موجودہ لائبریری۔",
        payments: "حالیہ مالی سرگرمی اور فالو اپ۔",
        certificates: "جاری شدہ تکمیلی اسناد۔",
      },
      notice: {
        blogCreated: "بلاگ کامیابی سے محفوظ ہو گیا۔",
        blogDeleted: "بلاگ کامیابی سے حذف ہو گیا۔",
        courseCreated: "کورس کامیابی سے محفوظ ہو گیا۔",
        courseDeleted: "کورس کامیابی سے حذف ہو گیا۔",
        bookCreated: "کتاب کامیابی سے محفوظ ہو گئی۔",
        bookDeleted: "کتاب کامیابی سے حذف ہو گئی۔",
        blogFailed: "بلاگ محفوظ نہیں ہو سکا۔ مطلوبہ فیلڈز یا سلگ چیک کریں۔",
        courseFailed: "کورس محفوظ نہیں ہو سکا۔ سلگ یا فیلڈز چیک کریں۔",
        bookFailed: "کتاب محفوظ نہیں ہو سکی۔",
        seedOk: "اسٹیٹک ویب سائٹ کانٹینٹ کامیابی سے ڈیٹابیس میں امپورٹ ہو گیا۔",
        seedFail: "ویب سائٹ کانٹینٹ ڈیٹابیس میں امپورٹ نہیں ہو سکا۔",
      },
      overview: {
        title: "فوری جائزہ",
        description:
          "ایک ہی جگہ سے پتا چلتا ہے کہ کس شعبے میں توجہ درکار ہے اور کون سا کانٹینٹ پبلش یا ڈرافٹ حالت میں ہے۔",
        priority: "اہم ترجیحات",
        priorityItems: [
          {
            label: "ریویو کے منتظر داخلے",
            hint: "دلچسپی رکھنے والے خاندانوں سے فالو اپ کریں۔",
          },
          {
            label: "نئے رابطہ پیغامات",
            hint: "سرد ہونے سے پہلے جواب دیں۔",
          },
          {
            label: "ڈرافٹ کانٹینٹ",
            hint: "پبلش یا آرکائیو کرنے کا فیصلہ کریں۔",
          },
        ],
        workflowTitle: "ایڈیٹوریل ورک فلو",
        workflowText:
          "کانٹینٹ ڈیسک اب انگلش اور اردو دونوں کے لیے تیار ہے، لیکن ہر ورک اسپیس اپنی چیز الگ سنبھالتا ہے۔",
      },
      operations: {
        title: "آپریشنز ورک اسپیس",
        description:
          "داخلہ، رابطہ، سبمشن، ادائیگی، اور سرٹیفکیٹ سرگرمی کو الگ آپریشنل پینلز میں دیکھیں۔",
        admissions: "حالیہ داخلے",
        admissionsSub: "خاندانی انٹیک پائپ لائن",
        contacts: "رابطہ ڈیسک",
        contactsSub: "تازہ انکوائریز",
        submissions: "اکیڈمک ورک فلو",
        submissionsSub: "سسٹم میں موجود سبمشنز",
        payments: "ادائیگیاں",
        paymentsSub: "مالی سرگرمی",
        certificates: "سرٹیفکیٹس",
        certificatesSub: "جاری شدہ ریکارڈ",
        emptyAdmissions: "داخلہ فارم جمع ہوں گے تو یہاں نظر آئیں گے۔",
        emptyContacts: "رابطہ فارم سبمٹ ہوتے ہی یہاں ترتیب سے آئیں گے۔",
        emptySubmissions: "اسائنمنٹ ایکٹیویٹی ابھی دستیاب نہیں ہے۔",
        emptyPayments: "ادائیگیاں آتے ہی یہاں تازہ ریکارڈ نظر آئے گا۔",
        emptyCertificates: "سرٹیفکیٹس جاری ہوں گے تو یہاں دکھائی دیں گے۔",
      },
      filters: {
        searchPlaceholder: "تلاش کریں...",
        allStatuses: "تمام اسٹیٹس",
        published: "پبلشڈ",
        draft: "ڈرافٹ",
        archived: "آرکائیوڈ",
        apply: "فلٹر لگائیں",
        demo: "ویب سائٹ کانٹینٹ امپورٹ کریں",
      },
      common: {
        totalItems: "کل آئٹمز",
        slug: "سلگ",
        status: "اسٹیٹس",
        title: "عنوان",
        titleUrdu: "اردو عنوان",
        category: "کیٹیگری",
        customCategory: "کسٹم کیٹیگری",
        excerpt: "خلاصہ",
        excerptUrdu: "اردو خلاصہ",
        content: "مواد",
        contentUrdu: "اردو مواد",
        description: "تفصیل",
        descriptionUrdu: "اردو تفصیل",
        summary: "سمری",
        summaryUrdu: "اردو سمری",
        featuredNote: "نمایاں نوٹ",
        featuredNoteUrdu: "اردو نمایاں نوٹ",
        duration: "دورانیہ",
        level: "لیول",
        price: "قیمت",
        format: "فارمیٹ",
        pages: "صفحات",
        featuredHome: "ہوم پیج پر نمایاں کریں",
        create: "بنائیں",
        save: "تبدیلیاں محفوظ کریں",
        delete: "حذف کریں",
        edit: "ایڈٹ کریں",
        noRecords: "ابھی ریکارڈ موجود نہیں۔",
      },
      modules: {
        blogs: {
          title: "بلاگ ورک اسپیس",
          description: "یہاں صرف مضامین، اعلان، اور بلاگ مینجمنٹ کا کام رکھیں۔",
          createTitle: "نیا بلاگ شائع کریں",
          listTitle: "موجودہ بلاگز",
          create: "بلاگ شائع کریں",
          empty: "ابھی کوئی بلاگ موجود نہیں۔",
        },
        courses: {
          title: "کورس ورک اسپیس",
          description: "یہ حصہ صرف کورسز، نصاب، اور کورس مینجمنٹ کے لیے ہے۔",
          createTitle: "نیا کورس بنائیں",
          listTitle: "موجودہ کورسز",
          create: "کورس بنائیں",
          empty: "ابھی کوئی کورس موجود نہیں۔",
        },
        books: {
          title: "کتب ورک اسپیس",
          description: "یہاں صرف کتب، PDFs، اور لائبریری ریسورسز منظم کریں۔",
          createTitle: "نئی کتاب شامل کریں",
          listTitle: "موجودہ کتب",
          create: "کتاب بنائیں",
          empty: "ابھی کوئی کتاب موجود نہیں۔",
        },
      },
      meta: {
        general: "جنرل",
        noAuthor: "مصنف موجود نہیں",
        allLevels: "تمام لیولز",
        featured: "ہوم پیج پر نمایاں",
        standard: "معمول کی ویزیبلٹی",
        paymentFallback: "ادائیگی",
        issued: "جاری شدہ",
        recent: "حال ہی میں",
      },
    };
  }

  return {
    workspace: "Admin Workspace",
    sidebarTitle: "Management Panel",
    role: "Role",
    views: {
      overview: "Dashboard",
      operations: "Operations",
      blogs: "Blogs",
      courses: "Courses",
      books: "Books",
    },
    heroEyebrow: "Academy Control Center",
    heroTitle: "Professional admin workspace built around focused sections",
    heroText:
      "Each area now has its own workspace so the team can manage blogs, courses, books, and operations without working through one long mixed page.",
    heroBadge: "Live system",
    signedInAs: "Signed in as",
    health: "Workspace health",
    liveItems: "live items",
    admissionsQueue: "Admissions queue",
    contactsQueue: "Contact inquiries",
    contentDrafts: "Content drafts",
    stats: {
      users: "Total users",
      library: "Content library",
      payments: "Payments tracked",
      certificates: "Certificates issued",
    },
    statsText: {
      users: "Registered learners, teachers, admins, and parents.",
      library: "Combined blogs, courses, and books currently in the database.",
      payments: "Recent financial activity available for review.",
      certificates: "Issued completion and recognition records.",
    },
    notice: {
      blogCreated: "Blog saved successfully.",
      blogDeleted: "Blog removed successfully.",
      courseCreated: "Course saved successfully.",
      courseDeleted: "Course removed successfully.",
      bookCreated: "Book saved successfully.",
      bookDeleted: "Book removed successfully.",
      blogFailed: "Blog could not be saved. Check required fields or slug.",
      courseFailed: "Course could not be saved. Check required fields or slug.",
      bookFailed: "Book could not be saved.",
      seedOk: "Static website content was imported into the database successfully.",
      seedFail: "Website content could not be imported into the database.",
    },
    overview: {
      title: "Quick overview",
      description:
        "Use this dashboard to see which area needs attention first and how much public content is live versus still in draft.",
      priority: "Priority queue",
      priorityItems: [
        {
          label: "Admissions awaiting review",
          hint: "Follow up with interested families and confirm the best course fit.",
        },
        {
          label: "New contact inquiries",
          hint: "Respond before important leads go cold.",
        },
        {
          label: "Draft content items",
          hint: "Publish or archive pending content from the content desk.",
        },
      ],
      workflowTitle: "Editorial workflow",
      workflowText:
        "The workspace now separates each public content type into its own professional area with cleaner publishing flow.",
    },
    operations: {
      title: "Operations workspace",
      description:
        "Admissions, contacts, submissions, payments, and certificates are grouped into focused operational panels.",
      admissions: "Recent admissions",
      admissionsSub: "Family intake pipeline",
      contacts: "Contact desk",
      contactsSub: "Recent inquiries",
      submissions: "Academic workflow",
      submissionsSub: "Submissions in system",
      payments: "Payments",
      paymentsSub: "Financial activity snapshot",
      certificates: "Certificates",
      certificatesSub: "Issued recognitions",
      emptyAdmissions: "Admissions will appear here once the website forms start coming in.",
      emptyContacts: "Contact submissions will appear here as soon as they are received.",
      emptySubmissions: "Assignment review activity is not available yet.",
      emptyPayments: "Payment records will appear here when transactions start arriving.",
      emptyCertificates: "Certificate records will appear here after issuance starts.",
    },
    filters: {
      searchPlaceholder: "Search current workspace...",
      allStatuses: "All statuses",
      published: "Published",
      draft: "Draft",
      archived: "Archived",
      apply: "Apply filters",
      demo: "Import website content",
    },
    common: {
      totalItems: "Total items",
      slug: "Slug",
      status: "Status",
      title: "Title",
      titleUrdu: "Urdu title",
      category: "Category",
      customCategory: "Custom category",
      excerpt: "Excerpt",
      excerptUrdu: "Urdu excerpt",
      content: "Content",
      contentUrdu: "Urdu content",
      description: "Description",
      descriptionUrdu: "Urdu description",
      summary: "Summary",
      summaryUrdu: "Urdu summary",
      featuredNote: "Featured note",
      featuredNoteUrdu: "Urdu featured note",
      duration: "Duration",
      level: "Level",
      price: "Price",
      format: "Format",
      pages: "Pages",
      featuredHome: "Feature on homepage",
      create: "Create",
      save: "Save changes",
      delete: "Delete",
      edit: "Edit",
      noRecords: "No records yet.",
    },
    modules: {
      blogs: {
        title: "Blog workspace",
        description: "This area is only for articles, announcements, and blog publishing.",
        createTitle: "Publish a new blog post",
        listTitle: "Existing blog posts",
        create: "Publish blog",
        empty: "No blog posts available yet.",
      },
      courses: {
        title: "Course workspace",
        description: "This area is only for programs, curriculum notes, and course management.",
        createTitle: "Create a new course",
        listTitle: "Existing courses",
        create: "Create course",
        empty: "No courses available yet.",
      },
      books: {
        title: "Book workspace",
        description: "This area is only for library books, PDFs, and downloadable resources.",
        createTitle: "Add a new book",
        listTitle: "Existing books",
        create: "Create book",
        empty: "No books available yet.",
      },
    },
    meta: {
      general: "General",
      noAuthor: "No author",
      allLevels: "All Levels",
      featured: "Featured on homepage",
      standard: "Standard visibility",
      paymentFallback: "Payment",
      issued: "Issued",
      recent: "Recently",
    },
  };
}

function getStatusMessage(
  value: string | string[] | undefined,
  copy: ReturnType<typeof getAdminCopy>
): Notice | null {
  const message = Array.isArray(value) ? value[0] : value;

  switch (message) {
    case "blog-created":
      return { tone: "success", text: copy.notice.blogCreated };
    case "blog-deleted":
      return { tone: "success", text: copy.notice.blogDeleted };
    case "course-created":
      return { tone: "success", text: copy.notice.courseCreated };
    case "course-deleted":
      return { tone: "success", text: copy.notice.courseDeleted };
    case "book-created":
      return { tone: "success", text: copy.notice.bookCreated };
    case "book-deleted":
      return { tone: "success", text: copy.notice.bookDeleted };
    case "settings-saved":
      return {
        tone: "success",
        text:
          copy.workspace === "Admin Workspace"
            ? "Site settings saved successfully."
            : "سائٹ سیٹنگز کامیابی سے محفوظ ہو گئیں۔",
      };
    case "hero-saved":
      return {
        tone: "success",
        text:
          copy.workspace === "Admin Workspace"
            ? "Homepage hero content saved successfully."
            : "ہوم پیج ہیرو کانٹینٹ کامیابی سے محفوظ ہو گیا۔",
      };
    case "blog-create-failed":
    case "blog-delete-failed":
      return { tone: "error", text: copy.notice.blogFailed };
    case "course-create-failed":
    case "course-delete-failed":
      return { tone: "error", text: copy.notice.courseFailed };
    case "book-create-failed":
    case "book-delete-failed":
      return { tone: "error", text: copy.notice.bookFailed };
    case "settings-save-failed":
      return {
        tone: "error",
        text:
          copy.workspace === "Admin Workspace"
            ? "Site settings could not be saved."
            : "سائٹ سیٹنگز محفوظ نہیں ہو سکیں۔",
      };
    case "hero-save-failed":
      return {
        tone: "error",
        text:
          copy.workspace === "Admin Workspace"
            ? "Homepage hero content could not be saved."
            : "ہوم پیج ہیرو کانٹینٹ محفوظ نہیں ہو سکا۔",
      };
    case "certificate-issued":
      return {
        tone: "success",
        text: "Certificate issued successfully.",
      };
    case "lesson-created":
      return { tone: "success", text: "Lesson created successfully." };
    case "assignment-created":
      return { tone: "success", text: "Assignment created successfully." };
    case "enrollment-created":
      return { tone: "success", text: "Enrollment saved successfully." };
    case "payment-created":
      return { tone: "success", text: "Payment record saved successfully." };
    case "media-created":
      return { tone: "success", text: "Media record saved successfully." };
    case "admission-status-updated":
      return { tone: "success", text: "Admission status updated successfully." };
    case "certificate-issue-failed":
      return {
        tone: "error",
        text: "Certificate could not be issued. Check student email and selected course.",
      };
    case "lesson-create-failed":
      return { tone: "error", text: "Lesson could not be created. Check course and title." };
    case "assignment-create-failed":
      return { tone: "error", text: "Assignment could not be created. Check course and title." };
    case "enrollment-create-failed":
      return { tone: "error", text: "Enrollment could not be saved. Check student email and course." };
    case "payment-create-failed":
      return { tone: "error", text: "Payment could not be saved. Check email, amount, and reference." };
    case "media-create-failed":
      return { tone: "error", text: "Media record could not be saved. Add a valid URL and filename." };
    case "admission-status-failed":
      return { tone: "error", text: "Admission status could not be updated." };
    case "seed-complete":
      return { tone: "success", text: copy.notice.seedOk };
    case "seed-failed":
      return { tone: "error", text: copy.notice.seedFail };
    default:
      return null;
  }
}

function formatDate(value: Date | string | null | undefined, locale: SiteLocale, fallback: string) {
  if (!value) {
    return fallback;
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale === "ur" ? "ur-PK" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(amount?: { toNumber(): number } | number | null, currency?: string | null) {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : amount && typeof amount === "object" && "toNumber" in amount
        ? amount.toNumber()
        : 0;

  return `${currency || "USD"} ${numericAmount}`;
}

function getStatusOptions(copy: ReturnType<typeof getAdminCopy>) {
  return [
    { value: "PUBLISHED", label: copy.filters.published },
    { value: "DRAFT", label: copy.filters.draft },
    { value: "ARCHIVED", label: copy.filters.archived },
  ] as const;
}

export default async function AdminDashboardPage(props: PageProps<"/admin">) {
  const [cookieStore, searchParams, session] = await Promise.all([
    cookies(),
    props.searchParams,
    auth(),
  ]);

  if (!session?.user?.id) {
    redirect("/login?next=/admin");
  }

  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }

  const locale = getLocaleFromCookies(cookieStore);
  const copy = getAdminCopy(locale);
  const view = normalizeWorkspaceView(
    typeof searchParams.view === "string" ? searchParams.view : undefined
  );
  const searchTerm =
    typeof searchParams.q === "string" ? searchParams.q.trim().toLowerCase() : "";
  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "ALL";
  const statusOptions = getStatusOptions(copy);

  let dashboard: DashboardData = {
    users: 0,
    admissions: [],
    courses: [],
    submissions: [],
    payments: [],
    certificates: [],
    contacts: [],
  };

  try {
    dashboard = await getAdminDashboardData();
  } catch {
    // Keep the admin workspace available while database content is still sparse.
  }

  const [blogs, courses, books, siteSettings, heroSettings] = await Promise.all([
    getAdminBlogs(),
    getAdminCourses(),
    getAdminBooks(),
    getSiteSettings(),
    getHomepageHeroSettings(),
  ]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = !searchTerm
      ? true
      : [blog.title, blog.slug, blog.category?.name, blog.author?.email]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));
    const matchesStatus = statusFilter === "ALL" ? true : blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = !searchTerm
      ? true
      : [course.title, course.slug, course.level, course.teacher?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));
    const matchesStatus = statusFilter === "ALL" ? true : course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBooks = books.filter((book) => {
    const matchesSearch = !searchTerm
      ? true
      : [book.title, book.slug, book.category, book.format]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));
    const matchesStatus = statusFilter === "ALL" ? true : book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const notice = getStatusMessage(searchParams.success || searchParams.error, copy);
  const totalDrafts =
    blogs.filter((item) => item.status === "DRAFT").length +
    courses.filter((item) => item.status === "DRAFT").length +
    books.filter((item) => item.status === "DRAFT").length;
  const publishedContent =
    blogs.filter((item) => item.status === "PUBLISHED").length +
    courses.filter((item) => item.status === "PUBLISHED").length +
    books.filter((item) => item.status === "PUBLISHED").length;
  const todayLabel = new Intl.DateTimeFormat(locale === "ur" ? "ur-PK" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const sidebarLinks = [
    { view: "overview", label: copy.views.overview },
    { view: "operations", label: copy.views.operations },
    { view: "blogs", label: copy.views.blogs },
    { view: "courses", label: copy.views.courses },
    { view: "books", label: copy.views.books },
    {
      view: "settings",
      label: locale === "ur" ? "سیٹنگز" : locale === "ar" ? "الإعدادات" : "Settings",
    },
  ] satisfies Array<{ view: WorkspaceView; label: string }>;

  const priorityData = copy.overview.priorityItems.map((item, index) => ({
    ...item,
    value:
      index === 0
        ? dashboard.admissions.length
        : index === 1
          ? dashboard.contacts.length
          : totalDrafts,
  }));

  function renderWorkspaceHeader(title: string, description: string) {
    return (
      <div className={styles.workspaceHeader}>
        <div>
          <span className={styles.sectionEyebrow}>{copy.workspace}</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
    );
  }

  function renderFilterBar() {
    return (
      <div className={styles.commandBar}>
        <form className={styles.filterForm}>
          <input type="hidden" name="view" value={view} />
          <input
            type="search"
            name="q"
            defaultValue={typeof searchParams.q === "string" ? searchParams.q : ""}
            placeholder={copy.filters.searchPlaceholder}
            className={styles.filterInput}
          />
          <select name="status" defaultValue={statusFilter} className={styles.filterSelect}>
            <option value="ALL">{copy.filters.allStatuses}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.secondaryAction}>
            {copy.filters.apply}
          </button>
        </form>

        <form action={seedDemoContentAction}>
          <button type="submit" className={styles.secondaryAction}>
            {copy.filters.demo}
          </button>
        </form>
      </div>
    );
  }

  function renderOverview() {
    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(copy.overview.title, copy.overview.description)}

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span>{copy.stats.users}</span>
            <strong>{dashboard.users}</strong>
            <p>{copy.statsText.users}</p>
          </article>
          <article className={styles.statCard}>
            <span>{copy.stats.library}</span>
            <strong>{blogs.length + courses.length + books.length}</strong>
            <p>{copy.statsText.library}</p>
          </article>
          <article className={styles.statCard}>
            <span>{copy.stats.payments}</span>
            <strong>{dashboard.payments.length}</strong>
            <p>{copy.statsText.payments}</p>
          </article>
          <article className={styles.statCard}>
            <span>{copy.stats.certificates}</span>
            <strong>{dashboard.certificates.length}</strong>
            <p>{copy.statsText.certificates}</p>
          </article>
        </div>

        <div className={styles.summaryGrid}>
          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.overview.priority}</span>
                <h3>{copy.overview.priority}</h3>
              </div>
            </div>
            <div className={styles.priorityList}>
              {priorityData.map((task) => (
                <div key={task.label} className={styles.priorityItem}>
                  <div>
                    <strong>{task.label}</strong>
                    <p>{task.hint}</p>
                  </div>
                  <span className={styles.priorityValue}>{task.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.overview.workflowTitle}</span>
                <h3>{copy.overview.workflowTitle}</h3>
              </div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoItem}>
                <strong>{copy.views.blogs}</strong>
                <span>{filteredBlogs.length} {copy.common.totalItems.toLowerCase()}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>{copy.views.courses}</strong>
                <span>{filteredCourses.length} {copy.common.totalItems.toLowerCase()}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>{copy.views.books}</strong>
                <span>{filteredBooks.length} {copy.common.totalItems.toLowerCase()}</span>
              </div>
            </div>
            <p className={styles.workspaceNote}>{copy.overview.workflowText}</p>
          </article>
        </div>
      </div>
    );
  }

  function renderOperations() {
    const certificateCourses = courses.filter((course) => course.status !== "ARCHIVED");

    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(copy.operations.title, copy.operations.description)}
        <div className={styles.operationsGrid}>
          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.operations.admissions}</span>
                <h3>{copy.operations.admissionsSub}</h3>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.admissions.length ? (
                dashboard.admissions.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.course || copy.meta.general}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "NEW"}</span>
                      <small>{formatDate(item.createdAt, locale, copy.meta.recent)}</small>
                      <form action={updateAdmissionStatusAction} className={styles.inlineAction}>
                        <input type="hidden" name="view" value="operations" />
                        <input type="hidden" name="id" value={item.id} />
                        <select name="status" defaultValue={item.status || "NEW"}>
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="WAITLISTED">WAITLISTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                        <button type="submit" className={styles.miniButton}>
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.operations.emptyAdmissions}</div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.operations.contacts}</span>
                <h3>{copy.operations.contactsSub}</h3>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.contacts.length ? (
                dashboard.contacts.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.subject || copy.meta.general}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.metaLine}>{item.email || copy.meta.general}</span>
                      <small>{formatDate(item.createdAt, locale, copy.meta.recent)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.operations.emptyContacts}</div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.operations.submissions}</span>
                <h3>{copy.operations.submissionsSub}</h3>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.submissions.length ? (
                dashboard.submissions.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.assignment?.title || copy.meta.general}</strong>
                      <p>{item.student?.name || copy.meta.general}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "DRAFT"}</span>
                      <small>{formatDate(item.updatedAt, locale, copy.meta.recent)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.operations.emptySubmissions}</div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.operations.payments}</span>
                <h3>{copy.operations.paymentsSub}</h3>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.payments.length ? (
                dashboard.payments.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.user?.name || copy.meta.paymentFallback}</strong>
                      <p>{item.course?.title || copy.meta.general}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "PENDING"}</span>
                      <small>{formatMoney(item.amount, item.currency)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.operations.emptyPayments}</div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Certificate desk</span>
                <h3>Issue a completion certificate</h3>
              </div>
            </div>
            <form action={issueCertificateAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <label className={styles.field}>
                <span>Student email</span>
                <input
                  name="studentEmail"
                  type="email"
                  placeholder="student@example.com"
                  required
                />
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Course</span>
                  <select name="courseId" defaultValue="" required>
                    <option value="" disabled>
                      Select live course
                    </option>
                    {certificateCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Issue date</span>
                  <input name="issuedAt" type="date" />
                </label>
              </div>
              <div className={styles.infoPanel}>
                <strong>How this works</strong>
                <p>
                  A certificate is generated once per student and course, saved
                  in the database, then shown inside the student dashboard with
                  its public verification page.
                </p>
              </div>
              <button type="submit" className={styles.primaryAction}>
                Issue certificate
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Lesson builder</span>
                <h3>Create a course lesson</h3>
              </div>
            </div>
            <form action={createLessonAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <label className={styles.field}>
                <span>Course</span>
                <select name="courseId" defaultValue="" required>
                  <option value="" disabled>
                    Select course
                  </option>
                  {certificateCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Lesson title</span>
                  <input name="title" required />
                </label>
                <label className={styles.field}>
                  <span>Slug optional</span>
                  <input name="slug" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Order</span>
                  <input name="order" type="number" min="0" defaultValue="0" />
                </label>
                <label className={styles.field}>
                  <span>Duration minutes</span>
                  <input name="duration" type="number" min="1" defaultValue="45" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Lesson notes</span>
                <textarea name="content" rows={5} />
              </label>
              <label className={styles.checkRow}>
                <input name="isPreview" type="checkbox" />
                <span>Allow public preview</span>
              </label>
              <button type="submit" className={styles.primaryAction}>
                Create lesson
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Assignment desk</span>
                <h3>Create assignment</h3>
              </div>
            </div>
            <form action={createAssignmentAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <label className={styles.field}>
                <span>Course</span>
                <select name="courseId" defaultValue="" required>
                  <option value="" disabled>
                    Select course
                  </option>
                  {certificateCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Assignment title</span>
                  <input name="title" required />
                </label>
                <label className={styles.field}>
                  <span>Due date</span>
                  <input name="dueDate" type="date" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Description</span>
                <textarea name="description" rows={5} />
              </label>
              <button type="submit" className={styles.primaryAction}>
                Create assignment
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Enrollment desk</span>
                <h3>Add or update enrollment</h3>
              </div>
            </div>
            <form action={createEnrollmentAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <label className={styles.field}>
                <span>Student email</span>
                <input name="studentEmail" type="email" required />
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Course</span>
                  <select name="courseId" defaultValue="" required>
                    <option value="" disabled>
                      Select course
                    </option>
                    {certificateCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Status</span>
                  <select name="status" defaultValue="ACTIVE">
                    <option value="PENDING">PENDING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </label>
              </div>
              <button type="submit" className={styles.primaryAction}>
                Save enrollment
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Payment desk</span>
                <h3>Record a payment</h3>
              </div>
            </div>
            <form action={createPaymentAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>User email</span>
                  <input name="userEmail" type="email" required />
                </label>
                <label className={styles.field}>
                  <span>Reference</span>
                  <input name="referenceId" required />
                </label>
              </div>
              <label className={styles.field}>
                <span>Course optional</span>
                <select name="courseId" defaultValue="">
                  <option value="">No course</option>
                  {certificateCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Amount</span>
                  <input name="amount" type="number" min="1" step="0.01" required />
                </label>
                <label className={styles.field}>
                  <span>Currency</span>
                  <input name="currency" defaultValue="USD" />
                </label>
                <label className={styles.field}>
                  <span>Status</span>
                  <select name="status" defaultValue="PAID">
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </label>
              </div>
              <label className={styles.field}>
                <span>Provider</span>
                <input name="provider" placeholder="Bank transfer, Stripe, Easypaisa" />
              </label>
              <button type="submit" className={styles.primaryAction}>
                Save payment
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Media library</span>
                <h3>Register uploaded media</h3>
              </div>
            </div>
            <form action={createMediaRecordAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="operations" />
              <div className={styles.infoPanel}>
                <strong>Storage note</strong>
                <p>
                  Add the final cloud URL here. For direct Vercel Blob uploads,
                  configure BLOB_READ_WRITE_TOKEN in production.
                </p>
              </div>
              <label className={styles.field}>
                <span>File URL</span>
                <input name="url" type="url" required />
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Filename</span>
                  <input name="filename" required />
                </label>
                <label className={styles.field}>
                  <span>MIME type</span>
                  <input name="mimeType" placeholder="image/webp" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Size bytes optional</span>
                <input name="size" type="number" min="0" />
              </label>
              <button type="submit" className={styles.primaryAction}>
                Save media record
              </button>
            </form>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.operations.certificates}</span>
                <h3>{copy.operations.certificatesSub}</h3>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.certificates.length ? (
                dashboard.certificates.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.studentName || copy.meta.general}</strong>
                      <p>{item.courseName || copy.meta.general}</p>
                      {item.certificateNo ? (
                        <small className={styles.metaLine}>{item.certificateNo}</small>
                      ) : null}
                    </div>
                    <div className={styles.feedMeta}>
                      {item.verificationId ? (
                        <a
                          href={`/certificates/${item.verificationId}`}
                          className={styles.metaLine}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify record
                        </a>
                      ) : (
                        <span className={styles.metaLine}>{copy.meta.issued}</span>
                      )}
                      <small>{formatDate(item.issuedAt, locale, copy.meta.recent)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.operations.emptyCertificates}</div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  function renderBlogWorkspace() {
    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(copy.modules.blogs.title, copy.modules.blogs.description)}
        {renderFilterBar()}
        <div className={styles.workspaceColumns}>
          <article className={styles.editorCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.views.blogs}</span>
                <h3>{copy.modules.blogs.createTitle}</h3>
              </div>
            </div>
            <form action={createBlogAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="blogs" />
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.title}</span>
                  <input name="title" placeholder="New article title" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.titleUrdu}</span>
                  <input name="titleUrdu" dir="rtl" placeholder="اردو عنوان" />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>{copy.common.slug}</span>
                  <input name="slug" placeholder="auto-generate-ho-jayega" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.category}</span>
                  <select name="categoryName" defaultValue="Quran">
                    <option value="Quran">Quran</option>
                    <option value="Tajweed">Tajweed</option>
                    <option value="Parenting">Parenting</option>
                    <option value="Spirituality">Spirituality</option>
                    <option value="Study Habits">Study Habits</option>
                    <option value="CUSTOM">{copy.common.customCategory}</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{copy.common.customCategory}</span>
                  <input name="customCategoryName" placeholder="Custom category" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.status}</span>
                  <select name="status" defaultValue="PUBLISHED">
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className={styles.infoPanel}>
                  <strong>{copy.modules.blogs.title}</strong>
                  <p>{copy.modules.blogs.description}</p>
                </div>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.excerpt}</span>
                  <textarea name="excerpt" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.excerptUrdu}</span>
                  <textarea name="excerptUrdu" dir="rtl" />
                </label>
              </div>
              <StructuredEditor
                name="content"
                label={copy.common.content}
                placeholder="Write the main article here..."
              />
              <StructuredEditor
                name="contentUrdu"
                label={copy.common.contentUrdu}
                dir="rtl"
                placeholder="اردو مکمل مواد"
              />
              <button type="submit" className={styles.primaryAction}>
                {copy.modules.blogs.create}
              </button>
            </form>
          </article>

          <article className={styles.listCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.common.totalItems}</span>
                <h3>{copy.modules.blogs.listTitle}</h3>
              </div>
              <span className={styles.counterBadge}>{filteredBlogs.length}</span>
            </div>
            <div className={styles.recordList}>
              {filteredBlogs.length ? (
                filteredBlogs.map((blog) => (
                  <div key={blog.id} className={styles.recordItem}>
                    <div className={styles.recordTop}>
                      <strong>{resolveLocalizedInlineText(blog.title, locale)}</strong>
                      <span className={styles.statusPill}>{blog.status}</span>
                    </div>
                    <p className={styles.recordMeta}>
                      {blog.category?.name || copy.meta.general} | {blog.author?.email || copy.meta.noAuthor}
                    </p>
                    <details className={styles.editDetails}>
                      <summary className={styles.editSummary}>{copy.common.edit}</summary>
                      <form action={updateBlogAction} className={styles.editForm}>
                        <input type="hidden" name="id" value={blog.id} />
                        <input type="hidden" name="view" value="blogs" />
                        <div className={styles.formSplit}>
                          <label className={styles.field}>
                            <span>{copy.common.title}</span>
                            <input name="title" defaultValue={blog.title} required />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.slug}</span>
                            <input name="slug" defaultValue={blog.slug} />
                          </label>
                        </div>
                        <div className={styles.formSplit}>
                          <label className={styles.field}>
                            <span>{copy.common.category}</span>
                            <select
                              name="categoryName"
                              defaultValue={
                                ["Quran", "Tajweed", "Parenting", "Spirituality", "Study Habits"].includes(
                                  blog.category?.name || ""
                                )
                                  ? blog.category?.name || "Quran"
                                  : "CUSTOM"
                              }
                            >
                              <option value="Quran">Quran</option>
                              <option value="Tajweed">Tajweed</option>
                              <option value="Parenting">Parenting</option>
                              <option value="Spirituality">Spirituality</option>
                              <option value="Study Habits">Study Habits</option>
                              <option value="CUSTOM">{copy.common.customCategory}</option>
                            </select>
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.customCategory}</span>
                            <input
                              name="customCategoryName"
                              defaultValue={
                                ["Quran", "Tajweed", "Parenting", "Spirituality", "Study Habits"].includes(
                                  blog.category?.name || ""
                                )
                                  ? ""
                                  : blog.category?.name || ""
                              }
                            />
                          </label>
                        </div>
                        <label className={styles.field}>
                          <span>{copy.common.status}</span>
                          <select name="status" defaultValue={blog.status}>
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>{copy.common.excerpt}</span>
                          <textarea name="excerpt" defaultValue={blog.excerpt || ""} required />
                        </label>
                        <StructuredEditor
                          name="content"
                          label={copy.common.content}
                          defaultValue={blog.content || ""}
                          required
                        />
                        <button type="submit" className={styles.secondaryAction}>
                          {copy.common.save}
                        </button>
                      </form>
                    </details>
                    <form action={deleteBlogAction} className={styles.inlineAction}>
                      <input type="hidden" name="id" value={blog.id} />
                      <input type="hidden" name="view" value="blogs" />
                      <button type="submit" className={styles.dangerButton}>
                        {copy.common.delete}
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.modules.blogs.empty}</div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  function renderCourseWorkspace() {
    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(copy.modules.courses.title, copy.modules.courses.description)}
        {renderFilterBar()}
        <div className={styles.workspaceColumns}>
          <article className={styles.editorCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.views.courses}</span>
                <h3>{copy.modules.courses.createTitle}</h3>
              </div>
            </div>
            <form action={createCourseAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="courses" />
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.title}</span>
                  <input name="title" placeholder="Course title" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.titleUrdu}</span>
                  <input name="titleUrdu" dir="rtl" placeholder="اردو کورس عنوان" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.slug}</span>
                  <input name="slug" placeholder="auto-generate-ho-jayega" />
                </label>
                <div className={styles.infoPanel}>
                  <strong>{copy.modules.courses.title}</strong>
                  <p>{copy.modules.courses.description}</p>
                </div>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>{copy.common.level}</span>
                  <select name="level" defaultValue="All Levels">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{copy.common.status}</span>
                  <select name="status" defaultValue="PUBLISHED">
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{copy.common.price}</span>
                  <input name="price" type="number" min="0" step="1" defaultValue="0" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.duration}</span>
                  <input name="duration" placeholder="8 Weeks" />
                </label>
                <label className={styles.checkboxField}>
                  <input type="checkbox" name="featured" defaultChecked />
                  <span>{copy.common.featuredHome}</span>
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.description}</span>
                  <textarea name="description" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.descriptionUrdu}</span>
                  <textarea name="descriptionUrdu" dir="rtl" />
                </label>
              </div>
              <StructuredEditor
                name="content"
                label={copy.common.content}
                placeholder="Each line can be one curriculum point"
              />
              <StructuredEditor
                name="contentUrdu"
                label={copy.common.contentUrdu}
                dir="rtl"
                placeholder="ہر لائن ایک نصابی پوائنٹ ہو سکتی ہے"
              />
              <button type="submit" className={styles.primaryAction}>
                {copy.modules.courses.create}
              </button>
            </form>
          </article>

          <article className={styles.listCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.common.totalItems}</span>
                <h3>{copy.modules.courses.listTitle}</h3>
              </div>
              <span className={styles.counterBadge}>{filteredCourses.length}</span>
            </div>
            <div className={styles.recordList}>
              {filteredCourses.length ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className={styles.recordItem}>
                    <div className={styles.recordTop}>
                      <strong>{resolveLocalizedInlineText(course.title, locale)}</strong>
                      <span className={styles.statusPill}>{course.status}</span>
                    </div>
                    <p className={styles.recordMeta}>
                      {course.level || copy.meta.allLevels} |{" "}
                      {course.featured ? copy.meta.featured : copy.meta.standard}
                    </p>
                    <details className={styles.editDetails}>
                      <summary className={styles.editSummary}>{copy.common.edit}</summary>
                      <form action={updateCourseAction} className={styles.editForm}>
                        <input type="hidden" name="id" value={course.id} />
                        <input type="hidden" name="view" value="courses" />
                        <div className={styles.formSplit}>
                          <label className={styles.field}>
                            <span>{copy.common.title}</span>
                            <input name="title" defaultValue={course.title} required />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.slug}</span>
                            <input name="slug" defaultValue={course.slug} />
                          </label>
                        </div>
                        <div className={styles.formTriple}>
                          <label className={styles.field}>
                            <span>{copy.common.level}</span>
                            <input name="level" defaultValue={course.level || ""} />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.status}</span>
                            <select name="status" defaultValue={course.status}>
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.price}</span>
                            <input
                              name="price"
                              type="number"
                              defaultValue={Number(course.price || 0)}
                            />
                          </label>
                        </div>
                        <div className={styles.formSplit}>
                          <label className={styles.field}>
                            <span>{copy.common.duration}</span>
                            <input name="duration" defaultValue={course.duration || ""} />
                          </label>
                          <label className={styles.checkboxField}>
                            <input type="checkbox" name="featured" defaultChecked={course.featured} />
                            <span>{copy.common.featuredHome}</span>
                          </label>
                        </div>
                        <label className={styles.field}>
                          <span>{copy.common.description}</span>
                          <textarea name="description" defaultValue={course.description || ""} required />
                        </label>
                        <StructuredEditor
                          name="content"
                          label={copy.common.content}
                          defaultValue={course.content || ""}
                        />
                        <button type="submit" className={styles.secondaryAction}>
                          {copy.common.save}
                        </button>
                      </form>
                    </details>
                    <form action={deleteCourseAction} className={styles.inlineAction}>
                      <input type="hidden" name="id" value={course.id} />
                      <input type="hidden" name="view" value="courses" />
                      <button type="submit" className={styles.dangerButton}>
                        {copy.common.delete}
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.modules.courses.empty}</div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  function renderBookWorkspace() {
    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(copy.modules.books.title, copy.modules.books.description)}
        {renderFilterBar()}
        <div className={styles.workspaceColumns}>
          <article className={styles.editorCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.views.books}</span>
                <h3>{copy.modules.books.createTitle}</h3>
              </div>
            </div>
            <form action={createBookAction} className={styles.adminForm}>
              <input type="hidden" name="view" value="books" />
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.title}</span>
                  <input name="title" placeholder="Book title" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.titleUrdu}</span>
                  <input name="titleUrdu" dir="rtl" placeholder="اردو کتاب عنوان" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.slug}</span>
                  <input name="slug" placeholder="auto-generate-ho-jayega" />
                </label>
                <div className={styles.infoPanel}>
                  <strong>{copy.modules.books.title}</strong>
                  <p>{copy.modules.books.description}</p>
                </div>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>{copy.common.category}</span>
                  <select name="category" defaultValue="Quran">
                    <option value="Quran">Quran</option>
                    <option value="Fiqh">Fiqh</option>
                    <option value="Aqidah">Aqidah</option>
                    <option value="Character">Character</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{copy.common.status}</span>
                  <select name="status" defaultValue="PUBLISHED">
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>{copy.common.pages}</span>
                  <input name="pages" type="number" min="1" defaultValue="32" />
                </label>
              </div>
              <label className={styles.field}>
                <span>{copy.common.format}</span>
                <input name="format" defaultValue="PDF Guide" required />
              </label>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.summary}</span>
                  <textarea name="summary" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.summaryUrdu}</span>
                  <textarea name="summaryUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.featuredNote}</span>
                  <textarea name="featuredNote" />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.featuredNoteUrdu}</span>
                  <textarea name="featuredNoteUrdu" dir="rtl" />
                </label>
              </div>
              <button type="submit" className={styles.primaryAction}>
                {copy.modules.books.create}
              </button>
            </form>
          </article>

          <article className={styles.listCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{copy.common.totalItems}</span>
                <h3>{copy.modules.books.listTitle}</h3>
              </div>
              <span className={styles.counterBadge}>{filteredBooks.length}</span>
            </div>
            <div className={styles.recordList}>
              {filteredBooks.length ? (
                filteredBooks.map((book) => (
                  <div key={book.id} className={styles.recordItem}>
                    <div className={styles.recordTop}>
                      <strong>{resolveLocalizedInlineText(book.title, locale)}</strong>
                      <span className={styles.statusPill}>{book.status}</span>
                    </div>
                    <p className={styles.recordMeta}>
                      {book.category} | {book.format} | {book.pages}
                    </p>
                    <details className={styles.editDetails}>
                      <summary className={styles.editSummary}>{copy.common.edit}</summary>
                      <form action={updateBookAction} className={styles.editForm}>
                        <input type="hidden" name="id" value={book.id} />
                        <input type="hidden" name="view" value="books" />
                        <div className={styles.formSplit}>
                          <label className={styles.field}>
                            <span>{copy.common.title}</span>
                            <input name="title" defaultValue={book.title} required />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.slug}</span>
                            <input name="slug" defaultValue={book.slug} />
                          </label>
                        </div>
                        <div className={styles.formTriple}>
                          <label className={styles.field}>
                            <span>{copy.common.category}</span>
                            <input name="category" defaultValue={book.category} />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.format}</span>
                            <input name="format" defaultValue={book.format} />
                          </label>
                          <label className={styles.field}>
                            <span>{copy.common.pages}</span>
                            <input name="pages" type="number" defaultValue={book.pages} />
                          </label>
                        </div>
                        <label className={styles.field}>
                          <span>{copy.common.status}</span>
                          <select name="status" defaultValue={book.status}>
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>{copy.common.summary}</span>
                          <textarea name="summary" defaultValue={book.summary} required />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.common.featuredNote}</span>
                          <textarea name="featuredNote" defaultValue={book.featuredNote || ""} />
                        </label>
                        <button type="submit" className={styles.secondaryAction}>
                          {copy.common.save}
                        </button>
                      </form>
                    </details>
                    <form action={deleteBookAction} className={styles.inlineAction}>
                      <input type="hidden" name="id" value={book.id} />
                      <input type="hidden" name="view" value="books" />
                      <button type="submit" className={styles.dangerButton}>
                        {copy.common.delete}
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>{copy.modules.books.empty}</div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  function renderSettingsWorkspace() {
    const settingsCopy = {
      title: locale === "ur" ? "سائٹ سیٹنگز" : locale === "ar" ? "إعدادات الموقع" : "Site settings",
      description:
        locale === "ur"
          ? "ہوم پیج ہیرو، برانڈنگ، لوگو، اور سوشل لنکس کو یہاں سے کنٹرول کریں۔"
          : locale === "ar"
            ? "تحكم في بطل الصفحة الرئيسية والعلامة التجارية والشعار وروابط التواصل من هنا."
            : "Control homepage hero content, branding, logo, and key social links from here.",
      identityTitle:
        locale === "ur"
          ? "برانڈ اور رابطہ سیٹنگز"
          : locale === "ar"
            ? "إعدادات العلامة والتواصل"
            : "Brand and contact settings",
      heroTitle:
        locale === "ur" ? "ہوم پیج ہیرو" : locale === "ar" ? "بطل الصفحة الرئيسية" : "Homepage hero",
      saveIdentity:
        locale === "ur"
          ? "سائٹ سیٹنگز محفوظ کریں"
          : locale === "ar"
            ? "احفظ إعدادات الموقع"
            : "Save site settings",
      saveHero:
        locale === "ur"
          ? "ہیرو کانٹینٹ محفوظ کریں"
          : locale === "ar"
            ? "احفظ محتوى البطل"
            : "Save hero content",
    };

    const socials = siteSettings.socials;

    return (
      <div className={styles.workspaceStack}>
        {renderWorkspaceHeader(settingsCopy.title, settingsCopy.description)}
        <div className={styles.workspaceColumns}>
          <article className={styles.editorCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>{settingsCopy.title}</span>
                <h3>{settingsCopy.identityTitle}</h3>
              </div>
            </div>
            <form action={saveSiteSettingsAction} className={styles.adminForm}>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.title}</span>
                  <input name="brandName" defaultValue={siteSettings.brandName} />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.titleUrdu}</span>
                  <input name="brandNameUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Subtitle</span>
                  <textarea name="subtitle" defaultValue={siteSettings.subtitle} />
                </label>
                <label className={styles.field}>
                  <span>Subtitle Urdu</span>
                  <textarea name="subtitleUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Description</span>
                  <textarea name="description" defaultValue={siteSettings.description} />
                </label>
                <label className={styles.field}>
                  <span>Description Urdu</span>
                  <textarea name="descriptionUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Footer text</span>
                  <textarea name="footerText" defaultValue={siteSettings.footerText} />
                </label>
                <label className={styles.field}>
                  <span>Footer text Urdu</span>
                  <textarea name="footerTextUrdu" dir="rtl" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Logo path</span>
                <input name="logoSrc" defaultValue={siteSettings.logoSrc} />
              </label>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>YouTube</span>
                  <input name="youtube" defaultValue={socials.youtube} />
                </label>
                <label className={styles.field}>
                  <span>Facebook</span>
                  <input name="facebook" defaultValue={socials.facebook} />
                </label>
                <label className={styles.field}>
                  <span>Instagram</span>
                  <input name="instagram" defaultValue={socials.instagram} />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>TikTok</span>
                  <input name="tiktok" defaultValue={socials.tiktok} />
                </label>
                <label className={styles.field}>
                  <span>WhatsApp channel</span>
                  <input name="whatsapp" defaultValue={socials.whatsapp} />
                </label>
                <label className={styles.field}>
                  <span>WhatsApp chat</span>
                  <input name="whatsappChat" defaultValue={socials.whatsappChat} />
                </label>
              </div>
              <button type="submit" className={styles.primaryAction}>
                {settingsCopy.saveIdentity}
              </button>
            </form>
          </article>

          <article className={styles.editorCard}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Hero</span>
                <h3>{settingsCopy.heroTitle}</h3>
              </div>
            </div>
            <form action={saveHomepageHeroSettingsAction} className={styles.adminForm}>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Badge</span>
                  <input name="badge" defaultValue={heroSettings.badge} />
                </label>
                <label className={styles.field}>
                  <span>Badge Urdu</span>
                  <input name="badgeUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.title}</span>
                  <textarea name="title" defaultValue={heroSettings.title} />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.titleUrdu}</span>
                  <textarea name="titleUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>{copy.common.description}</span>
                  <textarea name="description" defaultValue={heroSettings.description} />
                </label>
                <label className={styles.field}>
                  <span>{copy.common.descriptionUrdu}</span>
                  <textarea name="descriptionUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Mini highlights</span>
                  <textarea name="miniHighlights" defaultValue={heroSettings.miniHighlights} />
                </label>
                <label className={styles.field}>
                  <span>Mini highlights Urdu</span>
                  <textarea name="miniHighlightsUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Course pills</span>
                  <textarea name="highlights" defaultValue={heroSettings.highlights} />
                </label>
                <label className={styles.field}>
                  <span>Course pills Urdu</span>
                  <textarea name="highlightsUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Primary CTA</span>
                  <input name="primaryAction" defaultValue={heroSettings.primaryAction} />
                </label>
                <label className={styles.field}>
                  <span>Primary CTA Urdu</span>
                  <input name="primaryActionUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Secondary CTA</span>
                  <input name="secondaryAction" defaultValue={heroSettings.secondaryAction} />
                </label>
                <label className={styles.field}>
                  <span>Secondary CTA Urdu</span>
                  <input name="secondaryActionUrdu" dir="rtl" />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Stat 1 label</span>
                  <input name="statLabel1" defaultValue={heroSettings.stats[0]?.label || ""} />
                </label>
                <label className={styles.field}>
                  <span>Stat 1 Urdu</span>
                  <input name="statLabel1Urdu" dir="rtl" />
                </label>
                <label className={styles.field}>
                  <span>Stat 1 value</span>
                  <input name="statValue1" defaultValue={heroSettings.stats[0]?.value || ""} />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Stat 2 label</span>
                  <input name="statLabel2" defaultValue={heroSettings.stats[1]?.label || ""} />
                </label>
                <label className={styles.field}>
                  <span>Stat 2 Urdu</span>
                  <input name="statLabel2Urdu" dir="rtl" />
                </label>
                <label className={styles.field}>
                  <span>Stat 2 value</span>
                  <input name="statValue2" defaultValue={heroSettings.stats[1]?.value || ""} />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Stat 3 label</span>
                  <input name="statLabel3" defaultValue={heroSettings.stats[2]?.label || ""} />
                </label>
                <label className={styles.field}>
                  <span>Stat 3 Urdu</span>
                  <input name="statLabel3Urdu" dir="rtl" />
                </label>
                <label className={styles.field}>
                  <span>Stat 3 value</span>
                  <input name="statValue3" defaultValue={heroSettings.stats[2]?.value || ""} />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Trust label</span>
                  <input name="trusted" defaultValue={heroSettings.trusted} />
                </label>
                <label className={styles.field}>
                  <span>Curriculum label</span>
                  <input name="curriculum" defaultValue={heroSettings.curriculum} />
                </label>
                <label className={styles.field}>
                  <span>Teachers label</span>
                  <input name="teachers" defaultValue={heroSettings.teachers} />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Image alt</span>
                  <input name="imageAlt" defaultValue={heroSettings.imageAlt} />
                </label>
                <label className={styles.field}>
                  <span>Image path</span>
                  <input name="imageSrc" defaultValue={heroSettings.imageSrc} />
                </label>
              </div>
              <div className={styles.formTriple}>
                <label className={styles.field}>
                  <span>Certificate</span>
                  <input name="certificate" defaultValue={heroSettings.certificate} />
                </label>
                <label className={styles.field}>
                  <span>Certificate detail</span>
                  <input name="certificateDetail" defaultValue={heroSettings.certificateDetail} />
                </label>
                <label className={styles.field}>
                  <span>Verified badge</span>
                  <input name="verified" defaultValue={heroSettings.verified} />
                </label>
              </div>
              <div className={styles.formSplit}>
                <label className={styles.field}>
                  <span>Live classes</span>
                  <input name="liveClasses" defaultValue={heroSettings.liveClasses} />
                </label>
                <label className={styles.field}>
                  <span>Live detail</span>
                  <input name="liveDetail" defaultValue={heroSettings.liveDetail} />
                </label>
              </div>
              <button type="submit" className={styles.primaryAction}>
                {settingsCopy.saveHero}
              </button>
            </form>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminSection}>
      <div className={styles.dashboardShell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBrand}>
            <div className={styles.brandMark}>
              <Image
                src={siteSettings.logoSrc}
                alt={siteSettings.brandName}
                width={56}
                height={56}
                className={styles.brandLogo}
              />
            </div>
            <div className={styles.brandText}>
              <strong>{siteSettings.brandName}</strong>
              <span>{copy.sidebarTitle}</span>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            {sidebarLinks.map((item) => (
              <a
                key={item.view}
                href={`/admin?view=${item.view}`}
                className={item.view === view ? styles.sidebarLinkActive : styles.sidebarLink}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.sidebarMeta}>
            <span className={styles.sidebarLabel}>{copy.role}</span>
            <strong>{session.user.role}</strong>
            <p>{session.user.email}</p>
          </div>

          <div className={styles.sidebarFoot}>
            <SignOutButton />
          </div>
        </aside>

        <div className={styles.dashboard}>
          <div className={styles.heroCard}>
            <div className={styles.heroContent}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>{copy.heroEyebrow}</span>
                <span className={styles.roleBadge}>
                  {sidebarLinks.find((item) => item.view === view)?.label || copy.views.overview}
                </span>
              </div>
              <div className={styles.heroHeading}>
                <div>
                  <h1>{copy.heroTitle}</h1>
                  <p className={styles.heroDate}>{todayLabel}</p>
                </div>
                <div className={styles.heroBadge}>{copy.heroBadge}</div>
              </div>
              <p className={styles.heroText}>{copy.heroText}</p>
              <div className={styles.quickActions}>
                {sidebarLinks.map((item) => (
                  <a key={item.view} href={`/admin?view=${item.view}`} className={styles.quickLink}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.heroSide}>
              <div className={styles.profileCard}>
                <div>
                  <span className={styles.profileLabel}>{copy.signedInAs}</span>
                  <strong>{session.user.name || "Super Admin"}</strong>
                </div>
                <span className={styles.profileMeta}>{session.user.email}</span>
              </div>

              <div className={styles.healthCard}>
                <div className={styles.healthHeader}>
                  <strong>{copy.health}</strong>
                  <span>
                    {publishedContent} {copy.liveItems}
                  </span>
                </div>
                <div className={styles.healthRow}>
                  <span>{copy.admissionsQueue}</span>
                  <strong>{dashboard.admissions.length}</strong>
                </div>
                <div className={styles.healthRow}>
                  <span>{copy.contactsQueue}</span>
                  <strong>{dashboard.contacts.length}</strong>
                </div>
                <div className={styles.healthRow}>
                  <span>{copy.contentDrafts}</span>
                  <strong>{totalDrafts}</strong>
                </div>
              </div>
            </div>
          </div>

          {notice ? (
            <div className={notice.tone === "success" ? styles.noticeSuccess : styles.noticeError}>
              {notice.text}
            </div>
          ) : null}

          {view === "overview"
            ? renderOverview()
            : view === "operations"
              ? renderOperations()
              : view === "blogs"
                ? renderBlogWorkspace()
                : view === "courses"
                  ? renderCourseWorkspace()
                  : view === "books"
                    ? renderBookWorkspace()
                    : renderSettingsWorkspace()}
        </div>
      </div>
    </div>
  );
}
