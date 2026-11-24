import { Link } from 'react-router-dom';
import { Icon, Reveal } from '../components/primitives'; // Adjust path if your primitives are elsewhere

export default function PrivacyPolicy() {
  return (
    <div className="bg-[var(--color-sand)] min-h-screen pt-32 pb-24 text-[var(--color-fg-2)]">
      <div className="shell max-w-4xl">
        <Reveal>
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] hover:underline mb-8 transition-colors"
          >
            <Icon name="arrow-left" size={16} /> Back to Home
          </Link>

          {/* Header */}
          <div className="mb-16">
            <h1 className="display text-[var(--color-ink)] mb-4">Privacy Policy</h1>
            <p className="text-[var(--color-fg-3)] font-medium">
              Last Updated: November 24, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            
            <PolicySection number="1" title="Introduction">
              <p>Thank you for your interest in CTC Taxi. We are committed to protecting your privacy while providing you with a safe, reliable and satisfactory transportation experience.</p>
              <p>This Privacy Policy explains our privacy practices, the personal information we collect, how we use and share it, how long we retain it, and the choices and rights available to you regarding your information.</p>
              <p>This Privacy Policy applies to our Services wherever we operate. We comply with applicable data protection and privacy laws in the jurisdictions where we provide our Services. Where any provision of this policy conflicts with applicable local law, we will comply with the law to the extent of the inconsistency.</p>
              <p>CTC Taxi is provided and controlled by the entity identified in the applicable Terms of Use. References to “CTC Taxi”, “we”, “us” or “our” mean the relevant operating entity.</p>
              <p>This policy applies to all CTC Taxi customers and users, including users of our website, <a href="https://ctctaxi.com/" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">https://ctctaxi.com/</a> (“Website”), our mobile applications (“Apps”), and any services provided through the Website or Apps. It also applies when you contact us through telephone, email, written correspondence, social media, in person or any other communication channel (collectively, the “Services”).</p>
              <p>This policy covers Riders and Drivers. It does not cover how we handle information relating to our employees, corporate partners, vendors and subcontractors in their capacity as business associates.</p>
              <p>In this policy:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Users</strong> refers to individuals who use our Services.</li>
                <li><strong>Riders</strong> refers to individuals who request or receive transportation services through CTC Taxi.</li>
                <li><strong>Drivers</strong> refers to individuals who provide transportation services through CTC Taxi.</li>
              </ul>
              <p>Capitalized terms not defined in this policy have the meanings assigned to them in our Terms of Use.</p>
              <p>By using our Services, you acknowledge that you have read this Privacy Policy and understand how we handle your personal information, subject to applicable legal requirements.</p>
            </PolicySection>

            <PolicySection number="2" title="Types of Information We Collect">
              <p>We collect information that you provide directly, information generated through your use of our Services, and information obtained from certain third-party sources.</p>
              <p>We do not intentionally collect sensitive personal information such as religious beliefs, health information or biometric data as part of our ordinary service operations. We also do not collect your device contacts or information from other applications installed on your device.</p>
              
              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-8 mb-4">2.1 Information You Provide</h4>
              <p><strong>Profile and Registration Information</strong></p>
              <p>When you register for or use our Services, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Your full name.</li>
                <li>Phone number.</li>
                <li>Email address (optional).</li>
                <li>Profile photograph (optional).</li>
                <li>Country and preferred language.</li>
                <li>Frequently used or saved locations, where this feature is available.</li>
              </ul>

              <p><strong>Driver Documents and Verification</strong></p>
              <p>To register and operate as a Driver, you may be required to provide information and documents necessary to verify your identity, eligibility and vehicle. These may include:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Driver’s licence.</li>
                <li>Identity document.</li>
                <li>Vehicle registration and other relevant vehicle documents.</li>
                <li>Gender (optional).</li>
                <li>Vehicle details, including make, model, year, colour and registration number.</li>
                <li>Bank account details required for Driver payments and payouts.</li>
                <li>Other documents reasonably required for verification or compliance with applicable regulations.</li>
              </ul>

              <p><strong>User-Generated Content</strong></p>
              <p>We collect content you voluntarily submit through our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Ratings and reviews.</li>
                <li>Messages exchanged with other Users during a trip.</li>
                <li>Photographs or documents you upload.</li>
                <li>Other feedback or information you choose to provide.</li>
              </ul>

              <p><strong>Correspondence and Support Information</strong></p>
              <p>When you contact our support team, we may collect information contained in your communications, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Messages and enquiries.</li>
                <li>Complaints and feedback.</li>
                <li>Lost-item reports.</li>
                <li>Information relating to trip incidents.</li>
                <li>SOS alerts triggered through the App.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-8 mb-4">2.2 Information We Collect Automatically</h4>
              <p><strong>Location Information</strong></p>
              <p>Location information is essential to providing transportation services, matching Riders with Drivers, displaying routes and supporting trip safety.</p>
              <p>Depending on your role and App permissions, we collect precise location information as follows:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Riders:</strong> We collect your precise location when you use the App to request a ride and during the trip. This enables us to identify nearby Drivers, match you with a Driver, display relevant routes and calculate fares.</li>
                <li><strong>Drivers:</strong> We collect your precise location while you are online and during an active trip, including when the App is running in the background or is not actively displayed on your screen. This allows Riders to be matched with you, see your arrival and follow their trips, while helping us maintain accurate fare calculations and safety records. Location collection stops when you go offline.</li>
              </ul>
              <p>Location information is used for service delivery, customer support, safety, fraud prevention and other legitimate operational purposes.</p>

              <p><strong>Transaction Information</strong></p>
              <p>We collect transaction information associated with your use of CTC Taxi, which may include:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Trip fares and payment details.</li>
                <li>Payment methods.</li>
                <li>Wallet top-ups.</li>
                <li>Driver earnings.</li>
                <li>Service commissions.</li>
                <li>Driver payouts.</li>
                <li>Payment status and transaction history.</li>
              </ul>
              <p>Card payments are processed through our designated payment providers. CTC Taxi does not store complete card numbers.</p>

              <p><strong>Usage Information</strong></p>
              <p>We collect information about how you interact with our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Trips requested, accepted, completed or cancelled.</li>
                <li>Routes and distances travelled.</li>
                <li>Trip dates and times.</li>
                <li>App screens and features used.</li>
                <li>General service activity necessary to understand and improve our Apps.</li>
              </ul>

              <p><strong>Communications Information</strong></p>
              <p>We collect information relating to communications necessary for operating our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>One-time verification and sign-in codes sent to your phone.</li>
                <li>Trip notifications.</li>
                <li>Account notifications.</li>
                <li>Other service-related messages and delivery information.</li>
              </ul>

              <p><strong>Device Information</strong></p>
              <p>We collect limited technical information about the device used to access our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Device model.</li>
                <li>Operating system.</li>
                <li>App version.</li>
                <li>Notification token used to deliver push notifications.</li>
              </ul>
              <p>Our mobile applications do not use your device’s advertising identifier.</p>

              <p><strong>Cookies, Analytics and Third-Party Technologies</strong></p>
              <p>Our Apps use analytics technologies to understand how Users interact with different screens and features. We also use error-monitoring tools to receive crash reports and identify technical problems that may affect the performance and reliability of our Services.</p>
              <p>Our Website may use cookies and similar technologies required for its proper operation and to measure website visits.</p>
              <p>Cookies are small text files stored on your device by websites. You may manage or delete cookies through your browser settings. However, disabling certain cookies may affect some Website functionalities.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-8 mb-4">2.3 Information We Obtain From Other Sources</h4>
              <p><strong>Third-Party Services</strong></p>
              <p>We may receive limited information from third-party service providers that support our operations.</p>
              <p>For example:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Payment providers may inform us whether a payment has been successful or unsuccessful.</li>
                <li>Messaging providers may inform us whether a verification or sign-in code has been successfully delivered.</li>
              </ul>
              <p>Where applicable, third-party providers process information in accordance with their own privacy policies and applicable agreements.</p>

              <p><strong>State Authorities</strong></p>
              <p>Where permitted or required by law, we may verify Driver documents or information with the relevant issuing authorities or government institutions.</p>

              <p><strong>Other Users or Third Parties</strong></p>
              <p>We may receive information about you from other Users or third parties, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Ratings and reviews submitted after trips.</li>
                <li>Reports concerning service experiences.</li>
                <li>Complaints or safety incident reports.</li>
                <li>Information provided in connection with disputes or claims.</li>
              </ul>
              <p>We will handle such information in accordance with applicable data protection laws and this Privacy Policy.</p>
            </PolicySection>

            <PolicySection number="3" title="How We Use Your Information">
              <p>We use personal information for the following purposes:</p>
              
              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.1 To Provide Our Services</h4>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Create, manage and verify your account.</li>
                <li>Maintain account security and preferences.</li>
                <li>Match Riders with available Drivers.</li>
                <li>Display trips and routes on the map.</li>
                <li>Calculate fares based on applicable service pricing.</li>
                <li>Process payments, wallet top-ups and Driver payouts.</li>
                <li>Verify Driver documents and vehicle information.</li>
                <li>Notify Drivers about expiring documents where applicable.</li>
                <li>Facilitate communications between Riders and Drivers.</li>
                <li>Send trip updates, receipts, verification codes and account notifications.</li>
                <li>Provide customer support.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.2 Safety and Security</h4>
              <p>We use personal information to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Handle SOS alerts, complaints and incidents during trips.</li>
                <li>Support the safety of Riders and Drivers.</li>
                <li>Detect, prevent and investigate fraud.</li>
                <li>Identify misuse of our Services.</li>
                <li>Address unsafe or unlawful behaviour.</li>
                <li>Investigate disputes and other service-related incidents.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.3 Customer Support and Product Improvement</h4>
              <p>We use information to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Respond to enquiries and complaints.</li>
                <li>Resolve technical and service-related problems.</li>
                <li>Identify and correct application errors.</li>
                <li>Improve the performance, reliability and quality of our Apps.</li>
                <li>Understand how Users interact with our Services.</li>
                <li>Develop and improve existing features.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.4 Marketing and Promotions</h4>
              <p>We may use our Apps to communicate promotional information, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Special offers and discounts.</li>
                <li>Promotional coupons.</li>
                <li>Service announcements.</li>
                <li>Updates about new features and services.</li>
                <li>Other relevant offers and campaigns.</li>
              </ul>
              <p>You may turn off promotional push notifications through your device settings where applicable.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.5 Legal Compliance</h4>
              <p>We may process your personal information to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Meet applicable legal and regulatory obligations.</li>
                <li>Respond to lawful requests from government authorities.</li>
                <li>Comply with court orders and legal proceedings.</li>
                <li>Protect our legal rights and interests.</li>
                <li>Address regulatory, insurance and compliance matters.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">3.6 Automated Decision-Making</h4>
              <p>We use certain automated processes to support the operation of our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Matching Riders with nearby available Drivers based on location and availability.</li>
                <li>Calculating ride fares using trip distance, time and the applicable prices established for each service and region.</li>
              </ul>
              <p>If you have questions about an automated decision that affects you, you may contact us through our support channels for further assistance.</p>
              <p><strong>We do not sell your personal information.</strong></p>
            </PolicySection>

            <PolicySection number="4" title="How We Share Your Information">
              <p>We respect the confidentiality of your personal information and share it only when necessary for the purposes described in this policy or as permitted or required by applicable law.</p>
              
              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.1 With Other Users</h4>
              <p>To facilitate transportation services, certain information is shared between Riders and Drivers.</p>
              <p><strong>Information Shared With Riders</strong></p>
              <p>During a trip, Riders may see:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Driver’s first name.</li>
                <li>Driver’s profile photograph.</li>
                <li>Vehicle details.</li>
                <li>Driver’s rating.</li>
                <li>Driver’s live location.</li>
              </ul>
              <p><strong>Information Shared With Drivers</strong></p>
              <p>Drivers may see:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Rider’s first name.</li>
                <li>Pick-up location.</li>
                <li>Drop-off location.</li>
                <li>Rider’s rating.</li>
              </ul>
              <p><strong>Contact Information</strong></p>
              <p>Phone numbers may be used where necessary to enable Riders and Drivers to contact each other regarding a trip.</p>
              <p><strong>Trip Receipts</strong></p>
              <p>Trip receipts may contain relevant trip information, including trip details, fare and payment information.</p>
              <p>We only share information between Users to the extent reasonably necessary to arrange, provide and manage transportation services.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.2 With Service Providers</h4>
              <p>We may share relevant personal information with trusted third-party service providers that help us operate and maintain our Services.</p>
              <p>These providers may include:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Payment processing companies.</li>
                <li>Messaging and notification service providers.</li>
                <li>Cloud hosting and storage providers.</li>
                <li>Application analytics and error-monitoring providers.</li>
                <li>Technical support providers.</li>
                <li>Map and navigation service providers.</li>
                <li>Professional advisers where necessary.</li>
              </ul>
              <p>These service providers may process information on our behalf and are expected to handle it in accordance with applicable data protection requirements and relevant contractual obligations.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.3 Within Our Corporate Group</h4>
              <p>We may share relevant information with companies that are part of, controlled by, or affiliated with Countryside Taxi Company Limited, where necessary to operate, manage and provide our Services in different locations and countries.</p>
              <p>Such information will be handled in accordance with this Privacy Policy and applicable data protection laws.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.4 In Connection With Business Transfers</h4>
              <p>We may transfer personal information in connection with a substantial business transaction, including a merger, restructuring, consolidation, acquisition or sale of assets.</p>
              <p>Where such a transfer occurs, we will use reasonable efforts to ensure that the receiving entity handles the information in accordance with this Privacy Policy and applicable legal requirements.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.5 For Legal Reasons</h4>
              <p>We may disclose personal information when reasonably necessary:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To comply with applicable laws, regulations, court orders or lawful requests from government authorities.</li>
                <li>To protect the safety, rights and property of Users, CTC Taxi or the public.</li>
                <li>To investigate or resolve disputes, claims and insurance matters.</li>
                <li>To enforce our Terms of Use and other applicable policies.</li>
              </ul>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">4.6 With Your Consent</h4>
              <p>We may share your personal information for additional purposes where you have provided your consent or specifically directed us to do so.</p>
            </PolicySection>

            <PolicySection number="5" title="Your Rights and Choices">
              <p>Depending on applicable data protection laws, you may have certain rights regarding your personal information.</p>
              
              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.1 Accessing and Updating Your Information</h4>
              <p>You may review and update certain personal information through your account settings or by contacting our support team at: <a href="mailto:support@ctctaxi.com" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">support@ctctaxi.com</a></p>
              <p>We may require verification of your identity before processing certain requests.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.2 Managing Location Permissions</h4>
              <p>You can manage location permissions through your mobile device settings.</p>
              <p>However, disabling location access may affect our ability to match you with Drivers, display routes, provide accurate trip information and deliver certain App features.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.3 Managing Push Notifications</h4>
              <p>You can enable or disable push notifications through your device settings.</p>
              <p>Please note that disabling notifications may affect your ability to receive important trip updates, arrival notifications and other account-related messages.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.4 Managing Cookies</h4>
              <p>You may manage or delete cookies through your web browser settings.</p>
              <p>Disabling certain cookies may affect the proper functioning of some Website features.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.5 Deleting Your Account and Personal Information</h4>
              <p>You may request the deletion of your account or personal information through the App settings, where available, or by contacting our support team at: <a href="mailto:support@ctctaxi.com" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">support@ctctaxi.com</a></p>
              <p>We may ask you to verify your identity before processing your request.</p>
              <p>Please note that we may be required or permitted to retain certain information for legitimate business and legal purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Completing outstanding transactions.</li>
                <li>Resolving unpaid balances.</li>
                <li>Preventing fraud and misuse.</li>
                <li>Addressing security incidents.</li>
                <li>Complying with legal or regulatory obligations.</li>
                <li>Resolving disputes and insurance claims.</li>
                <li>Establishing, exercising or defending legal claims.</li>
              </ul>
              <p>Where we retain information after an account deletion request, we will take reasonable steps to limit its use to the applicable retention purpose.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">5.6 Asking Questions or Raising Complaints</h4>
              <p>You may contact us if you have questions about this Privacy Policy, wish to exercise your data protection rights or want to raise a complaint regarding how your personal information is handled.</p>
              <p>Contact:<br/>Email: <a href="mailto:support@ctctaxi.com" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">support@ctctaxi.com</a></p>
              <p>We will review and respond to requests in accordance with applicable laws and subject to any necessary identity verification.</p>
            </PolicySection>

            <PolicySection number="6" title="How We Store Your Information">
              <p>We retain personal information only for as long as reasonably necessary to provide our Services and fulfil the purposes described in this Privacy Policy, subject to applicable legal and regulatory requirements.</p>
              <p>Retention periods may vary depending on:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>The type of information collected.</li>
                <li>Whether the information relates to a Rider or Driver.</li>
                <li>The purpose for which the information is processed.</li>
                <li>Applicable legal and regulatory obligations.</li>
                <li>The need to resolve disputes, claims or outstanding transactions.</li>
              </ul>
              <p>For example, we may retain:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Account information for as long as your account remains active and as necessary after account termination.</li>
                <li>Trip and transaction records for operational, accounting and tax purposes.</li>
                <li>Driver verification documents for as long as necessary to establish eligibility and meet applicable requirements.</li>
                <li>Relevant records for as long as necessary to investigate incidents, resolve disputes or address legal claims.</li>
              </ul>
              <p>When information is no longer required, we will take reasonable steps to securely delete or anonymize it in accordance with applicable laws and our retention practices.</p>
            </PolicySection>

            <PolicySection number="7" title="How Your Information Is Protected">
              <p>CTC Taxi takes reasonable technical, administrative and organizational measures designed to protect your personal information against unauthorized access, disclosure, alteration, loss, misuse or destruction.</p>
              <p>These measures are intended to maintain the confidentiality, integrity and security of information processed through our Services.</p>
              <p>We periodically review our security practices and may adopt improved technologies and procedures to strengthen the protection of User information.</p>
              <p>However, no method of electronic transmission or information storage is completely secure. While we make reasonable efforts to protect your personal information, we cannot guarantee absolute security against every possible security threat or unauthorized third-party activity.</p>
            </PolicySection>

            <PolicySection number="8" title="General Disclosures">
              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">8.1 Protecting Children</h4>
              <p>Our Services are intended for adults and are not directed at individuals under the age of 18.</p>
              <p>We do not knowingly collect personal information from children under 18. If we become aware that an individual under 18 has provided personal information to us, we will take reasonable steps to stop further processing and delete the information where appropriate and legally permissible.</p>
              <p>If you believe that a child has provided personal information to CTC Taxi, please contact us at: <a href="mailto:support@ctctaxi.com" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">support@ctctaxi.com</a></p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">8.2 Telephone Monitoring</h4>
              <p>As part of our customer service and quality assurance practices, telephone conversations with our support team may be monitored or recorded where applicable and permitted by law.</p>
              <p>Where recordings are made, they may be used for service quality assurance, training, complaint resolution and other legitimate operational purposes, or disclosed where legally required.</p>

              <h4 className="text-[1.1rem] font-bold text-[var(--color-ink)] mt-6 mb-3">8.3 Third-Party Websites and Services</h4>
              <p>Our Website and Apps may contain links to third-party websites, services or social media platforms.</p>
              <p>When you access these external platforms, their respective privacy policies and terms may apply. These third parties may collect information about your interaction with their services independently of CTC Taxi.</p>
              <p>CTC Taxi does not control the privacy practices of independent third-party websites and services and is not responsible for their collection, use or disclosure of personal information.</p>
              <p>We encourage you to review the privacy policies of third-party platforms before providing them with your personal information.</p>
            </PolicySection>

            <PolicySection number="9" title="Changes to This Privacy Policy">
              <p>We may occasionally update this Privacy Policy to reflect changes in our Services, business operations, technology or applicable laws and regulations.</p>
              <p>When we make changes, we will update the “Last Updated” date at the top of this policy and publish the revised version on our Website or through other appropriate communication channels where required.</p>
              <p>We encourage Users to review this page periodically to remain informed about how we protect and handle personal information.</p>
              <p>Your continued use of our Services after an updated policy becomes effective will be subject to the revised policy, to the extent permitted by applicable law.</p>
            </PolicySection>

            <PolicySection number="10" title="Contact Us">
              <p>If you have questions, comments, concerns or requests regarding this Privacy Policy or the way CTC Taxi handles your personal information, please contact us through the following channel:</p>
              <div className="bg-white p-6 rounded-xl border border-[var(--color-line)] mt-6">
                <p className="font-bold text-[var(--color-ink)] mb-2">CTC Taxi Support</p>
                <p>Email: <a href="mailto:support@ctctaxi.com" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">support@ctctaxi.com</a></p>
                <p>Website: <a href="https://ctctaxi.com/" className="text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)] transition-colors">https://ctctaxi.com/</a></p>
              </div>
              <p className="mt-6">We appreciate your trust in CTC Taxi and remain committed to protecting your privacy while providing reliable transportation services.</p>
            </PolicySection>

          </div>
        </Reveal>
      </div>
    </div>
  );
}

// Reusable Component to handle the formatting automatically
function PolicySection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white p-8 md:p-10 rounded-2xl border border-[var(--color-line)] shadow-sm">
      <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6 flex items-center gap-3">
        <span className="text-[var(--color-brand)] opacity-50">{number}.</span> {title}
      </h2>
      <div className="space-y-4 leading-relaxed text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}