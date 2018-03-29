function Shield(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}
Shield.prototype.drawCanvas = function() {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.canvas.width = this.width = 500;
  this.canvas.height = this.height = 500;
  this.ctx.fillStyle="red";
  this.ctx.fillRect(0,0,100,100);
}
Shield.prototype.drawShield = function (shield, x, y) {
  this.ctx.drawImage(shield.img, shield.x, shield.y, shield.w, shield.h, x, y,
                     shield.w, shield.h);
};
Shield.prototype.coruptionShield = function () {
  this.ctx.clearRect(60 ,414 ,20, 20);
};
