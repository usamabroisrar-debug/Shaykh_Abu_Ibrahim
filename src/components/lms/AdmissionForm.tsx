"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import { courses } from "@/data/courses";
import styles from "./LmsExperience.module.css";

export function AdmissionForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    timezone: "Asia/Karachi",
    ageGroup: "Children",
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
        setError(data.message || "Admission request submit nahi ho saki.");
        return;
      }

      setMessage("Admission request submit ho gayi hai. Team aap se jaldi rabta karegi.");
      setForm({
        name: "",
        email: "",
        phone: "",
        guardianName: "",
        guardianPhone: "",
        timezone: "Asia/Karachi",
        ageGroup: "Children",
        course: courses[0]?.title ?? "",
        message: "",
      });
    } catch {
      setError("Network issue ki wajah se admission request submit nahi ho saki.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="admission-name">Student name</label>
          <input
            id="admission-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Muhammad Ahmed"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-email">Email</label>
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
          <label htmlFor="admission-phone">Phone / WhatsApp</label>
          <input
            id="admission-phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+92..."
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-timezone">Timezone</label>
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
          <label htmlFor="admission-guardian">Guardian name</label>
          <input
            id="admission-guardian"
            value={form.guardianName}
            onChange={(event) => updateField("guardianName", event.target.value)}
            placeholder="Parent / guardian"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-guardian-phone">Guardian phone</label>
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
          <label htmlFor="admission-age-group">Age group</label>
          <select
            id="admission-age-group"
            value={form.ageGroup}
            onChange={(event) => updateField("ageGroup", event.target.value)}
          >
            <option>Children</option>
            <option>Teen</option>
            <option>Adult</option>
            <option>Family</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="admission-course">Preferred course</label>
          <select
            id="admission-course"
            value={form.course}
            onChange={(event) => updateField("course", event.target.value)}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="admission-message">Goals or notes</label>
        <textarea
          id="admission-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us about current level, schedule, or goals."
        />
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Admission Request"}
      </Button>
    </form>
  );
}
