"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/shared";
import styles from "./LmsExperience.module.css";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Message send nahi ho saka.");
        return;
      }

      setMessage("Message save ho gaya hai. Team aap se jaldi contact karegi.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setError("Network issue ki wajah se message send nahi ho saka.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            value={form.subject}
            onChange={(event) => updateField("subject", event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <Button type="submit" className={styles.submit} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
