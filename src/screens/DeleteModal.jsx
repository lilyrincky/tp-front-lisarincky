function DeleteModal({onConfirm,onCancel}){
    return(
        <div className="modal">
      <p>Souhaitez-vous vraiment supprimer ce Pokémon ?</p>
      <button onClick={onConfirm}>Oui</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
    )
}