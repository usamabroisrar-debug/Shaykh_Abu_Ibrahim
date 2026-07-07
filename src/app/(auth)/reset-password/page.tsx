import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import styles from "@/components/auth/AuthForms.module.css";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Reset Password",
  description:
    "Set a new password for your academy account and return to your protected dashboard and course experience.",
  path: "/reset-password",
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Set new password"
      title="Choose a fresh password and return to your dashboard"
      description="Use the reset token created for your account and update your password securely."
      benefits={[
        {
          title: "Token-based recovery",
          text: "Each reset request creates a dedicated token with an expiry window.",
        },
        {
          title: "Account continuity",
          text: "Your enrollments, admissions, and notifications stay connected to the same account.",
        },
        {
          title: "Protected dashboard access",
          text: "Once complete, you can log back into the correct role-specific experience.",
        },
      ]}
    >
      <span className={styles.eyebrow}>Reset</span>
      <h2 className={styles.title}>Update your password</h2>
      <p className={styles.description}>
        Paste or open your reset token link, then choose a new password for
        your account.
      </p>
      <ResetPasswordForm token={params.token || ""} />
    </AuthShell>
  );
}
