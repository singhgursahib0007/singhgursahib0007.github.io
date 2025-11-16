// --- 1. Canvas and Game Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// --- 2. Game State Variables ---
let gameMode = 'walk'; // 'walk' or 'task'
let currentRoom = 'mainHall';
const keys = {}; // To store pressed keys
let animationTime = 0; // For pulsing effects

const player = {
    x: canvas.width / 2,
    y: canvas.height - 100, // Start at the bottom of the main hall
    width: 30,
    height: 40,
    color: '#e74c3c', // Crewmate Red
    visorColor: '#a9d6e5', // Light blue visor
    speed: 4,
    rounding: 15, // For crewmate shape
    nearDoor: false,
    nearTask: false,
    nearestScientist: null // Track nearest scientist
};

// --- Scientists Database ---
const scientists = {
    'pasteurLab': {
        name: 'Louis Pasteur',
        description: 'French chemist-microbiologist who developed pasteurization and created the first vaccines for rabies and anthrax.'
    },
    'leeuwenhoekLab': {
        name: 'Antonie van Leeuwenhoek',
        description: 'Dutch microscopist who first observed microorganisms and greatly improved early microscopes.'
    },
    'kochLab': {
        name: 'Robert Koch',
        description: 'German physician who identified the bacteria causing TB, cholera, and anthrax and established Koch\'s postulates.'
    },
    'flemingLab': {
        name: 'Alexander Fleming',
        description: 'Scottish microbiologist who discovered penicillin and pioneered modern antibiotic research.'
    }
};

