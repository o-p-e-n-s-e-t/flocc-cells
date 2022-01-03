const { WIDTH, HEIGHT, SCALE } = require('./constants');
const { CanvasRenderer, LineChartRenderer } = require('flocc');

exports.viz = function viz() {
  window.renderer = new CanvasRenderer(environment, {
    background: "blue",
    scale: SCALE,
    width: WIDTH * SCALE,
    height: HEIGHT * SCALE,
  });
  renderer.mount("#container");

  window.growthCurve = new LineChartRenderer(environment, {
    autoScale: true,
    background: '#fff',
    width: 300,
    height: 200,
  });
  growthCurve.mount("#growthCurve");
  growthCurve.metric("population", {
    fn: () => environment.agents.length,
  });
}
