const ShippingPolicyPage = () => {
  return (
    <>
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Shipping Time</h2>
          <p>
            Orders are processed within 1–2 business days. Once your order is
            shipped, you will receive a tracking number via email and/or SMS.
            Standard shipping usually takes 3–7 business days depending on your
            location.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Shipping Rates</h2>
          <p>
            We offer free shipping on orders above ₹999. For orders below this,
            delivery charges will be calculated according to your delivery
            location.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">International Shipping</h2>
          <p>
            Currently, we do not offer international shipping. We only ship
            within India.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Delayed Deliveries</h2>
          <p>
            Occasionally, deliveries may be delayed due to unforeseen
            circumstances such as weather, courier delays, or high order volume.
            If your order is delayed beyond 10 business days, please contact us
            at{" "}
            <a
              href="mailto:modaura.in@gmail.com"
              className="text-blue-600 underline"
            >
              modaura.in@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Tracking</h2>
          <p>
            After your order is shipped, you will receive an email and/or SMS with a
            tracking link. You can use that link to track the status of your
            delivery.
          </p>
        </section>
      </main>
    </>
  );
};

export default ShippingPolicyPage;
