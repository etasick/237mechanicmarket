import { useRouter } from 'next/router';

function GetQuoteButton() {
  const router = useRouter();

  const handleGetQuote = () => {
    router.push('/contact-us'); // Replace with your actual contact page route
  };

  return (
    <button
      onClick={handleGetQuote}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      Get Quote
    </button>
  );
}

export default GetQuoteButton;