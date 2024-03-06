// TODO #import-router: use ES named imports to import the router
import { Router } from "./app/scripts/router.js";
// TODO #import-components: use ES named imports to import WelcomeComponent, GameComponent a ScoreComponent
import { WelcomeComponent } from "./app/scripts/welcome.js";
import { GameComponent } from "./app/scripts/game.js";
import { ScoreComponent } from "./app/scripts/score.js";
// TODO #import-css: use ES side-effect imports to import styles/style.css
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import "./app/styles/style.css";
const outlet = document.querySelector("#content-outlet");
const router = new Router(outlet);
router
  .register("", {
    component: WelcomeComponent,
    // TODO #import-html: remove the templateUrl property.
    templateUrl: "/src/app/views/welcome.html",
  })
  .register("welcome", {
    component: WelcomeComponent,
    // TODO #import-html: remove the templateUrl property.
    templateUrl: "/src/app/views/welcome.html",
  })
  .register("game", {
    component: GameComponent,
    // TODO #import-html: remove the templateUrl property.
    templateUrl: "/src/app/views/game.html",
  })
  .register("score", {
    component: ScoreComponent,
    // TODO #import-html: remove the templateUrl property.
    templateUrl: "/src/app/views/score.html",
  });
