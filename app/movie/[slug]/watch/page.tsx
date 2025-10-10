const WatchPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return <div>This is watch page {slug}</div>;
};

export default WatchPage;
