import { cookies } from "next/headers";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import styles from "@/components/auth/AuthForms.module.css";
import { getLocaleContent, getLocaleFromCookies } from "@/lib/locale";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Student Login",
  description:
    "Login to access your Islamic learning dashboard, courses, admissions, certificates, and student progress tools.",
  path: "/login",
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromCookies(await cookies());
  const content = getLocaleContent(locale);

  return (
    <AuthShell
      eyebrow={content.auth.secureAccess}
      title={content.auth.loginJourney}
      description={content.auth.loginDescription}
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
      <span className={styles.eyebrow}>{content.auth.login}</span>
      <h2 className={styles.title}>{content.auth.welcomeBack}</h2>
      <p className={styles.description}>{content.auth.useCredentials}</p>
      <LoginForm nextPath={params.next || "/student"} locale={locale} />
    </AuthShell>
  );
}
