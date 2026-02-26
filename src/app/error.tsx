
"use client";

export default function Error500() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
            <div className="flex flex-col items-center">
                <h1 className="text-7xl font-extrabold mb-4 text-red-600 drop-shadow-lg">500</h1>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Internal Server Error</h2>
                <p className="text-gray-500 mb-6 max-w-md">Oops! Something went wrong on our end. Please try again later or contact support if the problem persists.</p>
                <a href="/" className="inline-block px-8 py-3 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition shadow">Go to Homepage</a>
            </div>
        </main>
    );
}
