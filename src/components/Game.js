import React from 'react';
import './Game.css';
function Game() {
    const messageTyped = React.createRef();
    const SnakeMap = React.createRef(null);
    const WichPlayer = 0;
    function sendMessage(message)  {
      fetch("http://192.168.50.164:8080/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elem: message
        }),
      }).then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    };
    function getPlayer()  {
        fetch("http://192.168.50.164:8080/playerSet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elem: WichPlayer
          }),
        }).then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    };
    
    // #region GAME
    let ctx;
    const boardWidth = 500;
    const boardHeight = 500;
    const boardBackground = 'white';
    const snakeColor = 'green';
    const foodColor = 'red';
    const snakeBorder = 'black';
    const unitSize = 25;
    let running = false;
    let xVelocity = unitSize;
    let yVelocity = 0;
    let foodX;
    let foodY;
    const originSnake =[
        {x: unitSize * 4,y:0},
        {x: unitSize * 3,y:0},
        {x: unitSize * 2,y:0},
        {x: unitSize * 1,y:0},
        {x: 0,y:0},
    ]
    let snake =[
        {x: unitSize * 4,y:0},
        {x: unitSize * 3,y:0},
        {x: unitSize * 2,y:0},
        {x: unitSize * 1,y:0},
        {x: 0,y:0},
    ]
    window.addEventListener('keydown', changeDirection);
    function gameStart(){
        
        if(WichPlayer === 0)
        {
            getPlayer();
        }
        ctx = SnakeMap.current.getContext('2d');
        console.log(ctx);
        running = true;
        snake = originSnake;
        clearBoard();
        fetch("http://192.168.50.164:8080/gameOver", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                snake: snake
            }),
          }).then((res) => res.json())
          .then((data) => {
            snake = data.snake;
          });
        createFood();
        drawFood();
        nextTick();
    };
    function nextTick(){
        if(running){
            setTimeout(() => {
                clearBoard();
                drawFood();
                moveSnake();
                drawSnake();
                checkGameOver();
                nextTick();
            }, 200);
        }
        else{
            displayGameOver();
        }
    };
    function clearBoard(){
        ctx.fillStyle = boardBackground;
        ctx.fillRect(0,0,boardWidth,boardHeight);
    }
    function createFood(){
        function randomFood(max, min)
        {
            const randNum = Math.round((Math.random() * (max - min)+ min) / unitSize) * unitSize;
            return randNum; 
        }
        foodX = randomFood(0, boardWidth - unitSize);
        foodY = randomFood(0, boardHeight - unitSize);
    };
    function drawFood(){
        ctx.fillStyle = foodColor;
        ctx.fillRect(foodX,foodY,unitSize,unitSize)
    };
    function moveSnake(){
        const head = {x: snake[0].x + xVelocity,
                      y: snake[0].y + yVelocity};
        snake.unshift(head);
        if(snake[0].x === foodX && snake[0].y === foodY)
        {
            createFood();
        }
        else{
            snake.pop();
        }
    };
    function drawSnake(){
        ctx.fillStyle = snakeColor;
        ctx.strokeStyle = snakeBorder;
        snake.forEach((snakePart) => {
            ctx.fillRect(snakePart.x,snakePart.y,unitSize,unitSize)
            ctx.strokeRect(snakePart.x,snakePart.y,unitSize,unitSize)
        })
    };
    function changeDirection(event){
        const keyPressed = event.keyCode;
        console.log(keyPressed)
        fetch("http://192.168.50.164:8080/changeDirection", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keyPressed: keyPressed
            }),
          }).then((res) => res.json())
          .then((data) => {
            xVelocity = data.xVelocity;
            yVelocity = data.yVelocity;
          });
    };
    function checkGameOver(){
        switch(true){
            case snake[0].x < 0:
                running = false;
                break;
            case snake[0].x >= boardWidth:
                running = false;
                break;
            case snake[0].y < 0:
                running = false;
                break;
            case snake[0].y >= boardHeight:
                running = false;
                break;
            default:
                break;
        }
        for(let i = 1; i < snake.length; i++){
            if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
                running = false;
            }
        }
    };
    function displayGameOver(){
    };
    // #endregion

    return (
      <div className="App" >
        <canvas id='SnakeMap' width={boardWidth} height={boardHeight} ref={SnakeMap}/>
        <br/>
        <input type="text" ref={messageTyped}></input>
        <input type="button" onClick={(e) => sendMessage(messageTyped.current.value)} value={'Send'}></input>
        <input type='button' onClick={gameStart} value={'Game Start'}></input>
      </div>
    );
}
export default Game;