import { parseUrl } from "../../../../init/front-end/src/app/scripts/utils";
import { Component } from "../../../../init/front-end/src/app/scripts/component";
import template from "./score.component.html";
import "./score.component.css";

// TODO #import-html: use ES default imports to import game.component.html as template

// TODO #class: use the ES6 class keyword
/* class ScoreComponent constructor */
export class ScoreComponent extends Component {
  constructor() {
    // TODO #extends: call super(template)
    super(template);
    var params = parseUrl();
    // TODO #import-html: assign template to this.template
    this.name = params.name;
    this.size = parseInt(params.size);
    this.time = parseInt(params.time);
    this.template = template;
  }

  // TODO #class: turn function into a method of ScoreComponent
  /* method ScoreComponent.init */
  init() {
    document.getElementById("name").innerText = this.name;
    document.getElementById("size").innerText = this.size;
    document.getElementById("time").innerText = this.time;
  }
}