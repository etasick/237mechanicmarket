import React from "react";
import { CheckCircle, Lock, Truck, FlaskConical, Barcode } from "lucide-react";

const features = [
  { icon: <CheckCircle size={40} className="text-green-500" />, text: "Satisfaction Guaranteed" },
  { icon: <Lock size={40} className="text-blue-500" />, text: "Secure Ordering" },
  { icon: <Truck size={40} className="text-yellow-500" />, text: "Next Day Shipping" },
  { icon: <FlaskConical size={40} className="text-purple-500" />, text: "Third Party Tested" },
  { icon: <Barcode size={40} className="text-red-500" />, text: "Batch & Lot Tracking" },
];

const FeaturesSection = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-100 rounded-xl shadow-md">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm w-48">
          {feature.icon}
          <p className="mt-2 text-sm font-semibold text-gray-700">{feature.text}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;
