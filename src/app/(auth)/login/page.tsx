import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import styles from "@/components/auth/AuthForms.module.css";
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

  return (
    <AuthShell
      eyebrow="Secure access"
      title="Login to continue your Islamic learning journey"
      description="Students, parents, teachers, and administrators can now move into dedicated dashboards for admissions, enrollments, progress tracking, and academy operations."
      benefits={[
        {
          title: "Role-based dashboards",
          text: "Each account lands on the right space for study, teaching, or administration.",
        },
        {
          title: "Admissions and learning records",
          text: "Stay close to submissions, course movement, and ongoing progress in one place.",
        },
        {
          title: "Structured next steps",
          text: "From admission to enrollment to certificates, the experience now has a real system behind it.",
        },
      ]}
    >
      <span className={styles.eyebrow}>Login</span>
      <h2 className={styles.title}>Welcome back</h2>
      <p className={styles.description}>
        Use your academy credentials to continue with courses, admissions, and
        your private dashboard.
      </p>
      <LoginForm nextPath={params.next || "/student"} />
    </AuthShell>
  );
}
