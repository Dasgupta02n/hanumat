import Link from "next/link";

export default function ShivaRoot() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Georgia, serif",
      }}
    >
      <p>
        Opening Shivayatan… <Link href="/shiva/hi/">Continue</Link>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace("/shiva/hi/");`,
        }}
      />
    </div>
  );
}
