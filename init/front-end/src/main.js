import { Router } from "./app/scripts/router.js";
import { WelcomeComponent } from "../../../src/app/components/welcome/welcome.component.js";
import { GameComponent } from "../../../src/app/components/game/game.component.js";
import { ScoreComponent } from "../../../src/app/components/score/score.component.js";
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import "./app/styles/style.css";

import { NavbarComponent } from "./app/components/navbar/navbar.component";
customElements.define("my-navbar", NavbarComponent);

const outlet = document.querySelector("#content-outlet");
const router = new Router(outlet);
router
  .register("", {
    component: WelcomeComponent,
  })
  .register("welcome", {
    component: WelcomeComponent,
  })
  .register("game", {
    component: GameComponent,
  })
  .register("score", {
    component: ScoreComponent,
  });
