import { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/landing/Nav';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — Chocka',
  description:
    'Terms and conditions for using the Chocka Google Business Profile management service.',
};

export default function TermsPage() {
  return (
    <>
      <Nav />

      <main className="pt-28 pb-20">
        <div className="container-max px-6 md:px-12 lg:px-20">
          {/* Header */}
          <div className="max-w-3xl">
            <p className="font-mono text-orange text-sm uppercase tracking-wider mb-4">
              Legal
            </p>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl leading-[0.95] mb-6">
              TERMS OF SERVICE
            </h1>
            <p className="text-mid">
              Last updated: 15 April 2026
            </p>
          </div>

          {/* Content */}
          <article className="mt-16 max-w-3xl space-y-12 text-mid leading-relaxed">
            <Section title="1. Introduction">
              <p>
                These terms of service (&ldquo;Terms&rdquo;) govern your use of the Chocka platform
                and services (&ldquo;Service&rdquo;) operated by{' '}
                <strong className="text-black">Useful for Humans Ltd</strong> (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, &ldquo;our&rdquo;), a company registered in England and Wales
                with its registered address at Unit 82a James Carter Road, Bury St Edmunds, IP28
                7DE.
              </p>
              <p>
                By creating an account or using the Service you agree to be bound by these Terms. If
                you do not agree, do not use the Service.
              </p>
            </Section>

            <Section title="2. What the service does">
              <p>
                Chocka is a Google Business Profile management service designed for UK tradespeople.
                When you connect your Google Business Profile via OAuth, we:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Read your profile data, reviews, and performance insights.</li>
                <li>Publish posts to your Google Business Profile on your behalf.</li>
                <li>Draft and publish replies to your Google reviews.</li>
                <li>
                  Track performance metrics and generate a weekly Chocka Score ranking your profile
                  against others in your trade and area.
                </li>
                <li>Send you weekly summary emails and notifications about new reviews.</li>
              </ul>
            </Section>

            <Section title="3. What the service does not do">
              <p>Chocka does not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Guarantee any specific ranking on Google Search or Google Maps. Your Chocka Score
                  is an internal metric, not a Google ranking.
                </li>
                <li>
                  Generate fake reviews or engage in any activity that violates Google&apos;s
                  policies.
                </li>
                <li>Provide legal, financial, or professional advice of any kind.</li>
                <li>
                  Guarantee uptime or uninterrupted access. While we aim for high availability, the
                  Service depends on third-party APIs (including Google) that may experience
                  downtime.
                </li>
              </ul>
            </Section>

            <Section title="4. Eligibility">
              <p>
                You must be at least 18 years old and operating a legitimate trade business in the
                United Kingdom to use the Service. By subscribing, you confirm that you are
                authorised to manage the Google Business Profile you connect to Chocka.
              </p>
            </Section>

            <Section title="5. Account and security">
              <p>
                You are responsible for maintaining the security of your account credentials and for
                all activity that occurs under your account. Notify us immediately at{' '}
                <a href="mailto:hello@chocka.co.uk" className="text-orange hover:underline">
                  hello@chocka.co.uk
                </a>{' '}
                if you suspect unauthorised access.
              </p>
            </Section>

            <Section title="6. Subscription and payment">
              <p>
                The Service is available on a monthly subscription at{' '}
                <strong className="text-black">&pound;29 per month</strong> (inclusive of VAT where
                applicable). Payment is processed by Stripe and is charged monthly in advance.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Your subscription renews automatically each month until you cancel.
                </li>
                <li>
                  We reserve the right to change our pricing with at least 30 days&apos; written
                  notice. Price changes will take effect from your next billing cycle after the
                  notice period.
                </li>
                <li>
                  Payments are non-refundable except where required by law or at our sole
                  discretion.
                </li>
              </ul>
            </Section>

            <Section title="7. Cancellation">
              <p>
                You may cancel your subscription at any time through your account dashboard or by
                emailing{' '}
                <a href="mailto:hello@chocka.co.uk" className="text-orange hover:underline">
                  hello@chocka.co.uk
                </a>.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Cancellation takes effect at the end of your current billing period. You will
                  retain access until then.
                </li>
                <li>
                  Upon cancellation, we will revoke access to your Google Business Profile and delete
                  your personal data within 30 days, in line with our{' '}
                  <Link href="/privacy" className="text-orange hover:underline">
                    Privacy Policy
                  </Link>.
                </li>
                <li>
                  We may suspend or terminate your account immediately if you breach these Terms or
                  use the Service in a way that could harm us or other users.
                </li>
              </ul>
            </Section>

            <Section title="8. Your responsibilities">
              <p>By using the Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide accurate information and keep your account details up to date.
                </li>
                <li>
                  Only connect Google Business Profiles that you own or are authorised to manage.
                </li>
                <li>
                  Comply with Google&apos;s Terms of Service and Business Profile policies.
                </li>
                <li>
                  Not use the Service for any unlawful purpose, to distribute spam, or to post
                  misleading content.
                </li>
                <li>
                  Not attempt to reverse-engineer, copy, or resell any part of the Service.
                </li>
              </ul>
            </Section>

            <Section title="9. Intellectual property">
              <p>
                All content, software, and branding associated with Chocka (including the Chocka
                Score algorithm) remain the intellectual property of Useful for Humans Ltd. Your
                subscription grants you a limited, non-exclusive, non-transferable licence to use the
                Service for its intended purpose.
              </p>
              <p>
                You retain ownership of your business data. By using the Service you grant us a
                licence to access, process, and display your Google Business Profile data solely for
                the purpose of providing the Service to you.
              </p>
            </Section>

            <Section title="10. Limitation of liability">
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                  without warranties of any kind, whether express or implied.
                </li>
                <li>
                  We are not liable for any indirect, incidental, special, consequential, or
                  punitive damages, including loss of profits, data, or business opportunity.
                </li>
                <li>
                  Our total liability for any claim arising from or related to the Service is
                  limited to the amount you paid us in the 12 months preceding the claim.
                </li>
                <li>
                  We are not liable for any actions taken by Google in relation to your Business
                  Profile, including suspension, removal, or changes to their API.
                </li>
              </ul>
              <p>
                Nothing in these Terms excludes or limits our liability for death or personal injury
                caused by our negligence, fraud or fraudulent misrepresentation, or any other
                liability that cannot be excluded or limited under English law.
              </p>
            </Section>

            <Section title="11. Indemnification">
              <p>
                You agree to indemnify and hold us harmless from any claims, damages, or expenses
                (including reasonable legal fees) arising from your breach of these Terms or your
                misuse of the Service.
              </p>
            </Section>

            <Section title="12. Changes to these terms">
              <p>
                We may update these Terms from time to time. If we make material changes we will
                notify you by email at least 30 days before they take effect. Continued use of the
                Service after changes take effect constitutes acceptance of the updated Terms.
              </p>
            </Section>

            <Section title="13. Governing law and disputes">
              <p>
                These Terms are governed by and construed in accordance with the laws of{' '}
                <strong className="text-black">England and Wales</strong>. Any disputes arising from
                or in connection with these Terms or the Service shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </Section>

            <Section title="14. Contact">
              <p>
                If you have any questions about these Terms, contact us at:
              </p>
              <div className="bg-cream rounded-2xl p-6 mt-4">
                <p className="text-black font-medium">Useful for Humans Ltd</p>
                <p>Unit 82a James Carter Road</p>
                <p>Bury St Edmunds, IP28 7DE</p>
                <p className="mt-2">
                  <a href="mailto:hello@chocka.co.uk" className="text-orange hover:underline">
                    hello@chocka.co.uk
                  </a>
                </p>
              </div>
            </Section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading font-bold text-xl text-black">{title}</h2>
      {children}
    </section>
  );
}
