import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { supabase } from "../../config/supabaseClient";
import { useUser } from "../../hooks/useUser";
import { getAutoCompleteValue } from "../../utils/addres.util";
import { Loader } from "../../components/Loader";

type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  pincode: string;
  phone: string;
};

type CheckoutAddressProps = {
  onSelectAddressId: (id: string) => void;
};

export default function CheckoutAddress({
  onSelectAddressId,
}: CheckoutAddressProps) {
  const { user, loading: isUserLoading } = useUser();
  const navigate = useNavigate();

  const [addressList, setAddressList] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(true);

  const [formData, setFormData] = useState<Omit<Address, "id">>({
    label: "",
    name: "",
    line1: "",
    city: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isUserLoading, user, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to load addresses");
        return;
      }

      setAddressList(data);
      setIsFetchingAddress(false);
    };

    fetchAddresses();
  }, [user?.id]);

  const handleFormChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAddress = async () => {
    const isComplete = Object.values(formData).every(
      (val) => val.trim() !== ""
    );
    if (!isComplete) return toast.error("Please fill in all fields.");
    if (!user?.id) return toast.error("User not found.");

    setIsSaving(true);

    const { data, error } = await supabase
      .from("user_addresses")
      .insert({ user_id: user.id, ...formData })
      .select("id")
      .single();

    setIsSaving(false);

    if (error || !data?.id) {
      toast.error("Failed to save address");
      return;
    }

    const newEntry = { id: data.id, ...formData };
    setAddressList((prev) => [...prev, newEntry]);
    setSelectedAddressId(data.id);
    onSelectAddressId(data.id);
    setIsAddingNewAddress(false);
    setFormData({
      label: "",
      name: "",
      line1: "",
      city: "",
      pincode: "",
      phone: "",
    });

    toast.success("Address saved");
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("Please select an address.");
      return;
    }
    onSelectAddressId(selectedAddressId);
  };

  const addressFields = [
    { key: "label", placeholder: "Label (e.g. Home, Office)" },
    { key: "name", placeholder: "Full Name" },
    { key: "line1", placeholder: "Address Line" },
    { key: "city", placeholder: "City" },
    { key: "pincode", placeholder: "Pincode" },
    { key: "phone", placeholder: "Phone Number" },
  ];

  if (isFetchingAddress) {
    return <Loader>Loading your saved addresses...</Loader>;
  }

  return (
    <div className="space-y-8">
      {!isAddingNewAddress && addressList.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800">
            Select a Shipping Address
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {addressList.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-4 rounded-xl border cursor-pointer shadow-sm transition-all ${
                  selectedAddressId === address.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                <p className="font-semibold text-lg">{address.label}</p>
                <p className="text-sm text-gray-700">{address.name}</p>
                <p className="text-sm text-gray-700">
                  {address.line1}, {address.city}
                </p>
                <p className="text-sm text-gray-700">
                  Pincode: {address.pincode}
                </p>
                <p className="text-sm text-gray-700">Phone: {address.phone}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsAddingNewAddress(true)}
            >
              + Add New Address
            </button>
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={!selectedAddressId}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </>
      )}

      {(addressList.length === 0 || isAddingNewAddress) && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Address
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {addressFields.map(({ key, placeholder }) => (
              <input
                key={key}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder={placeholder}
                autoComplete={getAutoCompleteValue(key)}
                value={formData[key as keyof typeof formData]}
                onChange={(e) =>
                  handleFormChange(key as keyof typeof formData, e.target.value)
                }
              />
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-4">
            {addressList.length > 0 && (
              <button
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsAddingNewAddress(false)}
              >
                Cancel
              </button>
            )}
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleSaveAddress}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
