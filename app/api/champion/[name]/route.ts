import { NextResponse } from 'next/server';

const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';
const DDRAGON_VERSION = '14.17.1';

// Function to handle special cases and normalize champion names
const normalizeChampionName = (name: string): string => {
  const specialCases: { [key: string]: string } = {
    'Bel\'Veth': 'Belveth',
    'Cho\'Gath': 'Chogath',
    'Kai\'Sa': 'Kaisa',
    'Kha\'Zix': 'Khazix',
    'Kog\'Maw': 'KogMaw',
    'Rek\'Sai': 'RekSai',
    'Vel\'Koz': 'Velkoz'
  };

  // Check if the name is a special case
  if (specialCases[name]) {
    return specialCases[name];
  }

  // Remove any non-alphanumeric characters and return
  return name.replace(/[^a-zA-Z0-9]/g, '');
};

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const championName = params.name;

  if (!championName || championName === 'null') {
    return NextResponse.json({ error: 'Invalid champion name' }, { status: 400 });
  }

  const normalizedChampionName = normalizeChampionName(championName);

  try {
    const response = await fetch(`${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/data/en_US/champion/${normalizedChampionName}.json`);
    
    if (!response.ok) {
      throw new Error('Champion not found');
    }

    const data = await response.json();
    const champion = data.data[normalizedChampionName];

    const championData = {
      name: champion.name,
      title: champion.title,
      lore: champion.lore,
      tags: champion.tags,
      info: champion.info,
      image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/champion/${champion.image.full}`,
      loadingImage: `${DDRAGON_BASE_URL}/img/champion/loading/${champion.id}_0.jpg`,
      abilities: {
        passive: {
          name: champion.passive.name,
          description: champion.passive.description,
          image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/passive/${champion.passive.image.full}`,
        },
        Q: {
          name: champion.spells[0].name,
          description: champion.spells[0].description,
          image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/spell/${champion.spells[0].image.full}`,
        },
        W: {
          name: champion.spells[1].name,
          description: champion.spells[1].description,
          image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/spell/${champion.spells[1].image.full}`,
        },
        E: {
          name: champion.spells[2].name,
          description: champion.spells[2].description,
          image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/spell/${champion.spells[2].image.full}`,
        },
        R: {
          name: champion.spells[3].name,
          description: champion.spells[3].description,
          image: `${DDRAGON_BASE_URL}/${DDRAGON_VERSION}/img/spell/${champion.spells[3].image.full}`,
        },
      },
    };

    return NextResponse.json(championData);
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return NextResponse.json({ error: 'Champion not found or error occurred' }, { status: 404 });
  }
}