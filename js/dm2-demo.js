var c, c2, cl, cr;
var phi = 0;
var phi_2 = 0;

// We can "run the graph through x = 0" by incrementing phi. To avoid variable overflow, set phi -> 0 when phi === 100f (100 being arbitrary)

var config = {
    chartLength: 600,
    chartIncrement: 1,
    speed: 1,
    triangleHarmonics: 5,
    gridLines: 8,
    stepperDistance: 1000,
    pen: {
        color: 'black',
        size: 2
    }
};

function cotan(x) {
    return 1 / Math.tan(x);
}
var c;
var intersectCircles = function (x1, y1, r1, x2, y2, r2) {
    var centerdx = x1 - x2;
    var centerdy = y1 - y2;
    var R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) {
        // no intersection
        return []; // empty list of results
    }
    // intersection(s) should exist

    var R2 = R * R;
    var R4 = R2 * R2;
    var a = (r1 * r1 - r2 * r2) / (2 * R2);
    var r2r2 = r1 * r1 - r2 * r2;
    var c = Math.sqrt(2 * (r1 * r1 + r2 * r2) / R2 - r2r2 * r2r2 / R4 - 1);

    var fx = (x1 + x2) / 2 + a * (x2 - x1);
    var gx = c * (y2 - y1) / 2;
    var ix1 = fx + gx;
    var ix2 = fx - gx;

    var fy = (y1 + y2) / 2 + a * (y2 - y1);
    var gy = c * (x1 - x2) / 2;
    var iy1 = fy + gy;
    var iy2 = fy - gy;

    // note if gy == 0 and gx == 0 then the circles are tangent and there is only one solution
    // but that one solution will just be duplicated as the code is currently written
    return [[ix1, iy1], [ix2, iy2]];
};
var chooseFunction = function (t, controls) {
    if (controls.ft === "sin") {
        return sinT(t, controls);
    } else if (controls.ft === "triangle") {
        return triangleT(t, controls);
    } else if (controls.ft === "square") {
        return squareT(t, controls);
    } else if (controls.ft === "sawtooth") {
        return sawtoothT(t, controls);
    }
};

var sinT = function (t, controls) {
    let _phi = phi + 1 / 0.005 * controls.offsetX;
    let y =
        controls.a * Math.sin(2 * Math.PI * controls.f * (t + _phi)) +
        controls.offset;
    return y;
};
var sawtoothT = function (t, c) {
    let _phi = phi + (1 / .005) * c.offsetX;
    let p = 1 / c.f;
    let y = ((-2 * c.a) / Math.PI) * Math.atan(cotan((t * Math.PI + _phi) / p)) + c.offset;
    return y;
}
var triangleT = function (t, c) {
    let _phi = phi + 1 / 0.005 * c.offsetX;
    let p = 1 / c.f;
    let a = c.a * 0.65;
    let y = a * Math.asin(Math.sin(2 * Math.PI / p * (t + _phi))) + c.offset;
    return y;
};
var squareT = function (t, c) {
    let _phi = phi + 1 / 0.005 * c.offsetX;
    var sin = function (t) {
        return Math.sin(2 * Math.PI * c.f * (t + _phi));
    };

    let y = c.a * Math.sign(sin(t)) + c.offset;
    return y;
};

var shiftChart = function (controls) {
    phi += config.speed;
    if (phi >= 999999) {
        phi = 0;
    }
};

var controlsA = {
    a: 40,
    f: 0.005,
    offset: window.innerHeight * .11 + window.innerWidth * .1,
    offsetX: 0, // *f
    ft: "sin"
};
var controlsB = {
    a: 40,
    f: 0.005,
    offset: window.innerHeight * .11 + window.innerWidth * .1,
    offsetX: .2, // *f
    ft: "sin",
    id: "b"
};

let points = [];

function fillCircle(c, x, y, r) {
    c.moveTo(x, y)
    c.arc(x, y, r, 0, 2 * Math.PI, false);
    c.stroke();
}
var lastPoint = [0,0];

const drawResult = function (c, cl, data) {
    // data contains length a, length b
    let A = [10, 10];
    let B = [config.stepperDistance + 10, 10];
    //we do this to scale up the drawing
    data.a *= 3.4;
    data.b *= 3.4;
    let inters = intersectCircles(A[0], A[1], data.a, B[0], B[1], data.b);
    let nextPoint = inters[1];
    c.beginPath();
    if (nextPoint) {
        c.lineWidth = config.pen.size;
        c.strokeStyle = config.pen.color;
        c.moveTo(lastPoint[0], lastPoint[1]);
        c.lineTo(nextPoint[0], nextPoint[1]);
        if(lastPoint[0] != 0)
        c.stroke();

        lastPoint = nextPoint;
        // Draw lines
        cl.clearRect(0,0,cl.canvas.width, cl.canvas.height)
        cl.fillRect(A[0], A[1], 10, 10);
        cl.fillRect(B[0], B[1], 10, 10);
        cl.beginPath()
        cl.moveTo(A[0], A[1])
        cl.lineTo(nextPoint[0], nextPoint[1]);
        cl.lineTo(B[0], B[1]);
        cl.stroke();
        fillCircle(cl, nextPoint[0], nextPoint[1], config.pen.size / 2)
    }
    
};

