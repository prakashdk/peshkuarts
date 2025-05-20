import { useState } from "react";
import { FaBox, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useCheckout, type OrderItem } from "../../hooks/useCheckout";
import { useUser } from "../../hooks/useUser";
import CheckoutAddress from "./CheckoutAddress";
import CheckoutConfirm from "./CheckoutConfirm";
import CheckoutPayment from "./CheckoutPayment";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const steps = [
  { label: "Address", icon: FaMapMarkerAlt },
  { label: "Confirm", icon: FaBox },
  { label: "Payment", icon: FaCreditCard },
];

const CheckoutBase = () => {
  const { user } = useUser();
  const { cartItems } = useCart();
  const { placeOrder, setPendingAddressId, getPendingAddressId } =
    useCheckout();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(
    getPendingAddressId()
  );

  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handlePlaceOrder = async () => {
    if (!addressId) return;

    setLoading(true);

    const res = await placeOrder({
      user_id: user.id,
      address_id: addressId,
      items: orderItems,
    });

    setLoading(false);

    if (res?.success) {
      navigate(`/orders/${res.orderId}`);
    } else {
      toast.error("Order failed. Try again.");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <CheckoutAddress
            onSelectAddressId={(id) => {
              setAddressId(id);
              setPendingAddressId(id);
              setStep(1);
            }}
          />
        );
      case 1:
        return (
          <CheckoutConfirm
            cartItems={cartItems}
            onBack={() => setStep(0)}
            onNext={(items) => {
              setOrderItems(items);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <CheckoutPayment
            loading={loading}
            onBack={() => setStep(1)}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex justify-between items-center relative mb-10">
        {steps.map((stepItem, index) => {
          const isCompleted = index < step;
          const isActive = index === step;
          const Icon = stepItem.icon;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all 
                  ${
                    isCompleted
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : isActive
                      ? "bg-white text-indigo-600 border-indigo-600"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
              >
                <Icon className="text-lg" />
              </div>
              <span
                className={`text-sm mt-2 font-medium ${
                  isCompleted || isActive ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-300 z-0">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 shadow-lg rounded-2xl">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default CheckoutBase;
