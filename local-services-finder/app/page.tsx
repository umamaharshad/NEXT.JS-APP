import NearbyProviders from './components/NearbyProviders';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4">
      <section className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-3xl font-bold">Find trusted local services near you</h1>
        <p className="mt-2 max-w-3xl text-white/90">
          Plumbers, electricians, tutors, tailors and more — verified local help with ratings
          and direct call/WhatsApp.
        </p>
      </section>

      <NearbyProviders />
    </main>
  );
}
