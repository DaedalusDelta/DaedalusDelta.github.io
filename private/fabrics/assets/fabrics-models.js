/* Pure numerical models shared by the article and verification script.
 * No acceleration saturation, state projection, or hidden position correction. */
(function (root) {
  "use strict";
  function rk4(f, y, dt) {
    const add = (k, scale) => y.map((x, i) => x + scale * k[i]);
    const a = f(y), b = f(add(a, dt / 2)), c = f(add(b, dt / 2)), d = f(add(c, dt));
    return y.map((x, i) => x + dt * (a[i] + 2 * b[i] + 2 * c[i] + d[i]) / 6);
  }
  function parabolic(k, m, energized, dt = 0.002, duration = 2) {
    const energy = y => (y[2] ** 2 + m * y[3] ** 2) / 2;
    const f = y => {
      const vx = y[2], vy = y[3], hy = k * vx * vx, z = vx * vx + m * vy * vy;
      const alpha = energized && z > 0 ? -m * vy * hy / z : 0;
      return [vx, vy, alpha * vx, hy + alpha * vy];
    };
    let y = [0, 0, 1, 0], drift = 0, residual = 0;
    const trace = [y.slice()], initial = energy(y), steps = Math.round(duration / dt);
    dt = duration / steps;
    for (let i = 0; i < steps; i++) {
      y = rk4(f, y, dt);
      drift = Math.max(drift, Math.abs(energy(y) - initial));
      residual = Math.max(residual, Math.abs(y[1] - k * y[0] ** 2 / 2));
      trace.push(y.slice());
    }
    return {trace, final: y, energy: energy(y), drift, residual};
  }
  function obstacle(options = {}) {
    const p = {eta: 4, b: 2.5, headon: false, barrier: true, dt: .001,
      duration: 12, radius: .35, ell: .45, k: 2, lambda: .015, d0: .45,
      goal: [1.4, 0], ...options};
    const clearance = y => Math.hypot(y[0], y[1]) - p.radius;
    const potential = y => {
      const d = clearance(y);
      if (d <= 0) return Infinity;
      const goal = p.k / 2 * ((y[0] - p.goal[0]) ** 2 + (y[1] - p.goal[1]) ** 2);
      return goal + (p.barrier && d < p.d0 ? p.lambda * (1 / d - 1 / p.d0) ** 2 : 0);
    };
    const total = y => (y[2] ** 2 + y[3] ** 2) / 2 + potential(y);
    let minClearance = Infinity;
    function field(y) {
      const radius = Math.hypot(y[0], y[1]), d = radius - p.radius;
      minClearance = Math.min(minClearance, d);
      if (d <= 0 || !y.every(Number.isFinite)) throw new Error("A numerical integration stage entered the disk or became nonfinite.");
      const n = [y[0] / radius, y[1] / radius], vx = y[2], vy = y[3];
      const vv = vx * vx + vy * vy, vn = vx * n[0] + vy * n[1];
      const gain = p.eta * Math.exp(-d / p.ell);
      const repulsion = p.barrier && d < p.d0 ? 2 * p.lambda * (1 / d - 1 / p.d0) / (d * d) : 0;
      return [vx, vy,
        gain * (vv * n[0] - vx * vn) - p.k * (y[0] - p.goal[0]) + repulsion * n[0] - p.b * vx,
        gain * (vv * n[1] - vy * vn) - p.k * (y[1] - p.goal[1]) + repulsion * n[1] - p.b * vy,
        p.b * vv];
    }
    let y = [-1.4, p.headon ? 0 : .55, .6, 0, 0], error = null, balance = 0, maxIncrease = 0, time = 0;
    const trace = [y.slice()], initial = total(y), steps = Math.round(p.duration / p.dt), dt = p.duration / steps;
    for (let i = 0; i < steps; i++) {
      try {
        const next = rk4(field, y, dt);
        if (clearance(next) <= 0) throw new Error("The accepted numerical state entered the disk.");
        y = next;
      } catch (e) { error = e.message; break; }
      time = (i + 1) * dt;
      balance = Math.max(balance, Math.abs(total(y) + y[4] - initial));
      maxIncrease = Math.max(maxIncrease, total(y) - initial);
      if (i % 10 === 0) trace.push(y.slice());
    }
    trace.push(y.slice());
    return {trace, final: y, time, error, minClearance, balance, maxIncrease,
      goalError: Math.hypot(y[0] - p.goal[0], y[1] - p.goal[1]),
      speed: Math.hypot(y[2], y[3]), initial, total: total(y), parameters: p};
  }
  // Closed-form underdamped spring. The landscape uses b=0 and b=1.6.
  function springState(t, b = 1.6) {
    const gamma = b / 2, omega = Math.sqrt(2 - gamma * gamma);
    if (!(omega > 0) || b < 0) throw new Error("This illustration uses 0 <= b < sqrt(8).");
    const decay = Math.exp(-gamma * t), c = Math.cos(omega * t), s = Math.sin(omega * t);
    const state = [0, 0, 0, 0];
    for (let j = 0; j < 2; j++) {
      const q0 = j === 0 ? 1.1 : .2, v0 = j === 0 ? 0 : 1;
      const A = q0, B = (v0 + gamma * q0) / omega;
      state[j] = decay * (A * c + B * s);
      state[j + 2] = decay * (-gamma * (A * c + B * s) + omega * (-A * s + B * c));
    }
    const E = .5 * (state[2] ** 2 + state[3] ** 2), potential = state[0] ** 2 + state[1] ** 2;
    return {state, E, potential, total: E + potential};
  }
  // Horizontal 2R arm, massless unit-length links, unit masses at elbow and tip.
  function robotMechanics(y) {
    const c = Math.cos(y[1]), s = Math.sin(y[1]), v1 = y[2], v2 = y[3];
    const M = [[3+2*c, 1+c], [1+c, 1]];
    const xi = [-s*(2*v1*v2+v2*v2), s*v1*v1];
    const determinant = 2-c*c;
    const acceleration = [(-xi[0]+M[0][1]*xi[1])/determinant,
      (M[0][1]*xi[0]-M[0][0]*xi[1])/determinant];
    const elbow = [Math.cos(y[0]), Math.sin(y[0])];
    const tip = [elbow[0]+Math.cos(y[0]+y[1]), elbow[1]+Math.sin(y[0]+y[1])];
    const energy = .5*(M[0][0]*v1*v1+2*M[0][1]*v1*v2+v2*v2);
    return {M, xi, acceleration, energy, elbow, tip, momentum:M[0][0]*v1+M[0][1]*v2};
  }
  function robotCoast(dt = .001, duration = 1.2) {
    let y = [0, Math.PI/2, 1, 0], drift = 0;
    const steps = Math.round(duration/dt);dt = duration/steps;
    const initial = robotMechanics(y).energy, trace = [y.slice()];
    const field = state => [...state.slice(2), ...robotMechanics(state).acceleration];
    for(let i=0;i<steps;i++) {
      y = rk4(field,y,dt);trace.push(y.slice());
      drift = Math.max(drift,Math.abs(robotMechanics(y).energy-initial));
    }
    return {trace,dt,duration,drift,initial};
  }
  const api = {rk4, parabolic, obstacle, springState, robotMechanics, robotCoast};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FabricsModels = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
