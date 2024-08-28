class Circle {
    constructor(_canvas, _size, _usl, _lsl, _subgroups=1) {
        this._size = _size;
        this.x = 0;
        this.y = 0;
        this.deviations = [];
        this._usl = Number(_usl);
        this._lsl = Number(_lsl);
        this.subgroups = _subgroups;
        this._showPoints = true;
        this._show = true;
        this._showTolerance = true;
        this._showCenter = true;
        this._jump = true;
        this._canvas = _canvas
    }
    center() {
        this.x = this._canvas.width/2;
        this.y = this._canvas.height/2;
        this.update();
    }
    reset() {
        this.deviations = [];
    }
    update() {
        if (this._show) {
            push();
            fill(40);
            ellipse(this.x, this.y, this._size);
            pop();
            if (this._showTolerance) {
                this.drawTolerance();
            }
            if (this._showPoints) {
                this.drawPoints();
            }
            if (this._showCenter) {
                this.drawCenter();
            }
        }
    }
    click() {
        this.storeDeviation();
        if (this._jump) {
            this.jump();
        }
    }
    jump() {
        let width = this._canvas.width;
        let height = this._canvas.height;
        this.x = Math.floor(random(this._size/2, width - (this._size/2)));
        this.y = Math.floor(random(this._size/2, height - (this._size/2)));
    }
    storeDeviation() {
        this.deviations.push([mouseX-this.x, -(mouseY-this.y)]);
    }
    drawCenter() {
        push();
        let lineSize = 50;
        strokeWeight(2);
        stroke(100,100,255);
        translate(-lineSize/2,0);
        line(this.x, this.y, this.x+lineSize, this.y);
        translate(lineSize/2,-lineSize/2);
        line(this.x, this.y, this.x, this.y+lineSize);
        pop();
    }
    drawTolerance() {
        push();
        noFill();
        stroke(255,0,0);
        ellipse(this.x, this.y, this._usl*2);
        pop();
    }
    drawPoints() {
        push();
        strokeWeight(3);
        stroke('rgba(255,255,0,0.7)')
        this.deviations.forEach((p) => {
            point(this.x+p[0], this.y-p[1]);
        });
        pop();
    }
    calculateSampleStandardDev(values, mean) {
        let sum = 0;
        values.forEach((v) => {
            sum += (v-mean)**2;
        });
        let stdDev = Math.sqrt(sum/(values.length-1));
        return stdDev;
    }
    calculateStandardDev(values, mean) {
        let sum = 0;
        values.forEach((v) => {
            sum += (v-mean)**2;
        });
        let stdDev = Math.sqrt(sum/values.length);
        return stdDev;
    }
    calculateP(stdDev) {
        return (this._usl - this._lsl) / (6 * stdDev);
    }
    calculatePk(stdDev, mean) {
        let ppk1 = (this._usl - mean)/(3 * stdDev);
        let ppk2 = (mean - this._lsl)/(3 * stdDev);
        if (ppk1 < ppk2) {
            return ppk1;
        }
        else if (ppk2 <= ppk1) {
            return ppk2;
        }
    }
    calculateStatistics() {
        let xDevs = [];
        let yDevs = [];
        let xDevsSum = 0, yDevsSum = 0;
        if (this.deviations.length == 0) {
            return {
                "USL": Number(this._usl),
                "LSL": Number(this._lsl),
                "x": {
                    "Values": [0],
                    "Mean": 0,
                    "SampleStdDev": 0,
                    "StdDev": 0,
                    "pp": 0,
                    "ppk": 0,
                    "cp": 0,
                    "cpk": 0
                },
                "y": {
                    "Values": [0],
                    "Mean": 0,
                    "SampleStdDev": 0,
                    "StdDev": 0,
                    "pp": 0,
                    "ppk": 0,
                    "cp": 0,
                    "cpk": 0
                },
            }
        }
        else {
            this.deviations.forEach((d) => {
                xDevs.push(d[0]);
                yDevs.push(d[1]);
                xDevsSum += d[0];
                yDevsSum += d[1];
            });
        }

        let xDevsMean = xDevsSum/this.deviations.length;
        let xSampleStdDev = this.calculateSampleStandardDev(xDevs,xDevsMean);
        let xPp = this.calculateP(xSampleStdDev);
        let xPpk = this.calculatePk(xSampleStdDev,xDevsMean);
        
        let yDevsMean = yDevsSum/this.deviations.length;
        let ySampleStdDev = this.calculateSampleStandardDev(yDevs,yDevsMean);
        let yPp = this.calculateP(ySampleStdDev);
        let yPpk = this.calculatePk(ySampleStdDev,yDevsMean);

        let xStdDev = this.calculateStandardDev(xDevs,xDevsMean);
        let xCp = this.calculateP(xStdDev);
        let xCpk = this.calculatePk(xStdDev,xDevsMean);
        
        let yStdDev = this.calculateStandardDev(yDevs,yDevsMean);
        let yCp = this.calculateP(yStdDev);
        let yCpk = this.calculatePk(yStdDev,yDevsMean);

        let result = {
            "USL": Number(this._usl),
            "LSL": Number(this._lsl),
            "x": {
                "Values": xDevs,
                "Mean": xDevsMean,
                "SampleStdDev": xSampleStdDev,
                "StdDev": xSampleStdDev,
                "pp": xPp,
                "ppk": xPpk,
                "cp": xCp,
                "cpk": xCpk
            },
            "y": {
                "Values": yDevs,
                "Mean": yDevsMean,
                "SampleStdDev": ySampleStdDev,
                "StdDev": ySampleStdDev,
                "pp": yPp,
                "ppk": yPpk,
                "cp": yCp,
                "cpk": yCpk
            },
        }
        return result;
    }
}