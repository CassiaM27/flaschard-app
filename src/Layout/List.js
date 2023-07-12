import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { listDecks } from "../utils/api";

import ListView from "../Decks/ListView";

export const List = () => {

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
  
  const allDecks = decks.map((deck) => (
    <ListView key={deck.id} deckId={deck.id} submitted={setSubmitted} />
  ));

  return (
    <article className="col-12 py-1">
      <Link
        to={`/decks/new`}
        type="button"
        className="btn btn-secondary mx-2 px-3"
      >
        + Create
      </Link>
      <ul className="list-group">{allDecks}</ul>
    </article>
  )
};

export default List;