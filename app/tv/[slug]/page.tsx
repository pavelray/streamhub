import React from 'react'

const TvDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return (
    <div>
      This is TV show page {slug}
    </div>
  )
}

export default TvDetailsPage
