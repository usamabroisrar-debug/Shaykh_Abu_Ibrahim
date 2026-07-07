import type { ReactNode } from "react";

type SocialIconName =
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok";

type SocialIconProps = {
  name: SocialIconName;
  size?: number;
  className?: string;
};

const iconPaths: Record<SocialIconName, ReactNode> = {
  whatsapp: (
    <>
      <path d="M12 2.2a9.8 9.8 0 0 0-8.35 14.93L2.1 21.9l4.92-1.5A9.8 9.8 0 1 0 12 2.2Z" />
      <path
        d="M8.48 7.78c-.2-.45-.4-.46-.58-.47h-.5c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.97 2.62 1.1 2.8c.14.18 1.9 3.04 4.7 4.14 2.33.91 2.8.73 3.31.68.52-.05 1.67-.68 1.9-1.34.23-.66.23-1.23.16-1.34-.07-.11-.25-.18-.52-.32-.27-.14-1.6-.8-1.85-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.41.12-.55.13-.13.27-.34.41-.5.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.63-1.57-.9-2.15Z"
        fill="currentColor"
      />
    </>
  ),
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <circle cx="17.25" cy="6.8" r="1.2" fill="currentColor" />
    </>
  ),
  facebook: (
    <>
      <path d="M13.4 21v-7.44h2.5l.37-2.9H13.4V8.8c0-.84.23-1.41 1.43-1.41h1.53V4.8c-.26-.04-1.17-.11-2.23-.11-2.2 0-3.71 1.34-3.71 3.8v2.17H8v2.9h2.42V21h2.98Z" />
    </>
  ),
  youtube: (
    <>
      <path d="M20.4 7.5a2.7 2.7 0 0 0-1.89-1.9C16.86 5.15 12 5.15 12 5.15s-4.86 0-6.51.45A2.7 2.7 0 0 0 3.6 7.5c-.45 1.65-.45 4.5-.45 4.5s0 2.85.45 4.5a2.7 2.7 0 0 0 1.89 1.9c1.65.45 6.51.45 6.51.45s4.86 0 6.51-.45a2.7 2.7 0 0 0 1.89-1.9c.45-1.65.45-4.5.45-4.5s0-2.85-.45-4.5Z" />
      <path d="m10.2 15.44 4.85-3.44-4.85-3.44v6.88Z" fill="currentColor" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14.88 3.5c.48 1.35 1.4 2.42 2.73 3.13.82.44 1.68.67 2.59.71v2.79a7.9 7.9 0 0 1-2.86-.57v5.05a5.62 5.62 0 1 1-5.08-5.6v2.9a2.75 2.75 0 1 0 2.2 2.7V3.5h.42Z" />
    </>
  ),
};

export function SocialIcon({
  name,
  size = 20,
  className = "",
}: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}
