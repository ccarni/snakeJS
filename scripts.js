let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let status = document.getElementById("status");
let gridWidth = 20, gridHeight = 20;

let direction;
let score;
let updateId;
let snakes, apples = [];

class Snake {
    constructor(headPosition, direction, length) {
        const gridArray = new Array(grid.childNodes);
        this.pos = headPosition;
        this.dir = direction;
        this.length = length;
        this.dead = false;

        this.body = [];

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

        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.body.includes(i)) { 
                gridArray[0][i].classList.add("snake");
            }
        }

    }

    update(direction) {
        this.dir = direction;
        const gridArray = new Array(grid.childNodes);

        // Delete the snake from its current position
        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.body.includes(i)) { 
                gridArray[0][i].classList.remove("snake");
            }
        }

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

        // Add the body at the new position 
        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.body.includes(i)) { 
                gridArray[0][i].classList.add("snake");
            }
        }
        // Check if the snake has collided with its own body
        if (this.body.slice(1).includes(this.body[0])){
            this.dead = true;
        }

        // Check vertical bounds
        if (this.body[0] < 0 || this.body[0] >= gridWidth * gridHeight){
           this.dead = true; 
        }

        // Check left bounds
        if ((this.body[0] % 20 == 0) && (this.dir == "LEFT")) {
            this.dead = true;
        }

        if (((this.body[0] + 1) % 20 == 0) && (this.dir == "RIGHT")) {
            this.dead = true;
        }
        
    }

    elongate() {
        if (this.dir == "RIGHT") this.body.push(this.body[this.body.length - 1] - 1);
        else if (this.dir == "LEFT") this.body.push(this.body[this.body.length - 1] + 1);
        else if (this.dir == "UP") this.body.push(this.body[this.body.length - 1] + 20);
        else if (this.dir == "DOWN") this.body.push(this.body[this.body.length - 1] - 20);
    }
}

class Apple {
    constructor(position) {
        this.pos = position;
        const gridArray = new Array(grid.childNodes);
        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.pos == i) { 
                gridArray[0][i].classList.add("apple");
            }
        }
    }

    move() {
        const gridArray = new Array(grid.childNodes);
        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.pos == i) { 
                gridArray[0][i].classList.remove("apple");
            }   
        }

        this.pos = Math.floor(Math.random() * gridWidth * gridHeight);

        for (let i = 0; i < gridArray[0].length; i++) {
            if (this.pos == i) { 
                gridArray[0][i].classList.add("apple");
            }
        }
    }
}

function initialize() {

    grid = document.getElementById("grid");
    scoreDisplay = document.getElementById("score");
    status = document.getElementById("status");
    gridWidth = 20, gridHeight = 20;

    direction = "RIGHT";
    score = 0;

    // Setup the grid
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        const unit = document.createElement("div");
        unit.classList.add("unit");
        grid.appendChild(unit);
    }

    snakes = [];
    apples = [];
    snakes.push(new Snake(5, "RIGHT", 4));
    apples.push(new Apple(Math.floor(Math.random() * gridWidth * gridHeight)))
    
    updateId = setInterval(update, 75);
    document.addEventListener('keydown', updateDirection);
}

function update() { 
    snakes.forEach(snake => {
        snake.update(direction); 

        if (snake.dead) {
            clearInterval(updateId);
            status.innerHTML = "Status: You Lost";
        }

        apples.forEach(apple => {
            if (apple.pos == snake.pos){
                snake.elongate();
                apple.move();
                score++;
                scoreDisplay.innerHTML = "Score: " + score;
            } 
        });
    });

}

function updateDirection(e) {
    if (e.key == "ArrowLeft") {
        direction = "LEFT";
    } else if (e.key == "ArrowRight") {
        direction = "RIGHT";
    } else if (e.key == "ArrowUp") {
        direction = "UP";
    } else if (e.key == "ArrowDown") {
        direction = "DOWN";
    }
}

initialize();