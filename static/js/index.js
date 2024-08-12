// Setup game canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = homeWidth
canvas.height = homeHeight
const overlay = { opacity: 0 }
let complexPortalMap1, complexPortalMap2;
let gameInitialized = false;
// Setup start of game
const totalRounds = 2
let maps
let currentMap
let homeDisplay
let dungeon1
let dungeon2
let level = 0 // start on home map, e.g. maps[0]
// Setup player, game dashboard
const player = new Player(playerAttributes)
const dashboard = new Dashboard()
const keys = {
    ArrowLeft: { pressed: false }, 
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false }
}
// Setup tracking variables
let currentScreen = 0 // keeps track of instruction screen to display
const totalScreens = 3 // total number of instruction screens
let gameStarted = false // false during instructions, true once game has started


// Function to fetch a portal map from the Flask server
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
    .then(([complexPortalMap1, complexPortalMap2]) => {
        if (complexPortalMap1 && complexPortalMap2) {
            console.log("portal maps are loaded")
            gameInitialized = true;
            // Initialize game with the two portal maps
            homeDisplay = new Map('home', 'white');
            dungeon1 = new Map('dungeon', 'purple', complexPortalMap1, 0);
            dungeon2 = new Map('dungeon', 'teal', complexPortalMap2, 50);
            maps = [homeDisplay, dungeon1, dungeon2];
            currentMap = maps[0];

            displayInstructions();
            bindEventListeners();            


        } else {
            console.error('One or both portal maps failed to load.');
        }
    });


function displayInstructions() {
    // Clear the canvas before displaying instructions
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'midnightblue';
    c.textAlign = 'center';
    
    // Title
    // c.font = '30px Arial';
    // c.fillText('Portal Teleportation Game', canvas.width / 2, 100);
    
    // Instructions text based on the current screen
    if (currentScreen === 0) {
        c.font = '24px Arial';
        c.fillText('Welcome to the Dungeon Portal Game!', canvas.width / 2, 180);
        c.fillText('Teleport through portals to explore different platforms in a dungeon.', canvas.width / 2, 230);
        c.fillText('Find a way to escape each dungeon.', canvas.width / 2, 260);
        c.fillText('You will earn money based on how many points you earn in this game.', canvas.width / 2, 290);
        c.fillText('Press ENTER to continue.', canvas.width / 2, 340);
    } else if (currentScreen === 1) {
        c.font = '24px Arial';
        c.fillText('GAME INSTRUCTIONS:', canvas.width / 2, 160);
        c.fillText('Win and lose points from entering and exiting dungeons.', canvas.width / 2, 200);
        c.fillText('Every round, choose one of 2 dungeons to play.', canvas.width / 2, 230);
        c.fillText('There of two dungeons. Each one earns you different points.', canvas.width / 2, 260);
        c.fillText('Be careful: One of the two dungeons may lose you points.', canvas.width / 2, 310);
        c.fillText('To maximize points, find the better of the two dungeons to play.', canvas.width / 2, 340);
        c.fillText('Press ENTER to continue.', canvas.width / 2, 390);

        // Display gameplay image 1
        // const img = nfvfrew Image();
        // img.src = 'path_to_gameplay_image_1.png';
        // img.onload = () => {
        //     c.drawImage(img, canvas.width / 2 - img.width / 2, 300);
        // };

    } else if (currentScreen === 2) {
        c.font = '24px Arial';
        c.fillText('NAVIGATION:', canvas.width / 2, 160);
        c.fillText('Use LEFT and RIGHT arrow keys to move your player.', canvas.width / 2, 200);
        c.fillText('Press UP arrow key to enter a door or escape a dungeon.', canvas.width / 2, 230);
        c.fillText('Good luck! Your adventure begins now.', canvas.width / 2, 260);
        c.fillText('Press ENTER to start the game.', canvas.width / 2, 310);

        // Display gameplay image 2
        // const img = new Image();
        // img.src = 'path_to_gameplay_image_2.png';
        // img.onload = () => {
        //     this.c.drawImage(img, this.canvas.width / 2 - img.width / 2, 320);
        // };
    }
}

// Start the game after displaying instructions
function startGame() {
    if (gameInitialized) {
        maps[level].init();
        animate();
    } else {
        console.error('Game cannot start before portal maps are loaded.');
    }
}

// Updates and animates the game frame by frame
function animate() {
    // this makes animate a recursive function
    window.requestAnimationFrame(animate)
    
    // Draw background
    c.fillStyle = 'midnightblue'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw walls, doors, and collision blocks
    currentMap.draw()
    
    // Draw dashboard
    dashboard.draw()
    dashboard.refresh()
    
    // Update player position & animation
    player.handleInput(keys) 
    player.draw()
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
    // If a door was open for teleportation, close the door
    for (let i = 0; i < currentMap.doors.length; i++) {
        const door = currentMap.doors[i]
        if (door.autoplay && door.currentFrame === door.frameRate-1) {
            door.reset()
            player.preventInput = false
        }
    }
}

function endGame() {

}


// for calling Game class when there is one
// const game = new Game(homeWidth, homeHeight);
// game.init()