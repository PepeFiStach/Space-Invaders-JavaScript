function Screen(width, height) {
  this.canvas = document.getElementById("myCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;
}
Screen.prototype.drawCanvas = function () {
  this.ctx.fillStyle = "#000";
  this.ctx.fillRect(0, 0, this.width, this.height);
};

Screen.prototype.drawSprite = function(sprite, x, y) {
  this.ctx.drawImage(sprite.img, sprite.x, sprite.y,
  sprite.w, sprite.h, x, y, sprite.w, sprite.h);
};

Screen.prototype.clear = function() {
  this.ctx.clearRect(0, 0,  this.width, this.height);
};
Screen.prototype.clear2 = function() {
  this.ctx.clearRect(100, 100,  this.width, this.height);
};

Screen.prototype.drawBullets = function(bullets) {
  this.ctx.fillStyle = "#fff";
  this.ctx.fillRect(bullets.x, bullets.y, bullets.w, bullets.h);
}
