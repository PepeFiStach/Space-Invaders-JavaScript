const img = document.getElementById("modelsIMG");
const rows = [0, 1, 1, 2, 2];

let screen, spAliens = [], aliens = [], frame, lvlFrame, spFrame,
dir, spShip, ship, bullets = [], bulletsShip = [], spShield, shield, damageShield;

function init() {
  screen = new Screen(500,500);
  frame = 0;
  lvlFrame = 60;
  spFrame = 0;
  dir = 1;
  spAliens = [
    [new Models(img, 0, 0, 22, 16), new Models(img, 0, 16, 22, 16)],
    [new Models(img, 22, 0, 16, 16), new Models(img, 22, 16, 16, 16)],
    [new Models(img, 38, 0, 24, 16), new Models(img, 38, 16, 24, 16)],
  ];
  spShip = new Models(img, 62, 0 , 24, 16);
  ship = {
    sprite: spShip,
    x: screen.width / 2,
    y: screen.height - spShip.h * 2,
  };
  spShield = new Shield(img, 84, 8, 36, 24);
  shield = {
    canvas: null,
    ctx: null,
    x: 68 + 111,
    y: ship.y - (30 + spShield.h),
    h: spShield.h,
    init: function() {
      this.canvas = document.getElementById("canvas");
      this.canvas.width = screen.width;
      this.canvas.height = screen.height,
      this.ctx = this.canvas.getContext("2d");

      for (let i = 0; i < 4; i++) {
        this.ctx.drawImage(spShield.img, spShield.x, spShield.y, spShield.w, spShield.h,
        68 + 111*i, this.y, spShield.w, spShield.h);
      }
    },
    damage: function(x, y) {
      x = Math.floor(x/2) * 2;
      y = Math.floor(y/2) * 2;
      this.ctx.clearRect(x-2, y-2, 4, 4);
      this.ctx.clearRect(x+2, y-4, 2, 4);
      this.ctx.clearRect(x+4, y, 2, 2);
      this.ctx.clearRect(x+2, y+2, 2, 2);
      this.ctx.clearRect(x-4, y+2, 2, 2);
      this.ctx.clearRect(x-6, y, 2, 2);
      this.ctx.clearRect(x-4, y-4, 2, 2);
      this.ctx.clearRect(x-2, y-6, 2, 2);
    },
    hit: function(x, y) {
      let imgData = this.ctx.getImageData(x, y, 1, 1);
      let dataShip = this.ctx.getImageData(ship.x+5,ship.y-10,1,1);
      console.log(dataShip.data[3]);
      if(imgData.data[3] !==0) {
        this.damage(x, y);
        return true;
      }
      return false
    }
  };
  shield.init();
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < 10; x++) {
      let a = rows[y];
      aliens.push({
        sprite: spAliens[a],
        x: 30 + 30*x,
        y: 30 + 30*y,
        w: spAliens[a][0].w,
        h: spAliens[a][0].h,
      });
    }
  }
} init();

function update() {
  frame++;
  let _max = screen.width, _min = 0;
  if (frame === lvlFrame) {
    if (spFrame === 0) {
      spFrame = 1;
    }
    else {
      spFrame = 0;
    }
    for (let i = 0; i < aliens.length; i++) {
      let a = aliens[i];
      a.x += 30 * dir;
      _max = Math.max(_max, a.x + a.w);
      _min = Math.min(_min, a.x - 30);
      if (a.y > screen.height - 100) {
        alert("Game Over");
      }
    }
    if (_max > screen.width || _min < 0) {
      dir *= -1;
      for (let i = 0; i < aliens.length; i++) {
        let a = aliens[i];
        a.y += 30;
        a.x += 30 * dir;
      }
    }
    for (let i = 0; i < 3; i++) {
      let aliensShot = Math.floor(Math.random()*aliens.length);
      bullets.push(new Bullets(aliens[aliensShot].x, aliens[aliensShot].y,
                   5, 5, -5));
    }
    frame = 0;
  }
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].velocity;
  }
  for (let i = 0; i < bulletsShip.length; i++) {
    bulletsShip[i].y -= bulletsShip[i].velocity;
  }
  collide();
  collideShield();
  collideShield2();
  draw();
  requestAnimationFrame(update);
}

function collide() {
  for (let i = 0; i < bulletsShip.length; i++) {
    for (let j = 0; j < aliens.length; j++) {
      if (bulletsShip[i].x > aliens[j].x &&
          bulletsShip[i].x < aliens[j].x + aliens[j].w &&
          bulletsShip[i].y > aliens[j].y &&
          bulletsShip[i].y < aliens[j].y + aliens[j].h) {
        bulletsShip.push(new Bullets(ship.x + 9, ship.y + 2, 5, 5))
        bulletsShip.splice(i, 1);
        aliens.splice(j, 1);
      }
    }
  }
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].x > ship.x &&
        bullets[i].x < ship.x + 24 &&
        bullets[i].y > ship.y &&
        bullets[i].y < ship.y + 16) {
      bullets.splice(i, 1);
      ship.sprite = null;
    }
  }
}
function collideShield() {
  for (let i = 0; i < bullets.length; i++) {
    if (shield.y < bullets[i].y &&
        bullets[i].y < shield.y + shield.h) {
          if(shield.hit(bullets[i].x, bullets[i].y)){
            bullets.splice(i, 1);
          };
    }
  }
}
function collideShield2() {
  for (let i = 0; i < bulletsShip.length; i++) {
    if (shield.y < bulletsShip[i].y &&
        bulletsShip[i].y < shield.y + shield.h) {
          if(shield.hit(bulletsShip[i].x, bulletsShip[i].y)){
            bulletsShip.splice(i, 1);
          };
    }
  }
}

document.addEventListener("keydown", function(event) {
  if (event.keyCode === 37 && ship.x > 10) {
    ship.x -= 15;
  }
  if (event.keyCode === 39 && ship.x < screen.width - 30) {
    ship.x += 15;
  }
  if (event.keyCode === 32) {
    bulletsShip.push(new Bullets(ship.x + 9, ship.y, 5, 5, 5));
  }
});

function draw(){
  screen.clear();
  screen.drawCanvas();
  for (let i = 0; i < aliens.length; i++) {
    let a = aliens[i];
    screen.drawSprite(a.sprite[spFrame], a.x, a.y);
  }
  screen.drawSprite(ship.sprite, ship.x, ship.y);
  for (let i = 0; i < bullets.length; i++) {
    screen.drawBullets(bullets[i]);
  }
  for (let i = 0; i < bulletsShip.length; i++) {
    screen.drawBullets(bulletsShip[i]);
  }
}
update();
