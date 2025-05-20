import {
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left: Contact Info */}
        <div className="w-full md:w-1/2 p-8 space-y-6 bg-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-700">Get in Touch</h2>
          <p className="text-gray-700">
            We'd love to hear from you! Reach out with questions, feedback, or
            just say hi.
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-600 text-lg" />
              <span>support@yourdomain.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-indigo-600 text-lg" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-indigo-600 text-lg" />
              <span>Chennai, Tamil Nadu, India</span>
            </div>

            <div className="flex items-center gap-3">
              <FaInstagram className="text-pink-600 text-lg" />
              <a
                href="https://www.instagram.com/peshkuarts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @peshkuarts
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message or Illustration */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            We’re here for you
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-sm">
            Whether it's support, custom orders, or collaborations — drop us a
            line and we’ll respond as soon as possible.
          </p>
          <img
            src="https://ik.imagekit.io/8o8cofkqk/etsy%20peshkuarts/Etsy%20Banner.png?updatedAt=1747500710586"
            alt="Contact banner"
            className="rounded-lg w-full max-w-xs object-cover shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
