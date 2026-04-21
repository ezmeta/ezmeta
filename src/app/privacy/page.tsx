export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg mb-6">
          Last Updated: April 20, 2026
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to EZ Meta ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">We collect several types of information from and about users of our platform, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Personal Information:</strong> Name, email address, and billing information when you register for an account.
            </li>
            <li className="mb-2">
              <strong>Meta Ad Account Data:</strong> When you connect your Meta Ad accounts, we access performance data through the Meta Graph API.
            </li>
            <li className="mb-2">
              <strong>Usage Data:</strong> Information about how you use our platform, including AI content generations, feature usage, and interaction patterns.
            </li>
            <li className="mb-2">
              <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Provide, maintain, and improve our services</li>
            <li className="mb-2">Process your transactions and manage your account</li>
            <li className="mb-2">Connect to Meta's API on your behalf to retrieve and analyze ad performance</li>
            <li className="mb-2">Generate AI-powered content based on your inputs and preferences</li>
            <li className="mb-2">Send you technical notices, updates, security alerts, and support messages</li>
            <li className="mb-2">Respond to your comments, questions, and customer service requests</li>
            <li className="mb-2">Monitor and analyze trends, usage, and activities in connection with our service</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Service Providers:</strong> Companies that perform services on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.
            </li>
            <li className="mb-2">
              <strong>Meta:</strong> When you connect your Meta Ad accounts, we exchange data with Meta through their API.
            </li>
            <li className="mb-2">
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </li>
            <li className="mb-2">
              <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Data Rights</h2>
          <p className="mb-4">Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">The right to access your personal data</li>
            <li className="mb-2">The right to rectify inaccurate personal data</li>
            <li className="mb-2">The right to request deletion of your personal data</li>
            <li className="mb-2">The right to restrict or object to processing of your personal data</li>
            <li className="mb-2">The right to data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@ezmeta.com.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@ezmeta.com.
          </p>
        </section>
      </div>
    </div>
  );
}