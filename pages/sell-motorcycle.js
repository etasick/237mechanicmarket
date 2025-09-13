import SellVehiclePage from "./sell-my-car";
export default function SellMotorcycle() {
  return (
    <>
      
      <SellVehiclePage category="motorcycles"/>
      
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale,
    },
  };
}