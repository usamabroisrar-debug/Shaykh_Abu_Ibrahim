import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import styles from "@/components/auth/AuthForms.module.css";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Create Account",
  description:
    "Create a student, parent, or teacher account for admissions, course enrollment, dashboard access, and private academy resources.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="New account"
      title="Create an academy account built for structured Islamic study"
      description="Start with the role that matches your journey so we can connect admissions, enrollments, support, and future learning progress correctly."
      benefits={[
        {
          title: "Student and parent ready",
          text: "Capture guardian details early so admissions and support stay family-friendly.",
        },
        {
          title: "Teacher onboarding path",
          text: "Faculty accounts can now move into role-specific tools and operational workflows.",
        },
        {
          title: "Prepared for LMS growth",
          text: "Profiles are shaped to support dashboards, certificates, quizzes, and future integrations.",
        },
      ]}
    >
      <span className={styles.eyebrow}>Register</span>
      <h2 className={styles.title}>Create your account</h2>
      <p className={styles.description}>
        Register once, then use the same account for admission tracking,
        enrollment, course activity, and direct academy communication.
      </p>
      <RegisterForm />
    </AuthShell>
  );
}
