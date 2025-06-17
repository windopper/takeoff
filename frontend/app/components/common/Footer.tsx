import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200/20 dark:border-zinc-800/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-3">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Takeoff.
          </p>
          <FooterLink href="/about" content="About" />
          <FooterLink href="https://github.com/windopper/takeoff" content="Github" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, content }: { href: string; content: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      {content}
    </Link>
  );
}