document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('meteors'),
        ctx    = canvas.getContext('2d');
  let W, H, meteors = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Meteor “class”
  function Meteor() {
    this.init();
  }
  Meteor.prototype.init = function() {
    this.x       = Math.random() * W;
    this.y       = Math.random() * H/2;
    this.length  = 80 + Math.random()*100;
    this.speed   = 4 + Math.random()*4;
    this.opacity = 0.5 + Math.random()*0.5;
    this.angle   = 25 * Math.PI/180; // 25° downward
  };
  Meteor.prototype.update = function() {
    this.x -= this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    // reset when off‐screen
    if (this.x < -this.length || this.y > H + this.length) {
      this.init();
    }
  };
  Meteor.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + this.length * Math.cos(this.angle),
      this.y - this.length * Math.sin(this.angle)
    );
    ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.lineWidth   = 2;
    ctx.stroke();
  };

  // initialize a bunch of meteors
  for (let i = 0; i < 30; i++) {
    meteors.push(new Meteor());
  }

  // animation loop
  function loop() {
    ctx.clearRect(0, 0, W, H);
    meteors.forEach(m => {
      m.update();
      m.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
});