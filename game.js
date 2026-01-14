const viewport = document.getElementById("viewport");
const player = document.getElementById("player");
const bgFar = document.getElementById("bg-far");
const bgMid = document.getElementById("bg-mid");
const bgFront = document.getElementById("bg-front");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const controls = document.getElementById("controls");

const clock = document.getElementById("clock");
const music = document.getElementById("music");

// MAANRAJAT
const WORLD_LEFT = 0;
const WORLD_RIGHT = 2000;

let playerX = WORLD_LEFT;
let movingLeft = false;
let movingRight = false;
let walkFrame = 0;
let facing = "right"; // right / left

// -------- SCALE --------
function scaleGame() {
  const scale = Math.min(
    window.innerWidth / 568,
    window.innerHeight / 320
  );
  viewport.style.transform = `scale(${scale})`;
}
window.addEventListener("resize", scaleGame);
scaleGame();

// -------- START --------
startBtn.onclick = () => {
  startScreen.classList.add("hidden");

  clock.play().catch(()=>{});

  setTimeout(() => {
    music.play().catch(()=>{});
    document.getElementById("game").classList.remove("hidden");
    controls.classList.remove("hidden");
    window.focus();
  }, 1200);
};

// -------- INPUT --------
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") movingLeft = true;
  if (e.key === "ArrowRight") movingRight = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") movingLeft = false;
  if (e.key === "ArrowRight") movingRight = false;
});

document.getElementById("leftBtn").ontouchstart = () => movingLeft = true;
document.getElementById("leftBtn").ontouchend = () => movingLeft = false;
document.getElementById("rightBtn").ontouchstart = () => movingRight = true;
document.getElementById("rightBtn").ontouchend = () => movingRight = false;

// -------- UPDATE LOOP --------
function update() {
  const speed = 2;
  let walking = false;

  if (movingRight) {
    playerX += speed;
    facing = "right";
    walking = true;
  }
  if (movingLeft) {
    playerX -= speed;
    facing = "left";
    walking = true;
  }

  // KIINTEÄT RAJAT
  if (playerX < WORLD_LEFT) playerX = WORLD_LEFT;
  if (playerX > WORLD_RIGHT) playerX = WORLD_RIGHT;

  // SIIRRÄ PELAAJA
  player.style.left = playerX + "px";

  // PARALLAX
  bgFar.style.backgroundPositionX = -playerX * 0.3 + "px";
  bgMid.style.backgroundPositionX = -playerX * 0.6 + "px";
  bgFront.style.backgroundPositionX = -playerX * 1.0 + "px";

  // ANIMAATIO
  if (walking) {
    walkFrame++;
    const frame = walkFrame % 20 < 10 ? "1" : "2";
    player.src = `images/character/walk_${facing}_${frame}.png`;
  } else {
    player.src = `images/character/idle_${facing}.png`;
  }

  requestAnimationFrame(update);
}

update();
