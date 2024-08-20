const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let expandedCell = null;
let probablyPhone = canvas.height > canvas.width ? true : false;

function outlineText(ctx, color, txt, x, y) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeText(txt, x, y);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White text color
    ctx.fillText(txt, x, y);
}

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    value = parseFloat(urlParams.get(name)) || 1.0;
    if (probablyPhone) {
        return value * 5.0  // Adjust speed for phones
    }
    return value // Default speed is 1.0
}

// Get the speed parameter from the URL
const speedMultiplier = getUrlParameter('speed');

// Load background images
const backgroundImages = Array.from({ length: 5 }, (_, index) => {
    const img = new Image();
    img.src = `backgrounds/background-${index + 1}.png`;
    return img;
});

// Load vertical background images
const verticalBackgroundImages = Array.from({ length: 5 }, (_, index) => {
    const img = new Image();
    img.src = `backgrounds/vertical-background-${index + 1}.png`;
    return img;
});

// Randomly select one background image
const backgroundImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
const verticalBackgroundImage = verticalBackgroundImages[Math.floor(Math.random() * verticalBackgroundImages.length)];

// Load cell images
const cellImages = Array.from({ length: 25 }, (_, index) => {
    const img = new Image();
    img.src = `cells/cell-${index + 1}.png`;
    return img;
});

// Mock JSON data
let mockJsonData = [
    { "title": "Poo", "text": "The poo is yellow", "zoomInText": "The poo is yellow and smells bad" },
    { "title": "Pee", "text": "The pee is clear", "zoomInText": "The pee is clear, indicating good hydration" },
    { "title": "Air", "text": "The air smells foul", "zoomInText": "The air smells foul, a sign of pollution or decay" },
    { "title": "Food", "text": "The food is rotten", "zoomInText": "The food is rotten, covered in mold and emitting a strong odor" },
    { "title": "Vomit", "text": "The vomit is white", "zoomInText": "The vomit is white, possibly indicating bile or mucus content.. or milk" },
    { "title": "Burp", "text": "The burp is liquid", "zoomInText": "The burp is liquid, likely due to acid reflux or indigestion.. or milk" },
    { "title": "Scream", "text": "I must scream", "zoomInText": "I must scream, but there is no one to hear my cry" },
    { "title": "Drool", "text": "The drool is sticky", "zoomInText": "The drool is sticky, hanging from the lips in a thin strand" },
    { "title": "Sweat", "text": "The sweat is salty", "zoomInText": "The sweat is salty and drips down, a sign of exertion" },
    { "title": "Whimper", "text": "A quiet whimper", "zoomInText": "A quiet whimper, a sound of fear and vulnerability" },
    { "title": "Tears", "text": "The tears are bitter", "zoomInText": "The tears are bitter, flowing freely down the cheeks" },
    { "title": "Blood", "text": "The blood is red", "zoomInText": "The blood is red, rich with oxygen and vital for life" },
    { "title": "Mucus", "text": "The mucus is thick", "zoomInText": "The mucus is thick, a response to infection or irritation" },
    { "title": "Phlegm", "text": "The phlegm is green", "zoomInText": "The phlegm is green, likely indicating a respiratory infection" },
    { "title": "Rot", "text": "The flesh is decaying", "zoomInText": "The flesh is decaying, revealing bone and oozing a foul stench" },
    { "title": "Whisper", "text": "The whisper is eerie", "zoomInText": "The whisper is eerie, echoing in the dark, sending chills down the spine" },
    { "title": "Shadow", "text": "The shadow looms", "zoomInText": "The shadow looms, creeping across the floor, engulfing everything in darkness" },
    { "title": "Echo", "text": "The echo is haunting", "zoomInText": "The echo is haunting, a remnant of a voice long lost, repeating endlessly" },
    { "title": "Ash", "text": "The ash is cold", "zoomInText": "The ash is cold, remnants of something once alive, now reduced to dust" },
    { "title": "Breath", "text": "The breath is shallow", "zoomInText": "The breath is shallow, raspy, as if the lungs struggle for every gasp of air" },
    { "title": "Night", "text": "The night is endless", "zoomInText": "The night is endless, a suffocating darkness where no light dares to enter" },
    { "title": "Frost", "text": "The frost bites", "zoomInText": "The frost bites, cold enough to sting, slowly numbing flesh and soul" }
];

// if it's a phone we only want half of the cells
if (probablyPhone) {
    mockJsonData = mockJsonData.slice(0, 10);
}

