var canvasW, canvasH;
let circle;
var result1;

function setup() {
    canvasW = 500;
    canvasH = 500;
    var canvas = createCanvas(canvasW,canvasH);
    canvas.parent("canvasContainer")
    canvas.mouseClicked(canvasClick);
    circle = new Circle(canvas,_size,tolerance,-tolerance);
    circle.jump(canvasW,canvasH);
}

function draw() {
    background(200);
    circle._showTolerance = showTolerance;
    circle._showCenter = showCenter;
    circle._showPoints = showPoints;
    circle._jump = jump;
    circle._size = _size;
    circle._usl = tolerance;
    circle._lsl = -tolerance;
    circle.update();
    push();
    translate(20, canvasH-20);
    line(0, 0, 40, 0);
    line(0, 0, 0, -40);
    text("X", 40, 15);
    text("Y", -15, -40);
    translate(40,0);
    fill(0, 0, 0);
    triangle(-5, -5, 5, 0, -5, 5);
    translate(-40,-40);
    rotate(-PI/2);
    // fill(247, 208, 88);
    triangle(-5, -5, 5, 0, -5, 5);
    pop();
}

function canvasClick() {
    circle.click();
    updateCharts();
}

function normalDensity(x, mean, stddev) {
    return (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stddev, 2));
}

function reset1() {
    circle.reset();
    updateCharts();
}

