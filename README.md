# Pong Game

This is a classic implementation of the Pong game, developed in HTML5 Canvas and TypeScript. The objective is to hit the ball back and forth between the two paddles until one of the players misses the ball.

## How to Play

To play, open https://pong-tdmenf.stackblitz.io in your browser. Use the up and down arrow keys to move your paddle up and down. You can also use the mouse to move the paddle. The objective is to hit the ball with your paddle and prevent it from hitting the opposite wall. If the ball hits the wall behind your paddle, the opposing player scores a point.

## Code structure

- `Ball`: Represents the ball in the game, stores position, velocity, and size, and includes methods for displaying the ball, updating its position, resetting it, and changing its direction.
- `Paddle`: Represents a player's paddle, stores position, length, speed, and progress, and includes methods for displaying the paddle, updating its position based on user input, and moving the paddle up or down.
- `Score`: Represents the scores of both players and includes methods for displaying the scores and incrementing them.
- `InputController`: Handles user input for controlling the human player's paddle, listens for keydown and mousemove events, and updates the paddle's position accordingly.
- `Game`: The main class that initializes and runs the game. It contains instances of the Ball, Paddle, and Score classes, handles the game loop, collision detection, and AI-controlled opponent.

## Game Settings

- `CENTER_LINE_WIDTH`: Width of the center line dividing the game field
- `BALL_SIZE`: Size of the ball
- `BALL_SPEED`: Speed at which the ball moves
- `PADDLE_WIDTH`: Width of the paddles
- `PADDLE_LENGTH`: Length of the paddles
- `HUMAN_PADDLE_VELOCITY`: Speed at which the human player's paddle moves
- `AI_PADDLE_VELOCITY`: Speed at which the AI-controlled paddle moves
- `COLOR_SCORE`: Color of the score text
- `COLOR_BACKGROUND`: Color of the game background
- `COLOR_CENTER_LINE`: Color of the center dividing line
- `COLOR_PADDLE`: Color of the paddles

## Game Overview:

The game is a simple 2-player Pong-style game where each player controls a paddle and tries to hit a ball back and forth, with the goal of scoring points by making the ball go past the opponent's paddle. The game ends when one player reaches a predetermined number of points, or when the game is manually stopped.

### Game Objective:

The objective of the game is to score more points than your opponent by hitting the ball past their paddle while also preventing them from hitting the ball past your paddle.

### Controls

- Up Arrow Key: Move the paddle up
- Down Arrow Key: Move the paddle down
- Mouse: Move the paddle up or down

### Game mechanics

- The game is played on a canvas element with two paddles (controlled by the player and AI) and a ball.
- The objective of the game is to score points by hitting the ball with the paddle and making it go past the opponent's paddle.
- The ball starts in the middle of the canvas and moves in a straight line towards one of the players.
- The player must move their paddle up or down to hit the ball and send it back to the opponent's side.
- If the ball hits the opponent's paddle, it bounces back and the game continues.
- If the ball goes past a player's paddle, the other player gets a point.
- The game ends when one player reaches a certain number of points (not implemented in this code).
- The AI-controlled paddle moves up or down to try to intercept the ball and hit it back.
- The player-controlled paddle can be moved with the keyboard arrow keys or by moving the mouse over the canvas.
- The score is displayed on the canvas during gameplay.

### Game entities

- `Ball`: represents the ball that bounces back and forth between the paddles.
- `Paddle`: represents the player-controlled and computer-controlled paddles that move up and down the screen to hit the ball.
- `Score`: represents the score of each player.
- `InputController`: handles the user input for the human-controlled paddle.
- `Game`: coordinates the game's components and controls the game loop.
  The technical details of the game include:

### Technical Details

- The game is written in TypeScript.
- The game's graphics are rendered using the HTML5 canvas element and 2D context.
- The game is controlled by the requestAnimationFrame() method, which is used to update the game's graphics and components on each frame.
- The game uses event listeners to handle user input for the human-controlled paddle.