class Cell {
    constructor(x, y, radius, title, text, zoomInText, image) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.originalRadius = radius;
        this.title = title;
        this.text = text;
        this.zoomInText = zoomInText;
        this.image = image;
        this.dx = (Math.random() - 0.5) * 0.3 * speedMultiplier; // Adjusted speed movement
        this.dy = (Math.random() - 0.5) * 0.3 * speedMultiplier; // Adjusted speed movement
        this.angle = Math.random() * 2 * Math.PI; // Random initial angle
        this.searchingSpeed = 0.15 * speedMultiplier; // Adjusted speed for searching behavior
        this.rotation = Math.random() * 2 * Math.PI; // Random rotation
        this.expanding = false;
        this.zoomedIn = false;
    }

    draw() {
        // Save the current context state
        ctx.save();

        // Apply shadow for a slight blur effect around the cell
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Slight shadow color for a blending effect

        // Move to the cell's center and apply rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw the cell image, adjusted for rotation and size
        ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);

        // Reset rotation
        ctx.rotate(-this.rotation);

        // Reset shadow settings to avoid affecting text
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        if (this.zoomedIn) {
            // Draw zoomInText if the cell is zoomed in, ensuring it stays within the cell
            ctx.font = `bold ${this.radius * 0.15}px Luminari`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const lines = this.getWrappedText(ctx, this.zoomInText, this.radius * 1.5);
            lines.forEach((line, index) => {
                outlineText(ctx, 'black', line, 0, -this.radius * 0.2 + index * this.radius * 0.15);
            });
        } else {
            // Draw the title inside the cell
            ctx.font = `bold ${this.radius * 0.25}px Didot, Luminari`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            outlineText(ctx, 'black', this.title, 0, -this.radius * 0.3);

            // Draw the text inside the cell
            ctx.font = `${this.radius * 0.18}px Didot, Luminari`;
            outlineText(ctx, 'black', this.text, 0, this.radius * 0.3);
        }

        // Restore the context to its original state
        ctx.restore();
    }

    getWrappedText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    update(cells) {
        if (expandedCell === this) {
            // Expand the cell to fill the screen and ensure it is centered
            const targetRadius = Math.min(canvas.width, canvas.height) / 2;
            this.radius += (targetRadius - this.radius) * 0.1;
            this.x += (canvas.width / 2 - this.x) * 0.1;
            this.y += (canvas.height / 2 - this.y) * 0.1;
            if (Math.abs(this.radius - targetRadius) < 1) {
                this.zoomedIn = true;
            }
        } else if (this.expanding) {
            // Shrink the cell back to its original size
            this.radius += (this.originalRadius - this.radius) * 0.1;
            this.x += (this.originalX - this.x) * 0.1;
            this.y += (this.originalY - this.y) * 0.1;
            this.zoomedIn = false;
            if (Math.abs(this.radius - this.originalRadius) < 1) {
                this.radius = this.originalRadius;
                this.expanding = false;
            }
        } else {
            // Normal movement
            this.angle += (Math.random() - 0.5) * 0.06; // Small angle changes for wiggling
            this.dx += Math.cos(this.angle) * this.searchingSpeed * (Math.random() - 0.5);
            this.dy += Math.sin(this.angle) * this.searchingSpeed * (Math.random() - 0.5);

            this.x += this.dx;
            this.y += this.dy;

            // Ensure cells cannot leave the border of the screen
            if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
                this.dx = -Math.abs(this.dx);
            }
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.dx = Math.abs(this.dx);
            }
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.dy = -Math.abs(this.dy);
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius;
                this.dy = Math.abs(this.dy);
            }

            // Interaction with other cells (simple avoidance)
            for (let i = 0; i < cells.length; i++) {
                if (this === cells[i]) continue;

                const dist = Math.hypot(this.x - cells[i].x, this.y - cells[i].y);
                if (dist - this.radius - cells[i].radius < 0) {
                    const angle = Math.atan2(this.y - cells[i].y, this.x - cells[i].x);
                    this.dx = Math.cos(angle) * this.searchingSpeed;
                    this.dy = Math.sin(angle) * this.searchingSpeed;
                    cells[i].dx = -Math.cos(angle) * this.searchingSpeed;
                    cells[i].dy = -Math.sin(angle) * this.searchingSpeed;
                }
            }
        }

        this.draw();
    }

    toggleExpand() {
        if (expandedCell === this) {
            expandedCell = null;
            this.expanding = true;
        } else {
            expandedCell = this;
            this.originalX = this.x;
            this.originalY = this.y;
        }
    }
}

// Handle clicks on the canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // If a cell is expanded, any click should shrink it back
    if (expandedCell) {
        expandedCell.toggleExpand();
        return;
    }

    // Check if any cell was clicked
    for (const cell of cells) {
        const dist = Math.hypot(mouseX - cell.x, mouseY - cell.y);
        if (dist < cell.radius) {
            cell.toggleExpand();
            break;
        }
    }
});

function doesOverlap(x, y, radius, cells) {
    for (let i = 0; i < cells.length; i++) {
        const dist = Math.hypot(x - cells[i].x, y - cells[i].y);
        if (dist < radius + cells[i].radius + 10) { // Add some extra space between cells
            return true;
        }
    }
    return false;
}

// Fetch the cell data (in reality, you'd use fetch from an actual URL)
function fetchCellData() {
    // Simulate fetch with the mock JSON
    return Promise.resolve(mockJsonData);
}

let cells = [];

fetchCellData().then(data => {
    for (let i = 0; i < data.length; i++) {
        let x, y, radius, attempts = 0;
        const maxAttempts = 100; // Limit the number of attempts to avoid infinite loops
        do {
            radius = Math.random() * 50 + 60; // Larger radius for more text
            //if it's a phone we want to have smaller cells
            if (probablyPhone) {
                radius = Math.random() * 50 + 40;
            }
            x = Math.random() * (canvas.width - radius * 2) + radius;
            y = Math.random() * (canvas.height - radius * 2) + radius;
            attempts++;
        } while (doesOverlap(x, y, radius, cells) && attempts < maxAttempts);

        const { title, text, zoomInText } = data[i];
        const image = cellImages[Math.floor(Math.random() * cellImages.length)];
        cells.push(new Cell(x, y, radius, title, text, zoomInText, image));
    }

    function animate() {
        // Choose the correct background image based on screen orientation
        let chosenBackground = canvas.height > canvas.width ? verticalBackgroundImage : backgroundImage;

        // Draw the background image
        ctx.drawImage(chosenBackground, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw each cell
        cells.forEach(cell => cell.update(cells));

        // Draw the expanded cell last to ensure it's on top
        if (expandedCell) {
            expandedCell.update(cells);
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(animate);
    }

    animate();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
