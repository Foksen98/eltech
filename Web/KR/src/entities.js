class Entity {
    constructor() {
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
        this.position = "";
    }


    draw(ctx) {
        spriteManager.drawSprite(ctx, this.position, this.pos_x, this.pos_y);
    }


    update() {}
}


class Player extends Entity {
    constructor() {
        super();
        this.nickname = "";
        this.countCoins = 0;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 25;
        this.left = "hero-left";
        this.right = "hero-right";
        this.position = "hero-right";
        this.jump = false;
        this.win = false;
    }


    update() {
        physicManager.updatePlayer(this);
    }

    // завершение игры
    kill() {
        window.cancelAnimationFrame(ANIM);

        // gameManager.kill(this);
        if (!this.win) {
            gameManager.kill(this);
            soundManager.stopAll();
            soundManager.init();
            soundManager.play("/music/aud3.mp3", {looping: 0, volume: 0.5});
            elem.innerHTML = 'Вы отчислены!';
            elem1.innerHTML = 'Хочу учиться!';
            result.style.display = 'block';
        }
        else {
            gameManager.kill(this, this.countCoins);
        }

        document.getElementById("records").innerHTML = scoreTable.get();

        elem1.onclick = function () {
            gameManager.play();

            this.innerHTML = "";
            elem.innerHTML = "";
        }
    }

    // стрельба мячами
    fire() {
        // создание мяча
        try {
            let obj = new gameManager.factory['ball']();
            obj.type = 'ball';
            obj.pos_x = this.pos_x + this.size_x;
            obj.pos_y = this.pos_y + this.size_y / 2;
            obj.size_x = 50;
            obj.size_y = 50;
            if (this.position === 'hero-right') {
                obj.move_x = 1;
            }
            else {
                obj.move_x = -1;
            }
            gameManager.entities.push(obj);
        }
        catch (ex) {
            console.log("" + e.gid + e.type + ex);
        }
    }


    // касание врагов / плюсов / минусов
    onTouchEntity(obj) {
        // если коснулись врагов
        if (obj.type === "pacman" || obj.type === "minion") {
            this.kill();
        }
        // если коснулись плюса
        if (obj.type === "plus") {
            soundManager.play("/music/aud1.wav", {looping: 0, volume: 0.5});
            this.countCoins += 1;
            let elem = document.getElementById('pCoins');
            elem.innerHTML = this.countCoins;
            obj.kill();

        }
        // если коснулись минуса
        if (obj.type === "minus") {
            soundManager.play("/music/aud1.wav", {looping: 0, volume: 0.5});
            this.countCoins -= 1;
            let elem = document.getElementById('pCoins');
            elem.innerHTML = this.countCoins;
            obj.kill();

        }
        // если коснулись книги
        if (obj.type === "book") {;
            soundManager.stopAll();
            soundManager.init();
            soundManager.play("/music/aud2.mp3", {looping: 0, volume: 1});
            this.win = true;
            this.kill();
        }
    }


    onTouchMap(obj) {
        this.kill();
    };
}


class Pacman extends Entity {
    constructor() {
        super();
        this.move_x = -1;
        this.speed = 40;
        this.distance = 20;
        this.steps = 0;
        this.position = "pacman-right";
        this.left = "pacman-left";
        this.right = "pacman-right";
    }


    update() {
        physicManager.updateEnemy(this);
    }
}


class Minion extends Entity {
    constructor() {
        super();
        this.move_x = -1;
        this.speed = 10;
        this.distance = 15;
        this.steps = 0;
        this.position = "minion";
        this.left = "minion";
        this.right = "minion";
    }


    update() {
        physicManager.updateEnemy(this);
    }
}


class Ball extends Entity {
    constructor() {
        super();
        this.move_x = 0;
        this.speed = 20;
        this.distance = 15;
        this.steps = 0;
        this.position = "ball";
    }


    update() {
        physicManager.updateBall(this);
    }


    kill(obj) {
        if (obj !== null) {
            soundManager.play("/music/aud1.wav", {looping: 0, volume: 0.5});
            gameManager.kill(obj);
        }
        gameManager.kill(this);
    }
}


class Book extends Entity {
    constructor() {
        super();
        this.position = "book";
    }
}


class Plus extends Entity {
    constructor() {
        super();
        this.position = "plus";
    }
}


class Minus extends Entity {
    constructor() {
        super();
        this.position = "minus";
    }
}
