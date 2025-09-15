const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <div>Movie Details Page for movie ID: {slug}</div>;
};

export default MovieDetailsPage;
