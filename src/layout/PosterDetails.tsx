import React from "react";

type PosterDetailsProps = {
  descriptionHTML: string;
};

const highlights = [
  { icon: "🎨", text: "High-resolution print with crisp detailing" },
  { icon: "🖼️", text: "Matte finish ideal for framing" },
  { icon: "📦", text: "Carefully packaged to avoid damage" },
  { icon: "🎁", text: "Perfect gift for film lovers" },
];

const specs: Record<string, string> = {
  Size: "A3 (11.7 x 16.5 inches)",
  Material: "300 GSM textured art paper",
  Frame: "Not included",
  Finish: "Matte, non-reflective",
};

export default function PosterDetails({ descriptionHTML }: PosterDetailsProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-primary">Description</h3>
      <div
        className="prose prose-indigo mb-10"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />

      <hr className="border-gray-200 mb-8" />

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Why You’ll Love It
        </h3>
        <ul className="space-y-3 text-gray-700">
          {highlights.map(({ icon, text }, i) => (
            <li key={i} className="flex items-center gap-3 text-lg">
              <span className="text-indigo-500 text-2xl">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200 mb-8" />

      <div>
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Specifications
        </h3>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-base">
          {Object.entries(specs).map(([key, value]) => (
            <React.Fragment key={key}>
              <dt className="font-semibold">{key}</dt>
              <dd>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}
