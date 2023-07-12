import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck } from "../utils/api";
import { useParams, useHistory, useRouteMatch, Link } from 'react-router-dom';

export const EditDeck = () => {
    
  const history = useHistory();
  const url = useRouteMatch();
  const {deckId} = useParams();

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
        setFormData(pullDeck);
      }
      catch (error) {
        console.log("error editing deck");
      }
      return () => {
        deckAbort.abort();
      }
    }
    loadDeck();
  }, [])

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this deck? You will not be able to recover it.");
    if (confirm) {
      await deleteDeck(deckId);
      history.push("/");
    }
  };

  return (
    <div>
    <nav className="mt-5 pt-2 pl-3 col-12 bg-light">
      <div className="row">
        <Link to={'/'}>Home&nbsp;</Link>
        <p>/ Edit Deck</p>
      </div>
    </nav>
    <h1 className="pt-2 col-12">Edit Deck</h1>
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
          cols={60}
        />
        <br />
        <Link
          to={`/`}
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
        <Link
          to={url}
          className="btn btn-danger"
          onClick={handleDelete}>
          Delete Deck
        </Link>
      </form>
    </div>
  </div>
  )
}


export default EditDeck;