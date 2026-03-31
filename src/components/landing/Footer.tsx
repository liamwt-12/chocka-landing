import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container-max px-6 md:px-12 lg:px-20">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Left: Wordmark */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-orange">
                CHOCKA
              </span>
              <span className="text-soft text-xs font-mono uppercase tracking-wider">
                INDEX
              </span>
            </Link>
          </div>

          {/* Centre: Stats */}
          <div className="text-soft text-sm leading-relaxed text-center">
            Updated weekly · Based on public Google data · 7,101 businesses
            ranked
          </div>

          {/* Right: Tradespeople link */}
          <div className="md:text-right">
            <Link
              href="/for-tradespeople"
              className="text-orange font-heading font-bold hover:underline"
            >
              Are you a tradesperson? →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-soft text-sm">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a
              href="mailto:hello@chocka.co.uk"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          <div>
            A{' '}
            <a
              href="https://usefulforhumans.com"
              className="text-orange hover:underline"
            >
              Useful for Humans
            </a>{' '}
            product
          </div>
        </div>
      </div>
    </footer>
  );
}
