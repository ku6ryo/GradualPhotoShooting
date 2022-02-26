import Stats from "stats.js"

const stats = new Stats()
document.body.appendChild(stats.dom)

const button = document.createElement("button")
button.textContent = "start"
button.style.position = "absolute"
button.style.bottom = "0"
button.style.right = "0"
button.style.zIndex = "1000"
button.style.width = "100px"
button.style.height = "100px"
button.addEventListener("click", () => {
  main()
})
document.body.appendChild(button)

const mainCanvas = document.createElement("canvas")
const mainContext = mainCanvas.getContext("2d")
mainCanvas.style.height = "100vh"
mainCanvas.style.width = "100vw"
document.querySelector(".container")!.appendChild(mainCanvas)

async function main() {

  const gradualCanvas = document.createElement("canvas")
  const gradualContext = gradualCanvas.getContext("2d")

  const cameraVideo = document.createElement("video");
  cameraVideo.addEventListener("playing", () => {
    const frameWidth = cameraVideo.videoWidth;
    const frameHeight = cameraVideo.videoHeight;
    mainCanvas.width = frameWidth
    mainCanvas.height = frameHeight
    mainCanvas.style.maxHeight = `calc(100vw * ${frameHeight / frameWidth})`
    mainCanvas.style.maxWidth = `calc(100vh * ${frameWidth / frameHeight})`
    gradualCanvas.width = frameWidth
    gradualCanvas.height = frameHeight
    requestAnimationFrame(process)
  })
  cameraVideo.style.position = "absolute";
  cameraVideo.style.right = "0"
  cameraVideo.style.top = "0"
  cameraVideo.style.width = "100px"
  document.body.appendChild(cameraVideo)

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1920 },
        height: { ideal: 1080 } 
      },
    })
    .then(function (stream) {
      cameraVideo.srcObject = stream;
      cameraVideo.play();
    })
    .catch(function (e) {
      console.log(e)
      console.log("Something went wrong!");
    });
  } else {
    alert("getUserMedia not supported on your browser!");
  }

  let i = 0
  async function process () {
    stats.begin()
    if (!mainContext) {
      throw new Error("mainContext is null")
    }
    if (!gradualContext) {
      throw new Error("gradualContext is null")
    }
    gradualContext.drawImage(cameraVideo, 0, i, mainCanvas.width, 1, 0, i, mainCanvas.width, 1)
    mainContext.drawImage(cameraVideo, 0, 0, mainCanvas.width, mainCanvas.height)
    mainContext.drawImage(gradualCanvas, 0, 0, mainCanvas.width, mainCanvas.height)
    mainContext.fillStyle = "rgba(255, 0, 0, 0.5)"
    mainContext.fillRect(0, i, mainCanvas.width, 1)

    i += 1
    stats.end()
    if (i < mainCanvas.height) {
      requestAnimationFrame(process)
    }
  }
}