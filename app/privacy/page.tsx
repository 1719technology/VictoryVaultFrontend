import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, Lock, FileText } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="bg-gray-100 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>Last Updated: June 1, 2024</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm text-gray-600">Secure & Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="mb-6">
            WinRed ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website or make a contribution
            through our platform. Please read this privacy policy carefully. If you do not agree with the terms of this
            privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information that you voluntarily provide to us when you register on the website, express an
            interest in obtaining information about us or our products and services, participate in activities on the
            website, or otherwise contact us.
          </p>
          <p className="mb-6">
            The personal information that we collect depends on the context of your interactions with us and the
            website, the choices you make, and the products and features you use. The personal information we collect
            may include the following:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>
              Name and Contact Data. We collect your first and last name, email address, postal address, phone number,
              and other similar contact data.
            </li>
            <li>
              Credentials. We collect passwords, password hints, and similar security information used for
              authentication and account access.
            </li>
            <li>
              Payment Data. We collect data necessary to process your payment if you make purchases, such as your
              payment instrument number (such as a credit card number), and the security code associated with your
              payment instrument.
            </li>
            <li>Employment Information. We may collect your employment information if you choose to provide it.</li>
            <li>
              Political Affiliation. As a platform for political contributions, we may collect information about your
              political affiliation and preferences.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use personal information collected via our website for a variety of business purposes described below. We
            process your personal information for these purposes in reliance on our legitimate business interests, in
            order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal
            obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
          </p>
          <p className="mb-6">We use the information we collect or receive:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>To facilitate account creation and logon process.</li>
            <li>To send administrative information to you.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To respond to your inquiries and offer support.</li>
            <li>To request feedback and to contact you about your use of our website.</li>
            <li>To enforce our terms, conditions, and policies.</li>
            <li>To comply with legal and regulatory requirements related to campaign finance.</li>
            <li>To process your financial contributions to candidates and committees.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclosure of Your Information</h2>
          <p className="mb-4">
            We may share information we have collected about you in certain situations. Your information may be
            disclosed as follows:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>
              <strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to
              do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order,
              or legal process, such as in response to a court order or a subpoena (including in response to public
              authorities to meet national security or law enforcement requirements).
            </li>
            <li>
              <strong>Campaign Finance Reporting:</strong> Contributions made through our platform are subject to
              Federal Election Commission (FEC) reporting requirements. Information about your contribution, including
              your name, address, occupation, and employer may be reported to the FEC and made available for public
              inspection.
            </li>
            <li>
              <strong>Candidates and Committees:</strong> When you make a contribution to a candidate or committee
              through our platform, we share your information with that candidate or committee to process your
              contribution and for their own compliance purposes.
            </li>
            <li>
              <strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is
              necessary to investigate, prevent, or take action regarding potential violations of our policies,
              suspected fraud, situations involving potential threats to the safety of any person and illegal
              activities, or as evidence in litigation in which we are involved.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or
              during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion
              of our business to another company.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with
              your consent.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Security of Your Information</h2>
          <p className="mb-6">
            We use administrative, technical, and physical security measures to help protect your personal information.
            While we have taken reasonable steps to secure the personal information you provide to us, please be aware
            that despite our efforts, no security measures are perfect or impenetrable, and no method of data
            transmission can be guaranteed against any interception or other type of misuse. Any information disclosed
            online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee
            complete security if you provide personal information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy for Children</h2>
          <p className="mb-6">
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware
            of any data we have collected from children under age 13, please contact us using the contact information
            provided below.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Controls for Do-Not-Track Features</h2>
          <p className="mb-6">
            Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you
            can activate to signal your privacy preference not to have data about your online browsing activities
            monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has
            been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that
            automatically communicates your choice not to be tracked online.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Options Regarding Your Information</h2>
          <p className="mb-4">
            You may at any time review or change the information in your account or terminate your account by:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Logging into your account settings and updating your account</li>
            <li>Contacting us using the contact information provided below</li>
          </ul>
          <p className="mb-6">
            Upon your request to terminate your account, we will deactivate or delete your account and information from
            our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot
            problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Web Beacons</h2>
          <p className="mb-6">
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help
            customize the website and improve your experience. For more information on how we use cookies, please refer
            to our Cookie Policy posted on the website, which is incorporated into this Privacy Policy. By using the
            website, you agree to be bound by our Cookie Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-6">
            We may update this privacy policy from time to time in order to reflect, for instance, changes to our
            practices or for other operational, legal or regulatory reasons. The updated version will be indicated by an
            updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make
            material changes to this privacy policy, we may notify you either by prominently posting a notice of such
            changes or by directly sending you a notification. We encourage you to review this privacy policy frequently
            to be informed of how we are protecting your information.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have questions or comments about this policy, you may email us at privacy@winred.com or by mail to:
          </p>
          <address className="not-italic mb-6">
            WinRed
            <br />
            123 Constitution Ave
            <br />
            Washington, DC 20001
            <br />
            United States
          </address>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Have questions about our privacy practices?</h3>
              <p className="text-gray-600">Our team is here to help you understand how we protect your information.</p>
            </div>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
