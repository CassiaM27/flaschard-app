import React, { useState, useEffect } from "react";
import { createCard } from "../utils/api";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export const CardForm = ({initialFormState, deckId}) => {
    
    const [formData, setFormData] = useState({});
    const {cardId} = useParams();

    const handleChange = ({ target }) => {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  
    useEffect(() => {
      setFormData(initialFormState)
    })

  const handleSubmit = (event) => {
      event.preventDefault();
      const cardAbort = new AbortController();
  
      async function makeCard() {
        try{
          await createCard(deckId, formData, cardAbort.signal);
        }
        catch (error) {
          console.log("error creating card");
        }
        return () => {
          cardAbort.abort();
        }
      }
      makeCard();
      setFormData({initialFormState});
      console.log("Submitted:", formData);
    };

    function renderSaveOrSubmit() {
      if(cardId) {
        return (
          <Link
            to={`/decks/:deckId`}
            type="button"
            className="btn btn-primary mr-2"
          >
            Submit
          </Link>
        )
      } else {
        return (
          <button type="submit" onClick={handleSubmit} className="btn btn-primary mr-2">
            Save
          </button>
        )
      }
    }

  return (
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
      <label htmlFor="back" className="my-2">
        Back
      </label>
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
      {renderSaveOrSubmit()}
    </form>
  )
}

export default CardForm;