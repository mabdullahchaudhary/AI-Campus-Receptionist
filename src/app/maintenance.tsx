export default function Maintenance() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-extrabold mb-4">Scheduled Maintenance</h1>
      <p className="text-gray-500 mb-6">Superior AI is currently undergoing scheduled maintenance.<br />We’ll be back online shortly. Thank you for your patience!</p>
      <a href="mailto:info@superior.edu.pk" className="inline-block px-6 py-2 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition">Contact Support</a>
    </main>
  );
}