var drawChart = function (c, controls) {
    c.clearRect(0, 0, 600, 600);
    // Draw grid
    c.strokeStyle = "lightgray";
    c.lineWidth = 1;
    for (let i = 0; i < config.gridLines; i++) {
        c.beginPath();
        c.moveTo(0, 600 / config.gridLines * i);
        c.lineTo(600, 600 / config.gridLines * i);
        c.stroke();

        c.beginPath();
        c.moveTo(600 / config.gridLines * i, 0);
        c.lineTo(600 / config.gridLines * i, 600);
        c.stroke();
    }

    c.strokeStyle = "black";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, chooseFunction(0, controls));
    for (let t = 0; t < config.chartLength; t += config.chartIncrement) {
        let y = chooseFunction(t, controls) - controls.offset / 2;
        c.lineTo(t, y, 2, 2);
    }
    c.stroke();
};

function initColorButtons() {
    let buttons = document.querySelectorAll('.color-list input')
    for (let i = 0; i < buttons.length; i++) {
        let b = buttons[i];
        b.style.background = b.value;
        b.addEventListener('change', function () {
            config.pen.color = this.value;
        })
    }
}
function initSizeButtons() {
    let buttons = document.querySelectorAll('.size-list input')
    for (let i = 0; i < buttons.length; i++) {
        let b = buttons[i];
        b.style.width = b.value * 3 + 'px';
        b.style.height = b.value * 3 + 'px';
        b.addEventListener('change', function () {
            config.pen.size = this.value;
        })
    }
}
function initFunctionButtons() {
    let buttons = document.querySelectorAll('.function-list input')
    for (let i = 0; i < buttons.length; i++) {
        let b = buttons[i];
        let stepper = b.getAttribute('data-stepper')
        if ( stepper === 'a'){
            b.addEventListener('change', function () {
                controlsA.ft = this.value;
            })
        } else {
        b.addEventListener('change', function () {
                    controlsB.ft = this.value;
                })
        }
    }
}

function initFileActions() {
    let saveButton = document.querySelector('#saveImage')
    let clearButton = document.querySelector('#clearImage')
    saveButton.addEventListener('click', function () {
        this.href = cr.canvas.toDataURL();
        this.download = "Hi_Tracey.png";
    })
    clearButton.addEventListener('click', function () {
      cr.clearRect(0,0,cr.canvas.width, cr.canvas.height)
    })
}

function bindControls() {
    let controls = document.querySelectorAll(".control");
    for (let i = 0; i < controls.length; i++) {
        let c = controls[i];
        let stepper = c.getAttribute("data-stepper");
        let parameter = c.getAttribute("data-parameter");
        if (stepper === "a") {
            c.value = controlsA[parameter];
            c.addEventListener("input", function (e) {
                controlsA[parameter] = this.value;
            });
        } else {
            c.value = controlsB[parameter];
            c.addEventListener("input", function (e) {
                controlsB[parameter] = this.value;
            });
        }
    }
}

function step(timestamp) {
    shiftChart(controlsA);
    drawChart(c, controlsA);
    drawChart(c2, controlsB);
    drawResult(cr, cl,{
        a: chooseFunction(10, controlsA),
        b: chooseFunction(10, controlsB)
    });
    window.requestAnimationFrame(step);
}

var init = function () {
    let canvas = document.querySelector("#controlA");
    let canvas2 = document.querySelector("#controlB");
    let canvasResult = document.querySelector("#result");
    let canvasLines = document.querySelector("#lines");
    // add canvas for lines
    c = canvas.getContext("2d");
    c2 = canvas2.getContext("2d");
    cr = canvasResult.getContext("2d");
    cl = canvasLines.getContext("2d");
    config.stepperDistance = window.innerWidth - 90;
    canvasResult.width = window.innerWidth;
    canvasResult.height = window.innerHeight * 1.2;
    canvasLines.width = window.innerWidth;
    canvasLines.height = window.innerHeight * 1.2;
    drawChart(c, controlsA);
    drawChart(c2, controlsB);

    bindControls();
    initColorButtons();
    initSizeButtons();
    initFunctionButtons();
    initFileActions();
    window.requestAnimationFrame(step);
    var draggableElems = document.querySelectorAll('.draggable');
    console.log(draggableElems)
    // array of Draggabillies
    var draggies = []
    // init Draggabillies
    for (var i = 0; i < draggableElems.length; i++) {
        var draggableElem = draggableElems[i];
        var draggie = new Draggabilly(draggableElem, {
            // options...
        });
        draggies.push(draggie);
    }
};

init();
