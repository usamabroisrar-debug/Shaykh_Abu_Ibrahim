import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import styles from "@/components/auth/AuthForms.module.css";
import { getLocaleContent, getLocaleFromCookies } from "@/lib/locale";
import { auth, getDashboardPath } from "@/lib/auth";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Login",
  description:
    "Login to access your Islamic learning dashboard, courses, admissions, certificates, and admin or teacher tools.",
  path: "/login",
});

const allowedNextPaths = new Set(["/admin", "/teacher", "/student"]);

function getSafeNextPath(next?: string) {
  if (next && allowedNextPaths.has(next)) {
    return next;
  }

  return "/student";
}

function getRoleAwareCopy(nextPath: string, content: ReturnType<typeof getLocaleContent>) {
  const locale = content.lang;

  if (nextPath === "/admin") {
    return {
      shellTitle:
        locale === "en"
          ? "Login to access your academy control center"
          : locale === "ar"
            ? "سجّل الدخول للوصول إلى مركز إدارة الأكاديمية"
            : "Academy control center tak pohanchne ke liye login karein",
      shellDescription:
        locale === "en"
          ? "Administrative access for admissions, public content, inquiries, payments, and academy operations."
          : locale === "ar"
            ? "وصول إداري لإدارة القبول والمحتوى العام والاستفسارات والمدفوعات وعمليات الأكاديمية."
            : "Admissions, public content, inquiries, payments aur academy operations ke liye administrative access.",
      cardEyebrow:
        locale === "en" ? "Admin login" : locale === "ar" ? "دخول الإدارة" : "Admin login",
      cardTitle:
        locale === "en"
          ? "Welcome back, admin"
          : locale === "ar"
            ? "مرحباً بعودتك يا مسؤول النظام"
            : "Welcome back, admin",
      cardDescription:
        locale === "en"
          ? "Use your academy admin credentials to manage the website, teams, and operational workflows."
          : locale === "ar"
            ? "استخدم بيانات مسؤول الأكاديمية لإدارة الموقع والفِرق وسير العمل التشغيلي."
            : "Website, team aur operational workflows manage karne ke liye academy admin credentials use karein.",
    };
  }

  if (nextPath === "/teacher") {
    return {
      shellTitle:
        locale === "en"
          ? "Login to manage your teaching workspace"
          : locale === "ar"
            ? "سجّل الدخول لإدارة مساحة التدريس الخاصة بك"
            : "Apna teaching workspace manage karne ke liye login karein",
      shellDescription:
        locale === "en"
          ? "Teacher access for courses, assignments, student progress, and classroom activity."
          : locale === "ar"
            ? "وصول المعلمين إلى الدورات والواجبات وتقدّم الطلاب ونشاط الصف."
            : "Courses, assignments, student progress aur classroom activity ke liye teacher access.",
      cardEyebrow:
        locale === "en" ? "Teacher login" : locale === "ar" ? "دخول المعلم" : "Teacher login",
      cardTitle:
        locale === "en"
          ? "Welcome back, teacher"
          : locale === "ar"
            ? "مرحباً بعودتك أيها المعلم"
            : "Welcome back, teacher",
      cardDescription:
        locale === "en"
          ? "Sign in to review lessons, submissions, and teaching responsibilities."
          : locale === "ar"
            ? "سجّل الدخول لمراجعة الدروس والتسليمات ومسؤوليات التدريس."
            : "Lessons, submissions aur teaching responsibilities dekhne ke liye sign in karein.",
    };
  }

  return {
    shellTitle: content.auth.loginJourney,
    shellDescription: content.auth.loginDescription,
    cardEyebrow: content.auth.login,
    cardTitle: content.auth.welcomeBack,
    cardDescription: content.auth.useCredentials,
  };
}

function getRedirectPathForSignedInUser(nextPath: string, role?: string | null) {
  const ownDashboardPath = getDashboardPath(role);

  if (
    (nextPath === "/admin" && ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role || "")) ||
    (nextPath === "/teacher" && role === "TEACHER") ||
    (nextPath === "/student" && ["STUDENT", "PARENT"].includes(role || ""))
  ) {
    return nextPath;
  }

  return ownDashboardPath;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromCookies(await cookies());
  const content = getLocaleContent(locale);
  const nextPath = getSafeNextPath(params.next);
  const session = await auth();

  if (session?.user?.id) {
    redirect(getRedirectPathForSignedInUser(nextPath, session.user.role));
  }

  const roleAwareCopy = getRoleAwareCopy(nextPath, content);

  return (
    <AuthShell
      eyebrow={content.auth.secureAccess}
      title={roleAwareCopy.shellTitle}
      description={roleAwareCopy.shellDescription}
      benefits={[
        {
          title: content.auth.roleDashboards,
          text: content.auth.roleDashboardsText,
        },
        {
          title: content.auth.records,
          text: content.auth.recordsText,
        },
        {
          title: content.auth.nextSteps,
          text: content.auth.nextStepsText,
        },
      ]}
    >
      <span className={styles.eyebrow}>{roleAwareCopy.cardEyebrow}</span>
      <h2 className={styles.title}>{roleAwareCopy.cardTitle}</h2>
      <p className={styles.description}>{roleAwareCopy.cardDescription}</p>
      <LoginForm nextPath={nextPath} locale={locale} />
    </AuthShell>
  );
}
