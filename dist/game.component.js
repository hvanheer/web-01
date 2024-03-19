import { parseUrl } from "../../../../init/front-end/src/app/scripts/utils";
import { Component } from "../../../../init/front-end/src/app/scripts/component";
import { CardComponent } from "./card/card.component";
import template from "./game.component.html";
import "./game.component.css";
let environment = {
  api: {
    host: "http://localhost:8081"
  }
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
      this.fetchConfig().then(config => {
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
      }).catch(error => {
        reject(error); // Reject the promise if there's an error fetching the config
      });
    });
  }
  start() {
    this._startTime = Date.now();
    let seconds = 0;
    document.querySelector("nav .navbar-title").textContent = `Player:   ${this._name}   Elapsed time:   ${seconds++}`;
    this._timer = setInterval(() => {
      document.querySelector("nav .navbar-title").textContent = `Player:   ${this._name}  Elapsed time:   ${seconds++}`;
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
    let timeElapsedInSeconds = Math.floor((Date.now() - this._startTime) / 1000);
    clearInterval(this._timer);
    setTimeout(() => {
      let scorePage = "./#score";
      window.location = `${scorePage}?name=${this._name}&size=${this._size}&time=${timeElapsedInSeconds}`;
    }, 750);
  }
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
  }
}