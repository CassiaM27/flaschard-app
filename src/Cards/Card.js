import React, { useState } from "react";
import { deleteCard } from "../utils/api";
import { useHistory, Link } from 'react-router-dom';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

export const Card = (({cardInfo, cardId}) => {
  
  const [card, setCard] = useState({});
  const history = useHistory();
  const {deckId} = useParams();

  useEffect(() => {
    setCard(cardInfo)
  }, [cardInfo])

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
        await deleteCard(cardId);
        history.push("/");
    }
  };
  
  return (
    <div className="border col-12">
      <div className="row">
        <p className="col-6 my-3">{card.front}</p>
        <p className="col-6 my-3">{card.back}</p>
      </div>
      <p>{card.description}</p>
      <div className="d-grid gap-2">
        <Link
          to={`/decks/${deckId}/cards/${cardId}/edit`}
          type="button"
          className="btn btn-secondary m-2"
        >
          Edit
        </Link>
        <button type="button" onClick={handleDelete} className="btn btn-danger m-2 float-right">
          <span className="oi oi-trash"></span>
        </button>
      </div>
    </div>
  )
})

export default Card;