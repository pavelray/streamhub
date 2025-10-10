const WatchPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <div className="min-h-screen pt-12">
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="section-title text-4xl lg:text-5xl mb-12">
            Watch Movie ID: {slug}
          </h2>
          {/* Video Player Placeholder */}
          <div className="w-full aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-white text-xl">
              Video Player for Movie ID: {slug}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WatchPage;
