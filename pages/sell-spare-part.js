import SellVehiclePage from "./sell-my-car";
export default function SellSparePart() {
  return (
    <>
      
      <SellVehiclePage category="spare-parts"/>
      
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