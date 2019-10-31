const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

let x = canvas.width / 2
let y = canvas.height - 30

let dx = 2
let dy = -2 

let paddleHeight = 15
let paddleWidth = 75
let paddleX = (canvas.width-paddleWidth) / 2

const ballRadius = 10

let rightPressed = false
let leftPressed = false

let brickRowCount = 5
let brickColumnCount = 5
let brickWidth = 75
let brickPadding = 10
let brickHeight = 20
let brickOffsetTop = 30
let brickOffsetLeft = 30

let score = 0
let lives = 3

let bricks = []
for(let c = 0; c < brickColumnCount; c++) {
	bricks[c] = []
	for(let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 }
	}
}

function drawLives() {
	ctx.font = "16px Consolas"
	ctx.fillStyle = "#333"
	ctx.fillText("Lives: " + lives, canvas.width - 85, 20)
}

function drawScore() {
	ctx.font = "16px Consolas"
	ctx.fillStyle = "#333"
	ctx.fillText("Score " + score, 8, 20)
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
    	for(let r = 0; r < brickRowCount; r++) {
    		if(bricks[c][r].status == 1) {
    		let brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
    		let brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
    		bricks[c][r].x = brickX
    		bricks[c][r].y = brickY
    		ctx.beginPath()
    		ctx.rect(brickX, brickY, brickWidth, brickHeight)
    		ctx.fillStyle = "#0095DD"
    		ctx.fill()
    		ctx.closePath()
    	}
    	}
    }
}

function keyDownHandler(e) {
	if(e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = true
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true
	}
}

function keyUpHandler(e) {
	if(e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false
	}
}

function collsionDetection() {
	for(let c = 0; c < brickColumnCount; c++) {
		for(let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r]
			if(b.status == 1) {
				if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy
					b.status = 0
					score++

				if(score == brickColumnCount*brickRowCount) {
					alert("Congratulations! You have won the game.")
					window.location.reload()
					clearInterval(interval)
				}
			}
			}
		}
	}
}

function drawPaddle() {
	ctx.beginPath()
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
	ctx.fillStyle = "#333"
	ctx.fill()
	ctx.closePath()

	if(rightPressed) {
		paddleX += 3
		if(paddleX + paddleWidth > canvas.width) {
			paddleX = canvas.width - paddleWidth
		}
	}

	else if(leftPressed) {
		paddleX += -3
		if(paddleX < 0) {
			paddleX = 0
		}
	}
}

function drawBall() {
	ctx.beginPath()
	ctx.arc(x, y, ballRadius, 0, Math.PI*2)
	ctx.fillStyle = "#0095DD"
	ctx.fill()
	ctx.closePath()

	if(y + dy < ballRadius || y + dy > canvas.height) {
		dy = -dy;
	}

	else if(y + dy > canvas.height - ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy
		}
		else {
			lives--
			if(!lives) {
				alert("Game Over")
				window.location.reload()
				clearInterval(interval)
			}
			else {
				x = canvas.width / 2
				y = canvas.height - 30
				dx = 2
				dy = -2
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}

	if(x + dx > canvas.width || x + dx < ballRadius) {
		dx = -dx;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawBall()
	drawPaddle()
	drawBricks()
	collsionDetection()
	drawScore()
	drawLives()
	x += dx
	y += dy
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)
let interval = setInterval(draw, 10)