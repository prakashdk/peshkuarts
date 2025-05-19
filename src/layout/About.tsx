import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Banner Image */}
      <motion.div
        variants={item}
        className="overflow-hidden rounded-xl shadow-md mb-10"
      >
        <img
          src="https://ik.imagekit.io/8o8cofkqk/etsy%20peshkuarts/Etsy%20Banner.png?updatedAt=1747500710586"
          alt="Peshku Arts Banner"
          className="w-full h-64 object-cover"
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-primary mb-6"
        variants={item}
      >
        About Us
      </motion.h1>

      {/* Intro Paragraph */}
      <motion.p
        className="text-lg text-gray-700 leading-relaxed mb-6"
        variants={item}
      >
        Welcome to Peshku Arts — where tradition meets tech! Our store is
        crafted with love and purpose, built for India’s evolving digital
        shoppers. From smooth checkout flows to trusted payment integrations
        like PhonePe, we’re on a mission to make online shopping fast, familiar,
        and joyful.
      </motion.p>

      {/* Vision & Mission */}
      <motion.div className="space-y-4" variants={item}>
        <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
        <p className="text-gray-600">
          We aim to empower Indian artisans and modern creators by giving their
          work the digital platform it deserves — without compromising on
          experience, performance, or peace of mind.
        </p>

        <h2 className="text-2xl font-semibold text-primary mt-6">
          Why We Built This
        </h2>
        <p className="text-gray-600">
          Most e-commerce flows feel clunky or bloated. We believe in a minimal,
          intuitive experience that respects your time and doesn’t get in the
          way. Supabase, Framer Motion, and clean React code are part of our
          stack — but **you** are the focus.
        </p>

        <h2 className="text-2xl font-semibold text-primary mt-6">
          What’s Next?
        </h2>
        <p className="text-gray-600">
          We’re actively working on enabling real-time PhonePe payments,
          customer support chat, and artisan profiles. Stay tuned — the next
          step is always bigger.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
