import React, { useState } from "react";
import { deleteCard, readCard } from "../utils/api";
import { useHistory, Link } from 'react-router-dom';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

export const Card = (({cardId}) => {
  
  const [cards, setCards] = useState([]);
  const history = useHistory();
  const {deckId} = useParams();

  useEffect(() => {
    const cardAbort = new AbortController();

    async function loadCards() {
      try{
        const pullCard = await readCard(cardId, cardAbort.signal);
        setCards(pullCard);
      }
      catch (error) {
        console.log("error creating card list");
      }
      return () => {
        cardAbort.abort();
      }
    }
    loadCards();
  }, [])

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
        await deleteCard(cardId);
        history.push("/");
    }
  };
  
  return (
    <div className="border col-10">
      <div className="row">
        <p className="col-6 my-3">{cards.front}</p>
        <p className="col-6 my-3">{cards.back}</p>
      </div>
      <p>{cards.description}</p>
      <div className="d-grid gap-2">
        <Link
          to={`/decks/${deckId}/cards/${cardId}/edit`}
          type="button"
          className="btn btn-secondary m-2"
        >
          Edit
        </Link>
        <button type="button" onClick={handleDelete} className="btn btn-danger m-2">
          Delete Card
        </button>
      </div>
    </div>
  )
})

export default Card;