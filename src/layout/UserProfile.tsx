import { useEffect, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "../config/supabaseClient";
import { useUser } from "../hooks/useUser";
import { Loader } from "../components/Loader";

type Profile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
};

type Address = {
  id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const UserProfile = () => {
  const { user, loading: isUserLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndAddresses = async () => {
      if (!user) return;

      setLoading(true);

      // Fetch profile info
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email, phone, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Profile fetch error:", profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData || null);

      // Fetch user addresses
      const { data: addressData, error: addressError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (addressError) {
        console.error("Address fetch error:", addressError.message);
        setLoading(false);
        return;
      }

      setAddresses(addressData || []);
      setLoading(false);
    };

    fetchProfileAndAddresses();
  }, [user]);

  if (loading || isUserLoading) {
    return <Loader>Loading your profile...</Loader>;
  }

  // Use fallback data from user object if profile not available
  const displayName =
    profile?.full_name || (user?.user_metadata?.name as string) || "User";
  const displayEmail = profile?.email || user?.email || "No email";
  const displayPhone = profile?.phone || "No phone";

  const avatarUrl =
    profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6 md:flex md:space-y-0 md:space-x-8">
        {/* Profile Section */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <p className="mt-4 text-lg font-medium text-gray-800 text-center md:text-left">
            {displayName}
          </p>

          <div className="mt-6 space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-500" />
              <span>{displayEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-indigo-500" />
              <span>{displayPhone}</span>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 text-center md:text-left">
            Addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="text-gray-600 italic text-center md:text-left">
              No addresses found.
            </p>
          ) : (
            <ul className="space-y-4">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="border rounded-lg p-4 bg-indigo-50 flex items-start gap-3"
                >
                  <FaMapMarkerAlt className="mt-1 text-indigo-500" />
                  <div>
                    <p className="font-semibold text-indigo-700">
                      {addr.label}
                    </p>
                    <p className="text-gray-700">
                      {addr.address_line1}
                      {addr.address_line2 ? `, ${addr.address_line2}` : ""}
                    </p>
                    <p className="text-gray-700">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-gray-700">{addr.country}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition">
          Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
