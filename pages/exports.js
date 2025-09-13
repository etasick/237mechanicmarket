import { NextSeo } from 'next-seo';
import Link from 'next/link';

export default function ExportPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <NextSeo
        title="Export Policy | MadeinKamer"
        description="Policies governing our export procedures and requirements"
      />
      
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Export Policy</h1>
        
        <div className="mb-10">
          <p className="text-gray-600">
            This Export Policy outlines the terms governing MadeinKamer's export services from Cameroon to international markets.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Export Process</h2>
            <ol className="list-decimal pl-6 space-y-4 text-gray-600">
              <li>
                <strong>Product Verification:</strong> We confirm product availability (in-stock or procurement required)
              </li>
              <li>
                <strong>Documentation:</strong> We prepare all required export documents:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Commercial invoice</li>
                  <li>Packing list</li>
                  <li>Certificate of Origin</li>
                  <li>Phytosanitary certificates (for agricultural products)</li>
                </ul>
              </li>
              <li>
                <strong>Customs Clearance:</strong> We handle all Cameroon export formalities
              </li>
              <li>
                <strong>Shipping:</strong> We arrange secure international transport
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Prohibited Items</h2>
            <p className="text-gray-600">
              We cannot export items restricted by Cameroonian law or international regulations, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Endangered species products</li>
              <li>Hazardous materials</li>
              <li>Counterfeit goods</li>
              <li>Weapons and ammunition</li>
              <li>Items requiring special permits we don't possess</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Import Compliance</h2>
            <p className="text-gray-600">
              Customers are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Confirming products comply with their country's import regulations</li>
              <li>Paying all import duties and taxes</li>
              <li>Obtaining any required import licenses</li>
              <li>Providing accurate HS codes for customs classification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Shipping Terms</h2>
            <p className="text-gray-600">
              All shipments are made under <strong>FOB Douala</strong> terms unless otherwise agreed in writing. Shipping options include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li><strong>Air Freight:</strong> Faster but more expensive (3-7 days)</li>
              <li><strong>Sea Freight:</strong> Economical for large shipments (20-45 days)</li>
              <li><strong>Courier Services:</strong> For small parcels (DHL, FedEx)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Risk Transfer</h2>
            <p className="text-gray-600">
              Title and risk of loss pass to buyer when goods are loaded onto the shipping carrier in Cameroon.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Force Majeure</h2>
            <p className="text-gray-600">
              We are not liable for delays caused by events beyond our reasonable control including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
              <li>Customs delays</li>
              <li>Port closures</li>
              <li>Political unrest</li>
              <li>Natural disasters</li>
              <li>Global pandemics</li>
            </ul>
          </section>

          <div className="pt-6">
            <p className="text-gray-600">
              For export-related questions, contact our logistics team at <Link href="mailto:info@madeinkamer.com" className="text-blue-600">info@madeinkamer.com</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}