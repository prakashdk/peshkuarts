const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Return & Refund Policy
        </h1>
        <p className="text-gray-700">
          At Peshku Arts, your satisfaction means everything to us. We take
          great care in delivering high-quality handcrafted products. However,
          if something isn't right, we're here to make it better.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600">Returns</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            Returns are accepted within <strong>7 days</strong> of delivery.
          </li>
          <li>
            Items must be unused, in their original packaging, and in the same
            condition you received them.
          </li>
          <li>
            Custom or personalized orders are <strong>non-returnable</strong>{" "}
            unless damaged or defective.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-indigo-600">
          Damaged or Incorrect Products
        </h2>
        <p className="text-gray-700">
          If your order arrives damaged or you received the wrong item, please
          contact us within
          <strong> 48 hours</strong> of delivery. Kindly share clear photos of
          the product and packaging so we can resolve the issue quickly.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600">Refunds</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            Once your return is received and inspected, we will notify you via
            email.
          </li>
          <li>
            Approved refunds will be processed within 3-5 business days back to
            your original payment method.
          </li>
          <li>Shipping charges (if any) are non-refundable.</li>
        </ul>

        <h2 className="text-xl font-semibold text-indigo-600">
          How to Initiate a Return
        </h2>
        <p className="text-gray-700">
          To start a return, please contact us at{" "}
          <a
            href="mailto:support@yourdomain.com"
            className="text-indigo-600 underline"
          >
            support@yourdomain.com
          </a>{" "}
          with your order number and issue details. We'll provide the next steps
          and return address.
        </p>

        <div className="border-t pt-4 text-sm text-gray-500">
          This policy is subject to change without notice. Last updated: May
          2025.
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
