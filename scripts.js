let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let gridArray = new Array(grid.childNodes);
let gridWidth = 20, gridHeight = 20;

let snakeSpeed;
let direction;
let score;
let updateId;
let snakes, apples = [];

let restartButton = document.createElement("button");
restartButton.classList.add("restart");
restartButton.innerHTML = "Restart";
restartButton.addEventListener("click", initialize);
document.querySelector("body").appendChild(restartButton);


class Snake {
    constructor(headPosition, direction, length, _gridArray) {
        this.pos = headPosition;
        this.dir = direction;
        this.length = length;
        this.dead = false;
        this.body = [];

        // Create the body
        for (var i = 0; i < length; i++){
            if (this.dir == "RIGHT") {
                this.body.push(headPosition - i);
            } else if (this.dir == "LEFT") {
                this.body.push(headPosition + i);
            } else if (this.dir == "UP") {
                this.body.push(headPosition - 20*i)            
            } else if (this.dir == "DOWN") {
                this.body.push(headPosition + 20*i)            
            }
        }

        for (let i = 0; i < _gridArray[0].length; i++) {
            if (this.body.includes(i)) { 
                _gridArray[0][i].classList.add("snake");
            }
        }

    }

    update(direction, _gridArray) {
        this.dir = direction;
        // move the rest of the body
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = this.body[i - 1];
        }

        // Move the head
        if (this.dir == "RIGHT") this.body[0]++;
        else if (this.dir == "LEFT") this.body[0]--;
        else if (this.dir == "UP") this.body[0] -= 20;
        else if (this.dir == "DOWN") this.body[0] += 20;

        this.pos = this.body[0];

        if (this.body.slice(1).includes(this.body[0])){
            this.dead = true;
        }

        if (this.body[0] < 0 || this.body[0] >= gridWidth * gridHeight){
           this.dead = true; 
        }

        if ((this.body[0] % 20 == 0) && (this.dir == "LEFT")) {
            this.dead = true;
        }

        if (((this.body[0] + 1) % 20 == 0) && (this.dir == "RIGHT")) {
            this.dead = true;
        }
        
    }

    draw (_gridArray) {
        for (let i = 0; i < _gridArray[0].length; i++) {
            if (_gridArray[0][i].classList.contains("snake")) { 
                _gridArray[0][i].classList.remove("snake");
            }
        }

        for (let i = 0; i < _gridArray[0].length; i++) {
            if (this.body.includes(i)) { 
                _gridArray[0][i].classList.add("snake");
            }
        }
    }

    elongate() {
        if (this.dir == "RIGHT") this.body.push(this.body[this.body.length - 1] - 1);
        else if (this.dir == "LEFT") this.body.push(this.body[this.body.length - 1] + 1);
        else if (this.dir == "UP") this.body.push(this.body[this.body.length - 1] + 20);
        else if (this.dir == "DOWN") this.body.push(this.body[this.body.length - 1] - 20);

        this.length++;
    }
}

class Apple {
    constructor(position, _gridArray) {
        this.pos = position;
        for (let i = 0; i < _gridArray[0].length; i++) {
            if (this.pos == i) { 
                _gridArray[0][i].classList.add("apple");
            }
        }
    }

    move(_gridArray) {
        for (let i = 0; i < _gridArray[0].length; i++) {
            if (this.pos == i) { 
                _gridArray[0][i].classList.remove("apple");
            }   
        }

        this.pos = Math.floor(Math.random() * gridWidth * gridHeight);

        for (let i = 0; i < _gridArray[0].length; i++) {
            if (this.pos == i) { 
                _gridArray[0][i].classList.add("apple");
            }
        }
    }
}

function initialize() {
    scoreDisplay.innerHTML = "Score: 0";
    snakeSpeed = 75;
    direction = "RIGHT";
    score = 0;
    
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        const unit = document.createElement("div");
        unit.classList.add("unit");
        grid.appendChild(unit);
    }

    snakes = [];
    apples = [];
    snakes.push(new Snake(5, "RIGHT", 4, gridArray));
    apples.push(new Apple(Math.floor(Math.random() * gridWidth * gridHeight), gridArray))
    
    document.addEventListener('keydown', updateDirection);
    clearTimeout(updateId);
    update();
}

function update() { 
    updateId = setTimeout(update, snakeSpeed);
    snakeSpeed = 75 - score*2;
    snakes.forEach(snake => {
        snake.update(direction, gridArray); 

        if (snake.dead) {
            clearTimeout(updateId);
            scoreDisplay.innerHTML = "You Lost, Your Score is " + score;
            return score;
        }

        snake.draw(gridArray);

        apples.forEach(apple => {
            if (apple.pos == snake.pos){
                snake.elongate();
                apple.move(gridArray);
                score++;
                scoreDisplay.innerHTML = "Score: " + score;
            } 
        });
    });
}

function updateDirection(e) {
    if (e.key == "ArrowLeft" || e.key == "a") {
        direction = "LEFT";
    } else if (e.key == "ArrowRight" || e.key == "d") {
        direction = "RIGHT";
    } else if (e.key == "ArrowUp" || e.key == "w") {
        direction = "UP";
    } else if (e.key == "ArrowDown" || e.key == "s") {
        direction = "DOWN";
    }
}

initialize();