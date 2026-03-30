import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container-max px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <Link href="/" className="font-mono text-2xl font-bold text-orange tracking-tight">
              CHOCKA
            </Link>
            <p className="text-soft text-sm mt-2">
              Get more jobs from Google. Automatically.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm">
            <Link href="/privacy" className="text-soft hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-soft hover:text-white transition-colors">
              Terms
            </Link>
            <a href="mailto:hello@chocka.co.uk" className="text-soft hover:text-white transition-colors">
              Contact
            </a>
            <Link href="/index" className="text-soft hover:text-white transition-colors">
              Chocka Index
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-soft text-sm text-center">
          A{' '}
          <a href="https://usefulforhumans.com" className="text-orange hover:underline">
            Useful for Humans
          </a>{' '}
          product. © {new Date().getFullYear()} Chocka. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
