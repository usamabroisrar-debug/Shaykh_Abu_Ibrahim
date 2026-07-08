import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import styles from "@/components/auth/AuthForms.module.css";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description:
    "Request a password reset for your student, parent, teacher, or admin account and restore secure dashboard access.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password reset"
      title="Recover access without losing your progress"
      description="If your login is blocked, generate a reset link and move back into admissions, courses, and your academy dashboard."
      benefits={[
        {
          title: "Quick recovery flow",
          text: "Generate a reset link immediately from the email attached to your account.",
        },
        {
          title: "Safe role continuity",
          text: "Once reset is complete, you return to the same student, teacher, or admin flow.",
        },
        {
          title: "Instant recovery link",
          text: "A reset link is generated immediately so you can continue the recovery flow without waiting.",
        },
      ]}
    >
      <span className={styles.eyebrow}>Recover access</span>
      <h2 className={styles.title}>Forgot your password?</h2>
      <p className={styles.description}>
        Enter your email and we will prepare a password reset link for this
        account.
      </p>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
