import { NextResponse } from 'next/server';

const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';
const DDRAGON_VERSION = '14.17.1';

export async function GET() {
  try {
    const response = await fetch(`${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/data/en_US/champion.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch champions');
    }

    const data = await response.json();
    const champions = Object.values(data.data).map((champion: any) => ({
      id: champion.id,
      name: champion.name,
      image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/champion/${champion.image.full}`,
      loadingImage: `${DDRAGON_BASE_URL}/img/champion/loading/${champion.id}_0.jpg`,
    }));

    return NextResponse.json(champions);
  } catch (error) {
    console.error('Error fetching all champions:', error);
    return NextResponse.json({ error: 'Failed to fetch champions' }, { status: 500 });
  }
}