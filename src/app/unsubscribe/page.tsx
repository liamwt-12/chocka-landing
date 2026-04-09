'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="font-heading font-extrabold text-2xl text-orange tracking-tight">
          Chocka
        </Link>

        {status === 'success' && (
          <div className="mt-8">
            <div className="text-4xl mb-4">&#10003;</div>
            <h1 className="font-heading font-bold text-2xl text-black mb-3">
              You&apos;ve been unsubscribed
            </h1>
            <p className="text-mid text-base leading-relaxed">
              You won&apos;t receive any more emails from us. If this was a mistake, just reply to any previous email and we&apos;ll add you back.
            </p>
          </div>
        )}

        {status === 'invalid' && (
          <div className="mt-8">
            <h1 className="font-heading font-bold text-2xl text-black mb-3">
              Invalid request
            </h1>
            <p className="text-mid text-base leading-relaxed">
              We couldn&apos;t process that unsubscribe link. Please try clicking the link in your email again.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8">
            <h1 className="font-heading font-bold text-2xl text-black mb-3">
              Something went wrong
            </h1>
            <p className="text-mid text-base leading-relaxed">
              Please try again, or reply to any email from us with &quot;unsubscribe&quot; and we&apos;ll remove you manually.
            </p>
          </div>
        )}

        {!status && (
          <div className="mt-8">
            <h1 className="font-heading font-bold text-2xl text-black mb-3">
              Unsubscribe
            </h1>
            <p className="text-mid text-base leading-relaxed">
              Use the link in your email to unsubscribe from future messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <p className="text-mid">Loading...</p>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
