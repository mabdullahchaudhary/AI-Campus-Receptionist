export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
            <div className="flex flex-col items-center">
                <h1 className="text-7xl font-extrabold mb-4 text-violet-700 drop-shadow-lg">404</h1>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Page Not Found</h2>
                <p className="text-gray-500 mb-6 max-w-md">Sorry, the page you are looking for does not exist, has been moved, or the link is broken.</p>
                <a href="/" className="inline-block px-8 py-3 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition shadow">Go to Homepage</a>
            </div>
        </main>
    );
}
