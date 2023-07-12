import React, { useState } from "react";
import { readDeck } from "../utils/api";
import { useHistory, Link } from 'react-router-dom';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

export const Study = (() => {
  
  const [deck, setDeck] = useState([]);
  const [cards, setCards] = useState([]);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const history = useHistory();
  const {deckId} = useParams();
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const cardAbort = new AbortController();

    async function loadDeck() {
      try{
        const pullDeck = await readDeck(deckId, cardAbort.signal);
        setDeck(pullDeck);
        setCards(pullDeck.cards)
      }
      catch (error) {
        console.log("error loading deck");
      }
      return () => {
        cardAbort.abort();
      }
    }

    loadDeck();
  }, [])

  const handleFlip = (event) => {
    event.preventDefault();
    setIsCardFlipped(!isCardFlipped);
  }

  const handleNext = (event) => {
    event.preventDefault();
    if(cardIndex === cards.length - 1) {
      const confirm = window.confirm("Restart cards? Click 'cancel' to return to the home page.");
      if (!confirm) {
        history.push("/");
      } else {
        setCardIndex(0);
        setIsCardFlipped(false);
      }
    } else {
      setCardIndex(cardIndex + 1);
      setIsCardFlipped(false);
    }
  }

  if(cards.length < 3){
    return (
      <div>
        <nav className="mb-2 pt-2 pl-3 col-12 bg-light">
          <div className="row">
            <Link to={'/'}>Home&nbsp;</Link>
            <Link to={`/decks/${deckId}`}>/ {deck.name}</Link>
            <p>&nbsp;/ Study</p>
          </div>
        </nav>
        <h1>Study: {deck.name}</h1>
        <h3>Not Enough Cards.</h3>
        <p>You need at least 3 cards to study.  There are {cards.length} cards in this deck.</p>
        <Link
          to={`/decks/${deckId}/cards/new`}
          type="button"
          className="btn btn-primary mr-2"
        >
          Add Cards
        </Link>
      </div>
    )
  } else {
    return (
      <div>
        <nav className="mb-2 pt-2 pl-3 col-12 bg-light">
          <div className="row">
            <Link to={'/'}>Home&nbsp;</Link>
            <p>&nbsp;/&nbsp;</p>
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            <p>&nbsp;/ Study</p>
          </div>
        </nav>
        <h1>Study: {deck.name}</h1>
        <div className="border">
          {/* 
            display card based on current cardIndex
            if isCardFlipped = true, display card.back and next button */
          }
          <h3 className="ml-2 mt-2">Card {cardIndex + 1} of {cards.length}</h3>
          { isCardFlipped ?
            <p className="ml-2 mt-2 mb-0">{cards[cardIndex].back}</p> :
            <p className="ml-2 mt-2 mb-0">{cards[cardIndex].front}</p>
          }
          <button type="button" onClick={handleFlip} className="btn btn-secondary ml-2 my-2">Flip</button>
          { isCardFlipped ? 
            <button type="button" onClick={handleNext} className="btn btn-primary m-2">Next</button> :
            null
          }
        </div>
      </div>
    )
  }
})

export default Study;