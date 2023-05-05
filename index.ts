// Import stylesheets
import './style.css';
/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public paddleSpeed: number;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ) {
    if (objectA && objectB) {
      this.gameObjectCollisionRegister.push({
        objectA: objectA,
        objectB: objectB,
        callback: callback,
        scope: scope,
      });
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectB.y < canvas.height &&
        collisionEntry.objectA.x >= collisionEntry.objectB.x &&
        collisionEntry.objectA.x <=
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y >= collisionEntry.objectB.y &&
        collisionEntry.objectA.y <=
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.bind(collisionEntry.scope).apply();
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < 0 ||
        wallCollisionEntry.objectA.y >= canvas.height ||
        wallCollisionEntry.objectA.x < 0 ||
        wallCollisionEntry.objectA.x >= canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

class Scene {
  public children: Array<any>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.physics = new Physics();
  }

  add(gameObject: GameObject) {
    this.children.push(gameObject);
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      gameObject.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      gameObject.render();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    game.scene.update();
    game.scene.render();

    // call next frame
    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */

const CENTER_LINE_WIDTH = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const PADDLE_WIDTH = 10;
const PADDLE_LENGTH = 70;
const PADDLE_SPEED = 20;
const HUMAN_PADDLE_VELOCITY = 40;
const AI_PADDLE_VELOCITY = 10;
const COLOR_SCORE = '#FFF';
const COLOR_BACKGROUND = '#000';
const COLOR_CENTER_LINE = '#FFF';
const COLOR_PADDLE = '#FFF';

/* --------------------------------- ENTITIES ------------------------------- */
class Ball extends GameObject {
  public xVel: number;
  public yVel: number;

  constructor() {
    super();
    this.x = canvas.height / 2;
    this.y = 100;
    this.xVel = -1;
    this.yVel = 1;
    this.width = BALL_SIZE;
    this.height = BALL_SIZE;
  }

  update() {
    super.update();
    this.x += this.xVel * BALL_SPEED;
    this.y += this.yVel * BALL_SPEED;
  }

  render() {
    super.render();
    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(this.x, this.y, BALL_SIZE, BALL_SIZE);
  }

  reset() {
    this.xVel = -1;
    this.yVel = 1;
    this.x = canvas.height / 2;
    this.y = 100;
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

class Paddle extends GameObject {
  constructor(
    playerSide: string,
    paddleSpeed: number,
    paddleController?: PaddleController
  ) {
    super(paddleController);
    if (playerSide == 'LEFT') {
      this.x = PADDLE_WIDTH;
    } else {
      this.x = canvas.width - PADDLE_WIDTH * 2;
    }
    this.y = canvas.height / 2 - PADDLE_LENGTH / 2;
    this.paddleSpeed = paddleSpeed;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_LENGTH;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.fillStyle = COLOR_PADDLE;
    ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_LENGTH);
  }

  moveTo(y: number) {
    if (y > 0 && y + PADDLE_LENGTH < canvas.height) {
      this.y = y;
    }
  }

  moveUp() {
    let y = this.y - this.paddleSpeed;
    if (y > 0) {
      this.y -= this.paddleSpeed;
    }
  }

  moveDown() {
    let y = this.y + this.paddleSpeed;
    if (y + PADDLE_LENGTH < canvas.height) {
      this.y += this.paddleSpeed;
    }
  }
}

class Score extends GameObject {
  private leftScore: number = 0;
  private rightScore: number = 0;

  constructor() {
    super();
  }

  update() {
    super.update();
  }

  render() {
    super.render();

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

/* ------------------------------- InputController  ----------------------------- */

class PaddleController extends InputController {
  constructor() {
    super();

    /*document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'ArrowUp') {
          let y = this.y + gameObject.paddleSpeed;
          if (y > 0) {
            this.y -= gameObject.paddleSpeed;
          }
        } else if (evt.key == 'ArrowDown') {
          let y = gameObject.y + gameObject.paddleSpeed;
          if (y + PADDLE_LENGTH < canvas.height) {
            gameObject.y += gameObject.paddleSpeed;
          }
        }
        evt.preventDefault();
      },
      false
    );*/

    document.addEventListener(
      'mousemove',
      (evt) => {
        let rect = canvas.getBoundingClientRect();
        let y = evt.clientY - rect.top;
        if (y > 0 && y + PADDLE_LENGTH < canvas.height) {
          this.y = y;
        }
      },
      false
    );
  }

  update(gameObject: GameObject) {
    gameObject.y = this.y;
  }
}

/* --------------------------------- SCENE ------------------------------- */
class MainLevel extends Scene {
  private score: Score;
  private humanPaddle: Paddle;
  private aiPaddle: Paddle;
  private ball: Ball = new Ball();

  constructor() {
    super();
  }

  create() {
    this.score = new Score();
    this.add(this.score);

    this.humanPaddle = new Paddle(
      'LEFT',
      HUMAN_PADDLE_VELOCITY,
      new PaddleController()
    );
    this.add(this.humanPaddle);

    this.aiPaddle = new Paddle('RIGHT', AI_PADDLE_VELOCITY);
    this.add(this.aiPaddle);

    this.ball = new Ball();
    this.add(this.ball);

    this.physics.onCollide(
      this.humanPaddle,
      this.ball,
      this.onHumanHitBall,
      this
    );
    this.physics.onCollide(this.aiPaddle, this.ball, this.onAIHitBall, this);
    this.physics.onCollideWalls(this.ball, this.onBallHitWall, this);
  }

  update() {
    super.update();
  }

  render() {
    super.render();

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

  onHumanHitBall() {
    console.log('onHumanHitBall');
    this.ball.changeDirection('EAST');
  }

  onAIHitBall() {
    console.log('onHumanHitBall');
    this.ball.changeDirection('WEST');
  }

  onBallHitWall() {
    if (
      this.ball.y >= canvas.height - BALL_SIZE &&
      this.ball.y <= canvas.height
    ) {
      this.ball.changeDirection('SOUTH');
    }
    if (this.ball.y <= BALL_SIZE && this.ball.y >= 0) {
      this.ball.changeDirection('NORTH');
    }
    if (this.ball.x >= canvas.width) {
      this.score.incrementLeft();
      this.ball.reset();
    } else if (this.ball.x <= BALL_SIZE) {
      this.score.incrementRight();
      this.ball.reset();
    }
  }

  doAIPaddleMove() {
    if (this.ball.x > canvas.width / 2) {
      if (this.aiPaddle.y >= this.ball.y) {
        this.aiPaddle.moveUp();
      } else if (this.aiPaddle.y + PADDLE_LENGTH < this.ball.y) {
        this.aiPaddle.moveDown();
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);

// TODO:
// - allow ai to move paddle (behavior)
// - fix paddle and ball collision for human
// - fix arrow up and down
//
