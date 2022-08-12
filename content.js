var url = location.hostname + location.pathname;
url = url.replaceAll("/", "");
url = url.replaceAll(".", "");
url = url.replaceAll("#", "");
url = url.replaceAll("$", "");
url = url.replaceAll("[", "");
url = url.replaceAll("]", "");
url = url.replaceAll(":", "");
url = url.replaceAll("?", "");
url = url.replaceAll("=", "");
url = url.replaceAll("&", "");
url = url.replaceAll("-", "");

var originalImage;
var drawing = false;

fetch("https://graffiti-art-online.herokuapp.com/image/" + url)
  .then((response) => response.json())
  .then((data) => {
    loadCanvas(data.image.canvas);
  })
  .catch((e) => console.log(e));

var x = document.createElement("CANVAS");
x.className += "webcanvas";
var ctx = x.getContext("2d");
var dimension = [document.body.scrollWidth, document.body.scrollHeight];
x.width = dimension[0];
x.height = dimension[1];
document.documentElement.prepend(x);

const buttonContainer = document.createElement("div");
buttonContainer.className += "buttonContainer";

let drawButton = document.createElement("button");
drawButton.innerHTML = "draw";
drawButton.className += "webbutton";
drawButton.onclick = function () {
  if (!drawing) {
    console.log("START DRAWING");
    document.addEventListener("mousemove", draw);
    drawing = true;
  } else {
    console.log("STOP DRAWING");
    document.removeEventListener("mousemove", draw);
    drawing = false;
  }
};

let saveButton = document.createElement("button");
saveButton.className += "webbutton";
saveButton.innerHTML = "save";
saveButton.onclick = function () {
  console.log("SAVING...");
  const img = x.toDataURL("image/png").toString();
  console.log(img);
  const body = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: img }),
  };
  console.log(body);
  const response = fetch(
    "https://graffiti-art-online.herokuapp.com/sites/" + url,
    body
  )
    .then((response) => console.log(response))
    .catch((e) => console.log(e));
  return;
};

let clearButton = document.createElement("button");
clearButton.className += "webbutton";
clearButton.innerHTML = "clear";
clearButton.onclick = function () {
  console.log("Cleared!");
  ctx.clearRect(0, 0, x.width, x.height);
  loadCanvas(originalImage.src);
};

let cleanButton = document.createElement("button");
cleanButton.className += "webbutton";
cleanButton.innerHTML = "clean";
cleanButton.onclick = function () {
  ctx.clearRect(0, 0, x.width, x.height);
};

buttonContainer.appendChild(drawButton);
buttonContainer.appendChild(saveButton);
buttonContainer.appendChild(clearButton);
buttonContainer.appendChild(cleanButton);
document.documentElement.prepend(buttonContainer);

// get canvas 2D context and set him correct size
resize();

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener("resize", resize);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);

// new position from mouse event
function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}

// resize canvas
function resize() {
  var dimension = [document.body.scrollWidth, document.body.scrollHeight];
  x.width = dimension[0];
  x.height = dimension[1];
  if (originalImage !== undefined) {
    ctx.drawImage(originalImage, 0, 0);
  }
}

function loadCanvas(dataURL) {
  var image = new Image();
  image.onload = function () {
    ctx.drawImage(this, 0, 0);
  };
  image.src = dataURL;
  originalImage = image;
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#c0392b";

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}
