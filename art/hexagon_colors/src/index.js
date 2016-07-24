import "./styles.css";

import COLORS from "./colors";
import polygon from "./polygon";
import { magnitude, orthogonalProjection } from "./math";

var POLYGON_EDGES = 6;
var POLYGON_SIZE = 36;

var canvas = document.getElementById("canvas");

function setup() {
    window.addEventListener("resize", resize, false);

    var context = canvas.getContext('2d');
    context.scale(2,2);

    resize();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function draw() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var r = POLYGON_SIZE / 2;
    var inradius = r * Math.cos(Math.PI / POLYGON_EDGES);
    var sidelength = 2 * r * Math.sin(Math.PI / POLYGON_EDGES)

    var numWide = canvas.width / (POLYGON_SIZE + inradius);
    var numHigh = Math.ceil(canvas.height / inradius) + 1;

    for (var row = 0; row < numHigh; ++row) {
        var offset = (row % 2 === 0) ? 0 : 1;

        // Note that our y position is calculated using the radius - this is
        // because we are offsetting the rows so the hexagons sit cleanly
        // alongside each other.
        var y = inradius * row;

        for (var col = 0; col < numWide; ++col) {
            // In order to get nicely nested hexagons we need to offset the x
            // position.  We take offset (0 or 1) into account to stagger the
            // rows.
            var x = (col * POLYGON_SIZE) + (sidelength * col) + ((sidelength / 2 + r) * offset);

            // v is the vector corresponding to the center of this polygon
            var v = [col, row];
            // s is a vector representing the desired color gradient angle
            var s = [numWide + 10, numHigh - 25];
            // p is a projection of v onto s
            var p = orthogonalProjection(v, s);

            // if we linear interpolate p over s we can pick a corresponding color
            var c = Math.round((magnitude(p) / magnitude(s)) * COLORS.length);
            // change the chosen color by +- 2
            c = Math.round(((Math.random() * 4) - 2) + c);
            var color = COLORS[Math.max(0, Math.min(COLORS.length - 1, c))];

            polygon(ctx, x, y, r, POLYGON_EDGES, color);
        }
    }
}

setup();
