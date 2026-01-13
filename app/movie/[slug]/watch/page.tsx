const WatchPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const movieId = slugParts[slugParts.length - 1];
  // Here you would typically fetch the movie streaming URL or data using the movieId
  // For this example, we'll just display the movieId

  return (
    <div className="min-h-screen mt-24">
      <div className="container mx-auto">
        <section className="py-16 px-6 lg:px-8">
          <h2 className="section-title text-4xl lg:text-5xl mb-12">
            Watch Movie ID: {movieId}
          </h2>
          {/* Video Player Placeholder */}
          <div className="w-full aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-white text-xl">
              Video Player for Movie ID: {movieId}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WatchPage;
