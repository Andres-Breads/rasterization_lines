function drawLineBasic(x1, y1, x2, y2) {
    let dx = Math.abs(x2-x1);
    let dy = Math.abs(y2-y1);
    let m = dy/dx;
    if (m >= 0 && m <= 1) {
        let xi, yi;
        let increment = x1;
        yi = y1;
        while (increment <= x2) {
            xi = increment
            console.log(`(${xi}, ${yi})`)
            yi = Math.round(yi + m);
            increment++;
        }
    }
}