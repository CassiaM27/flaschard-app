import React, { useState } from "react";
import { createDeck } from "../utils/api";
import { Link, useHistory } from 'react-router-dom';

export const NewDeck = () => {

  const history = useHistory();
  const initialFormState = {
    name: "",
    description: "",
  };
  const [formData, setFormData] = useState({...initialFormState});
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const deckAbort = new AbortController();
    async function makeDeck() {
      try{
        const saveDeck = await createDeck(formData, deckAbort.signal);
        history.push(`/decks/${saveDeck.id}`)
      }
      catch (error) {
        console.log("error creating deck");
      }
      return () => {
        deckAbort.abort();
      }
    }
    makeDeck();
    console.log("Submitted:", formData);
  };

  return (
    <div>
      <nav className="mt-5 pt-2 pl-3 col-12 bg-light">
        <div className="row">
          <Link to={'/'}>Home&nbsp;</Link>
          <p>/ Create Deck</p>
        </div>
      </nav>
      <h1 className="pt-2 col-12">Create Deck</h1>
      <div className="pt-2 col-12">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="mb-3">Name</label>
          <br />
          <input
            className="px-2"
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required={true}
          />
          <br />
          <label htmlFor="description" className="my-2">Description</label>
          <br />
          <textarea
            className="px-2"
            id="description"
            type="textarea"
            name="description"
            onChange={handleChange}
            value={formData.description}
            required={true}
            rows={5}
            cols={100}
          />
          <br />
          <Link
            to={`/`}
            type="button"
            className="btn btn-secondary mr-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary mr-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewDeck;