import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom"
import { listDecks, deleteDeck } from "../utils/api";

export const List = () => {

  const history = useHistory();
  const [decks, setDecks] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function submit () {
    if(submitted === true) {
      setSubmitted(false)
    }
  }

  useEffect(() => {
    const deckAbort = new AbortController();

    async function loadDecks() {
      try{
        const pullDeck = await listDecks(deckAbort.signal);
        setDecks(pullDeck);
      }
      catch (error) {
        console.log("error creating deck list");
        }
      return () => {
        deckAbort.abort();
      }
    }
    loadDecks();
    submit();
  }, [submitted])
  
  const handleDelete = async (deck) => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
      await deleteDeck(deck.id);
      submitted(deck)
    }
    //window.location.reload(true) // <-- not a good way to do this, but it works
  };

  const allDecks = decks.map((deck) => {
    return (
      <li key={deck.id} className="list-group-item col-12 p-4 border m-2">
        <h3>{deck.name}
          <small className="float-right">{deck.cards.length} cards</small>
        </h3>
        <p>{deck.description}</p>
        <div className="d-grid gap-2">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => history.push(`/decks/${deck.id}`)}
          >
            <span className="oi oi-eye mx-1"></span>
            View
          </button>
          <Link
            to={`/decks/${deck.id}/study`}
            type="button"
            className="btn btn-primary mr-2"
          >
            <span className="oi oi-book"></span>
            &nbsp;Study
          </Link>
          <button type="button" onClick={() => handleDelete(deck)} className="btn btn-danger float-right">
            <span className="oi oi-trash"></span>
          </button>
        </div>
      </li>
    );
  });

  return (
    <article className="col-12 py-1">
      
      <Link
        to={`/decks/new`}
        type="button"
        className="btn btn-secondary mx-2 px-3"
      >
        <span className="oi oi-plus"></span>
        &nbsp;Create
      </Link>
      <ul className="list-group">{allDecks}</ul>
    </article>
  )
};

export default List;