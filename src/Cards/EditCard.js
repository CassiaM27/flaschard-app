import React, { useEffect, useState } from "react";
import { readDeck, readCard } from "../utils/api";
import { useParams, Link } from 'react-router-dom';
import CardForm from "./CardForm";

export const EditCard = () => {
    
  const {cardId, deckId} = useParams();
  const [deck, setDeck] = useState({});

  const [formData, setFormData] = useState({});

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
    async function loadCard() {
      try{
        const pullCard = await readCard(cardId, deckAbort.signal);
        setFormData(pullCard);
      }
      catch (error) {
        console.log("error editing card");
      }
      return () => {
        deckAbort.abort();
      }
    }
    loadDeck();
    loadCard();
  }, [])

  return (
    <div>
    <nav className="mt-5 pt-2 pl-3 col-12 bg-light">
      <div className="row">
        <Link to={'/'}>Home</Link>
        <p>&nbsp;/&nbsp;</p>
        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        <p>&nbsp;/ Edit Card {cardId}</p>
      </div>
    </nav>
    <h1 className="pt-2 col-12">Edit Card</h1>
    <div className="pt-2 col-12">
      <CardForm
        initialFormState={formData}
        deckId={deckId}
      />
    </div>
  </div>
  )
}

export default EditCard;