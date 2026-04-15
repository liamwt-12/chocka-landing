import { Metadata } from 'next';
import Nav from '@/components/landing/Nav';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Chocka',
  description:
    'How Chocka collects, uses, and protects your data under UK GDPR.',
};

export default function PrivacyPage() {
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
              PRIVACY POLICY
            </h1>
            <p className="text-mid">
              Last updated: 15 April 2026
            </p>
          </div>

          {/* Content */}
          <article className="mt-16 max-w-3xl space-y-12 text-mid leading-relaxed">
            <Section title="1. Who we are">
              <p>
                Chocka is operated by <strong className="text-black">Useful for Humans Ltd</strong>,
                registered in England and Wales. Our registered address is Unit 82a James Carter Road,
                Bury St Edmunds, IP28 7DE.
              </p>
              <p>
                For data-protection purposes we are the controller. You can reach us at{' '}
                <a href="mailto:hello@chocka.co.uk" className="text-orange hover:underline">
                  hello@chocka.co.uk
                </a>.
              </p>
            </Section>

            <Section title="2. What data we collect">
              <p>When you sign up or use Chocka we may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-black">Account information</strong> — your name and email
                  address, collected when you create an account.
                </li>
                <li>
                  <strong className="text-black">Google Business Profile data</strong> — business
                  name, address, categories, opening hours, photos, reviews, review replies, Google
                  Business Profile Insights (views, searches, calls, direction requests), and posts.
                  This data is accessed via the Google Business Profile API using OAuth 2.0 with your
                  explicit consent.
                </li>
                <li>
                  <strong className="text-black">Payment information</strong> — processed by Stripe.
                  We do not store card numbers; Stripe handles this as a PCI-DSS-compliant processor.
                </li>
                <li>
                  <strong className="text-black">Communication data</strong> — emails sent via
                  Resend and SMS sent via Twilio, including delivery status and timestamps.
                </li>
                <li>
                  <strong className="text-black">Usage data</strong> — pages visited, features used,
                  and performance metrics to help us improve the service.
                </li>
              </ul>
            </Section>

            <Section title="3. How we use your data">
              <p>We process your data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-black">Managing your Google Business Profile</strong> —
                  publishing posts, replying to reviews, and updating profile information on your
                  behalf.
                </li>
                <li>
                  <strong className="text-black">Weekly management and automation</strong> — reading
                  your profile data to generate performance scores, rankings, and weekly summary
                  reports.
                </li>
                <li>
                  <strong className="text-black">Sending notifications</strong> — email and SMS
                  alerts about new reviews, performance changes, and account updates.
                </li>
                <li>
                  <strong className="text-black">Processing payments</strong> — managing your
                  subscription and billing.
                </li>
                <li>
                  <strong className="text-black">Improving the service</strong> — analysing
                  aggregate usage patterns to develop new features and fix issues.
                </li>
              </ul>
            </Section>

            <Section title="4. Lawful basis for processing">
              <p>Under UK GDPR we rely on the following lawful bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-black">Contract</strong> — processing necessary to deliver
                  the Chocka service you have subscribed to (Art. 6(1)(b)).
                </li>
                <li>
                  <strong className="text-black">Consent</strong> — accessing your Google Business
                  Profile data via OAuth, and sending marketing communications (Art. 6(1)(a)). You
                  can withdraw consent at any time.
                </li>
                <li>
                  <strong className="text-black">Legitimate interests</strong> — improving our
                  service, preventing fraud, and ensuring security (Art. 6(1)(f)).
                </li>
              </ul>
            </Section>

            <Section title="5. Third parties we share data with">
              <p>
                We share data only where necessary to operate the service. We do not sell your data.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-black">Google</strong> — to read and write your Business
                  Profile data via their API.
                </li>
                <li>
                  <strong className="text-black">Stripe</strong> — to process subscription payments
                  securely.
                </li>
                <li>
                  <strong className="text-black">Resend</strong> — to deliver transactional and
                  notification emails.
                </li>
                <li>
                  <strong className="text-black">Twilio</strong> — to send SMS notifications.
                </li>
              </ul>
              <p>
                Each third party processes data under their own privacy policy and in compliance with
                applicable data-protection law. Where data is transferred outside the UK, appropriate
                safeguards are in place (such as Standard Contractual Clauses).
              </p>
            </Section>

            <Section title="6. Data retention">
              <p>
                We retain your account data for as long as your subscription is active. If you cancel
                your account we will delete your personal data within 30 days, unless we are required
                by law to retain it for longer (for example, financial records kept for HMRC
                purposes).
              </p>
              <p>
                Google Business Profile data fetched during your subscription is removed from our
                systems within 30 days of cancellation. Aggregated, anonymised data used for
                rankings may be retained indefinitely as it cannot identify you.
              </p>
            </Section>

            <Section title="7. Your rights under UK GDPR">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-black">Access</strong> — request a copy of the personal
                  data we hold about you.
                </li>
                <li>
                  <strong className="text-black">Rectification</strong> — ask us to correct
                  inaccurate data.
                </li>
                <li>
                  <strong className="text-black">Erasure</strong> — ask us to delete your data
                  (&ldquo;right to be forgotten&rdquo;).
                </li>
                <li>
                  <strong className="text-black">Restriction</strong> — ask us to limit how we
                  process your data.
                </li>
                <li>
                  <strong className="text-black">Portability</strong> — receive your data in a
                  structured, machine-readable format.
                </li>
                <li>
                  <strong className="text-black">Object</strong> — object to processing based on
                  legitimate interests.
                </li>
                <li>
                  <strong className="text-black">Withdraw consent</strong> — where processing is
                  based on consent, withdraw it at any time without affecting the lawfulness of
                  earlier processing.
                </li>
              </ul>
              <p>
                To exercise any of these rights, email{' '}
                <a href="mailto:hello@chocka.co.uk" className="text-orange hover:underline">
                  hello@chocka.co.uk
                </a>. We will respond within one month.
              </p>
              <p>
                If you are not satisfied with our response you have the right to complain to the
                Information Commissioner&apos;s Office (ICO) at{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  ico.org.uk
                </a>.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                Chocka uses essential cookies required for the service to function (for example,
                session authentication). We do not use advertising or tracking cookies. Third-party
                services embedded in the site may set their own cookies — refer to their respective
                privacy policies for details.
              </p>
            </Section>

            <Section title="9. Security">
              <p>
                We take appropriate technical and organisational measures to protect your data,
                including encryption in transit (TLS) and at rest, access controls, and regular
                security reviews. No system is 100% secure, but we work to protect your information
                and will notify you and the ICO of any significant breach as required by law.
              </p>
            </Section>

            <Section title="10. Changes to this policy">
              <p>
                We may update this policy from time to time. If we make significant changes we will
                notify you by email. The &ldquo;last updated&rdquo; date at the top of this page
                indicates when the policy was last revised.
              </p>
            </Section>

            <Section title="11. Contact">
              <p>
                If you have any questions about this privacy policy or how we handle your data,
                contact us at:
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
