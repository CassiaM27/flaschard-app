import React, { useEffect, useState } from "react";
import { readDeck, readCard } from "../utils/api";
import { useParams, Link } from 'react-router-dom';

export const EditCard = () => {
    
  const {cardId, deckId} = useParams();
  const [deck, setDeck] = useState({});

  const [formData, setFormData] = useState({});
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted:", formData);
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
          Cancel
        </Link>
        <Link
          to={`/decks/:deckId`}
          type="button"
          className="btn btn-primary mr-2"
        >
          Submit
        </Link>
      </form>
    </div>
  </div>
  )
}

export default EditCard;