
// const game = new Game(homeWidth, homeHeight);
// game.init()

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = homeWidth
canvas.height = homeHeight
const overlay = { opacity: 0 }

// Setup maps and collision blocks
const homeDisplay = new Map('home', 'white')
const dungeon1 = new Map('dungeon', 'purple', complexPortalMap1)
const dungeon2 = new Map('dungeon', 'teal', complexPortalMap2)
const maps = [homeDisplay, dungeon1, dungeon2]

// Setup start of game
const totalRounds = 2
let currentMap = homeDisplay
let level = 0 // start on home map, e.g. maps[0]

// Setup player, game dashboard
const player = new Player(playerAttributes)
const dashboard = new Dashboard()
const keys = {
    ArrowLeft: { pressed: false }, 
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false }
}
// let switchingWorlds = false // this is to manage timing of switchingsprites: emerging animation

maps[level].init();
animate();

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

