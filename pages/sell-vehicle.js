// pages/sell-vehicle.js
import ListingWizard from "@/components/ListingWizard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SellVehiclePage() {
  return (
    <>
      <Header />
      <ListingWizard /> {/* generic - user chooses category */}
      <Footer />
    </>
  );
}
