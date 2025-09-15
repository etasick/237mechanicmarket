import { useRouter } from "next/router";

const TestNavigationButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        // navigate away (simulate leaving)
        router.push("/cars-for-sale").then(() => {
          // after 2s, navigate back
          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
      }}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Simulate Route Bounce
    </button>
  );
};
export default TestNavigationButton;