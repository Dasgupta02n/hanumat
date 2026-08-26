import Link from "next/link";

export default function KaliRoot() {
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
        Opening Kalika Dham… <Link href="/kali/hi/">Continue</Link>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace("/kali/hi/");`,
        }}
      />
    </div>
  );
}
