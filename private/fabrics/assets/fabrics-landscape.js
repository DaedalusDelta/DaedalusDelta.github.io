import * as THREE from "./vendor/three/three.module.js";

const $ = id => document.getElementById(id);
const view = $("landscape-view"), time = $("landscape-time"), model = globalThis.FabricsModels.springState;
const psiScale = .65, colors = [0xc1663d, 0x136f73], damping = [0, 1.6];
const energyText = value => value < .0005 ? value.toExponential(2) : value.toFixed(3);
const scene = new THREE.Scene();
scene.background = new THREE.Color("#f5f8f4");
scene.add(new THREE.HemisphereLight(0xffffff, 0x7c9185, 2.3));
const light = new THREE.DirectionalLight(0xffffff, 2.3);light.position.set(-3, 6, 4);scene.add(light);
const camera = new THREE.PerspectiveCamera(36, 1, .05, 50);
let yaw = .7, pitch = .64, renderer = null;
const target = new THREE.Vector3(0, .48, 0);
const labels = [];
function cameraUpdate() {
  const radius = 5.5;
  camera.position.set(radius*Math.cos(pitch)*Math.sin(yaw), .48+radius*Math.sin(pitch), radius*Math.cos(pitch)*Math.cos(yaw));
  camera.lookAt(target);
}
function material(color) {return new THREE.MeshStandardMaterial({color, roughness:.5, metalness:.12});}
const base = new THREE.Mesh(new THREE.CylinderGeometry(1.57, 1.57, .055, 80), material(0xdde5dc));
base.position.y = -.075;scene.add(base);
function line(points, color, opacity = 1) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const object = new THREE.Line(geometry, new THREE.LineBasicMaterial({color, transparent:opacity<1, opacity}));
  scene.add(object);return object;
}
function point(x, y) {return new THREE.Vector3(x, psiScale*(x*x+y*y), y);}
const ring = new THREE.RingGeometry(0, 1.5, 80, 26);
const positions = ring.attributes.position;
for(let i=0;i<positions.count;i++) {
  const x=positions.getX(i), y=positions.getY(i);positions.setXYZ(i,x,psiScale*(x*x+y*y),y);
}
ring.computeVertexNormals();
scene.add(new THREE.Mesh(ring,new THREE.MeshStandardMaterial({color:0xbed6c7,side:THREE.DoubleSide,transparent:true,opacity:.37,depthWrite:false,roughness:.9})));
for(let r=.25;r<=1.5;r+=.25) line(Array.from({length:129},(_,i)=>point(r*Math.cos(i/128*Math.PI*2),r*Math.sin(i/128*Math.PI*2))),0x91ac9a,.42);
for(let i=0;i<12;i++) {
  const theta=i/12*Math.PI*2;
  line(Array.from({length:45},(_,j)=>point(1.5*j/44*Math.cos(theta),1.5*j/44*Math.sin(theta))),0x91ac9a,.35);
}
function label(text, position, color = "#425b4a") {
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext("2d");ctx.font="48px system-ui";ctx.textAlign="center";ctx.fillStyle=color;ctx.fillText(text,256,65);
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false,transparent:true}));
  sprite.position.copy(position);scene.add(sprite);labels.push(sprite);
}
scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(0,-.02,0),1.85,0x839888,.09,.045));
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(0,-.02,0),1.85,0x839888,.09,.045));
label("q₁",new THREE.Vector3(1.94,-.01,0),undefined,.3);
label("q₂",new THREE.Vector3(0,-.01,1.94),undefined,.3);
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(-1.6,0,0),1.6,0x839888,.09,.045));
label("height ∝ ψ",new THREE.Vector3(-1.6,1.76,0),undefined,.8);
const goal=new THREE.Mesh(new THREE.TorusGeometry(.095,.009,8,48),material(0x3b5945));
goal.rotation.x=Math.PI/2;goal.position.y=.018;scene.add(goal);
label("goal",new THREE.Vector3(.15,.02,.22),undefined,.34);
const balls = [];
const drops = [], footprints = [];
class Motion extends THREE.Curve {
  constructor(b){super();this.b=b;}
  getPoint(u,out=new THREE.Vector3()) {
    const r=model(u*8,this.b);return out.set(r.state[0],psiScale*r.potential+.025,r.state[1]);
  }
}
for(let i=0;i<2;i++) {
  const curve=new Motion(damping[i]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,400,.009,6,false),material(colors[i])));
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.045,24,16),material(colors[i]));
  scene.add(ball);balls.push(ball);
  const drop = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),
    new THREE.LineDashedMaterial({color:colors[i],dashSize:.035,gapSize:.025,transparent:true,opacity:.65}));
  scene.add(drop);drops.push(drop);
  const footprint = new THREE.Mesh(new THREE.TorusGeometry(.045,.006,6,32),material(colors[i]));
  footprint.rotation.x=Math.PI/2;scene.add(footprint);footprints.push(footprint);
}
function resize() {
  if (!renderer) return;
  const width=view.clientWidth,height=view.clientHeight;
  renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();
}
function render(){
  if(!renderer)return;
  for(const sprite of labels) {
    const worldPerPixel=2*Math.tan(camera.fov*Math.PI/360)*camera.position.distanceTo(sprite.position)/view.clientHeight;
    sprite.scale.set(512*14/48*worldPerPixel,96*14/48*worldPerPixel,1);
  }
  renderer.render(scene,camera);
}
function update(t=Number(time.value)) {
  $("landscape-time-value").textContent=t.toFixed(2)+" s";
  for(let i=0;i<2;i++) {
    const r=model(t,damping[i]),suffix=i===0?"free":"damped";
    balls[i].position.set(r.state[0],psiScale*r.potential+.06,r.state[1]);
    footprints[i].position.set(r.state[0],-.015,r.state[1]);
    const segment=drops[i].geometry.attributes.position;
    segment.setXYZ(0,r.state[0],0,r.state[1]);segment.setXYZ(1,r.state[0],psiScale*r.potential+.04,r.state[1]);
    segment.needsUpdate=true;drops[i].computeLineDistances();
    $("landscape-v-"+suffix).textContent=energyText(r.total);
    $("landscape-e-"+suffix).style.width=(100*r.E/1.75)+"%";
    $("landscape-p-"+suffix).style.width=(100*r.potential/1.75)+"%";
    $("landscape-values-"+suffix).textContent="E = "+r.E.toFixed(3)+" · ψ = "+r.potential.toFixed(3);
  }
  const d=model(t,1.6);
  $("landscape-readout").textContent="At "+t.toFixed(2)+" s: orange retains V = 1.750; teal has V = "+energyText(d.total)+
    ". Damping has removed "+Math.max(0,1.75-d.total).toFixed(3)+" units of energy.";
  render();
}
cameraUpdate();
try {
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  view.querySelector(".landscape-fallback").hidden=true;view.prepend(renderer.domElement);
  renderer.domElement.setAttribute("aria-label","3D potential surface. Drag to orbit, or use arrow keys.");
  renderer.domElement.tabIndex=0;
  let drag=null;
  renderer.domElement.addEventListener("pointerdown",event=>{
    drag=[event.clientX,event.clientY,yaw,pitch];renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove",event=>{
    if(!drag)return;
    yaw=drag[2]-(event.clientX-drag[0])*.007;
    pitch=Math.max(.2,Math.min(1.25,drag[3]+(event.clientY-drag[1])*.006));
    cameraUpdate();render();
  });
  renderer.domElement.addEventListener("pointerup",()=>drag=null);
  renderer.domElement.addEventListener("pointercancel",()=>drag=null);
  renderer.domElement.addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;
    event.preventDefault();yaw+=(event.key==="ArrowLeft"?.15:event.key==="ArrowRight"?-.15:0);
    pitch=Math.max(.2,Math.min(1.25,pitch+(event.key==="ArrowUp"?.1:event.key==="ArrowDown"?-.1:0)));
    cameraUpdate();render();
  });
  new ResizeObserver(resize).observe(view);resize();
  view.dataset.renderer="webgl";
} catch(error) {
  view.dataset.renderer="static";$("landscape-hint").textContent="Static view · 3D unavailable";
  console.warn("Using the landscape illustration fallback:",error.message);
}
let playing=false, started=0;
function pause(){playing=false;$("landscape-play").textContent="Play motion";}
function tick(now) {
  if(!playing)return;
  if(!started)started=now;
  const t=Math.min(8,(now-started)/1000);time.value=t;update(t);
  if(t>=8)pause();else requestAnimationFrame(tick);
}
$("landscape-play").addEventListener("click",()=>{
  if(playing){pause();return;}
  time.value=0;update();playing=true;started=0;$("landscape-play").textContent="Pause";requestAnimationFrame(tick);
});
time.addEventListener("input",()=>{pause();update();});
$("landscape-reset").addEventListener("click",()=>{yaw=.7;pitch=.64;cameraUpdate();render();});
document.addEventListener("visibilitychange",()=>{if(document.hidden)pause();});
window.addEventListener("beforeprint",pause);
update();
