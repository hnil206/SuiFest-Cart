import type { Metadata } from 'next';

type Props = {
  params: Promise<{
    image: string;
  }>;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { image: imageName } = await params;

  return {
    title: `Suicard - ${imageName}`,
    twitter: {
      card: 'summary_large_image',
      site: '@SuiFest',
      creator: '@SuiFest',
      title: `Suicard - ${imageName}`,
      images: [`${baseUrl}/uploads/${imageName}.png`],
    },
    openGraph: {
      title: `Suicard - ${imageName}`,
      images: [`${baseUrl}/uploads/${imageName}.png`],
    },
  };
}

// ✅ Async component (Next.js 15+)
export default async function SuicardImagePage({ params }: Props) {
  const { image: imageName } = await params;

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>{imageName}</h1>
      <img src={`${baseUrl}/uploads/${imageName}.png`} alt={imageName} style={{ maxWidth: '100%', height: 'auto' }} />
    </main>
  );
}
