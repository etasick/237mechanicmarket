// components/PolicyLayout.js
export default function PolicyLayout({ title, children }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
              {title}
            </h1>
            <div className="prose prose-lg text-gray-600 space-y-6">
              {children}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a href="/contact-us" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact us with any questions
            </a>
          </div>
        </main>
      </div>
    );
  }