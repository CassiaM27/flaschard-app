import React, { useEffect, useState } from "react";
import { readDeck } from "../utils/api";
import { useParams, Link } from 'react-router-dom';
import CardForm from "./CardForm";

export const AddCard = () => {
  const {deckId} = useParams();
  const [deck, setDeck] = useState({});
  
  const initialFormState = {
    front: "",
    back: "",
  };

  useEffect(() => {
    const deckAbort = new AbortController();
  
    async function loadDeck() {
      try{
        const pullDeck = await readDeck(deckId, deckAbort.signal);
        setDeck(pullDeck);
      }
      catch (error) {
        console.log("error loading deck");
      }
      return () => {
        deckAbort.abort();
      }
    }
    loadDeck();
  }, [deckId])

  return (
    <div>
    <nav className="mt-5 pt-2 pl-3 col-12 bg-light">
      <div className="row">
        <Link to={'/'}>Home</Link>
        <p>&nbsp;/&nbsp;</p>
        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        <p>&nbsp;/ Add Card</p>
      </div>
    </nav>
    <div className="row">
      <h1 className="pt-2 text-left">{deck.name}:</h1>
      <h1 className="pt-2 text-left">&nbsp;Add Card</h1>
    </div>
    <div className="pt-2 col-12">
      <CardForm 
        initialFormState={initialFormState}
        deckId={deck.id}
      />
    </div>
  </div>
  )
}

export default AddCard;