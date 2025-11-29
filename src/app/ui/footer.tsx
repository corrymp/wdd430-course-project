import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} | Handcrafted Haven</p>
    </footer>
  );
}
