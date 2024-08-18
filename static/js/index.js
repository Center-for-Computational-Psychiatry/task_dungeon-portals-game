import { Map } from './classes/Map.js';
import { Player } from './classes/Player.js';
import { Dashboard } from './classes/Dashboard.js';
import { GameTracker } from './classes/GameTracker.js';
import { playerAttributes } from './data/playerConstants.js';
import { homeWidth, homeHeight, } from './data/mapConstants.js';
import { bindEventListeners, handleKeyDown, handleKeyUp } from './eventListeners.js';

// Setup game canvas
export const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')
canvas.width = homeWidth
canvas.height = homeHeight
export const overlay = { opacity: 0 }

// Setup start of game
export const totalRounds = 10
export let level = 0 // start on home map, e.g. maps[0]
export function setLevel(index) { level = index; }
export let currentMap
export let maps
export let gameEnded = false;
let gameInitialized = false;
let homeDisplay
let dungeon1
let dungeon2
let animationId;

// Setup player, game dashboard
export const player = new Player(playerAttributes)
export const dashboard = new Dashboard(totalRounds)
export let keys = {
    ArrowLeft: { pressed: false }, ArrowRight: { pressed: false }, ArrowUp: { pressed: false }
}

// Setup input field for first screen
export const inputField = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 40,
    width: 200,
    height: 40,
    value: '',
    active: true
};

// Setup tracking variables
export let currentScreen = 0; // keeps track of instruction screen to display
export let totalScreens = 4; // total number of pre-game screens
export let gameStarted = false; // false during instructions, true once game has started
export let gameSaved = false;
export let gameTracker = new GameTracker(); // GameTracker gets initialized once participant ID is collected
export function setCurrentMap(map) { currentMap = map; }
export function setGameStarted(bool) {
    gameStarted = bool;
    gameTracker.trackGameStart();
}
export function incrementCurrentScreen() {
    currentScreen++;
}

// Fetch portal maps from Flask server
function fetchPortalMap() {
    return fetch('http://localhost:5000/portal_map')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching portal map:', error);
            return null;
        });
}

// Fetch portal maps
const portalMap1Promise = fetchPortalMap();
const portalMap2Promise = fetchPortalMap();

Promise.all([portalMap1Promise, portalMap2Promise])
    .then(([portalMap1, portalMap2]) => {
        if (portalMap1 && portalMap2) {
            initializeGame(portalMap1, portalMap2);
        } else {
            console.error('One or both portal maps failed to load.');
        }
    });

function initializeGame(portalMap1, portalMap2) {
    console.log("portal maps are loaded")
    gameInitialized = true;
    // Initialize game with the two portal maps
    homeDisplay = new Map('home', 'white');
    dungeon1 = new Map('dungeon', 'purple', portalMap1, 0);
    dungeon2 = new Map('dungeon', 'teal', portalMap2, 50);
    maps = [homeDisplay, dungeon1, dungeon2];
    currentMap = maps[0];

    displayInstructions();
    bindEventListeners();
}