// --- 3. Room Definitions ---
// This object-based structure makes it easy to add new rooms.
// Tasks now reference URLs instead of task IDs
const rooms = {
    'mainHall': {
        name: 'Main Hall',
        backgroundColor: '#2c3e50', // Dark Blue-Gray
        walls: [
            // Outer walls
            { x: 0, y: 0, width: canvas.width, height: 20 }, // Top
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }, // Bottom
            { x: 0, y: 0, width: 20, height: canvas.height }, // Left
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }, // Right
        ],
        doors: [
            // Door to Pasteur's Lab (Left Wall - Center)
            { x: 0, y: 250, width: 25, height: 100, targetRoom: 'pasteurLab', targetX: canvas.width - 80, targetY: 300, scientistId: 'pasteurLab' },
            // Door to Robert Koch's Lab (Bottom Wall - Left Side, embedded in wall)
            { x: 150, y: canvas.height - 30, width: 100, height: 30, targetRoom: 'kochLab', targetX: 150, targetY: 30, scientistId: 'kochLab' },
            // Door to Fleming's Lab (Bottom Wall - Right Side, embedded in wall)
            { x: 550, y: canvas.height - 30, width: 100, height: 30, targetRoom: 'flemingLab', targetX: 550, targetY: 30, scientistId: 'flemingLab' },
            // Door to Leeuwenhoek's Lab (Right Wall - Center)
            { x: canvas.width - 25, y: 250, width: 25, height: 100, targetRoom: 'leeuwenhoekLab', targetX: 80, targetY: 300, scientistId: 'leeuwenhoekLab' }
        ],
        tasks: [] // No tasks in the main hall
    },
    'pasteurLab': {
        name: "Louis Pasteur's Lab",
        backgroundColor: '#34495e', // Slightly different dark blue
        walls: [
            // Outer walls
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height },
        ],
        doors: [
            // Door back to Main Hall (Right Wall - Center at same height)
            { x: canvas.width - 25, y: 250, width: 25, height: 100, targetRoom: 'mainHall', targetX: 60, targetY: 300, scientistId: 'pasteurLab' }
        ],
        tasks: [
            // Row 1: Pasteurization, Germ Theory, Fermentation
            { x: 80, y: 180, width: 150, height: 100, taskUrl: 'pasteur_task.html', name: 'Pasteurization' },           // Pasteurization
            { x: 325, y: 180, width: 150, height: 100, taskUrl: 'pasteur_germ_theory.html', name: 'Germ Theory' },  // Germ Theory
            { x: 570, y: 180, width: 150, height: 100, taskUrl: 'pasteur_fermentation.html', name: 'Fermentation' }, // Fermentation
            // Row 2: Anthrax Vaccine, Rabies Vaccine, and placeholder
            { x: 80, y: 360, width: 150, height: 100, taskUrl: 'pasteur_anthrax_vaccine.html', name: 'Anthrax Vaccine' },  // Anthrax
            { x: 325, y: 360, width: 150, height: 100, taskUrl: 'pasteur_rabies_vaccine.html', name: 'Rabies Vaccine' },  // Rabies
            { x: 570, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Coming Soon' }              // Future experiment
        ]
    },
    'leeuwenhoekLab': {
        name: "Antonie van Leeuwenhoek's Lab",
        backgroundColor: '#34495e',
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height },
            // Microscope bench
            { x: 300, y: 200, width: 200, height: 200 },
        ],
        doors: [
            // Door back to Main Hall (Left Wall - Center at same height)
            { x: 0, y: 250, width: 25, height: 100, targetRoom: 'mainHall', targetX: canvas.width - 80, targetY: 300, scientistId: 'leeuwenhoekLab' }
        ],
        tasks: [
            // Coming soon task (can point to coming_soon.html in future)
            { x: 300, y: 200, width: 200, height: 200, taskUrl: 'coming_soon.html' }
        ]
    },
    'kochLab': {
        name: "Robert Koch's Postulate Place",
        backgroundColor: '#34495e',
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }
        ],
        doors: [
            // Door back to Main Hall (Top Wall - Left Side, embedded in wall, matches entry x)
            { x: 150, y: 0, width: 100, height: 30, targetRoom: 'mainHall', targetX: 150, targetY: canvas.height - 80, scientistId: 'kochLab' }
        ],
        tasks: [
            // Row 1: 3 experiments (left to right)
            { x: 80, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 1' },   // Exp 1 - Top Left
            { x: 325, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 2' },  // Exp 2 - Top Center
            { x: 570, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 3' },  // Exp 3 - Top Right
            // Row 2: 3 experiments (left to right)
            { x: 80, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 4' },   // Exp 4 - Bottom Left
            { x: 325, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 5' },  // Exp 5 - Bottom Center
            { x: 570, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 6' }   // Exp 6 - Bottom Right
        ]
    },
    'flemingLab': {
        name: "Alexander Fleming's Lab",
        backgroundColor: '#34495e',
        walls: [
            { x: 0, y: 0, width: canvas.width, height: 20 },
            { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: canvas.height },
            { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }
        ],
        doors: [
            // Door back to Main Hall (Top Wall - Right Side, embedded in wall, matches entry x)
            { x: 550, y: 0, width: 100, height: 30, targetRoom: 'mainHall', targetX: 550, targetY: canvas.height - 80, scientistId: 'flemingLab' }
        ],
        tasks: [
            // Row 1: 3 experiments (left to right)
            { x: 80, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 1' },   // Exp 1 - Top Left
            { x: 325, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 2' },  // Exp 2 - Top Center
            { x: 570, y: 180, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 3' },  // Exp 3 - Top Right
            // Row 2: 3 experiments (left to right)
            { x: 80, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 4' },   // Exp 4 - Bottom Left
            { x: 325, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 5' },  // Exp 5 - Bottom Center
            { x: 570, y: 360, width: 150, height: 100, taskUrl: 'coming_soon.html', name: 'Experiment 6' }   // Exp 6 - Bottom Right
        ]
    }
};

// --- 4. Event Listeners for Keyboard Input ---
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// --- 5. Collision Detection Utility ---
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// --- Helper: Adjust color brightness ---
function adjustBrightness(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// --- 6. Game Loop Functions ---

/**
 * Updates game state (player movement, collisions)
 */
function update() {
    if (gameMode !== 'walk') return; // Don't move if a task is active

    const room = rooms[currentRoom];
    const oldX = player.x;
    const oldY = player.y;

    // --- Player Movement ---
    if (keys['w'] || keys['ArrowUp']) {
        player.y -= player.speed;
    }
    if (keys['s'] || keys['ArrowDown']) {
        player.y += player.speed;
    }
    if (keys['a'] || keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['d'] || keys['ArrowRight']) {
        player.x += player.speed;
    }

    // --- Wall Collision ---
    for (const wall of room.walls) {
        if (checkCollision(player, wall)) {
            // This is a simple "stop" collision.
            // We check X and Y movement separately for smoother sliding along walls.
            
            // Check X collision
            if (checkCollision({ ...player, y: oldY }, wall)) {
                player.x = oldX; // Revert X
            }
            // Check Y collision
            if (checkCollision({ ...player, x: oldX }, wall)) {
                player.y = oldY; // Revert Y
            }
        }
    }

    // --- Door Collision (Room Switching) ---
    for (const door of room.doors) {
        if (checkCollision(player, door)) {
            currentRoom = door.targetRoom;
            player.x = door.targetX;
            player.y = door.targetY;
            break; // Found a door, stop checking
        }
    }

    // --- Task Collision (Triggering Tasks) ---
    for (const task of room.tasks) {
        if (checkCollision(player, task)) {
            triggerTask(task.taskUrl);
            break; // Triggered a task
        }
    }
    
    // --- Check for hover effects ---
    player.nearDoor = false;
    player.nearTask = false;
    player.nearestScientist = null;
    
    for (const door of room.doors) {
        const expandedDoor = { ...door, x: door.x - 20, y: door.y - 20, width: door.width + 40, height: door.height + 40 };
        if (checkCollision(player, expandedDoor)) {
            player.nearDoor = true;
            if (door.scientistId) {
                player.nearestScientist = door.scientistId;
            }
            break;
        }
    }
    
    for (const task of room.tasks) {
        const expandedTask = { ...task, x: task.x - 20, y: task.y - 20, width: task.width + 40, height: task.height + 40 };
        if (checkCollision(player, expandedTask)) {
            player.nearTask = true;
            break;
        }
    }
}

/**
 * Draws the game state to the canvas
 */
        function draw() {
            const room = rooms[currentRoom];

            // --- Clear and Draw Background with Gradient ---
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background gradient (depth effect)
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, room.backgroundColor);
            bgGradient.addColorStop(1, adjustBrightness(room.backgroundColor, -15));
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Grid pattern overlay for subtle detail
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }                // --- Draw Walls with 3D Effect ---
            for (const wall of room.walls) {
                // Wall main color
                const wallGradient = ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.height);
                wallGradient.addColorStop(0, '#7f8c8d');
                wallGradient.addColorStop(1, '#5a6c7d');
                ctx.fillStyle = wallGradient;
                ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
                
                // Wall highlight (top edge)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wall.x, wall.y, wall.width, 2);
                
                // Wall shadow (bottom edge)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(wall.x, wall.y + wall.height - 2, wall.width, 2);
            }

            // --- Draw Doors ---
            for (const door of room.doors) {
                // Door gradient background
                const gradient = ctx.createLinearGradient(door.x, door.y, door.x, door.y + door.height);
                gradient.addColorStop(0, '#1abc9c');
                gradient.addColorStop(1, '#0d7b6d');
                ctx.fillStyle = gradient;
                ctx.fillRect(door.x, door.y, door.width, door.height);
                
                // Door border/frame
                ctx.strokeStyle = '#ecf0f1';
                ctx.lineWidth = 3;
                ctx.strokeRect(door.x, door.y, door.width, door.height);
                
                // Door highlight/shine effect
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.fillRect(door.x + 2, door.y + 2, door.width - 4, door.height * 0.4);
                
                // Door label with background
                const roomName = rooms[door.targetRoom]?.name || '???';
                ctx.font = 'bold 13px Inter';
                const textMetrics = ctx.measureText(roomName);
                
                // Determine label alignment: horizontal doors (wide) use center, vertical doors (tall) use side
                const isVerticalDoor = door.height > door.width;
                
                let labelX, labelY;
                if (isVerticalDoor) {
                    // For vertical doors, determine if it's on left or right wall
                    const isRightWall = door.x > canvas.width / 2;
                    if (isRightWall) {
                        // Right-aligned on left side of door for right wall doors
                        labelX = door.x - 10;
                        ctx.textAlign = 'right';
                    } else {
                        // Left-aligned on right side of door for left wall doors
                        labelX = door.x + door.width + 10;
                        ctx.textAlign = 'left';
                    }
                    labelY = door.y + door.height / 2;
                } else {
                    // Center-aligned for horizontal doors (top and bottom)
                    labelX = door.x + door.width / 2;
                    labelY = door.y + door.height / 2;
                    ctx.textAlign = 'center';
                }
                
                // Label background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                const labelPadding = 6;
                const labelWidth = textMetrics.width + (labelPadding * 2);
                const labelHeight = 20;
                
                if (isVerticalDoor) {
                    const isRightWall = door.x > canvas.width / 2;
                    if (isRightWall) {
                        ctx.fillRect(labelX - labelWidth, labelY - labelHeight / 2, labelWidth, labelHeight);
                    } else {
                        ctx.fillRect(labelX, labelY - labelHeight / 2, labelWidth, labelHeight);
                    }
                } else {
                    ctx.fillRect(labelX - labelWidth / 2, labelY - labelHeight / 2, labelWidth, labelHeight);
                }
                
                // Label text
                ctx.fillStyle = '#ecf0f1';
                ctx.textBaseline = 'middle';
                ctx.fillText(roomName, labelX, labelY);
            }

            // --- Draw Tasks ---
            const pulse = Math.sin(animationTime * 0.05) * 0.3 + 0.7; // Pulsing value 0.4-1.0
            
            for (const task of room.tasks) {
                // Task area background with slight transparency
                ctx.fillStyle = `rgba(241, 196, 15, ${0.1 * pulse})`;
                ctx.fillRect(task.x, task.y, task.width, task.height);
                
                // Pulsing border
                ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                ctx.strokeRect(task.x, task.y, task.width, task.height);
                ctx.setLineDash([]);
                
                // Outer glow effect
                ctx.strokeStyle = `rgba(241, 196, 15, ${0.3 * pulse})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(task.x - 3, task.y - 3, task.width + 6, task.height + 6);
                
                // Task name label
                if (task.name) {
                    ctx.fillStyle = '#f1c40f';
                    ctx.font = 'bold 14px Inter';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Background for text for better readability
                    const textMetrics = ctx.measureText(task.name);
                    const textWidth = textMetrics.width + 12;
                    const textHeight = 24;
                    const textX = task.x + task.width / 2;
                    const textY = task.y + task.height / 2;
                    
                    // Semi-transparent dark background
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                    ctx.fillRect(textX - textWidth / 2, textY - textHeight / 2, textWidth, textHeight);
                    
                    // Text
                    ctx.fillStyle = '#f1c40f';
                    ctx.fillText(task.name, textX, textY);
                }
            }
            
            animationTime++;

            // --- Draw Player (as a rounded "crewmate") ---
            // Shadow effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(player.x + player.width / 2, player.y + player.height + 5, player.width / 2, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Aura effect when near interactive areas
            if (player.nearDoor || player.nearTask) {
                const auraSize = Math.sin(animationTime * 0.08) * 5 + 15;
                ctx.strokeStyle = player.nearTask ? 'rgba(241, 196, 15, 0.3)' : 'rgba(26, 188, 156, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(
                    player.x - auraSize / 2,
                    player.y - auraSize / 2,
                    player.width + auraSize,
                    player.height + auraSize,
                    [player.rounding + auraSize / 2]
                );
                ctx.stroke();
            }
            
            // Body with gradient
            const bodyGradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
            bodyGradient.addColorStop(0, '#ff6b6b');
            bodyGradient.addColorStop(1, '#c0392b');
            ctx.fillStyle = bodyGradient;
            ctx.beginPath();
            ctx.roundRect(player.x, player.y, player.width, player.height, [player.rounding]);
            ctx.fill();
            
            // Body border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(player.x, player.y, player.width, player.height, [player.rounding]);
            ctx.stroke();

            // Visor with gradient
            const visorWidth = player.width * 0.6;
            const visorHeight = player.height * 0.25;
            const visorGradient = ctx.createLinearGradient(
                player.x + (player.width * 0.7 - visorWidth / 2),
                player.y + player.height * 0.2,
                player.x + (player.width * 0.7 - visorWidth / 2),
                player.y + player.height * 0.2 + visorHeight
            );
            visorGradient.addColorStop(0, '#64d4ff');
            visorGradient.addColorStop(1, '#2ecc71');
            
            ctx.fillStyle = visorGradient;
            ctx.beginPath();
            ctx.roundRect(
                player.x + (player.width * 0.7 - visorWidth / 2),
                player.y + player.height * 0.2,
                visorWidth,
                visorHeight,
                [visorHeight / 2]
            );
            ctx.fill();
            
            // Visor shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(
                player.x + (player.width * 0.7 - visorWidth / 2) + 2,
                player.y + player.height * 0.2 + 1,
                visorWidth * 0.4,
                visorHeight * 0.4
            );                // --- Draw Room Name with Shadow ---
            // Shadow text
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.font = 'bold 28px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(room.name, canvas.width / 2 + 2, 32);
            
            // Main text with glow
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Inter';
            ctx.fillText(room.name, canvas.width / 2, 30);
            
            // Subtle underline
            const textMetrics = ctx.measureText(room.name);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - textMetrics.width / 2 - 10, 62);
            ctx.lineTo(canvas.width / 2 + textMetrics.width / 2 + 10, 62);
            ctx.stroke();
}

/**
 * Main Game Loop
 */
function gameLoop() {
    if (gameMode === 'walk') {
        update();
        draw();
    }
    updateScientistPanel(); // Update scientist info every frame
    requestAnimationFrame(gameLoop);
}

// --- 7. Task and Modal Logic ---

/**
 * Trigger a task by loading its URL into the task iframe modal
 * @param {string} taskUrl - The URL of the task HTML file
 */
function triggerTask(taskUrl) {
    gameMode = 'task'; // Pause the game
    const taskFrame = document.getElementById('taskFrame');
    const taskModal = document.getElementById('taskModal');
    
    // Set the iframe source to the task URL
    taskFrame.src = taskUrl;
    
    // Show the modal
    taskModal.classList.add('visible');
}

function closeModal() {
    gameMode = 'walk'; // Resume game
    // Move player slightly to prevent immediate re-trigger
    player.y += 20;
}

// --- Task Modal Close Button ---
const taskModal = document.getElementById('taskModal');
const closeTaskModalBtn = document.getElementById('closeTaskModal');

closeTaskModalBtn.addEventListener('click', () => {
    taskModal.classList.remove('visible');
    document.getElementById('taskFrame').src = ''; // Clear the iframe
    closeModal();
});

// --- Scientist Panel Update ---
const scientistPanel = document.getElementById('scientistPanel');
const scientistName = document.getElementById('scientistName');
const scientistDescription = document.getElementById('scientistDescription');
let lastScientistId = null;

function updateScientistPanel() {
    if (player.nearestScientist && scientists[player.nearestScientist]) {
        const scientist = scientists[player.nearestScientist];
        
        // Only update if scientist changed
        if (lastScientistId !== player.nearestScientist) {
            scientistName.textContent = scientist.name;
            scientistDescription.textContent = scientist.description;
            scientistPanel.classList.remove('fade-out');
            lastScientistId = player.nearestScientist;
        }
    } else {
        // Reset to default
        if (lastScientistId !== null) {
            scientistName.textContent = 'Explore the labs to meet scientists';
            scientistDescription.textContent = 'Navigate near doors to learn about the great microbiologists!';
            lastScientistId = null;
        }
    }
}

// --- 8. Start the Game ---
console.log("Starting Microbe Crew game... Use W, A, S, D or Arrow Keys to move.");
gameLoop();
