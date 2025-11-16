# Microbe Crew - Interactive Microbiology Learning Game

## Goal
An interactive educational game where players navigate a microbiology facility, explore different scientists' labs, and engage with hands-on simulations of famous microbiology experiments. Designed to teach microbiology concepts through interactive gameplay.

## Tech Stack
- **No external libraries** - Pure HTML5, CSS3, JavaScript
- **Canvas-based rendering** - 2D game rendering for rooms and character movement
- **Modular architecture** - Separated concerns for scalability
- **Iframe-based task loading** - Dynamic experiment simulations

## Project Structure
```
Microbiology-game/
├── microbe_crew_game.html      # Main game entry point
├── style.css                    # Global styles (game UI, modals, buttons)
├── game.js                      # Core game logic (rendering, physics, rooms)
├── pasteur_task.html            # Pasteur experiment simulation
├── coming_soon.html             # Placeholder for future tasks
└── README.md                    # This file
```

## File Descriptions

### `microbe_crew_game.html`
- Single-page entry point
- Contains: Canvas, generic task modal with iframe
- Links to `style.css` and `game.js`
- **Don't modify gameplay logic here** - Use `game.js` instead

### `style.css`
- Global styles for main game interface
- Modal, button, and canvas container styling
- Iframe styling for task modal
- **All task-specific styles go in individual task files**

### `game.js`
- **Room definitions** - Layout, walls, doors, tasks for each room
- **Player object** - Character properties and behavior
- **Game loop** - Update and render logic (60 FPS)
- **Collision detection** - Wall, door, and task collisions
- **Task triggering** - Opens iframe modal with task URL
- **State management** - Game mode (walk vs. task)

### `pasteur_task.html`
- Self-contained Pasteur's swan-neck flask experiment
- **Complete isolation** - No dependencies on main game
- HTML structure + embedded CSS + embedded JavaScript
- Interactive flask simulation with step-by-step workflow

### `coming_soon.html`
- Placeholder for unimplemented labs
- Minimal HTML - displays construction message
- Can be replaced with actual task files

## How to Add New Labs & Simulations

### Step 1: Create a Task HTML File
Create a new file (e.g., `koch_task.html`):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Task Name</title>
    <style>
        /* Embed all CSS here - no external stylesheets */
        body { /* ... */ }
        /* Keep styles scoped to task */
    </style>
</head>
<body>
    <h2>Task Title</h2>
    <p>Instructions...</p>
    <!-- Your interactive simulation -->
    
    <script>
        // Self-contained logic only
        // No dependencies on game.js or other files
    </script>
</body>
</html>
```

### Step 2: Update Room Definition in `game.js`
Add or modify the room's tasks array:
```javascript
'kochLab': {
    name: "Robert Koch's Lab",
    backgroundColor: '#34495e',
    walls: [ /* ... */ ],
    doors: [ /* ... */ ],
    tasks: [
        { x: 200, y: 390, width: 400, height: 70, taskUrl: 'koch_task.html' }
    ]
}
```

### Step 3: Done!
- Player navigates to the task area
- Modal opens and loads your task file in an iframe
- Task runs independently

## Customization Guide

### Changing Canvas Size
In `game.js`, modify the canvas setup:
```javascript
canvas.width = 1024;   // Change from 800
canvas.height = 768;   // Change from 600
```
⚠️ **Note**: Adjust room layout coordinates proportionally

### Adding/Modifying Rooms
In `game.js` `rooms` object:
```javascript
'myNewLab': {
    name: 'My Lab Name',
    backgroundColor: '#rrggbb',  // Hex color
    walls: [
        { x, y, width, height },  // Rectangle collision boxes
    ],
    doors: [
        { x, y, width, height, targetRoom: 'mainHall', targetX: 100, targetY: 500 }
    ],
    tasks: [
        { x, y, width, height, taskUrl: 'task_file.html' }
    ]
}
```

### Adjusting Player Movement
In `game.js` player object:
```javascript
const player = {
    speed: 4,           // Pixels per frame (increase = faster)
    width: 30,          // Character width
    height: 40,         // Character height
    color: '#e74c3c',   // Body color
    visorColor: '#a9d6e5' // Visor color
};
```

### Styling the Modal
In `style.css`:
```css
.modal-content {
    max-width: 600px;           /* Change modal width */
    border-top: 8px solid #3498db;  /* Change accent color */
}

#taskFrame {
    height: 500px;              /* Change iframe height */
}
```

### Creating Interactive Simulations
Best practices for task files:

✅ **Do:**
- Use HTML5 Canvas, SVG, or DOM manipulation
- Embed all CSS and JavaScript in the same file
- Use CSS transitions/animations for visual feedback
- Build step-by-step workflows (button-based progression)
- Test independently before linking

❌ **Don't:**
- Import external libraries or stylesheets
- Reference global variables from main game
- Modify parent window state
- Use absolute imports

## Game Mechanics

### Movement
- **W/↑** - Move up
- **A/←** - Move left
- **S/↓** - Move down
- **D/→** - Move right

### Interactions
- **Enter a task area** (yellow dashed box) - Modal opens with simulation
- **Click "Close"** - Return to game
- **Navigate between rooms** - Walk through doors (teal areas)

## State Management

### Game Modes
- `'walk'` - Player can move, tasks are interactive
- `'task'` - Player frozen, task modal is active

Switching happens in `triggerTask()` and `closeModal()` in `game.js`.

### Task Modal Lifecycle
1. Player enters task collision area
2. `triggerTask(taskUrl)` called
3. Iframe src set to taskUrl
4. Modal shown with fade-in animation
5. Task runs independently
6. Close button moves player and resumes game

## Performance Considerations

- **Canvas rendering** uses `requestAnimationFrame` (60 FPS target)
- **Collision detection** is O(n) - efficient for small room counts
- **Iframes are lazy** - Only load when modal opens
- **CSS transitions** are GPU-accelerated

## Future Enhancements

Possible additions without breaking current structure:

- **Sound effects** - Add audio in individual task files
- **Scoring system** - Track experiment results
- **Save/load** - Store progress in localStorage
- **Inventory system** - Add item collection mechanics
- **Multiplayer** - With WebSockets in game.js
- **Mobile controls** - Add virtual joystick in game.js
- **Procedural tasks** - Generate simulations dynamically

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires: Canvas API, CSS Grid/Flex, ES6 JavaScript

## Development Workflow

1. **Add new room**: Modify `game.js` rooms object
2. **Create task file**: Copy `pasteur_task.html` template
3. **Link in game.js**: Add `taskUrl` to room's tasks array
4. **Test locally**: Open `microbe_crew_game.html` in browser
5. **Debug**: Use browser DevTools (F12)
   - Check console for `gameLoop` messages
   - Inspect iframe loading with Network tab
   - Pause game and inspect canvas in Elements

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Task modal doesn't load | Check taskUrl path is correct, file exists |
| Player stuck in walls | Check wall collision boxes don't overlap |
| Game feels slow | Reduce collision checks, limit particles |
| Task styling looks wrong | Ensure CSS is scoped in task file, no conflicts |
| Modal won't close | Check `closeTaskModal` button id matches |

## License & Attribution
Educational project for microbiology learning. Designs inspired by classic arcade games and educational simulations.

---

**Last Updated:** November 15, 2025  
**Maintainer:** [Your Name]
