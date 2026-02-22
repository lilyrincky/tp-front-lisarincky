import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import SearchBar from "../SearchBar.jsx";
import './index.css';

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); //nouveau
    const [customPokemons, setCustomPokemons] = useState([]); //nouveau
    const [newPokemonName, setPokemonName] = useState(""); //nouveau
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [newPokemonType, setPokemonType] = useState("");
    const [newPokemonHP, setPokemonHP] = useState(0);
    const [newPokemonAttack, setPokemonAttack] = useState(0);
    const [newPokemonDefense, setPokemonDefense] = useState(0);
    const [newPokemonSpecialAttack, setPokemonSpecialAttack] = useState(0);
    const [newPokemonSpecialDefense, setPokemonSpecialDefense] = useState(0);
    const [newPokemonSpeed, setPokemonSpeed] = useState(0);
    const [newPokemonImage, setPokemonImage] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/pokemons?page=${page+1}`/*"api/pokemons"/*`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`*/)/*modifié*/
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [page,isSearching]);

    const handleSearch = async (e) => {
        e.preventDefault(); 
        if (!searchTerm) return;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/pokemons/search?name=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) throw new Error("Pokémon non trouvé");
            const data = await res.json();
            setPokemons([data]); 
            setIsSearching(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert(err.message);
            setLoading(false);
        }
    };

    const resetSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
        setPage(0);
    };

    const handleAddPokemon = async () => {
        if (!newPokemonName) return;
        const parsedTypes = newPokemonType
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);
        const newPokemon = {
            name: { french: newPokemonName },
            type: newPokemonType.length ? newPokemonType : ["Normal"],
            base: {
                HP: Number(newPokemonHP) || 1,
                Attack: Number(newPokemonAttack) || 1,
                Defense: Number(newPokemonDefense) || 1,
                SpecialAttack: Number(newPokemonSpecialAttack) || 1,
                SpecialDefense: Number(newPokemonSpecialDefense) || 1,
                Speed: Number(newPokemonSpeed) || 1
            },
            image: newPokemonImage || "http://localhost:3000/assets/pokemons/default.png"
        };
        try {
            const res = await fetch('http://localhost:3000/pokemons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPokemon)
            });
            if (!res.ok) {
                console.log("Données envoyées :", newPokemon);
                throw new Error("400 Bad Request");
            }
            const savedPokemon = await res.json();
            setPokemons((prev) => [savedPokemon, ...prev]);
            setPokemonName("");
            setPokemonType([]);
            setPokemonHP(0);
            setPokemonAttack(0);
            setPokemonDefense(0);
            setPokemonSpecialAttack(0);
            setPokemonSpecialDefense(0);
            setPokemonSpeed(0);
            setPokemonImage("");
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la création du Pokémon');
        }
    };

    if (loading) {
        return <p>Chargement...</p>
    }

    return (
        <>
        <div  className="poke-list-container">
            <h2>Liste des Pokémon</h2>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={handleSearch}
                placeholder="Rechercher un Pokémon par nom"
            />
            {isSearching && (
                <button onClick={resetSearch}>Réinitialiser la recherche</button>
            )}
            <ul className="poke-list">
                {pokemons.map((pokemon, index) => (
                    <PokeCard key={index} pokemon={pokemon} />
                ))}
            </ul>
        </div>
        <div className="Ajouter">
            <h3>Ajouter un Pokémon</h3>
            <div>Nom : 
            <input
                type="text"
                placeholder="Nom du Pokémon"
                value={newPokemonName}
                onChange={(e) => setPokemonName(e.target.value)}
            />
            </div><div>Type: 
            <input
                type="text"
                placeholder="Types"
                value={newPokemonType}
                onChange={(e) => setPokemonType(e.target.value)}
            />
            </div><div>HP : <input type="number" placeholder="HP" value={newPokemonHP} onChange={(e) => setPokemonHP(Number(e.target.value))} />
            </div><div>Attack : <input type="number" placeholder="Attack" value={newPokemonAttack} onChange={(e) => setPokemonAttack(Number(e.target.value))} />
            </div><div>Defense : <input type="number" placeholder="Defense" value={newPokemonDefense} onChange={(e) => setPokemonDefense(Number(e.target.value))} />
            </div><div>Special Attack : <input type="number" placeholder="Special Attack" value={newPokemonSpecialAttack} onChange={(e) => setPokemonSpecialAttack(Number(e.target.value))} />
            </div><div>Special Defense : <input type="number" placeholder="Special Defense" value={newPokemonSpecialDefense} onChange={(e) => setPokemonSpecialDefense(Number(e.target.value))} />
            </div><div>Speed : <input type="number" placeholder="Speed" value={newPokemonSpeed} onChange={(e) => setPokemonSpeed(Number(e.target.value))} />
            </div><div>URL de l'image : <input
                type="text"
                placeholder="URL de l'image"
                value={newPokemonImage}
                onChange={(e) => setPokemonImage(e.target.value)}
            /></div>
            <button onClick={handleAddPokemon}>
                Ajouter
            </button>
        </div>
        <br/>
        <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                Précédent
            </button>
            <button onClick={() => setPage(page + 1)}>
                Suivant
            </button>
        </div>
        </>
    );
};

export default PokeList;