// components/AboutSection.js
"use client";
import { useRouter } from "next/router";
import { CheckBadgeIcon, ShieldCheckIcon, TruckIcon, StarIcon } from "@heroicons/react/24/outline";

const AboutSection = () => {
    const router = useRouter();
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Made in Cameroon Products<br />
              <span className="text-emerald-600">Trusted worldwide</span>
            </h2>
            
            <p className="text-lg text-gray-600">
             Madeinkamer.com makes it easy for anyone around the world to get products from  Cameroon. We export high-quality Coco beans,african walnuts,dry robusta coffe beans,palm oil, and many more products from Cameroon.we are located in Bonaberi,Douala,Cameroon.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <CheckBadgeIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">We handle the procurements from local suppliers</h3>
                  <p className="text-gray-600">
                    Our quality control staff make sure products from local suppliers meet the hgihest-quality needed for exports.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">warehouse</h3>
                  <p className="text-gray-600">
                    We handle the storage of the goods pending exports worldwide.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <StarIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">We handle exports in the Doula ports and kribi ports </h3>
                  <p className="text-gray-600">
                    Get a Quote.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-4">
              <button 
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={() => router.push('/products')}
              >
                Explore export products
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-xl">
              <TruckIcon className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">We export as fast as possible to reduce congestion in our warehouses.</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-xl">
              <ShieldCheckIcon className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Our quality control staff make sure only the best products are bought and exported to our partners all over the world.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <StarIcon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">5-Star Support</h3>
              <p className="text-gray-600">support staff  available 24/7 to respond to all your inquiries by email or phone.</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <CheckBadgeIcon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No child or forced labour</h3>
              <p className="text-gray-600">We deal with local suppliers who uphold the highest ethical standards in employment and work under the Cameroonian labour code.</p>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
       
      </div>
    </section>
  );
};

export default AboutSection;