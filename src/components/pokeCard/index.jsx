import { useEffect, useState } from "react";
import { Link } from "react-router";
import usePokemon from "../../hook/usePokemon";

import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    if (!pokemon || !pokemon.name || !pokemon.name.french) {
        return null;
    }
    const {pokemonData, loading} = usePokemon(pokemon.url);
    console.log('pokeData',pokemonData);

    if (loading) {
        return <p>Chargement du Pokémon...</p>;
    }


    return (
        <Link to={`/pokemonDetails/${pokemon.id}`}>
        <div className="poke-card">
            <div className={`poke-card-header poke-type-${pokemonData.types?.[0]?.type?.name}`}>
                <PokeTitle name={pokemon.name.french} />
            </div>
            <div className="poke-image-background">
                <PokeImage imageUrl={pokemon.image} />
            </div>
            <div>
                {pokemon.base && Object.entries(pokemon.base).map(([statName, value]) => (
                    <div className="poke-stat-row" key={statName}>
                    <span className={`poke-type-font poke-type-${statName}`}>{statName}</span>
                    <span className="poke-type-font poke-stat-value">{value}</span>
                    </div>
                ))}   

            </div>
        </div>
        </Link>
    );
}

export default PokeCard;