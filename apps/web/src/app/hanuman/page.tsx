import Link from "next/link";

export default function HanumanRoot() {
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
        Opening Hanumat… <Link href="/hi/">Continue</Link>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace("/hi/");`,
        }}
      />
    </div>
  );
}
