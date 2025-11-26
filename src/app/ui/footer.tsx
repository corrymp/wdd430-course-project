// TODO: replace with actual footer
export default function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().toLocaleDateString(undefined, {year: 'numeric'})} | Handcrafted Haven</p>
    </footer>
  );
}
