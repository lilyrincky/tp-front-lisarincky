import {Link, useParams, useNavigate} from 'react-router';
import { useEffect, useState } from "react";

const PokemonDetails = () => { 
  const {id} = useParams(); 
  const navigate = useNavigate();
  const [editedPokemon, setEditedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pokemons/${id}`);
        if (!res.ok) throw new Error('Pokémon introuvable');
        const data = await res.json();
        setEditedPokemon(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
    fetchPokemon();
  }, [id]);

  if (!editedPokemon) return <p>Chargement...</p>;

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/pokemons/${editedPokemon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPokemon)
      });
      if (!res.ok) throw new Error('Erreur modification');
      const updated = await res.json();
      setEditedPokemon(updated);
      alert('Pokémon modifié !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr ?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3000/pokemons/${editedPokemon.id}`, { method: 'DELETE' });
      alert('Pokémon supprimé !');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h1>Détails du Pokémon {editedPokemon?.name?.french}</h1>
      <div className='details'>
        <p><strong>Nom :</strong> {editedPokemon?.name?.french}</p>
        <p><strong>Type :</strong> {editedPokemon?.type?.join(", ")}</p>
      </div>
      <div className='modif'>
      <h2>Modifier :</h2>
      <div>
        <label>Nom :</label>
        <input
          type="text"
          value={editedPokemon?.name?.french || ""}
          onChange={(e) =>
            setEditedPokemon({
              ...editedPokemon,
              name: { ...editedPokemon.name, french: e.target.value },
            })
          }
        />
      </div>

      <div>
        <label>HP :</label>
        <input
          type="number"
          value={editedPokemon?.base?.HP || 0}
          onChange={(e) =>
            setEditedPokemon({
              ...editedPokemon,
              base: { ...editedPokemon.base, HP: Number(e.target.value) },
            })
          }
        />
      </div>

      <button onClick={handleUpdate}>Modifier</button>
      <br/>
      <button onClick={handleDelete}>Supprimer</button>
      </div>
      <br/>
      <br/>

      <Link to="/">Retour à la liste des Pokémon</Link>
    </div>
  );
};

export default PokemonDetails;
