const WIDTH = 800;
const HEIGHT = 800;

var chosenRendering = '';
var initialX = 0, initialY = 0, finalX = 0, finalY = 0;
var centerX = 0, centerY = 0, radius = 0;

function sketch(processing) {

    this.drawLineBasic = (x1, y1, x2, y2) => {
        let x, y, dx, dy, m, i;
        dx = (x2 - x1);
        dy = (y2 - y1);
        m = dy/dx;
        /* console.log({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'dy': dy, 'dx': dx, 'm': m}); */
        /* if (m >= 0 && m <= 1)  */{
            i = x1;
            y = y1;
            while (i <= x2) {
                x = i
                processing.point(x, y);
                y = y1 + dy * (x - x1) / dx;
                // y = Math.round(y + m);
                i++;
            }
        }
    }

    this.drawLineDDA = (x1, y1, x2, y2) => {
        let x, y, dx, dy, steps, i;

        dx = x2 - x1;
        dy = y2 - y1;

        if (dx >= dy) {
            steps = dx;
        } else {
            steps = dy;
        }

        dx = dx/steps;
        dy = dy/steps;
        x = x1;
        y = y1;
        i = 1;
        while (i <= steps) {
            processing.point(x, y);
            x += dx;
            y += dy;
            i++;
        }
    }

    /**
     * Draws a line based on Bresenham’s Algorithm
     * 
     * @author JavaScript Teacher
     * @param {integer} x1 
     * @param {integer} y1 
     * @param {integer} x2 
     * @param {integer} y2 
     */
    this.drawLine = (x1, y1, x2, y2) => {
        // Iterators, counters required by algorithm
        let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
        // Calculate line deltas
        dx = x2 - x1;
        dy = y2 - y1;
        // Create a positive copy of deltas (makes iterating easier)
        dx1 = Math.abs(dx);
        dy1 = Math.abs(dy);
        // Calculate error intervals for both axis
        px = 2 * dy1 - dx1;
        py = 2 * dx1 - dy1;
        
        // The line is X-axis dominant
        if (dy1 <= dx1) {
            // Line is drawn left to right
            if (dx >= 0) {
                x = x1; y = y1; xe = x2;
            } else { // Line is drawn right to left (swap ends)
                x = x2; y = y2; xe = x1;
            }
            processing.point(x, y); // Draw first pixel
            // Rasterize the line
            for (i = 0; x < xe; i++) {
                x = x + 1;
                // Deal with octants...
                if (px < 0) {
                    px = px + 2 * dy1;
                } else {
                    if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                        y = y + 1;
                    } else {
                        y = y - 1;
                    }
                    px = px + 2 * (dy1 - dx1);
                }
                // Draw pixel from line span at
                // currently rasterized position
               processing.point(x, y);
            }
        } else { // The line is Y-axis dominant
            // Line is drawn bottom to top
            if (dy >= 0) {
                x = x1; y = y1; ye = y2;
            } else { // Line is drawn top to bottom
                x = x2; y = y2; ye = y1;
            }
            processing.point(x, y); // Draw first pixel
            // Rasterize the line
            for (i = 0; y < ye; i++) {
                y = y + 1;
                // Deal with octants...
                if (py <= 0) {
                    py = py + 2 * dx1;
                } else {
                    if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                        x = x + 1;
                    } else {
                        x = x - 1;
                    }
                    py = py + 2 * (dx1 - dy1);
                }
                // Draw pixel from line span at
                // currently rasterized position
                processing.point(x, y);
            }
        }
    }

    this.drawCircleMidPoint = (xC, yC, r) => {
        let x, y, p;
        x = r; y = 0;
        p = 1 - r;

        processing.point(xC+x, yC+y);

        if (r > 0) {
            processing.point(xC+x, yC-y);
            processing.point(xC+y, yC+x);
            processing.point(xC-y, yC+x);
        }

        while (x > y) {
            y++;

            // Mid-point is inside or on the perimeter
            if (p <= 0) {
                p = p + 2 * y + 1;
            } else { // Mid-point is outside the perimeter
                x--;
                p = p + 2 * y - 2 * x + 1;
            }

            // All the perimeter points have already
            // been printed
            if (x < y) break;

            // Printing the generated point and its
            // reflection in the other octants after
            // translation
            processing.point(xC+x, yC+y);
            processing.point(xC-x, yC+y);
            processing.point(xC+x, yC-y);
            processing.point(xC-x, yC-y);

            // If the generated point is on the
            // line x = y then the perimeter points
            // have already been printed
            if (x != y) {
                processing.point(xC+y, yC+x);
                processing.point(xC-y, yC+x);
                processing.point(xC+y, yC-x);
                processing.point(xC-y, yC-x);
            }
        }
    }

    const drawCircle = (xC, yC, x, y) => {
        processing.point(xC+x, yC+y);
        processing.point(xC-x, yC+y);
        processing.point(xC+x, yC-y);
        processing.point(xC-x, yC-y);
        processing.point(xC+y, yC+x);
        processing.point(xC-y, yC+x);
        processing.point(xC+y, yC-x);
        processing.point(xC-y, yC-x);
    }

    this.drawCircleBres = (xC, yC, r) => {
        let x, d;
        x = 0; y = r;
        d = 3 - 2 * r;
        drawCircle(xC, yC, x, y);
        while (y >= x) {
            // for each pixel we will
            // draw all eight pixels
            x++;

            // check for decision parameter
            // and correspondingly
            // update d, x, y
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
            drawCircle(xC, yC, x, y);
        }
    }

    processing.setup = function(){
        processing.frameRate(2); // fps
        processing.size(WIDTH, HEIGHT);
    }

    let context = this
    processing.drawGame = function(world) {
        processing.background(255,255,0);
        processing.strokeWeight(4);
        switch (chosenRendering) {
            case 'line-basic':
                context.drawLineBasic(initialX, initialY, finalX, finalY);
                break;
            
            case 'line-DDA':
                context.drawLineDDA(initialX, initialY, finalX, finalY);
                break;

            case 'line-bres':
                context.drawLine(initialX, initialY, finalX, finalY);
                break;

            case 'circle-mid-point':
                context.drawCircleMidPoint(centerX, centerY, radius);
                break;

            case 'circle-bres':
                context.drawCircleBres(centerX, centerY, radius);
                break;

            default:
                break;
        }
    }

    processing.onTic = function(world) {
    }

    processing.onMouseEvent = function (world, event) {
        return world;
    }

  // ******************** De aquí hacia abajo no debe cambiar nada. ********************

  // Esta es la función que pinta todo. Se ejecuta 60 veces por segundo. 
  // No cambie esta función. Su código debe ir en drawGame
  processing.draw = function () {
    processing.drawGame(processing.state);
    processing.state = processing.onTic(processing.state);
  };
  // Esta función se ejecuta cada vez que presionamos una tecla. 
  // No cambie esta función. Su código debe ir en onKeyEvent
  processing.keyPressed = function () {
    processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
  }
  // Esta función se ejecuta cada vez movemos el mouse. 
  // No cambie esta función. Su código debe ir en onKeyEvent
  processing.mouseMoved = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "move", mouseX: processing.mouseX, mouseY: processing.mouseY });
  }

  // Estas funciones controlan los eventos del mouse. 
  // No cambie estas funciones. Su código debe ir en OnMouseEvent
  processing.mouseClicked = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "click", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mouseDragged = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "drag", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mousePressed = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "press", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mouseReleased = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "release", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }
  // Fin de los eventos del mouse
}

