import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck } from "../utils/api";
import { useHistory, Link } from 'react-router-dom';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import Card from "../Cards/Card";

export const Deck = () => {
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const {deckId} = useParams();

  useEffect(() => {
    const deckAbort = new AbortController();

    async function loadDeck() {
      try{
        const pullDeck = await readDeck(deckId, deckAbort.signal);
        setDeck(pullDeck);
        setCards(pullDeck.cards)
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

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
        await deleteDeck(deckId);
        history.push("/");
    }
  };

  const cardsInDeck = cards.map((card) => (
    <Card key={card.id} deckId={deckId} cardId={card.id} cardInfo={card} />
  ));

  return (
    <article className="col-12 p-4 m-2">
      <nav className="mb-2 pt-2 pl-3 col-12 bg-light">
        <div className="row">
          <Link to={'/'}>Home&nbsp;</Link>
          <p>/ {deck.name}</p>
        </div>
      </nav>
      <h3 className="display-4 my-3 col-9">{deck.name}</h3>
      <p className="mb-3">{deck.description}</p>
      <div className="d-grid gap-2 col-12">
        <Link
          to={`/decks/${deckId}/edit`}
          type="button"
          className="btn btn-secondary mr-2"
        >
          Edit
        </Link>
        <Link
          to={`/decks/${deckId}/study`}
          type="button"
          className="btn btn-primary mr-2"
        >
          <span className="oi oi-book"></span>
          &nbsp;Study
        </Link>
        <Link
          to={`/decks/${deckId}/cards/new`}
          type="button"
          className="btn btn-primary"
        >
          <span className="oi oi-plus"></span>
          &nbsp;Add Cards
        </Link>
        <button type="button" onClick={handleDelete} className="btn btn-danger float-right mr-2">
          <span className="oi oi-trash"></span>
        </button>
      </div>
      <br />
      <ul className="list-group col-12">{cardsInDeck}</ul>
    </article>
  )
};

export default Deck;