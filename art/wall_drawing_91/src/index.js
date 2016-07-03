import "./styles.css";

// LeWitt's description of Wall Drawing #91 is, “A six inch grid covering the
// wall.  Within each square, not straight lines from side to side, using red,
// yellow and blue pencils.  Each square contains at least one line of each
// color.”

var canvas = document.getElementById("canvas");
var infoModal = document.getElementById("info");
var infoCloseBtn = document.getElementById("info-close-btn");

// the width & height of each grid cell
var gridSize = 100;

var gridColor = "#eeeeee";

var maxLinesPerCell = 10;
var splitsPerLine = 2;
var maxPointOffsetPx = 10;

// tweak the line colors here
var colors = [
    "#de8988",
    "#f3e079",
    "#9aadd4"
];

function setup() {
    window.addEventListener("resize", resize, false);
    window.addEventListener("mouseup", toggleInfo, false);
    infoCloseBtn.addEventListener("click", closeInfo, false);

    // make sure that links don't trigger the toggleInfo handler
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("mouseup", (e) => {
            e.stopPropagation();
        }, false);
    }

    resize();
}

function closeInfo() { infoModal.className = "hidden"; }
function toggleInfo(evt) {
    if (infoModal.className === "hidden") {
        infoModal.className = "";
    } else {
        infoModal.className = "hidden";
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function randomDist(minLength, maxLength) {
    var dir = Math.random() > 0.5 ? 1 : -1;
    return Math.max(
        minLength,
        Math.random() * maxLength * dir
    );
}

function segment(start, end, remainingSplits) {
    if (remainingSplits === 0) {
        return [start, end];
    } else {
        var middle = new Point(
            start.x + ((end.x - start.x) / 2),
            start.y + ((end.y - start.y) / 2)
        );
        middle.offset();

        return segment(start, middle, remainingSplits - 1)
            .concat(segment(middle, end, remainingSplits - 1));
    }
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    offset() {
        this.x += randomDist(2, maxPointOffsetPx);
        this.y += randomDist(2, maxPointOffsetPx);
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    draw(ctx, color) {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.restore();
    }

    drawWiggly(ctx, color) {
        ctx.save();

        var points = segment(this.start, this.end, splitsPerLine);

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);

        for (var i = 0; i < points.length; ++i) {
            var p = points[i];
            ctx.lineTo(p.x, p.y);
        }

        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.restore();
    }
}

class Cell {
    constructor(left, top) {
        this.left = left;
        this.top = top;
        this.right = left + gridSize;
        this.bottom = top + gridSize;
    }

    randomLine() {
        var r1 = Math.random() * gridSize;
        var r2 = Math.random() * gridSize;
        var start, end;

        if (Math.random() >= 0.5) {
            // horz line
            start = new Point(this.left, this.top + r1);
            end = new Point(this.right, this.top + r2);
        } else {
            // vert line
            start = new Point(this.left + r1, this.top);
            end = new Point(this.left + r2, this.bottom);
        }

        return new Line(start, end);
    }
}

function draw() {
    var ctx = canvas.getContext("2d");

    // figure out the number of cells
    var cellsX = Math.floor(canvas.width / gridSize);
    var cellsY = Math.floor(canvas.height / gridSize);

    // add margin around the art to make up for the cells not filling the entire
    // space
    var marginLeft = (canvas.width - (gridSize * cellsX)) / 2;
    var marginTop = (canvas.height - (gridSize * cellsY)) / 2;

    for (var cx = 0; cx < cellsX; ++cx) {
        var px = marginLeft + (cx * gridSize);

        // draw vertical grid line
        (new Line(
            new Point(px, marginTop),
            new Point(px, canvas.height - marginTop)
        )).draw(ctx, gridColor);

        for (var cy = 0; cy < cellsY; ++cy) {
            var py = marginTop + (cy * gridSize);

            // draw horizontal grid line
            (new Line(
                new Point(marginLeft, py),
                new Point(canvas.width - marginLeft, py)
            )).draw(ctx, gridColor);

            var c = new Cell(px, py);
            var numLines = Math.max(colors.length, Math.round(Math.random() * maxLinesPerCell));
            var colorIdx = 0;
            for (var i = 0; i < numLines; i++) {
                colorIdx = (colorIdx + 1) % colors.length;
                c.randomLine().drawWiggly(ctx, colors[colorIdx]);
            }
        }
    }

    // close off right side of grid
    (new Line(
        new Point(canvas.width - marginLeft, marginTop),
        new Point(canvas.width - marginLeft, canvas.height - marginTop)
    )).draw(ctx, gridColor);

    // close off bottom side of grid
    (new Line(
        new Point(marginLeft, canvas.height - marginTop),
        new Point(canvas.width - marginLeft, canvas.height - marginTop)
    )).draw(ctx, gridColor);
}

setup();
