let move_speed = 3;
let gravity = 0.5;

let astro = document.querySelector(".astro");
let img = document.getElementById("astro-1");

let background = document.querySelector(".background");
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "start";
let astro_dy = 0;

// Hide astro initially
img.style.display = "none";
message.classList.add("messageStyle");

// START GAME
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && game_state !== "play") {
    document.querySelectorAll(".pipe_sprite").forEach((el) => el.remove());

    img.style.display = "block";
    astro.style.top = "200px";

    game_state = "play";
    astro_dy = 0;

    message.innerHTML = "";
    score_title.innerHTML = "Score: ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");

    play();
  }
});

//  JUMP
document.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowUp" || e.key === " ") && game_state === "play") {
    img.src = "Images/astro-2.png";
    astro_dy = -8;
  }
});

document.addEventListener("keyup", (e) => {
  if ((e.key === "ArrowUp" || e.key === " ") && game_state === "play") {
    img.src = "Images/astro.png";
  }
});

// MAIN GAME
function play() {
  function move() {
    if (game_state !== "play") return;

    let pipes = document.querySelectorAll(".pipe_sprite");

    pipes.forEach((pipe) => {
      let pipe_rect = pipe.getBoundingClientRect();
      let astro_rect = astro.getBoundingClientRect();

      // Remove pipes
      if (pipe_rect.right <= 0) {
        pipe.remove();
      } else {
        // COLLISION
        let padding = 5;
        if (
          astro_rect.left + padding <
            pipe_rect.left + pipe_rect.width - padding &&
          astro_rect.left + astro_rect.width - padding >
            pipe_rect.left + padding &&
          astro_rect.top + padding <
            pipe_rect.top + pipe_rect.height - padding &&
          astro_rect.top + astro_rect.height - padding > pipe_rect.top + padding
        ) {
          endGame();
        }

        // SCORE
        else if (
          pipe_rect.right < astro_rect.left &&
          pipe_rect.right + move_speed >= astro_rect.left &&
          pipe.increase_score === "1"
        ) {
          score_val.innerHTML = Number(score_val.innerHTML) + 1;
        }

        pipe.style.left = pipe_rect.left - move_speed + "px";
      }
    });

    requestAnimationFrame(move);
  }

  function apply_gravity() {
    if (game_state !== "play") return;

    astro_dy += gravity;
    astro.style.top = astro.offsetTop + astro_dy + "px";

    let astro_rect = astro.getBoundingClientRect();

    if (astro_rect.top <= 0 || astro_rect.bottom >= window.innerHeight) {
      endGame();
    }

    requestAnimationFrame(apply_gravity);
  }

  let pipe_gap = 150;
  let pipe_timer = 0;

  function create_pipe() {
    if (game_state !== "play") return;

    if (pipe_timer > 100) {
      pipe_timer = 0;

      let pipe_pos = Math.random() * (window.innerHeight - pipe_gap - 200) + 50;

      // Top pipe
      let pipe_top = document.createElement("div");
      pipe_top.className = "pipe_sprite";
      pipe_top.style.height = pipe_pos + "px";
      pipe_top.style.top = "0px";
      pipe_top.style.left = "100vw";

      document.body.appendChild(pipe_top);

      // Bottom pipe
      let pipe_bottom = document.createElement("div");
      pipe_bottom.className = "pipe_sprite";
      pipe_bottom.style.height =
        window.innerHeight - pipe_pos - pipe_gap + "px";
      pipe_bottom.style.top = pipe_pos + pipe_gap + "px";
      pipe_bottom.style.left = "100vw";
      pipe_bottom.increase_score = "1";

      document.body.appendChild(pipe_bottom);
    }

    pipe_timer++;
    requestAnimationFrame(create_pipe);
  }

  function endGame() {
    game_state = "End";
    message.innerHTML = "Game Over<br>Press Enter to Restart";
    message.classList.add("messageStyle");
    img.style.display = "none";
  }

  requestAnimationFrame(move);
  requestAnimationFrame(apply_gravity);
  requestAnimationFrame(create_pipe);
}
