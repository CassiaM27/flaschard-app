import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck } from "../utils/api";
import { Link } from 'react-router-dom';

export const ListView = ({deckId, submitted}) => {
  const [deck, setDeck] = useState([]);
  const [cardPull, setCardPull] = useState([]);

  useEffect(() => {
    const deckAbort = new AbortController();

    async function loadDeck() {
      try{
        const pullDeck = await readDeck(deckId, deckAbort.signal);
        setDeck(pullDeck);
        setCardPull(pullDeck.cards)
      }
      catch (error) {
        console.log("error creating deck list");
      }
      return () => {
        deckAbort.abort();
      }
    }
    loadDeck();
  }, [deckId])

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
      await deleteDeck(deckId);
      submitted(true)
    }
    //window.location.reload(true) // <-- not a good way to do this, but it works
  };

  return (
    <article className="col-12 p-4 border m-2">
      <div className="row">
        <h3 className="display-4 mb-4 col-9">{deck.name}</h3>
        <p className="col-3 my-3">{cardPull.length} Cards</p>
      </div>
      <p>{deck.description}</p>
      <div className="d-grid gap-2">
        <Link
          to={`/decks/${deckId}`}
          type="button"
          className="btn btn-secondary mr-2"
        >
          View
        </Link>
        <Link
          to={`/decks/${deckId}/study`}
          type="button"
          className="btn btn-primary mr-2"
        >
          Study
        </Link>
        <button type="button" onClick={handleDelete} className="btn btn-danger">
          Delete Deck
        </button>
      </div>
    </article>
  );
};

export default ListView;