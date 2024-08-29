"use client";
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { BorderBeam } from "@/components/ui/border-beam";

interface Ability {
  name: string;
  description: string;
  image: string;
}

interface Champion {
  id: string;
  name: string;
  title: string;
  lore: string;
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: string;
  loadingImage: string;
  abilities: {
    passive: Ability;
    Q: Ability;
    W: Ability;
    E: Ability;
    R: Ability;
  };
  recommendedItems: Array<{ id: string; name: string; image: string }>;
}

interface ChampionListItem {
  id: string;
  name: string;
  image: string;
}

const ChampionSearch: React.FC = () => {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [query, setQuery] = useState('');
  const [allChampions, setAllChampions] = useState<ChampionListItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchAllChampions();
  }, []);

  const fetchAllChampions = async () => {
    try {
      const response = await fetch('api/champions');
      if (!response.ok) throw new Error('Failed to fetch champions');
      const data: ChampionListItem[] = await response.json();
      setAllChampions(data);
    } catch (err) {
      console.error('Error fetching all champions:', err);
    }
  };

  const fetchChampionDetails = async (championName: string) => {
    try {
      const response = await fetch(`api/champion/${championName}`);
      if (!response.ok) throw new Error('Champion not found');
      const data: Champion = await response.json();
      setSelectedChampion(data);
      setQuery('');
      setShowResults(false);
    } catch (err) {
      console.error('Error fetching champion details:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredChampions.length > 0) {
      fetchChampionDetails(filteredChampions[0].name);
    }
  };

  const filteredChampions = query === ''
    ? []
    : allChampions.filter((champion) =>
        champion.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <section className='container mx-auto'>
    <div className="p-4 text-white">
      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 pl-10 bg-neutral-800 bg-opacity-80 text-white rounded focus:outline-none"
          placeholder="Search champions..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoComplete="off"
        />
      <BorderBeam size={70} duration={12} delay={9} colorFrom='#ffaa40' colorTo='#FFD49F' className='opacity-30'/>
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {showResults && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mb-8">
          {filteredChampions.map((champion) => (
            <div
              key={champion.id}
              className="text-center cursor-pointer"
              onClick={() => fetchChampionDetails(champion.name)}
            >
              <img src={champion.image} alt={champion.name} className="w-16 h-16 mx-auto rounded-full" />
              <p className="mt-2 text-sm">{champion.name}</p>
            </div>
          ))}
        </div>
      )}

      {selectedChampion && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex justify-center">
            <img src={selectedChampion.loadingImage} alt={`${selectedChampion.name} loading screen`} className="w-3/4 h-auto" />
          </div>
          <div className="col-span-2">
            <h2 className="text-4xl font-bold mb-2">{selectedChampion.name}</h2>
            <h3 className="text-2xl text-neutral-400 mb-4">{selectedChampion.title}</h3>
            <p className="text-lg mb-4">Role: <span className='text-neutral-400'>{selectedChampion.tags.join(', ')}</span></p>
            <p className="text-lg mb-8 text-neutral-400">{selectedChampion.lore}</p>

            <div className="grid grid-cols-5 gap-4 mb-8 pt-8">
              {['P', 'Q', 'W', 'E', 'R'].map((key) => {
                const ability = key === 'P' ? selectedChampion.abilities.passive : selectedChampion.abilities[key as keyof typeof selectedChampion.abilities];
                return (
                  <div key={key} className="text-center">
                    <div className="relative inline-block">
                      <img src={ability.image} alt={ability.name} className="w-16 h-16 mx-auto rounded-full" />
                      <span className="absolute bottom-0 right-0 bg-neutral-900 border border-neutral-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {key}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{ability.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    </section>
  );
};

export default ChampionSearch;