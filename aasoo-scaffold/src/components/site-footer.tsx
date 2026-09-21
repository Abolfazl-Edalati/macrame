import Link from "next/link";
import { INSTAGRAM_URL, TELEGRAM_URL } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-between text-sm text-neutral-500 border-t border-neutral-200 mt-10">
      <span>© آسو مکرومه</span>
      <div className="flex gap-6">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          اینستاگرام
        </a>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
          تلگرام
        </a>
      </div>
    </footer>
  );
}
