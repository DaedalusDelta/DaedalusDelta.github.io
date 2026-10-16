(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const {robotMechanics,robotCoast} = FabricsModels;
  const run = robotCoast(), slider = $("coast-time");
  const virtual = t => [t,Math.PI/2,1,0];
  function screen(p,offset){return [offset+65*p[0],235-65*p[1]];}
  function path(points){return points.map((p,i)=>(i?"L":"M")+p.join(",")).join(" ");}
  for(const [name,offset] of [["real",180],["virtual",600]]) {
    const points = run.trace.filter((_,i)=>i%8===0).map((y,j)=>
      screen(robotMechanics(name==="real"?y:virtual(j*8*run.dt)).tip,offset));
    $("coast-"+name+"-future").setAttribute("d",path(points));
  }
  function update(t=Number(slider.value)) {
    const index = Math.min(run.trace.length-1,Math.round(t/run.dt));
    const states = [run.trace[index],virtual(t)];
    $("coast-time-value").textContent=t.toFixed(2)+" s";
    for(const [i,name,offset] of [[0,"real",180],[1,"virtual",600]]) {
      const state=states[i], r=robotMechanics(state), elbow=screen(r.elbow,offset),tip=screen(r.tip,offset);
      $("coast-"+name+"-arm").setAttribute("d",path([[offset,235],elbow,tip]));
      for(const [part,point] of [["elbow",elbow],["tip",tip]]) {
        $("coast-"+name+"-"+part).setAttribute("cx",point[0]);
        $("coast-"+name+"-"+part).setAttribute("cy",point[1]);
      }
      const points=[];
      for(let j=0;j<=index;j+=8)points.push(screen(robotMechanics(i===0?run.trace[j]:virtual(j*run.dt)).tip,offset));
      points.push(tip);$("coast-"+name+"-trail").setAttribute("d",path(points));
      $("coast-"+name+"-angle").textContent="Elbow q₂ = "+(state[1]*180/Math.PI).toFixed(1)+"°";
    }
    const r=robotMechanics(states[0]);
    $("coast-real-energy").textContent="E = "+r.energy.toFixed(3)+" J · conserved";
    $("coast-readout").textContent="At "+t.toFixed(2)+" s: physical-model joint velocities ("+
      states[0][2].toFixed(3)+", "+states[0][3].toFixed(3)+") rad/s; virtual-model velocities (1, 0) rad/s. Maximum numerical energy drift over the full run: "+run.drift.toExponential(1)+" J.";
  }
  let playing=false,start=0;
  function stop(){playing=false;$("coast-play").textContent="Play at ¼ speed";}
  function frame(now) {
    if(!playing)return;if(!start)start=now;
    const t=Math.min(1.2,(now-start)/4000);slider.value=t;update(t);
    if(t===1.2)stop();else requestAnimationFrame(frame);
  }
  $("coast-play").addEventListener("click",()=>{
    if(playing){stop();return;}start=0;playing=true;slider.value=0;update(0);
    $("coast-play").textContent="Pause";requestAnimationFrame(frame);
  });
  $("coast-reset").addEventListener("click",()=>{stop();slider.value=0;update();});
  slider.addEventListener("input",()=>{stop();update();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
  window.addEventListener("beforeprint",stop);
  update();
})();
