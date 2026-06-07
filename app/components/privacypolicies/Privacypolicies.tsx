"use client";

import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>
          Effective Date: June 2026
        </p>

        <p className={styles.intro}>
          At Big Leap Technologies, accessible from https://bigleaptech.in/,
          we are committed to protecting the privacy and personal information
          of our clients, website visitors, business partners, and service
          users.
        </p>

        <div className={styles.content}>
          <div className={styles.policyBlock}>
            <h2>1. Scope of This Policy</h2>
            <p>
              This Privacy Policy applies to information collected through the
              Big Leap Technologies website and online services. It does not
              apply to information collected offline or through third-party
              platforms not controlled by Big Leap Technologies.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>2. Information We Collect</h2>

            <h3>Personal Information</h3>
            <ul>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Company Name</li>
              <li>Contact and Communication Details</li>
            </ul>

            <h3>Technical Information</h3>
            <ul>
              <li>IP Address</li>
              <li>Browser Type</li>
              <li>Device Information</li>
              <li>Pages Visited</li>
              <li>Cookies and Tracking Technologies</li>
            </ul>

            <h3>Service Information</h3>
            <ul>
              <li>Project Requirements</li>
              <li>Consultation Requests</li>
              <li>Support Communications</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>Provide and manage IT services and solutions</li>
              <li>Respond to inquiries and support requests</li>
              <li>Improve website functionality and user experience</li>
              <li>Analyze website performance and visitor behavior</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>4. Sharing of Information</h2>
            <p>
              Big Leap Technologies does not sell, rent, or trade personal
              information. Information may be shared with trusted service
              providers, legal authorities when required, or during business
              transfers such as mergers and acquisitions.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>5. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies to improve website functionality, analyze traffic,
              and enhance user experience. You may disable cookies through your
              browser settings, though some features may not function properly.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures including secure
              servers, encryption, firewalls, and access controls to safeguard
              your information.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>7. Data Retention</h2>
            <p>
              Personal information is retained only as long as necessary to
              provide services, comply with legal obligations, and maintain
              business records.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>8. Your Privacy Rights</h2>
            <ul>
              <li>Access your personal information</li>
              <li>Request corrections or updates</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent</li>
              <li>Object to certain processing activities</li>
            </ul>
          </div>

          <div className={styles.policyBlock}>
            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for their privacy practices and encourage users to
              review their policies.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>10. Children's Privacy</h2>
            <p>
              We do not knowingly collect personal information from children
              under 13 years of age. Any such information will be removed upon
              discovery.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>11. International Data Transfers</h2>
            <p>
              Information may be processed or stored outside your country of
              residence. Appropriate safeguards are implemented to protect your
              data.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>12. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Updates will be
              published on this page with a revised effective date.
            </p>
          </div>

          <div className={styles.policyBlock}>
            <h2>13. Contact Information</h2>
            <p>
              For privacy-related inquiries, please contact:
            </p>

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