function updateCharts() {
    result1 = circle.calculateStatistics();

    var scatterSize = [600,150]
    var histogramSize = [300,150]
    var capacitySize = [300,150]

    ////////// X AXIS
    // Statistics 
    try {
        var statisticsHtml = `
        LSE: ${result1['USL'].toFixed(2)}<br>
        LIE: ${result1['LSL'].toFixed(2)}<br>
        Média: ${result1['x']['Mean'].toFixed(2)}<br>
        pp: ${result1['x']['pp'].toFixed(3)}<br>
        ppk: ${result1['x']['ppk'].toFixed(3)}<br>
        cp: ${result1['x']['cp'].toFixed(3)}<br>
        cpk: ${result1['x']['cpk'].toFixed(3)}
        `
    }
    catch(e) {
        if (e instanceof TypeError) {
            return;
        }
    }
    document.getElementById('statistics').innerHTML = statisticsHtml

    var numberOfPoints = result1['x']['Values'].length;
    document.getElementById('count').innerHTML = `Total de pontos: ${numberOfPoints}`

    // Scatter X
    var trace1 = {
        y: result1['x']['Values'],
        type: 'scatter',
        name: 'Desvio X'
    };
    
    var upperLimit = {
        y: Array(numberOfPoints).fill(result1['USL']),
        mode: 'lines',
        type: 'scatter',
        name: 'Tol. Sup.',
        line: {
            color: 'rgb(255,0,0)'
        }
    }
    
    var lowerLimit = {
        y: Array(numberOfPoints).fill(result1['LSL']),
        mode: 'lines',
        type: 'scatter',
        name: 'Tol. Inf.',
        line: {
            color: 'rgb(255,0,0)'
        }
    };

    var data = [trace1, upperLimit, lowerLimit];
    var layout = {
        width:scatterSize[0], height:scatterSize[1],
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        },
        title: 'Desvios em X',
        showlegend: false,
    }
    Plotly.newPlot('scatterChart', data, layout, {displayModeBar: false});
    
    // Histogram x
    var trace = {
        x: result1['x']['Values'],
        type: 'histogram',
    };
    
    var data = [trace];
    var layout = {
        width:histogramSize[0],
        height:histogramSize[1],
        title: 'Histograma',
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        }
    }
    Plotly.newPlot('histogramChart', data, layout, {displayModeBar: false});
    
    // Density
    var yDensity = [];
    var xValues = [];
    var min = Math.min(...result1['x']['Values']);
    var max = Math.max(...result1['x']['Values']);

    
    if (result1['LSL'] < min) {
        min = result1['LSL'];
    }
    if (result1['USL'] > max) {
        max = result1['USL'];
    }
    
    min *= 1.2;
    max *= 1.2;
    
    for (var x = min; x <= max; x += 1) {
        xValues.push(x)
        yDensity.push(normalDensity(x, result1['x']['Mean'], result1['x']['StdDev']));
    }

    var density = {
        x: xValues,
        y: yDensity,
        mode: 'lines',
    }

    var data = [density];
    var layout = {
        title: 'Capacidade do processo',
        width:capacitySize[0],
        height:capacitySize[1],
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        },
        yaxis: {
            showticklabels: false,
        },
        shapes: [
            {
                type: 'line',
                x0: result1['LSL'],
                x1: result1['LSL'],
                y0: 0,
                y1:1,
                yref: 'paper',
                line: {
                    color: 'red',
                    width: 1,
                }
            },
            {
                type: 'line',
                x0: result1['USL'],
                x1: result1['USL'],
                y0: 0,
                y1:1,
                yref: 'paper',
                line: {
                    color: 'red',
                    width: 1,
                }
            }
        ],
    }
    Plotly.newPlot('bellChart', data, layout, {displayModeBar: false});

    ////////// Y AXIS
    // Statistics 
    try {
        var statisticsHtml = `
        LSE: ${result1['USL'].toFixed(2)}<br>
        LIE: ${result1['LSL'].toFixed(2)}<br>
        Média: ${result1['y']['Mean'].toFixed(2)}<br>
        pp: ${result1['y']['pp'].toFixed(3)}<br>
        ppk: ${result1['y']['ppk'].toFixed(3)}<br>
        cp: ${result1['y']['cp'].toFixed(3)}<br>
        cpk: ${result1['y']['cpk'].toFixed(3)}
        `
    }
    catch(e) {
        if (e instanceof TypeError) {
            return;
        }
    }
    document.getElementById('statistics2').innerHTML = statisticsHtml

    var numberOfPoints = result1['y']['Values'].length;
    document.getElementById('count2').innerHTML = `Total de pontos: ${numberOfPoints}`

    // Scatter Y
    var trace1 = {
        y: result1['y']['Values'],
        type: 'scatter',
        name: 'Desvio Y'
    };
    
    var upperLimit = {
        y: Array(numberOfPoints).fill(result1['USL']),
        mode: 'lines',
        type: 'scatter',
        name: 'Tol. Sup.',
        line: {
            color: 'rgb(255,0,0)'
        }
    }
    
    var lowerLimit = {
        y: Array(numberOfPoints).fill(result1['LSL']),
        mode: 'lines',
        type: 'scatter',
        name: 'Tol. Inf.',
        line: {
            color: 'rgb(255,0,0)'
        }
    };

    var data = [trace1, upperLimit, lowerLimit];
    var layout = {
        width:scatterSize[0], height:scatterSize[1],
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        },
        title: 'Desvios em Y',
        showlegend: false,
    }
    Plotly.newPlot('scatterChart2', data, layout, {displayModeBar: false});
    
    // Histogram y
    var trace = {
        x: result1['y']['Values'],
        type: 'histogram',
    };
    
    var data = [trace];
    var layout = {
        width:histogramSize[0],
        height:histogramSize[1],
        title: 'Histograma',
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        }
    }
    Plotly.newPlot('histogramChart2', data, layout, {displayModeBar: false});
    
    // Density
    var yDensity = [];
    var xValues = [];
    var min = Math.min(...result1['y']['Values']);
    var max = Math.max(...result1['y']['Values']);

    
    if (result1['LSL'] < min) {
        min = result1['LSL'];
    }
    if (result1['USL'] > max) {
        max = result1['USL'];
    }
    
    min *= 1.2;
    max *= 1.2;
    
    for (var x = min; x <= max; x += 1) {
        xValues.push(x)
        yDensity.push(normalDensity(x, result1['y']['Mean'], result1['y']['StdDev']));
    }

    var density = {
        x: xValues,
        y: yDensity,
        mode: 'lines',
    }

    var data = [density];
    var layout = {
        title: 'Capacidade do processo',
        width:capacitySize[0],
        height:capacitySize[1],
        margin: {
            l:40,
            t:40,
            b:40,
            r:40
        },
        yaxis: {
            showticklabels: false,
        },
        shapes: [
            {
                type: 'line',
                x0: result1['LSL'],
                x1: result1['LSL'],
                y0: 0,
                y1:1,
                yref: 'paper',
                line: {
                    color: 'red',
                    width: 1,
                }
            },
            {
                type: 'line',
                x0: result1['USL'],
                x1: result1['USL'],
                y0: 0,
                y1:1,
                yref: 'paper',
                line: {
                    color: 'red',
                    width: 1,
                }
            }
        ],
    }
    Plotly.newPlot('bellChart2', data, layout, {displayModeBar: false});
}