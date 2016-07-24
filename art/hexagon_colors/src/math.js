/**
 * Returns the dot product of two vectors.
 */
export const dot = ([x1, y1], [x2, y2]) =>
    (x1 * x2) + (y1 * y2);

/**
 * Scale vector by scalar s.
 */
export const scale = ([x, y], s) =>
    [x * s, y * s];

/**
 * Returns the magnitude of a vector.
 */
export const magnitude = ([x, y]) =>
    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

/**
 * Returns the orthogonal projection of vector v onto line s.
 */
export const orthogonalProjection = (v, s) =>
    scale(s, dot(v, s) / dot(s, s));
