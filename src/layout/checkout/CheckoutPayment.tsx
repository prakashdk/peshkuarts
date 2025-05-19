import { useState } from "react";
import { SiPhonepe } from "react-icons/si";

type Props = {
  loading: boolean;
  onBack: () => void;
  onPlaceOrder: () => void;
};

const CheckoutPayment = ({ loading, onBack }: Props) => {
  const [phonePeLoading, setPhonePeLoading] = useState(false);

  const handlePhonePePayment = () => {
    setPhonePeLoading(true);
    setTimeout(() => {
      alert("No backend implemented yet for PhonePe payment!");
      setPhonePeLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-700 mb-8 text-center text-lg">Pay with PhonePe</p>

      <div className="mb-6 text-center">
        <button
          type="button"
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white text-lg font-medium transition ${
            phonePeLoading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={handlePhonePePayment}
          disabled={loading || phonePeLoading}
        >
          {phonePeLoading ? (
            "Processing..."
          ) : (
            <>
              <SiPhonepe className="w-5 h-5" />
              Pay with PhonePe
            </>
          )}
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
