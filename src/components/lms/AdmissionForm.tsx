"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import { courses } from "@/data/courses";
import { resolveLocalizedInlineText } from "@/lib/content-localization";
import type { SiteLocale } from "@/lib/locale";
import styles from "./LmsExperience.module.css";

type AdmissionFormProps = {
  locale: SiteLocale;
};

export function AdmissionForm({ locale }: AdmissionFormProps) {
  const copy = {
    en: {
      studentName: "Student name",
      email: "Email",
      phone: "Phone / WhatsApp",
      timezone: "Timezone",
      guardianName: "Guardian name",
      guardianPhone: "Guardian phone",
      ageGroup: "Age group",
      preferredCourse: "Preferred course",
      goals: "Goals or notes",
      goalsPlaceholder: "Tell us about current level, schedule, or goals.",
      submitSuccess: "Admission request submitted. Our team will contact you soon.",
      submitError: "Admission request could not be submitted.",
      networkError: "The admission request could not be submitted due to a network issue.",
      submitting: "Submitting...",
      submit: "Submit Admission Request",
      ageChildren: "Children",
      ageTeen: "Teen",
      ageAdult: "Adult",
      ageFamily: "Family",
    },
    ur: {
      studentName: "طالب علم کا نام",
      email: "ای میل",
      phone: "فون / واٹس ایپ",
      timezone: "ٹائم زون",
      guardianName: "سرپرست کا نام",
      guardianPhone: "سرپرست کا فون",
      ageGroup: "عمر کا گروپ",
      preferredCourse: "پسندیدہ کورس",
      goals: "اہداف یا نوٹس",
      goalsPlaceholder: "اپنی موجودہ سطح، شیڈول، یا اہداف کے بارے میں بتائیں۔",
      submitSuccess: "داخلہ درخواست جمع ہو گئی ہے۔ ہماری ٹیم جلد آپ سے رابطہ کرے گی۔",
      submitError: "داخلہ درخواست جمع نہیں ہو سکی۔",
      networkError: "نیٹ ورک مسئلے کی وجہ سے داخلہ درخواست جمع نہیں ہو سکی۔",
      submitting: "جمع کیا جا رہا ہے...",
      submit: "داخلہ درخواست جمع کریں",
      ageChildren: "بچے",
      ageTeen: "ٹین",
      ageAdult: "بالغ",
      ageFamily: "خاندان",
    },
    ar: {
      studentName: "اسم الطالب",
      email: "البريد الإلكتروني",
      phone: "الهاتف / واتساب",
      timezone: "المنطقة الزمنية",
      guardianName: "اسم ولي الأمر",
      guardianPhone: "هاتف ولي الأمر",
      ageGroup: "الفئة العمرية",
      preferredCourse: "الدورة المفضلة",
      goals: "الأهداف أو الملاحظات",
      goalsPlaceholder: "أخبرنا عن المستوى الحالي أو الجدول أو الأهداف.",
      submitSuccess: "تم إرسال طلب القبول. سيتواصل معك فريقنا قريبًا.",
      submitError: "تعذر إرسال طلب القبول.",
      networkError: "تعذر إرسال طلب القبول بسبب مشكلة في الشبكة.",
      submitting: "جارٍ الإرسال...",
      submit: "إرسال طلب القبول",
      ageChildren: "الأطفال",
      ageTeen: "المراهقون",
      ageAdult: "البالغون",
      ageFamily: "العائلة",
    },
  }[locale];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    timezone: "Asia/Karachi",
    ageGroup: copy.ageChildren,
    course: courses[0]?.title ?? "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || copy.submitError);
        return;
      }

      setMessage(copy.submitSuccess);
      setForm({
        name: "",
        email: "",
        phone: "",
        guardianName: "",
        guardianPhone: "",
        timezone: "Asia/Karachi",
        ageGroup: copy.ageChildren,
        course: courses[0]?.title ?? "",
        message: "",
      });
    } catch {
      setError(copy.networkError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="admission-name">{copy.studentName}</label>
          <input
            id="admission-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Muhammad Ahmed"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-email">{copy.email}</label>
          <input
            id="admission-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="family@example.com"
            required
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="admission-phone">{copy.phone}</label>
          <input
            id="admission-phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+92..."
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-timezone">{copy.timezone}</label>
          <input
            id="admission-timezone"
            value={form.timezone}
            onChange={(event) => updateField("timezone", event.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="admission-guardian">{copy.guardianName}</label>
          <input
            id="admission-guardian"
            value={form.guardianName}
            onChange={(event) => updateField("guardianName", event.target.value)}
            placeholder="Parent / guardian"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-guardian-phone">{copy.guardianPhone}</label>
          <input
            id="admission-guardian-phone"
            value={form.guardianPhone}
            onChange={(event) => updateField("guardianPhone", event.target.value)}
            placeholder="+92..."
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="admission-age-group">{copy.ageGroup}</label>
          <select
            id="admission-age-group"
            value={form.ageGroup}
            onChange={(event) => updateField("ageGroup", event.target.value)}
          >
            <option>{copy.ageChildren}</option>
            <option>{copy.ageTeen}</option>
            <option>{copy.ageAdult}</option>
            <option>{copy.ageFamily}</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-course">{copy.preferredCourse}</label>
          <select
            id="admission-course"
            value={form.course}
            onChange={(event) => updateField("course", event.target.value)}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.title}>
                {resolveLocalizedInlineText(course.title, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="admission-message">{copy.goals}</label>
        <textarea
          id="admission-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder={copy.goalsPlaceholder}
        />
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
