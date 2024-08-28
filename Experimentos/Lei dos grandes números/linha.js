class Linha {
    constructor(x, y, altura, cor=[200,100,9]) {
        this.x = x;
        this.y = y;
        this.altura = altura;
        this.movendo = false;
        this.cor = cor;
    }
    mover(targetX, targetY) {
        this.movendo = true;
        this.targetX = targetX;
        this.targetY = targetY;
    }
    draw() {
        push();
        if (this.movendo) {
            this.x = lerp(this.x, this.targetX, 0.3);
            this.y = lerp(this.y, this.targetY, 0.1);
        }
        stroke(this.cor[0], this.cor[1], this.cor[2]);
        line(this.x, this.y, this.x, this.y-this.altura);
        pop();
    }
    update() {
        this.draw();
    }
}