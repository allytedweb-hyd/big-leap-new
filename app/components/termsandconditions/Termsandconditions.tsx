"use client";

import styles from "./tc.module.css";

export default function TermsAndConditions() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.lastUpdated}>
          Effective Date: June 2026
        </p>

        <p className={styles.intro}>
          Welcome to Big Leap Technologies. By accessing our website,
          enrolling in our courses, or using any of our services, you agree
          to comply with and be bound by the following Terms & Conditions.
        </p>

        <div className={styles.content}>
          <div className={styles.policyBlock}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Big Leap Technologies website and
              services, you acknowledge that you have read, understood,
              and agreed to these Terms & Conditions.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>2. About Our Services</h2>
            <ul>
              <li>Online Training Programs</li>
              <li>Professional Certification Courses</li>
              <li>Live Instructor-Led Sessions</li>
              <li>Recorded Learning Content</li>
              <li>Workshops and Webinars</li>
              <li>Career Guidance and Skill Development Programs</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>3. User Eligibility</h2>
            <ul>
              <li>Must be at least 18 years old or have guardian consent.</li>
              <li>Provide accurate registration information.</li>
              <li>Use services only for lawful purposes.</li>
              <li>Maintain the confidentiality of account credentials.</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>4. Course Registration & Enrollment</h2>
            <ul>
              <li>Enrollment is confirmed after successful payment.</li>
              <li>Registration information must be accurate.</li>
              <li>Course access credentials are personal and non-transferable.</li>
              <li>
                We reserve the right to suspend or cancel enrollment for misuse
                or policy violations.
              </li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>5. Fees & Payments</h2>
            <ul>
              <li>Course fees must be paid through approved payment methods.</li>
              <li>Prices may change without prior notice.</li>
              <li>Applicable taxes may be charged separately.</li>
              <li>
                Big Leap Technologies does not store card or banking details.
              </li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>6. Refund & Cancellation Policy</h2>
            <p>
              Refund requests must be submitted through our support team.
              Eligibility depends on course access, attendance, and content
              consumption. Promotional and discounted courses may have separate
              refund conditions.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>7. Intellectual Property Rights</h2>
            <p>
              All training materials, videos, presentations, assignments,
              documents, website content, logos, and branding are the property
              of Big Leap Technologies.
            </p>

            <h3>You May Not:</h3>
            <ul>
              <li>Copy or reproduce course materials</li>
              <li>Share login credentials</li>
              <li>Record training sessions</li>
              <li>Sell or redistribute course content</li>
              <li>Publish proprietary learning materials</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>8. User Conduct</h2>
            <ul>
              <li>Do not share accounts with others.</li>
              <li>Do not upload malicious software or harmful content.</li>
              <li>Do not harass trainers, staff, or learners.</li>
              <li>
                Do not attempt unauthorized access to systems or platforms.
              </li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>9. Certifications</h2>
            <p>
              Certificates may be awarded upon successful completion of course
              requirements, including attendance, assessments, assignments, and
              project submissions where applicable.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>10. Placement Assistance Disclaimer</h2>
            <p>
              Big Leap Technologies may provide placement assistance,
              interview preparation, resume guidance, and career support.
              However, job placement is not guaranteed and depends on individual
              performance, skills, and market conditions.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>11. Website Availability</h2>
            <p>
              We strive to maintain uninterrupted access to our website and
              learning platforms, but temporary downtime may occur due to
              maintenance, technical issues, or third-party service failures.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>12. Limitation of Liability</h2>
            <p>
              Big Leap Technologies shall not be liable for indirect,
              incidental, or consequential damages arising from the use of our
              services, website, training programs, or learning platforms.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>13. Third-Party Services</h2>
            <p>
              Our website may include links to third-party services, payment
              gateways, and resources. We are not responsible for their
              availability, content, or privacy practices.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>14. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy.
              By using our website, you consent to the collection and use of
              information as described therein.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>15. Modifications to Terms</h2>
            <p>
              We reserve the right to update these Terms & Conditions at any
              time. Changes will become effective once posted on this page.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>16. Governing Law</h2>
            <p>
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>17. Contact Information</h2>

            <div className={styles.contactBox}>
              <strong>Big Leap Technologies</strong>
              <p>Email: info@bigleaptech.in</p>
              <p>Website: https://bigleaptech.in</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}