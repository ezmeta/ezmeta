export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg mb-6">
          Last Updated: April 20, 2026
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using EZ Meta's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use EZ Meta's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Modify or copy the materials</li>
            <li className="mb-2">Use the materials for any commercial purpose or for any public display</li>
            <li className="mb-2">Attempt to decompile or reverse engineer any software contained on EZ Meta's platform</li>
            <li className="mb-2">Remove any copyright or other proprietary notations from the materials</li>
            <li className="mb-2">Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by EZ Meta at any time.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Subscription and Billing</h2>
          <p className="mb-4">
            EZ Meta offers subscription-based services with the following terms:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Subscription Fees:</strong> You agree to pay all fees associated with your selected subscription plan.
            </li>
            <li className="mb-2">
              <strong>Billing Cycle:</strong> Subscription fees are billed in advance on a monthly or annual basis depending on the plan you select.
            </li>
            <li className="mb-2">
              <strong>Automatic Renewal:</strong> Your subscription will automatically renew at the end of each billing period unless you cancel it.
            </li>
            <li className="mb-2">
              <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to the service until the end of your current billing period.
            </li>
            <li className="mb-2">
              <strong>Refunds:</strong> Refunds are provided in accordance with applicable laws and at our discretion.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Meta API Integration</h2>
          <p className="mb-4">
            By using our service, you acknowledge and agree to the following regarding Meta API integration:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              You authorize EZ Meta to access your Meta Ad accounts through the Meta Graph API.
            </li>
            <li className="mb-2">
              You must comply with Meta's Terms of Service and Platform Policies when using our service.
            </li>
            <li className="mb-2">
              EZ Meta is not affiliated with Meta and is solely responsible for our services.
            </li>
            <li className="mb-2">
              You understand that Meta may change their API functionality at any time, which could affect our service.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. AI-Generated Content</h2>
          <p className="mb-4">
            Regarding AI-generated content created through our platform:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              You retain ownership of the content you create using our AI tools.
            </li>
            <li className="mb-2">
              You are responsible for reviewing and approving all AI-generated content before use.
            </li>
            <li className="mb-2">
              EZ Meta makes no guarantees about the accuracy, quality, or appropriateness of AI-generated content.
            </li>
            <li className="mb-2">
              You agree not to use our AI tools to generate content that is illegal, harmful, or violates third-party rights.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p>
            EZ Meta's services are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
          <p>
            In no event shall EZ Meta or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our services, even if EZ Meta or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Account Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            EZ Meta reserves the right to revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then-current version of these Terms of Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at legal@ezmeta.com.
          </p>
        </section>
      </div>
    </div>
  );
}