export default function Error500() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2">Internal Server Error</h2>
      <p className="text-gray-500 mb-6">Something went wrong on our end. Please try again later or contact support.</p>
      <a href="/" className="inline-block px-6 py-2 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition">Go Home</a>
    </main>
  );
}