export function displayInstructions() {
    // Clear the canvas before displaying instructions
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'midnightblue';
    c.textAlign = 'center';

    // Instructions text based on the current screen
    if (currentScreen === 0) {
        drawParticipantIDField(); // Collect participant ID
    } else if (currentScreen === 1) {
        c.font = '24px Arial';
        c.fillText('Welcome to the Dungeon Portal Game!', canvas.width / 2, 180);
        c.fillText('Teleport through portals to explore different platforms in a dungeon.', canvas.width / 2, 230);
        c.fillText('Find a way to escape each dungeon.', canvas.width / 2, 260);
        c.fillText('You will earn money based on how many points you earn in this game.', canvas.width / 2, 290);
        c.fillText('Press ENTER to continue.', canvas.width / 2, 340);
    } else if (currentScreen === 2) {
        c.font = '24px Arial';
        c.fillText('GAME INSTRUCTIONS', canvas.width / 2, 160);
        c.fillText('Win and lose points from entering and exiting dungeons.', canvas.width / 2, 200);
        c.fillText('Every round, choose one of 2 dungeons to play.', canvas.width / 2, 230);
        c.fillText('There of two dungeons. Each one earns you different points.', canvas.width / 2, 260);
        c.fillText('Be careful: One of the two dungeons may lose you points.', canvas.width / 2, 310);
        c.fillText('To maximize points, find the better of the two dungeons to play.', canvas.width / 2, 340);
        c.fillText('Press ENTER to continue.', canvas.width / 2, 390);
    } else if (currentScreen === 3) {
        c.font = '24px Arial';
        c.fillText('NAVIGATION', canvas.width / 2, 160);
        c.fillText('Use LEFT and RIGHT arrow keys to move your player.', canvas.width / 2, 200);
        c.fillText('Press UP arrow key to enter a door or escape a dungeon.', canvas.width / 2, 230);
        c.fillText('Good luck! Your adventure begins now.', canvas.width / 2, 260);
        c.fillText('Press ENTER to start the game.', canvas.width / 2, 310);
    }
}

export function drawParticipantIDField() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    // Draw input field
    c.fillStyle = 'white';
    c.fillRect(inputField.x, inputField.y, inputField.width, inputField.height);
    c.strokeRect(inputField.x, inputField.y, inputField.width, inputField.height);
    // Draw input text
    c.fillStyle = 'black';
    c.font = '20px Arial';
    c.fillText(inputField.value, inputField.x + inputField.width / 2, inputField.y + 25);
    // Draw instructions
    c.fillStyle = 'black';
    c.font = '20px Arial';
    c.fillText('Enter Participant ID and press ENTER', canvas.width / 2, canvas.height / 2 - 60);
}


// Start the game after displaying instructions
export function startGame() {
    if (gameInitialized && !gameEnded) {
        console.log("Starting game")
        maps[level].init();
        animate();
    } else if (gameEnded) {
        console.log("Game has already ended. Cannot restart.");
    } else {
        console.error('Game cannot start before portal maps are loaded.');
    }
}

// Updates and animates the game frame by frame
function animate() {
    if (gameEnded) {
        cancelAnimationFrame(animationId);
        return;
    }
    // this makes animate a recursive function
    animationId = window.requestAnimationFrame(animate);

    // Draw background
    c.fillStyle = 'midnightblue'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Draw walls, doors, and collision blocks
    currentMap.draw()

    // Draw dashboard
    dashboard.draw(c, canvas)
    dashboard.refresh()

    // Update player position & animation
    player.handleInput(keys)
    player.draw(c)
    player.update(currentMap.collisionBlocks)

    // Overlay effect for level changes
    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()

    // Handle door closing
    resetDoors()

}

function resetDoors() {
    // If a portal was open for teleportation, close the portal
    for (let i = 0; i < currentMap.doors.length; i++) {
        const door = currentMap.doors[i]
        if (door.autoplay && door.currentFrame === door.frameRate - 1) {
            door.reset()
            player.preventInput = false
        }
    }
}

export function endGame() {
    gameEnded = true;
    cancelAnimationFrame(animationId);
    // Save game data
    saveGameData();
    // Remove event listeners
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);

    // Display end game text
    c.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = homeWidth
    canvas.height = homeHeight
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'midnightblue';
    c.textAlign = 'center';
    c.font = '32px Arial';
    c.fillText('Thank you for playing the Dungeon Portal Game.', canvas.width / 2, 200);
    c.fillText('The game is now complete.', canvas.width / 2, 275);
    c.fillText("You earned a total of " + dashboard.points + " points in this game.", canvas.width / 2, 350);
    c.fillText('Thank you for your participation!', canvas.width / 2, 425);

}

export function saveGameData() {
    gameTracker.exportToCSV();
    gameTracker.saveToDatabase();
    gameSaved = true;
}