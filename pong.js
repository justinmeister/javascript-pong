function Background() {
    var that = this;
    this.ready = false;
    this.image = new Image()
    this.image.onload = function() {
        that.ready = true;
    };
    this.image.src = "flapBG.png";
};


function Paddle(x, y) {
    var that = this;
    this.color = "rgb(240,240,240)"
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 100;
    this.yVelocity = 0;
    this.getBottom = function(){
        return that.y + that.height;
    }
    this.getRight = function(){
        return that.x + that.width
    }


};


function Ball(canvas) {
    var that = this;
    this.color = "rgb(250,250,250)";
    this.x = canvas.width / 2;
    this.y = canvas.width / 2;
    this.width = 10;
    this.height = 10;
    this.xVelocity = -200;
    this.yVelocity = -200;
}


function Game() {
    var that = this;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 500;
    document.body.appendChild(this.canvas);

    this.background = new Background();
    this.paddle1 = new Paddle(50, 50);
    this.paddle2 = new Paddle(this.canvas.width-50, 50);
    this.ball = new Ball(this.canvas);

    this.keysDown = {};
    this.now = Date.now();
    this.then = Date.now();
    this.delta = this.now - this.then;


    this.addListeners = function() {
        addEventListener("keydown", function(e) {
            that.keysDown[e.keyCode] = true;
        }, false);

        addEventListener("keyup", function(e) {
            delete that.keysDown[e.keyCode];
        }, false);
    }();



    this.update = function(modifier) {
        that.checkInput(modifier);
        that.checkCollisions()

        that.paddle1.y += that.paddle1.yVelocity * modifier;
        that.paddle2.y += that.paddle2.yVelocity * modifier;
        that.ball.x += that.ball.xVelocity * modifier;
        that.ball.y += that.ball.yVelocity * modifier;

    };


    this.checkCollisions = function() {
        if (that.ball.y <= 0) {
            that.ball.yVelocity *= -1
        }

        else if (that.ball.y + that.ball.height >= that.canvas.height) {
            that.ball.yVelocity *= -1
        }

        if (that.ball.x < that.paddle1.getRight() 
            && that.ball.y > that.paddle1.y
            && that.ball.y < that.paddle1.getBottom()) {
            that.ball.xVelocity *= -1
        }

        else if (that.ball.x > that.paddle2.x 
                 && that.ball.y > that.paddle1.y
                 && that.ball.y < that.paddle1.getBottom()) {
                 that.ball.xVelocity *= -1
        }


    }


    this.checkInput = function(modifier) {
        if (38 in that.keysDown) {
            if (that.paddle1.y > 0) {
                that.paddle1.yVelocity = (-400);
            }
            else {
                that.paddle1.y = 0;
                that.paddle1.yVelocity = 0;
            }
        }
        else if (40 in that.keysDown) {
            if (that.paddle1.getBottom() < that.canvas.height) {
                that.paddle1.yVelocity = (400);
            }

            else {
                that.paddle1.y = (that.canvas.height - that.paddle1.height);
                that.paddle1.yVelocity = 0;
            }
        }

        else {
            that.paddle1.yVelocity = 0;
        }

        if (87 in that.keysDown) {
            if (that.paddle2.y > 0) {
                that.paddle2.yVelocity = (-400);
            }
            else {
                that.paddle2.y = 0;
                that.paddle2.yVelocity = 0;
            }
        }

        else if (83 in that.keysDown) {
            if (that.paddle2.getBottom() < that.canvas.height) {
                that.paddle2.yVelocity = 400;
            }

            else {
                that.paddle2.y = (that.canvas.height - that.paddle2.height);
                that.paddle2.yVelocity = 0;
            }
        }

        else {
            that.paddle2.yVelocity = 0;
        }


       
    };


    this.render = function() {
        if (that.background.ready) {
            that.ctx.drawImage(that.background.image, 0, 0);
        }

        that.drawRectangle(that.paddle1);
        that.drawRectangle(that.paddle2);
        that.drawRectangle(that.ball);
    };


    this.drawRectangle = function(rect) {
        that.ctx.fillStyle = rect.color;
        that.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    };
    


    this.mainLoop = function() {
        that.now = Date.now();
        that.delta = that.now - that.then;
        console.log(that.delta);
        that.update(that.delta/1000);
        that.render();
        that.then = that.now;
    };

};

var game = new Game();
setInterval(game.mainLoop, 1000/60);



