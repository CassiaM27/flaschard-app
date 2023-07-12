import React, { useEffect, useState } from "react";
import { readDeck, createCard } from "../utils/api";
import { useParams, useHistory, Link } from 'react-router-dom';

export const AddCard = () => {
    
  const history = useHistory();
  const {cardId, deckId} = useParams();
  const [deck, setDeck] = useState({});
  
  const initialFormState = {
    front: "",
    back: "",
  };
  const [formData, setFormData] = useState({...initialFormState});

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const cardAbort = new AbortController();

    async function makeCard() {
      try{
        const saveCard = await createCard(deckId, formData, cardAbort.signal);
      }
      catch (error) {
        console.log("error creating card");
      }
      return () => {
        cardAbort.abort();
      }
    }
    makeCard();
    setFormData(initialFormState);
    console.log("Submitted:", formData);
  };

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
    <h1 className="pt-2 col-12">{deck.name}: Add Card</h1>
    <div className="pt-2 col-12">
      <form onSubmit={handleSubmit}>
        <label htmlFor="front" className="mb-3">Front</label>
        <br />
        <textarea
          className="px-2"
          id="front"
          type="text"
          name="front"
          onChange={handleChange}
          value={formData.front}
          required={true}
          rows={4}
          cols={60}
        />
        <br />
        <label htmlFor="back" className="my-2">Back</label>
        <br />
        <textarea
          className="px-2"
          id="back"
          type="textarea"
          name="back"
          onChange={handleChange}
          value={formData.back}
          required={true}
          rows={4}
          cols={60}
        />
        <br />
        <Link
          to={`/decks/:deckId`}
          type="button"
          className="btn btn-secondary mr-2"
        >
          Done
        </Link>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary mr-2">
          Save
        </button>
      </form>
    </div>
  </div>
  )
}

export default AddCard;