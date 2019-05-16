var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d'); // Think of this as super in a constructor function. It's passing us a bunch of methods we could use to draw.

let mouse = {
    x: undefined,
    y: undefined
}

let maxRadius = 40;

let colorArray = [
    '#FF9D1F',
    '#E85E01',
    '#FF490E',
    '#E8210E',
    '#FF0D4B'
]

window.addEventListener('mousemove', (event) => {
    // The mouse's x and y values are similar to the canvas shape's in that they are the distance along those axis.
    mouse.x = event.x; 
    mouse.y = event.y; 
});

window.addEventListener('resize', (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

const randomMinRadius = () => {
    return Math.floor(Math.random() * 10);
} 

function Circle(x, y, dx, dy, radius) {
    this.x = x; // Distance along the x-axis on the canvas relative to the origin point.
    this.y = y; // Distance along the y-axis on the canvas relative to the origin point.
    this.dx = dx; // Velocity along the x-axis.
    this.dy = dy; // Velocity along the y-axis.
    this.radius = radius; // Initial radius.
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.minRadius = randomMinRadius();
}

Circle.prototype.draw = function() {
    c.beginPath(); // This beginPath() is going to basically make sure your existing lines don't conneect to the start of this one. Almost like picking up your pen or pencil.
    c.arc(
        this.x, // Distance along the x-axis on the canvas relative to the origin point.
        this.y, // Distance along the y-axis on the canvas relative to the origin point.
        this.radius, // Initial radius.
        0, // Starting angle (in radians). Since we're using radians, setting this to 0 will start the angle at the 3 o'clock position of the arc's circle.
        Math.PI * 2, // Ending angle (again in radians). Math.PI * 2 equates to 360 degrees, or a full circle.
        false // Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    );
    c.fillStyle = this.color; // Sets the color of the circle's fill.
    c.fill(); // Actually fills in the circle.
}

Circle.prototype.update = function() {
    if (this.x + this.radius > innerWidth // If this circle's distance along the x-axis PLUS it's radius is GREATER THAN the width of the canvas...
        || this.x - this.radius < 0) { // OR this circle's distance along the x-axis MINUS it's radius is LESS THAN zero (the very left of the canvas)...
        this.dx = -this.dx; // ...Then change this circle's velocity to the negative equivalent. (Keep it from extending past the left or right sides of the canvas)
    }

    if (this.y + this.radius > innerHeight  // If this circle's distance along the y-axis PLUS it's radius is GREATER THAN the height of the canvas...
        || this.y - this.radius < 0) { // OR this circle's distance along the y-axis MINUS it's radius is LESS THAN zero (the very top of the canvas)...
        this.dy = -this.dy; // ...Then change this circle's velocity to the negative equivalent. (Keep it from extending past the top or bottom sides of the canvas)
    }

    this.x += this.dx; // This is adding to the circle's distance along the x-axis; creating it's velocity along that axis.
    this.y += this.dy; // This is adding to the circle's distance along the y-axis; creating it's velocity along that axis.

    // Interactivity
    if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
        if(this.radius < maxRadius) {
            this.radius += 1;
        }
    } else if(this.radius > this.minRadius) {
        this.radius -= 1;
    }

    this.draw(); // Draw out a new circle.
}

let circleArray = []; // This array will hold all of our circle objects.

function init() {
    circleArray = [];

    for(let i = 0; i < 1000; i++) { // The number of iterations through this forloop will be how many circles we create.
        let radius = randomMinRadius(); // Set the initial radius of the circle to a random number between 1-20px.
        let x = Math.random() * (innerWidth - radius * 2) + radius; // Set the initial distance along the x-axis. (Adding the radius at the end is to keep it from initializing past the right side of the canvas)
        let y = Math.random() * (innerHeight - radius * 2) + radius; // Set the initial distance along the y-axis. (Adding the radius at the end is to keep it from initializing past the top side of the canvas)
        let dx = (Math.random() - 0.5) * 2; // This is the number we'll be adding to the circle's distance along the x-axis.
        let dy = (Math.random() - 0.5) * 2; // This is the number we'll be adding to the circle's distance along the y-axis.
    
        circleArray.push(new Circle(x, y, dx, dy, radius)); // Push an instance of the Circle constructor to circleArray.
    }
}

init();

function animateCircle() {
    requestAnimationFrame(animateCircle); // Continuosly run this function as fast as the web browser's refresh rate.
    c.clearRect(0, 0, innerWidth, innerHeight); // Clear the entire canvas starting from the origin point, to the width and height of the canvas.

    for(let i = 0; i < circleArray.length; i++) { // Do something for each circle object in circleArray.
        circleArray[i].update(); // Run the update() method for each circle in the array. (Note update() is already running the draw() method as well)
    }
}

animateCircle();
