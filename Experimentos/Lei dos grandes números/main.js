var linhas = [];
var alturas = [];
var linhasParaMover = [];
var total = 200;
var posicaoAtual = 15;
var posicaoAtualPopX = 15;
var posicaoAtualPopY = 140;
var somaDeAmostras = 0;
var somaDePopulacao = 0;
var mediaPopulacional = 0;
var mediaAmostral = 0;
var historicoDeMedias = [];
var linhas2 = [];

function setup() {
    canvasW = 1025;
    canvasH = 520;
    var canvas = createCanvas(canvasW, canvasH);
    canvas.parent("canvasContainer");
    canvas.mouseClicked(clique);
    
    for (i=0; i<total; i++) {
        altura = Math.floor(random(5,100));
        alturas.push(altura);
        somaDePopulacao += altura;
    }
    alturas.sort(function(a,b) { return a-b; });
    for (i=0; i<total; i++) {
        linhas.push(new Linha(posicaoAtualPopX,posicaoAtualPopY,alturas[i]));
        linhas2.push(new Linha(posicaoAtualPopX,posicaoAtualPopY,alturas[i],[90,200,100]));
        posicaoAtualPopX += 5;
        linhasParaMover.push(i);
    }
    mediaPopulacional = somaDePopulacao/linhas.length;
}

function draw() {
    background(0);
    push();
    fill(255);
    text("POPULAÇÃO: " + linhas.length, 10, 10, 500, 30);
    stroke(255);
    fill(0);
    rect(10, 30, 1005, 115);
    pop();
    
    push();
    translate(0, 180);
    fill(255);
    text("AMOSTRAS: " + (total-linhasParaMover.length) + " - (" + Math.floor((total-linhasParaMover.length)/total*100) + "% da população)", 10, 10, 500, 30);
    stroke(255);
    fill(0);
    rect(10, 30, 1005, 115);
    translate(0,140);
    stroke(200,255,200);
    drawingContext.setLineDash([5]);
    line(10,-(Math.floor(mediaPopulacional)),1015,-(Math.floor(mediaPopulacional)));
    stroke(255,100,100);
    drawingContext.setLineDash([]);
    line(10,-(Math.floor(mediaAmostral)),1015,-(Math.floor(mediaAmostral)))
    pop();
    
    push();
    translate(0,130)
    fill(255);
    text("MÉDIA DA ALTURA POPULACIONAL: " + (mediaPopulacional).toFixed(1).replace(".",","), 10, 20, 500, 30);
    pop();
    
    push();
    translate(0,310);
    fill(255);
    text("MÉDIA DA ALTURA AMOSTRAL: " + (mediaAmostral).toFixed(1).replace(".",","), 10, 20, 500, 30);
    translate(420,0)
    stroke(200,255,200);
    drawingContext.setLineDash([5]);
    line(250,27,280,27);
    noStroke();
    drawingContext.setLineDash([]);
    text("MÉDIA POPULACIONAL", 285, 20, 350, 30);
    translate(200,0)
    stroke(255,100,100);
    line(250,27,280,27);
    noStroke();
    drawingContext.setLineDash([]);
    text("MÉDIA AMOSTRAL", 285, 20, 350, 30);
    pop();
    
    push();
    translate(0,360);
    fill(255);
    text("HISTÓRICO DAS MÉDIAS", 10, 10, 500, 30);
    stroke(255);
    fill(0);
    rect(10, 30, 1005, 115);
    translate(0,140);
    stroke(200,255,200);
    drawingContext.setLineDash([5]);
    // line(10,-(Math.floor(mediaPopulacional)),1015,-(Math.floor(mediaPopulacional)));
    stroke(255,100,100);
    drawingContext.setLineDash([]);
    // line(10,-(Math.floor(mediaAmostral)),1015,-(Math.floor(mediaAmostral)))
    historicoDeMedias.forEach((media, i) => {
        stroke(255);
        strokeWeight(2);
        point(15+(5*i), -Math.floor(media));
    });
    pop();
    
    linhas2.forEach((linha) => {
        linha.update();
    });
    linhas.forEach((linha) => {
        linha.update();
    });
}

function clique() {
    if (linhasParaMover.length > 0) {
        linhaEscolhida = random(linhasParaMover);
        linhas[linhaEscolhida].mover(posicaoAtual,320);
        somaDeAmostras += linhas[linhaEscolhida].altura;
        linhasParaMover.splice(linhasParaMover.indexOf(linhaEscolhida),1)
        mediaAmostral = somaDeAmostras/(total-linhasParaMover.length);
        historicoDeMedias.push(mediaAmostral);
        posicaoAtual += 5;
    }
}