const canvas = document.getElementById("canvas");
const instance = new Processing(canvas, sketch);

window.onload = function() {
    document.getElementById('btn-draw-basic').addEventListener('click', function() {
        chosenRendering = 'line-basic';
        initialX = Number(document.getElementById('initial-x').value);
        initialY = Number(document.getElementById('initial-y').value);
        finalX = Number(document.getElementById('final-x').value);
        finalY = Number(document.getElementById('final-y').value);

        const canvas = document.getElementById("canvas");
        const instance = new Processing(canvas, sketch);
    });

    document.getElementById('btn-draw-dda').addEventListener('click', function() {
        chosenRendering = 'line-DDA';
        initialX = Number(document.getElementById('initial-x').value);
        initialY = Number(document.getElementById('initial-y').value);
        finalX = Number(document.getElementById('final-x').value);
        finalY = Number(document.getElementById('final-y').value);

        const canvas = document.getElementById("canvas");
        const instance = new Processing(canvas, sketch);
    });

    document.getElementById('btn-draw-bres').addEventListener('click', function() {
        chosenRendering = 'line-bres';
        initialX = Number(document.getElementById('initial-x').value);
        initialY = Number(document.getElementById('initial-y').value);
        finalX = Number(document.getElementById('final-x').value);
        finalY = Number(document.getElementById('final-y').value);

        const canvas = document.getElementById("canvas");
        const instance = new Processing(canvas, sketch);
    });

    document.getElementById('btn-draw-circle-mid').addEventListener('click', function() {
        chosenRendering = 'circle-mid-point';
        centerX = Number(document.getElementById('central-x').value);
        centerY = Number(document.getElementById('central-y').value);
        radius = Number(document.getElementById('radius').value);

        const canvas = document.getElementById("canvas");
        const instance = new Processing(canvas, sketch);
    });

    document.getElementById('btn-draw-circle-bres').addEventListener('click', function() {
        chosenRendering = 'circle-bres';
        centerX = Number(document.getElementById('central-x').value);
        centerY = Number(document.getElementById('central-y').value);
        radius = Number(document.getElementById('radius').value);

        const canvas = document.getElementById("canvas");
        const instance = new Processing(canvas, sketch);
    });
};