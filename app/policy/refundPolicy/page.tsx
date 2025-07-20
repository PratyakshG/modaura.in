import React from "react";

const RefundPolicyPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Return Policy</h2>
        {/* <p className="mb-2">Return Link: xxxxxxxxxxxxxxxxxxxxxxxxxxxx</p> */}
        <p>
          Our return policy is valid for 7 days from the date of delivery.
          Within 7 days, you can initiate a return request on the link provided
          above.
        </p>
        <p>
          In case of damaged or defective product, ensure to complaint within 48
          hours of receiving the product.
        </p>
        <p>
          <strong>Note: </strong>Delivery Charges (if applicable) will not be
          refunded in any case.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Refund Policy</h2>
        <p>
          Refunds will be processed once your return is received and inspected
          in our warehouse in a maximum of 7 days from the date on which Modaura
          receives returned item. We will send you an email/Whatsapp message to
          notify you that we have received your returned item.
        </p>
        <br />
        <p>
          If everything is in order, then your refund will be processed, and the
          amount will be refunded to your original method of payment for prepaid
          orders. For cash on delivery orders, we will ask you to provide us
          with your bank account details and credit the refund amount in the
          same.
        </p>
        <br />
        <p>
          In case of prepaid order through UPI, Credit Card, Debit Card, or Net
          Banking, the amount will be refunded back to the account from which it
          was paid within 3-5 working days.
        </p>
        <br />
        <p>
          Please note that Cash-on-Delivery charges and Shipping Charges (if
          applicable) are not refundable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Things To Remember</h2>
        <p>
          For any defective/ damaged/incomplete/wrong order delivered, we
          request you to inform us within 48 hours of receiving the order with
          the unboxing video of the product received.
        </p>
        <br />
        <p>
          For defective and wrong. You can do so by clicking on
          &apos;Return&apos; under the &apos;My Orders&apos; section of the
          Modaura.com Website and follow the instructions to upload the images.
          Please keep in mind the following–You need to share the images,
          unboxing video for wrong product with fully packed condition.
        </p>
        <br />
        <p>
          Kindly ensure the video is clear and the damaged/defective/missing
          part of the jewellery is highlighted in zoom.
        </p>
        <br />
        <p>
          You must send us a video of the original labels and tags intact box.
          If the video is not shared as per the mentioned details we will be not
          able to cater any further request.
        </p>
        <br />
        <p>
          We will be requiring a 360-degree unpacking video of the parcel for us
          to process the request further. Please note that insufficient evidence
          or visible signs of tampering with the packet may result in your claim
          not being honoured. In all such cases, the brand reserves the right to
          take the final decision.
        </p>
        <br />
        <p>
          In case you face any technical difficulties in following this process,
          kindly get in touch with us on{" "}
          <a
            className="text-blue-600 underline"
            href="mailto:queries@modaura.com"
          >
            modaura.in@gmail.com
          </a>{" "}
          or <strong> WhatsApp us on +91 8882300527</strong>. We will then
          investigate the case and reply within 48-72 hours with the best
          available resolution.
        </p>
        <br />
        <p>
          Any such complaint raised after 48 hours of receiving the order may
          not be considered.
        </p>
        <br />
        <p>
          In case of missing items in return orders, i.e., where the customer
          claims to have returned multiple products but actual pickup
          doesn&apos;t include all said items, the company has a right to deduct
          an amount up to the full MRP of the missing product from the refund
          amount. This shall extend to promotional products, including but not
          limited to free gifts.
        </p>
        <br />
        <p>
          Once you have booked the return request, we request you to be
          available for the reverse pick-up, and we request you to answer calls
          from the delivery partner. In the absence of your availability or
          inability to answer the calls, the delivery partner may, at their
          discretion, cancel the reverse pick-up. In all such cases, the process
          will have to be re-initiated again, and the overall timeline will
          increase.
        </p>
        <br />
        <p>
          Further, please note that while most pin codes are forward and reverse
          serviceable, in rare cases, some pin codes may only be forward
          serviceable and not reverse serviceable.
        </p>
        <br />
        <p>
          Any single jewellery in a combo/ gift box cannot be replaced or
          returned.
        </p>
        <p>
          Products purchased in the period of a special promotional offer,
          contests, clearance or any special scheme, cannot be returned or
          replaced.
        </p>
      </section>
    </main>
  );
};

export default RefundPolicyPage;
