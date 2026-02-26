export default function Error502() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
            <h1 className="text-5xl font-extrabold mb-4 text-orange-500">502</h1>
            <h2 className="text-2xl font-semibold mb-2">Bad Gateway</h2>
            <p className="text-gray-500 mb-6">The server received an invalid response. Please try again later.</p>
            <a href="/" className="inline-block px-6 py-2 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition">Go Home</a>
        </main>
    );
}
