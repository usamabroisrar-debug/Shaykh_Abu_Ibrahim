"use client";

import { useId, useState } from "react";
import styles from "./StructuredEditor.module.css";

type StructuredEditorProps = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
  required?: boolean;
};

const snippets = [
  { label: "Heading", value: "Heading\n" },
  { label: "Subheading", value: "Subheading\n" },
  { label: "Bullet", value: "- " },
  { label: "Quote", value: "Quote:\n" },
  { label: "Dua", value: "Dua / Reflection:\n" },
];

export function StructuredEditor({
  name,
  label,
  defaultValue = "",
  placeholder,
  hint,
  dir = "ltr",
  required = false,
}: StructuredEditorProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  function insertSnippet(snippet: string) {
    setValue((current) => `${current}${current ? "\n" : ""}${snippet}`);
  }

  return (
    <label className={styles.wrapper} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <div className={styles.toolbar}>
        {snippets.map((item) => (
          <button
            key={item.label}
            type="button"
            className={styles.tool}
            onClick={() => insertSnippet(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <textarea
        id={id}
        name={name}
        value={value}
        dir={dir}
        required={required}
        placeholder={placeholder}
        className={styles.textarea}
        onChange={(event) => setValue(event.target.value)}
      />
      {hint ? <small className={styles.hint}>{hint}</small> : null}
    </label>
  );
}
