import { parseUrl } from "./utils";
import { Component } from "./component";
import template from "../views/game.html";

import back from "/src/assets/cards/back.png";
import card0 from "/src/assets/cards/card-0.png";
import card1 from "/src/assets/cards/card-1.png";
import card2 from "/src/assets/cards/card-2.png";
import card3 from "/src/assets/cards/card-3.png";
import card4 from "/src/assets/cards/card-4.png";
import card5 from "/src/assets/cards/card-5.png";
import card6 from "/src/assets/cards/card-6.png";
import card7 from "/src/assets/cards/card-7.png";
import card8 from "/src/assets/cards/card-8.png";
import card9 from "/src/assets/cards/card-9.png";

let CARD_TEMPLATE = `
  <main class="card-cmp">
    <div class="card-wrapper">
      <img class="card front-face" alt="card" />
      <img class="card back-face" alt="card" />
    </div>
  </main>`;

let environment = {
  api: {
    host: "http://localhost:8081",
  },
};

export class GameComponent extends Component {
  constructor() {
    super(template);
    let params = parseUrl();

    this._name = params.name;
    this._size = parseInt(params.size) || 9;
    this._flippedCard = null;
    this._matchedPairs = 0;
    this.template = template;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.fetchConfig()
          .then(config => {
            this._config = config;
            this._boardElement = document.querySelector(".cards");
            this._cards = this._config.ids.map(id => new CardComponent(id));

            this._cards.forEach(card => {
              this._boardElement.appendChild(card.getElement());

              card.getElement().addEventListener("click", () => {
                this._flipCard(card);
              });
            });

            this.start();
            resolve(); // Resolve the promise when initialization is complete
          })
          .catch(error => {
            reject(error); // Reject the promise if there's an error fetching the config
          });
    });
  }

  start() {
    this._startTime = Date.now();
    let seconds = 0;
    document.querySelector("nav .navbar-title").textContent =
        `Player:   ${this._name}   Elapsed time:   ${seconds++}`;

    this._timer = setInterval(() => {
      document.querySelector("nav .navbar-title").textContent =
          `Player:   ${this._name}  Elapsed time:   ${seconds++}`;
    }, 1000);
  }

  async fetchConfig() {
    try {
      const response = await fetch(`${environment.api.host}/board?size=${this._size}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  }

  goToScore() {
    let timeElapsedInSeconds = Math.floor(
        (Date.now() - this._startTime) / 1000
    );
    clearInterval(this._timer);

    setTimeout(() => {
      let scorePage = "./#score";
      window.location =
          `${scorePage}?name=${this._name}&size=${this._size}&time=${timeElapsedInSeconds}`;
    }, 750);
  };

  _flipCard(card) {
    if (this._busy) {
      return;
    }

    if (card.flipped) {
      return;
    }

    card.flip();

    if (!this._flippedCard) {
      this._flippedCard = card;
    } else {
      if (card.equals(this._flippedCard)) {
        this._flippedCard.matched = true;
        card.matched = true;
        this._matchedPairs += 1;

        this._flippedCard = null;

        if (this._matchedPairs === this._size) {
          this.goToScore();
        }
      } else {
        this._busy = true;

        setTimeout(() => {
          this._flippedCard.flip();
          card.flip();
          this._busy = false;
          this._flippedCard = null;
        }, 500);
      }
    }
  };
}

let CARDS_IMAGE = [
  back,
  card0,
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card8,
  card9,
];

class CardComponent extends Component {
  constructor(id) {
    super(CARD_TEMPLATE);
    this._flipped = false;
    this.template = CARD_TEMPLATE;
    this._elt = document.createElement("div");
    this._elt.innerHTML = this.template;
    this._elt = this._elt.firstElementChild;
    this._id = id;
    this._imageElt = this.getElement().querySelector(".card-wrapper");
    this._imageElt.querySelector("img.front-face").src =
        CARDS_IMAGE[this._id + 1];
    this._imageElt.querySelector("img.back-face").src = CARDS_IMAGE[0];
  }

  getElement() {
    return this._elt;
  };

  flip() {
    this._imageElt.classList.toggle("flip");
    this._flipped = !this._flipped;
  };

  equals(card) {
    return card._id === this._id;
  };

  get flipped() {
    return this._flipped;
  }
}
