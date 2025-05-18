import React from 'react';
import './WorkingSnake.css';
function Game() {
    const SnakeMap = React.createRef(null);    
    // #region GAME
    let ctx;
    const boardWidth = 500;
    const boardHeight = 500;
    const boardBackground = 'white';
    const snakeColor = 'green';
    const foodColor = 'red';
    const snakeBorder = 'black';
    const unitSize = 25;
    let score = 0;
    let running = false;
    let xVelocity = unitSize;
    let yVelocity = 0;
    let foodX;
    let foodY;
    let directionQueue = [];
    let snake =[
        {x: unitSize * 4,y:0},
        {x: unitSize * 3,y:0},
        {x: unitSize * 2,y:0},
        {x: unitSize * 1,y:0},
        {x: 0,y:0},
    ]
    window.addEventListener('keydown', changeDirection);
    function gameStart(){
        if(running) return;
        score = 0;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            { x: unitSize * 4, y: 0 },
            { x: unitSize * 3, y: 0 },
            { x: unitSize * 2, y: 0 },
            { x: unitSize * 1, y: 0 },
            { x: 0, y: 0 },
        ];
        directionQueue = []
        ctx = SnakeMap.current.getContext('2d');
        console.log(ctx);
        running = true;
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
        ctx.fillStyle  = boardBackground;
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
        if (directionQueue.length > 0) {
            const nextDir = directionQueue.shift();
            xVelocity = nextDir.x;
            yVelocity = nextDir.y;
        }   
        const head = {x: snake[0].x + xVelocity,
                      y: snake[0].y + yVelocity};
        snake.unshift(head);
        if(snake[0].x === foodX && snake[0].y === foodY)
        {
            score++;
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
    function changeDirection(event) {
        const keyPressed = event.keyCode;
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;
    
        const lastDirection = directionQueue.length > 0
            ? directionQueue[directionQueue.length - 1]
            : { x: xVelocity, y: yVelocity };
    
        const goingUp = lastDirection.y === -unitSize;
        const goingDown = lastDirection.y === unitSize;
        const goingRight = lastDirection.x === unitSize;
        const goingLeft = lastDirection.x === -unitSize;
    
        switch (true) {
            case keyPressed === LEFT && !goingRight:
                directionQueue.push({ x: -unitSize, y: 0 });
                break;
            case keyPressed === UP && !goingDown:
                directionQueue.push({ x: 0, y: -unitSize });
                break;
            case keyPressed === RIGHT && !goingLeft:
                directionQueue.push({ x: unitSize, y: 0 });
                break;
            case keyPressed === DOWN && !goingUp:
                directionQueue.push({ x: 0, y: unitSize });
                break;
            default:
                break;
        }
    }
    
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
    function displayGameOver() {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'red';
        ctx.strokeText('KONIEC GRY', boardWidth / 2, boardHeight / 2);
        ctx.font = '25px Arial';
        ctx.fillText(`WYNIK: ${score}`, boardWidth / 2, boardHeight / 2 + 40);
    }
    
    // #endregion

    return (
      <div className="App" style={{marginTop: '100px'}} >
        <canvas id='SnakeMap' width={boardWidth} height={boardHeight} ref={SnakeMap}/>
        <br/>
        <input type='button' onClick={gameStart} value={'Rozpocznij'}></input>
      </div>
    );
}
export default Game;