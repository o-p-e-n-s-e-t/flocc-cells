// UI functions

const { Panel, Button } = require('flocc-ui');

let panel;
let reset;
let go;

let _hasInit = false;

exports.hasInit = function hasInit() {
  return _hasInit;
}

exports.init = function init(setup) {
  reset = new Button({
    label: "Reset",
    onClick() {
      setup();
      pause();
    }
  });
  go = new Button({
    label: () => (environment.get("paused") ? "Go" : "Pause"),
    onClick() {
      environment.get("paused") ? run(true) : pause();
    }
  });
  panel = new Panel(environment, [reset, go]);
  _hasInit = true;
}

exports.update = function update(setup) {
  [panel, reset, go].forEach((c) => (c.environment = environment));
  reset.onClick = () => {
    setup();
    pause();
  };
  go.onClick = () => {
    environment.get("paused") ? run(true) : pause();
  };
}

function pause() {
  cancelAnimationFrame(window.animationID);
  environment.renderers.forEach((r) => r.render());
  environment.set("paused", true);
}

function run(keepRunning = false) {
  if (keepRunning) environment.set("paused", false);
  environment.tick({ randomizeOrder: true });
  if (environment.get("paused")) return;
  window.animationID = requestAnimationFrame(run);
}