// Import stylesheets
import './style.css';

var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

const CENTER_LINE_WIDTH = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const PADDLE_WIDTH = 10;
const PADDLE_LENGTH = 70;
const HUMAN_PADDLE_VELOCITY = 40;
const AI_PADDLE_VELOCITY = 10;
const COLOR_SCORE = '#FFF';
const COLOR_BACKGROUND = '#000';
const COLOR_CENTER_LINE = '#FFF';
const COLOR_PADDLE = '#FFF';

class Ball {
  public x: number;
  public y: number;
  public xVel: number;
  public yVel: number;

  constructor() {
    this.x = canvas.height / 2;
    this.y = 300;
    this.xVel = -1;
    this.yVel = 1;
  }

  display() {
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(this.x, this.y, BALL_SIZE, BALL_SIZE);
  }

  update() {
    this.x += this.xVel * BALL_SPEED;
    this.y += this.yVel * BALL_SPEED;
    this.display();
  }

  reset() {
    this.xVel = -1;
    this.yVel = 1;
    this.x = canvas.height / 2;
    this.y = 300;
  }

  changeDirection(compassDirection) {
    if (compassDirection == 'NORTH') {
      this.xVel = this.xVel;
      this.yVel = -this.yVel;
    } else if (compassDirection == 'SOUTH') {
      this.xVel = this.xVel;
      this.yVel = -this.yVel;
    } else if (compassDirection == 'WEST') {
      this.xVel = -this.xVel;
      this.yVel = this.yVel;
    } else if (compassDirection == 'EAST') {
      this.xVel = this.yVel;
      this.yVel = -this.xVel;
    }
  }
}

class Paddle {
  public x: number;
  public y: number;
  public progress: number = 1;
  public paddleSpeed: number = 20;

  constructor(playerSide: string, paddleSpeed: number) {
    if (playerSide == 'LEFT') {
      this.x = PADDLE_WIDTH;
    } else {
      this.x = canvas.width - PADDLE_WIDTH * 2;
    }
    this.y = canvas.height / 2 - PADDLE_LENGTH / 2;
    this.paddleSpeed = paddleSpeed;
    this.display();
  }

  display() {
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_LENGTH);
  }

  update(progress) {
    this.progress = progress / 16;
    this.display();
  }

  moveTo(y: number) {
    if (y > 0 && y + PADDLE_LENGTH < canvas.height) {
      this.y = y;
    }
  }

  moveUp() {
    let y = this.y - this.progress * this.paddleSpeed;
    if (y > 0) {
      this.y -= this.progress * this.paddleSpeed;
    }
  }

  moveDown() {
    let y = this.y + this.progress * this.paddleSpeed;
    if (y + PADDLE_LENGTH < canvas.height) {
      this.y += this.progress * this.paddleSpeed;
    }
  }
}

class Score {
  private leftScore: number = 0;
  private rightScore: number = 0;

  constructor() {
    this.display();
  }

  display() {
    let leftPosition = canvas.width / 3;
    let rightPosition = canvas.width - canvas.width / 3;
    ctx.font = '48px Verdana';
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.leftScore), leftPosition, 50);
    ctx.fillText(String(this.rightScore), rightPosition, 50);
  }

  incrementLeft() {
    this.leftScore += 1;
  }

  incrementRight() {
    this.rightScore += 1;
  }
}

class InputController {
  private paddle: Paddle;

  constructor(paddle: Paddle) {
    this.paddle = paddle;

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'ArrowUp') {
          this.paddle.moveUp();
        } else if (evt.key == 'ArrowDown') {
          this.paddle.moveDown();
        }
        evt.preventDefault();
      },
      false
    );

    document.addEventListener(
      'mousemove',
      (evt) => {
        let rect = canvas.getBoundingClientRect();
        let y = evt.clientY - rect.top;
        this.paddle.moveTo(y);
      },
      false
    );
  }
}

class Game {
  private score: Score = new Score();
  private humanPaddle: Paddle = new Paddle('LEFT', HUMAN_PADDLE_VELOCITY);
  private aiPaddle: Paddle = new Paddle('RIGHT', AI_PADDLE_VELOCITY);
  private ball: Ball = new Ball();

  private id: number;
  private lastRenderer: number = 0;

  constructor() {
    //Setup Components
    let inputController = new InputController(this.humanPaddle);
    this.id = requestAnimationFrame(this.gameLoop);
  }
  // Setup Game Area
  setup() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //dividing line
    ctx.beginPath();
    ctx.strokeStyle = COLOR_CENTER_LINE;
    ctx.setLineDash([10]);
    ctx.lineWidth = CENTER_LINE_WIDTH;
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();
  }

  gameLoop(timestamp) {
    var progress = timestamp - game.lastRenderer;
    game.lastRenderer = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // use game object because of requewstAnimationFrame
    // calling function with this scope
    game.setup();
    game.humanPaddle.update(progress);
    game.aiPaddle.update(progress);
    game.ball.update();
    game.checkCollision();
    game.checkBehaviors();
    game.score.display();

    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }

  checkCollision() {
    this.doBallPaddleCollision(game.humanPaddle, game.ball);
    this.doBallPaddleCollision(game.aiPaddle, game.ball);
    this.doBallTopBottomWallCollision(game.ball);
    this.doBallLeftRightWallCollision(game.ball);
  }

  checkBehaviors() {
    this.doAIPaddleMove(this.aiPaddle, this.ball);
  }

  doBallPaddleCollision(paddle: Paddle, ball: Ball) {
    if (
      paddle.x + PADDLE_WIDTH >= ball.x &&
      paddle.x <= ball.x &&
      paddle.y <= ball.y &&
      paddle.y + PADDLE_LENGTH >= ball.y
    ) {
      ball.changeDirection('WEST');
      ball.update();
    }
    if (
      paddle.x > canvas.width / 2 &&
      paddle.x <= ball.x + BALL_SIZE &&
      paddle.x + PADDLE_LENGTH >= ball.x &&
      paddle.y <= ball.y &&
      paddle.y + PADDLE_LENGTH >= ball.y
    ) {
      ball.changeDirection('EAST');
      ball.update();
    }
  }

  doBallTopBottomWallCollision(ball: Ball) {
    if (ball.y >= canvas.height - BALL_SIZE && ball.y <= canvas.height) {
      ball.changeDirection('SOUTH');
      ball.update();
    }
    if (ball.y <= BALL_SIZE && ball.y >= 0) {
      ball.changeDirection('NORTH');
      ball.update();
    }
  }

  doBallLeftRightWallCollision(ball: Ball) {
    if (ball.x >= canvas.width) {
      game.score.incrementLeft();
      ball.reset();
    } else if (ball.x <= BALL_SIZE) {
      game.score.incrementRight();
      ball.reset();
    }
  }

  doAIPaddleMove(paddle: Paddle, ball: Ball) {
    if (ball.x > canvas.width / 2) {
      if (paddle.y >= ball.y) {
        paddle.moveUp();
      } else if (paddle.y + PADDLE_LENGTH < ball.y) {
        paddle.moveDown();
      }
    }
  }
}

let game = new Game();
