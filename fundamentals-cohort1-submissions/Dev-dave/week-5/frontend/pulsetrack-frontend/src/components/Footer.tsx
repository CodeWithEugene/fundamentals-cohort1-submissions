export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-emerald-600 text-white text-center py-4 shadow-md z-50">
      <p>© {new Date().getFullYear()} PulseTrack | Your Health Companion 💚</p>
    </footer>
  );
}
