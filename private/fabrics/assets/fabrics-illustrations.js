(() => {
  "use strict";
  const $ = id => document.getElementById(id), ns = "http://www.w3.org/2000/svg";
  const routePoint = tau => {
    const u = tau / 4, z = 1 - u;
    return [z*z*z*50 + 3*z*z*u*155 + 3*z*u*u*315 + u*u*u*516,
      z*z*z*232 + 3*z*z*u*35 + 3*z*u*u*275 + u*u*u*82];
  };
  const frames = $("clock-frames");
  for (let second = 0; second <= 4; second++) {
    const [x, y] = routePoint(second), dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", x);dot.setAttribute("cy", y);dot.setAttribute("r", 3.5);dot.setAttribute("fill", "#8a9f92");
    frames.append(dot);
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", x);label.setAttribute("y", y - 20);
    label.setAttribute("text-anchor", "middle");label.setAttribute("class", "svg-small");
    label.textContent = second + " s";frames.append(label);
  }
  let clockPlaying = false, clockStart = 0, matched = false;
  function updateClock(value = Number($("clock-time").value)) {
    const t = value, normal = routePoint(t), fast = routePoint(matched?t:2*t);
    for (const [name, position] of [["normal", normal], ["fast", fast]]) {
      $("clock-" + name + "-dot").setAttribute("cx", position[0]);
      $("clock-" + name + "-dot").setAttribute("cy", position[1]);
    }
    $("clock-normal-label").textContent = "q(" + t.toFixed(2) + " s)";
    $("clock-fast-label").textContent = "q₂(" + (matched?t/2:t).toFixed(2) + ") = q(" + (matched?t:2*t).toFixed(2) + ")";
    $("clock-normal-bar").setAttribute("width", 208*t/4);
    $("clock-fast-bar").setAttribute("width", 208*(matched?t:2*t)/4);
    $("clock-time-value").textContent = t.toFixed(2) + " s";
    $("clock-readout").textContent = matched ? "Shared frame "+t.toFixed(2)+" s: normal playback reaches it at "+t.toFixed(2)+
      " s; double playback reaches it at "+(t/2).toFixed(2)+" s. The two markers coincide, and their derivative factors are 2 and 4." :
      "At wall time " + t.toFixed(2) + " s: teal reads recording time " +
      t.toFixed(2) + " s; orange reads " + (2*t).toFixed(2) + " s. The positions are looked up on one unchanged curve.";
  }
  function setMatched(value) {
    matched=value;$("clock-compare").setAttribute("aria-pressed",matched);
    $("clock-compare").textContent=matched?"Compare at the same wall time":"Freeze one shared frame";
    $("clock-slider-label").textContent=matched?"Shared recording time τ":"Wall-clock time t";
    $("clock-time").max=matched?4:2;$("clock-match-note").hidden=!matched;
    const dot=$("clock-fast-dot");
    dot.setAttribute("r",matched?15:10);dot.setAttribute("fill",matched?"none":"#c1663d");
    dot.setAttribute("stroke",matched?"#c1663d":"white");
  }
  $("clock-compare").addEventListener("click",()=>{
    stopClock();setMatched(!matched);$("clock-time").value=matched?2:1;updateClock();
  });
  function stopClock() {clockPlaying = false;$("clock-play").textContent = "Play both clocks";}
  function tickClock(now) {
    if (!clockPlaying) return;
    if (!clockStart) clockStart = now;
    const t = Math.min(2, (now - clockStart)/1000);
    $("clock-time").value = t;updateClock(t);
    if (t === 2) stopClock(); else requestAnimationFrame(tickClock);
  }
  $("clock-play").addEventListener("click", () => {
    if (clockPlaying) {stopClock();return;}
    setMatched(false);$("clock-time").value = 0;updateClock();clockPlaying = true;clockStart = 0;
    $("clock-play").textContent = "Pause";requestAnimationFrame(tickClock);
  });
  $("clock-time").addEventListener("input", () => {stopClock();updateClock();});
  updateClock();

  const projection = $("energization-illustration");
  const steps = [
    "1 · Read the current motion: v = (2, 0), pointing right. The proposed acceleration h = (3, 4) points partly forward and partly sideways.",
    "2 · Split the request: (3, 0) changes speed; (0, 4) turns velocity. Only the forward part contributes to v · h = 6.",
    "3 · Subtract the forward part: h − (3, 0) = (0, 4). The remaining acceleration does zero work; the current velocity has not jumped."
  ];
  let step = 2, projectionPlaying = false, projectionStart = 0;
  function cancellation(fraction) {
    const forward = 3 * (1-fraction), x = 494+30*forward;
    $("projection-moving-vector").setAttribute("d", "M494 186 L"+x+" 66");
    $("projection-vector-label").textContent = (fraction === 1 ? "g" : "a") + " = ("+forward.toFixed(fraction===1?0:1)+", 4)";
    $("projection-work-label").textContent = "Ė = "+(6*(1-fraction)).toFixed(fraction===1?0:1);
    $("projection-result-heading").textContent = fraction === 1 ? "ENERGIZED ACCELERATION g" : "REMOVE THE FORWARD COMPONENT";
    $("projection-right-angle").style.opacity = fraction === 1 ? 1 : 0;
  }
  function showStep(next) {
    step = next;projection.dataset.step = step;
    $("projection-readout").textContent = steps[step];
    [...projection.querySelectorAll("[data-projection-step]")].forEach((button, i) => button.setAttribute("aria-pressed", i === step));
  }
  function stopProjection() {projectionPlaying=false;$("projection-replay").textContent="Replay the reasoning";}
  function tickProjection(now) {
    if(!projectionPlaying)return;
    if(!projectionStart)projectionStart=now;
    const seconds=(now-projectionStart)/1000, next=seconds<2?0:seconds<4?1:2;
    if(next!==step)showStep(next);
    cancellation(Math.max(0,Math.min(1,(seconds-4)/3)));
    if(seconds>=7)stopProjection();else requestAnimationFrame(tickProjection);
  }
  projection.querySelectorAll("[data-projection-step]").forEach(button => button.addEventListener("click", () => {
    stopProjection();showStep(Number(button.dataset.projectionStep));cancellation(step===2?1:0);
  }));
  $("projection-replay").addEventListener("click", () => {
    if(projectionPlaying){stopProjection();return;}
    showStep(0);cancellation(0);projectionStart=0;projectionPlaying=true;
    $("projection-replay").textContent="Pause";requestAnimationFrame(tickProjection);
  });
  showStep(2);cancellation(1);
  document.addEventListener("visibilitychange", () => {if(document.hidden){stopClock();stopProjection();}});
  window.addEventListener("beforeprint", () => {stopClock();stopProjection();showStep(2);cancellation(1);});
})();
