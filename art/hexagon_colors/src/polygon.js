export default function(ctx, x, y, radius, edges, color) {
    // Amount of radians between each point (from the center)
    var incr_rad = (Math.PI * 2) / edges;
    // Offset the start angle so the bottom of the polygon is always flat
    var start_rad = (Math.PI / 2) - (Math.PI / edges);

    ctx.save();
    ctx.beginPath();

    // translate to the center of the polygon
    ctx.translate(x, y);

    for (var i = 0; i <= edges; ++i) {
        var angle = start_rad + (incr_rad * i);
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        ctx.lineTo(x, y);
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fill();

    ctx.closePath();

    ctx.restore();
};
