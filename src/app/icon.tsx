import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #022c22 0%, #065f46 55%, #d4af37 100%)",
          borderRadius: 18,
          color: "white",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        SAI
      </div>
    ),
    size,
  );
}
