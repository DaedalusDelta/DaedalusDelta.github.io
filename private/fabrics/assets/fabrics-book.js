(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const teal = "#136f73", orange = "#c1663d", gray = "#89938d", ink = "#233330";
  const fmt = (x, n = 3) => Number.isFinite(x) ? x.toFixed(n) : "undefined";
  const small = x => x.toExponential(1);
  const num = id => Number($(id).value);
  function out(id, value) { $(id + "-value").textContent = value; }
  function plot(id, bounds) {
    const canvas = $(id), ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.font = "15px system-ui";
    const [xmin, xmax, ymin, ymax] = bounds, pad = {l: 55, r: 25, t: 26, b: 35};
    const scale = Math.min((w - pad.l - pad.r) / (xmax - xmin), (h - pad.t - pad.b) / (ymax - ymin));
    const x0 = (w - (xmax - xmin) * scale) / 2, y0 = pad.t + (h - pad.t - pad.b - (ymax - ymin) * scale) / 2;
    const xy = (x, y) => [x0 + (x - xmin) * scale, y0 + (ymax - y) * scale];
    function line(points, color, width = 2, dash = []) {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
      points.forEach((p, i) => { const a = xy(p[0], p[1]); i ? ctx.lineTo(...a) : ctx.moveTo(...a); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    function circle(x, y, radius, fill, stroke, dash = []) {
      ctx.beginPath(); ctx.arc(...xy(x, y), radius * scale, 0, 2 * Math.PI);
      if (fill) {ctx.fillStyle = fill; ctx.fill();}
      if (stroke) {ctx.strokeStyle = stroke;ctx.lineWidth = 1.5;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
    }
    function label(text, x, y, color = ink) {ctx.fillStyle = color;ctx.fillText(text, x, y);}
    function arrow(x, y, dx, dy, color) {
      const a = xy(x, y), b = xy(x + dx, y + dy), angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
      if (Math.hypot(dx, dy) < 1e-10) return;
      ctx.strokeStyle = color;ctx.fillStyle = color;ctx.lineWidth = 3;
      ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
      ctx.beginPath();ctx.moveTo(...b);ctx.lineTo(b[0] - 10 * Math.cos(angle - .45), b[1] - 10 * Math.sin(angle - .45));
      ctx.lineTo(b[0] - 10 * Math.cos(angle + .45), b[1] - 10 * Math.sin(angle + .45));ctx.fill();
    }
    // Equal axis scales keep the plotted path geometry undistorted.
    if (xmin <= 0 && xmax >= 0) line([[0, ymin], [0, ymax]], "#e2e8e2", 1);
    if (ymin <= 0 && ymax >= 0) line([[xmin, 0], [xmax, 0]], "#e2e8e2", 1);
    label("x", xy(xmax, 0)[0] + 5, Math.max(22, Math.min(h - 8, xy(xmax, 0)[1] + 20)));
    label("y", Math.max(8, Math.min(w - 20, xy(0, ymax)[0] - 22)), xy(0, ymax)[1] + 5);
    return {ctx, line, circle, label, arrow, xy, scale, w, h};
  }
  function hd() {
    const p = num("hd-p"), speed = num("hd-speed"), factor = speed ** (p - 2);
    out("hd-speed", fmt(speed, 1));
    const chart = plot("hd-canvas", [-.2, 2, -.15, Math.max(1.1, factor + .1)]);
    const points = f => Array.from({length: 101}, (_, i) => {const x = i / 50;return [x, .25 * f * x * x];});
    chart.line(points(1), orange, 6, [9, 5]);chart.line(points(factor), teal, 2.5);
    chart.label("Orange: s = 1", 18, 20, orange);chart.label("Teal: s = " + fmt(speed, 1), 18, 42, teal);
    $("hd-readout").textContent = "At x = 2: orange y = 1.000; teal y = " + fmt(factor) +
      ". Path curvature factor s^(p−2) = " + fmt(factor) + ". " +
      (p === 2 ? "The speed cancels: both traces share the same geometry." : "The generator's path depends on starting speed (unless the two speeds happen to match).");
  }
  function metric() {
    const m = num("metric-m"), e = num("metric-eps");
    out("metric-m", fmt(m, 1));out("metric-eps", fmt(e, 2));
    const chart = plot("metric-canvas", [-2.7, 2.7, -1.25, 1.25]);
    chart.circle(0, 0, 1, null, gray, [5, 5]);
    const points = Array.from({length: 401}, (_, i) => {
      const t = i / 400 * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
      const r = 1 / (Math.sqrt(c * c + m * s * s) + e * c);
      return [r * c, r * s];
    });
    chart.line(points, teal, 3);chart.label("Velocity space • E = ½", 18, 20, teal);
    $("metric-readout").textContent = "Rightward speed: " + fmt(1 / (1 + e)) +
      "; leftward speed magnitude: " + fmt(1 / (1 - e)) + "; vertical speed: " + fmt(1 / Math.sqrt(m)) +
      ". All lie on the same energy contour.";
  }
  function energy() {
    const k = num("energy-k"), m = num("energy-m");
    out("energy-k", fmt(k, 1));out("energy-m", fmt(m, 1));
    const raw = FabricsModels.parabolic(k, m, false), en = FabricsModels.parabolic(k, m, true);
    const chart = plot("energy-canvas", [-.15, 2.3, -.2, Math.max(1.1, 2.3 * k)]);
    chart.line(Array.from({length: 101}, (_, i) => {const x = i * .022;return [x, .5 * k * x * x];}), "#b4bdb6", 7);
    chart.line(raw.trace, orange, 3, [8, 5]);chart.line(en.trace, teal, 3);
    chart.circle(raw.final[0], raw.final[1], .035, orange);chart.circle(en.final[0], en.final[1], .04, teal);
    chart.label("Same elapsed time: 2 s", 18, 20);
    $("energy-readout").textContent = "Initial E = 0.500. Raw final E = " + fmt(raw.energy) +
      "; energized final E = " + fmt(en.energy, 6) + "; maximum energy drift = " + small(en.drift) +
      "; path residual = " + small(en.residual) + ". Energized final Euclidean speed = " + fmt(Math.hypot(en.final[2], en.final[3])) + ".";
  }
  function map() {
    const q = num("map-angle") * Math.PI / 180, v = num("map-speed"), x = Math.cos(q), y = Math.sin(q);
    out("map-angle", num("map-angle") + "°");out("map-speed", fmt(v, 1) + " rad/s");
    const chart = plot("map-canvas", [-2.4, 2.4, -1.5, 1.5]);
    chart.circle(0, 0, 1, null, gray);chart.line([[0, 0], [x, y]], gray, 1);
    chart.arrow(x, y, -.4 * v * y, .4 * v * x, teal);chart.arrow(x, y, -.25 * v * v * x, -.25 * v * v * y, orange);
    chart.circle(x, y, .045, ink);chart.label("Velocity", 18, 20, teal);chart.label("Curvature acceleration", 18, 42, orange);
    $("map-readout").textContent = "Task velocity = (" + fmt(-v * y) + ", " + fmt(v * x) +
      "); task acceleration = (" + fmt(-v * v * x) + ", " + fmt(-v * v * y) +
      "). Speed magnitude = " + fmt(v) + "; acceleration magnitude = " + fmt(v * v) + ".";
  }
  function design() {
    const eta = num("design-eta"), b = num("design-b");
    out("design-eta", fmt(eta, 1));out("design-b", fmt(b, 2));
    const r = FabricsModels.obstacle({eta, b, headon: $("design-start").value === "headon", barrier: $("design-barrier").checked});
    const xs = r.trace.map(x => x[0]), ys = r.trace.map(x => x[1]);
    const chart = plot("design-canvas", [Math.min(-1.7, ...xs) - .1, Math.max(1.7, ...xs) + .1, Math.min(-.95, ...ys) - .1, Math.max(1.25, ...ys) + .1]);
    chart.circle(0, 0, .8, null, "#b8c8be", [5, 5]);chart.circle(0, 0, .35, "#f5d9c9", orange);
    chart.line(r.trace, teal, 2.5);
    const start = r.trace[0], last = r.final;
    chart.circle(start[0], start[1], .035, gray);chart.circle(last[0], last[1], .045, teal);chart.circle(1.4, 0, .055, null, ink);
    chart.label("Start", ...chart.xy(start[0] - .12, start[1] + .14));chart.label("Goal", ...chart.xy(1.4, -.2));
    chart.label("Up to 12 s • equal axis scale", 18, 20);
    $("design-readout").textContent = "Simulated " + fmt(r.time, 2) + " s. Goal error " + fmt(r.goalError) +
      "; final speed " + fmt(r.speed, 4) + "; minimum sampled clearance " + fmt(r.minClearance, 4) +
      "; maximum energy-balance residual " + small(r.balance) + "." +
      (b === 0 ? " With b = 0, total energy is conserved; the convergence theorem does not apply." : "") +
      (r.error ? " Stopped: " + r.error : (r.goalError > .1 && r.speed < .005 ? " Nearly at rest away from the goal: a possible equilibrium." : ""));
  }
  function bind(ids, fn) { ids.forEach(id => $(id).addEventListener("input", fn));fn(); }
  bind(["hd-p", "hd-speed"], hd);bind(["metric-m", "metric-eps"], metric);
  bind(["energy-k", "energy-m"], energy);bind(["map-angle", "map-speed"], map);
  bind(["design-eta", "design-b", "design-start", "design-barrier"], design);
  const details = [...document.querySelectorAll("article details")];
  function openAll() { details.forEach(d => d.open = true); }
  if (new URLSearchParams(location.search).has("print")) openAll();
  $("expand-background").addEventListener("click", () => {
    const shouldOpen = details.some(d => !d.open);details.forEach(d => d.open = shouldOpen);
    $("expand-background").textContent = shouldOpen ? "Collapse background notes" : "Expand background notes";
  });
  let beforePrintStates = null;
  window.addEventListener("beforeprint", () => {beforePrintStates = details.map(d => d.open);openAll();});
  window.addEventListener("afterprint", () => {if (beforePrintStates) details.forEach((d, i) => d.open = beforePrintStates[i]);});
  $("print-article").addEventListener("click", () => window.print());
})();
