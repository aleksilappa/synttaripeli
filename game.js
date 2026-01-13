console.log("GAME LOADED");

/* ELEMENTIT */
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const controls = document.getElementById("controls");

const char = document.getElementById("character");
const carsContainer = document.getElementById("cars");

const clock = document.getElementById("clock");
const music = document.getElementById("music");

/* TILA */
let canMove = false;
let walking = false;
let dir = 1;
let pos = 0;

let walkIndex = 0;
let walkFrame = 1;
const walkSequence = ["walk", "idle", "walk", "idle"];

/* ALOITUS */
startBtn.onclick = () => {
  startScreen.style.display = "none";

  try { clock.play(); } catch {}

  setTimeout(() => {
    try { music.play(); } catch {}
    game.classList.remove("hidden");
    controls.classList.remove("hidden");
    canMove = true;
    window.focus();
    spawnCars();
  }, 1500);
};

/* KOSKETUS */
document.getElementById("leftBtn").ontouchstart = () => move(-1);
document.getElementById("rightBtn").ontouchstart = () => move(1);
document.getElementById("leftBtn").ontouchend = stop;
document.getElementById("rightBtn").ontouchend = stop;

/* NÄPPÄIMISTÖ */
document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (!canMove) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    move(-1);
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    move(1);
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") stop();
});

/* LIIKE */
function move(d) {
  dir = d;
  walking = true;
}

function stop() {
  walking = false;
  walkIndex = 0;
  char.src = `images/character/idle_${dir > 0 ? "right" : "left"}.png`;
}

/* KÄVELYANIMAATIO */
setInterval(() => {
  if (!walking) return;

  const state = walkSequence[walkIndex];

  if (state === "walk") {
    char.src = `images/character/walk_${dir > 0 ? "right" : "left"}_${walkFrame}.png`;
    walkFrame = walkFrame === 1 ? 2 : 1;
  } else {
    char.src = `images/character/idle_${dir > 0 ? "right" : "left"}.png`;
  }

  walkIndex = (walkIndex + 1) % walkSequence.length;
}, 300);

/* MAAILMA */
setInterval(() => {
  if (!walking) return;

  pos += dir * 2;

  document.getElementById("bg-far").style.backgroundPositionX = -pos * 0.3 + "px";
  document.getElementById("bg-mid").style.backgroundPositionX = -pos * 0.6 + "px";
  document.getElementById("bg-front").style.backgroundPositionX = -pos + "px";
}, 30);

/* AUTOT */
function spawnCars() {
  setInterval(() => {
    const car = document.createElement("img");
    car.src = "images/objects/car.png";
    car.className = "car";

    const fromLeft = Math.random() > 0.5;
    car.style.left = fromLeft ? "-200px" : "100vw";
    car.style.transform = fromLeft ? "scaleX(1)" : "scaleX(-1)";
    const speed = fromLeft ? 4 : -4;

    carsContainer.appendChild(car);
    let x = fromLeft ? -200 : window.innerWidth;

    const loop = setInterval(() => {
      x += speed;
      car.style.left = x + "px";

      if (x < -300 || x > window.innerWidth + 300) {
        clearInterval(loop);
        car.remove();
      }
    }, 30);
  }, 20000);
}
