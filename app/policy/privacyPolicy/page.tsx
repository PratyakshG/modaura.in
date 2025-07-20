import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy describes our policies and procedures on the
        collection, use and disclosure of your information when you use the
        Service and tells you about your privacy rights and how the law protects
        you.
      </p>

      <p className="mb-4">
        We use your personal data to provide and improve the Service. By using
        the Service, you agree to the collection and use of information in
        accordance with this Privacy Policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Definitions</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Account:</strong> A unique account created for you to access
          our Service or parts of our Service.
        </li>
        <li>
          <strong>Company:</strong> Modaura Private Limited, Building Number 59,
          Okhla Phase 3 Delhi - 110020.
        </li>
        <li>
          <strong>Cookies:</strong> Small files stored on your device that hold
          browsing data.
        </li>
        <li>
          <strong>Device:</strong> Any device that can access the Service, such
          as a computer or smartphone.
        </li>
        <li>
          <strong>Personal Data:</strong> Information that identifies an
          individual.
        </li>
        <li>
          <strong>Service:</strong> Refers to the website https://modaura.co.in/
        </li>
        <li>
          <strong>Service Provider:</strong> A third party who processes data on
          behalf of the Company.
        </li>
        <li>
          <strong>Usage Data:</strong> Data collected automatically from your
          use of the Service.
        </li>
        <li>
          <strong>You:</strong> The individual using the Service or a legal
          entity on whose behalf the Service is used.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Data Collection</h2>
      <p className="mb-4">We collect personal data such as:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Email address</li>
        <li>First and last name</li>
        <li>Phone number</li>
        <li>Address, city, state, postal code</li>
        <li>Usage data (IP, browser info, time on site, etc.)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Tracking & Cookies</h2>
      <p className="mb-4">
        We use cookies to monitor and improve our services. Cookies can be
        session-based or persistent. You can disable cookies via your browser
        settings, but some parts of the Service may not function properly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Personal Data</h2>
      <p className="mb-4">Your data is used to:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Maintain and provide the Service</li>
        <li>Manage your account</li>
        <li>Fulfill contracts and orders</li>
        <li>Communicate updates and offers</li>
        <li>Analyze usage and improve performance</li>
        <li>Support business transfers or mergers</li>
        <li>Fulfill legal obligations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Retention & Security</h2>
      <p className="mb-4">
        We retain personal data only as long as necessary. We implement
        commercially reasonable security measures, but no method is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Children’s Privacy</h2>
      <p className="mb-4">
        We do not knowingly collect data from users under 13. If you believe a
        child has provided data, contact us to remove it.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Links</h2>
      <p className="mb-4">
        Our site may contain links to other websites not operated by us. We
        advise reviewing their privacy policies.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Changes are posted on
        this page and may also be sent via email or app notification.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at:
      </p>
      <p className="mt-2">
        📧 Email:{" "}
        <a
          href="mailto:queries@modaura.co.in"
          className="text-blue-600 underline"
        >
          modaura.in@gmail.com
        </a>
      </p>
    </main>
  );
};

export default PrivacyPolicyPage;
