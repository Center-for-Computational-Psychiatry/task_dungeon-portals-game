class Game {
    constructor(homeWidth, homeHeight, playerAttributes){
        // Setup game canvas
        this.canvas = document.querySelector('canvas');
        this.c = this.canvas.getContext('2d');
        this.canvas.width = homeWidth;
        this.canvas.height = homeHeight;
        this.overlay = { opacity: 0 };

        // Setup maps
        this.maps = [
            new Map('home', 'white'),
            new Map('dungeon', 'purple', complexPortalMap1),
            new Map('dungeon', 'teal', complexPortalMap2)
        ];

        // Starting game settings
        this.totalRounds = 2;
        this.currentMap = this.maps[0];
        this.level = 0; // start on home map

        this.player = new Player(playerAttributes);
        this.dashboard = new Dashboard();
        this.keys = {
            ArrowLeft: { pressed: false }, 
            ArrowRight: { pressed: false },
            ArrowUp: { pressed: false }
        };
        this.currentScreen = 0 // track instructions screens before real game
        this.screens = 3; // total number of instructions screens
        
        // this.switchingWorlds = false // manage timing of switchingsprites: emerging animation

        this.init();
    }

    init() {
        // Start by displaying instructions
        this.displayInstructions(); 
        // window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    displayInstructions() {
        // Clear the canvas before displaying instructions
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.c.fillStyle = 'midnightblue';
        this.c.textAlign = 'center';
        
        // Title
        // this.c.font = '30px Arial';
        // this.c.fillText('Portal Teleportation Game', this.canvas.width / 2, 100);
        
        // Instructions text based on the current screen
        if (this.currentScreen === 0) {
            this.c.font = '24px Arial';
            this.c.fillText('Welcome to the Portal Teleportation Game!', this.canvas.width / 2, 200);
            this.c.fillText('Navigate through portals to explore different platforms in a room.', this.canvas.width / 2, 240);
            this.c.fillText('Find a teleportation path to the exit.', this.canvas.width / 2, 280);
            this.c.fillText('Press Enter to continue.', this.canvas.width / 2, 320);
        } else if (this.currentScreen === 1) {
            this.c.font = '24px Arial';
            this.c.fillText('Win (or lose) points from entering and exiting rooms.', this.canvas.width / 2, 200);
            this.c.fillText('There are two rooms you can play. Every round, choose which room to play.', this.canvas.width / 2, 230);
            this.c.fillText('Each room has a different point bonus (for entering), with portals that MAY OR MAY NOT lose you points.', this.canvas.width / 2, 260);
            this.c.fillText('To maximize the points you earn, find the better of the two rooms to play.', this.canvas.width / 2, 290);
            this.c.fillText('Press Enter to continue.', this.canvas.width / 2, 320);
            this.c.fillText('', this.canvas.width / 2, 360);

            // Display gameplay image 1
            // const img = new Image();
            // img.src = 'path_to_gameplay_image_1.png';
            // img.onload = () => {
            //     this.c.drawImage(img, this.canvas.width / 2 - img.width / 2, 300);
            // };
        } else if (this.currentScreen === 2) {
            this.c.font = '24px Arial';
            this.c.fillText('At the end of the game, you will earn a game bonus based on the total points won.', this.canvas.width / 2, 160);
            this.c.fillText('NAVIGATION: Use LEFT and RIGHT arrow keys to move your player. Press UP arrow key to enter a door, enter a portal, or exit.', this.canvas.width / 2, 200);
            this.c.fillText('Good luck! Your adventure begins now.', this.canvas.width / 2, 240);
            this.c.fillText('Press Enter to start the game.', this.canvas.width / 2, 280);

            // Display gameplay image 2
            // const img = new Image();
            // img.src = 'path_to_gameplay_image_2.png';
            // img.onload = () => {
            //     this.c.drawImage(img, this.canvas.width / 2 - img.width / 2, 320);
            // };
        }
    }

    startGame() {
        // Clear the canvas and start game loop
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.maps[this.level].init();
        // if (!this.animationStarted) {
        //     this.animationStarted = true;
            this.animate();
        // }
    }

    animate() {
        // this makes animate a recursive function
        window.requestAnimationFrame(this.animate());
        
        // Draw background
        this.c.fillStyle = 'midnightblue';
        this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw walls, doors, and collision blocks
        this.currentMap.draw();
        
        // Draw dashboard
        this.dashboard.draw();
        this.dashboard.refresh();
        
        // Update player position & animation
        this.player.handleInput(this.keys);
        this.player.draw();
        this.player.update(currentMap.collisionBlocks);
    
        // Overlay effect for level changes
        this.c.save();
        this.c.globalAlpha = this.overlay.opacity;
        this.c.fillStyle = 'black';
        this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.c.restore();
    
        // Handle door closing
        this.resetDoors();
    }
    
    resetDoors() {
        // If a door was open for teleportation, close the door
        for (let i = 0; i < this.currentMap.doors.length; i++) {
            const door = this.currentMap.doors[i];
            if (door.autoplay && door.currentFrame === door.frameRate-1) {
                door.reset();
                this.player.preventInput = false;
            }
        }
    }

    endGame() {
        
    }

}





// const canvas = document.querySelector('canvas')
// const c = canvas.getContext('2d')
// canvas.width = homeWidth
// canvas.height = homeHeight
// const overlay = { opacity: 0 }

// Setup maps and collision blocks
// const homeDisplay = new Map('home', 'white')
// const dungeon1 = new Map('dungeon', 'purple', complexPortalMap1)
// const dungeon2 = new Map('dungeon', 'teal', complexPortalMap2)
// const maps = [homeDisplay, dungeon1, dungeon2]

// Setup start of game
// const totalRounds = 2
// let currentMap = homeDisplay
// let level = 0 // start on home map, e.g. maps[0]

// Setup player, game dashboard
// const player = new Player(playerAttributes)
// const dashboard = new Dashboard()
// const keys = {
//     ArrowLeft: { pressed: false }, 
//     ArrowRight: { pressed: false },
//     ArrowUp: { pressed: false }
// }
// let switchingWorlds = false // this is to manage timing of switchingsprites: emerging animation


// Updates and animates the game frame by frame
// function animate() {
//     // this makes animate a recursive function
//     window.requestAnimationFrame(animate)
    
//     // Draw background
//     c.fillStyle = 'midnightblue'
//     c.fillRect(0, 0, canvas.width, canvas.height)
    
//     // Draw walls, doors, and collision blocks
//     currentMap.draw()
    
//     // Draw dashboard
//     dashboard.draw()
//     dashboard.refresh()
    
//     // Update player position & animation
//     player.handleInput(keys) 
//     player.draw()
//     player.update(currentMap.collisionBlocks)

//     // Overlay effect for level changes
//     c.save()
//     c.globalAlpha = overlay.opacity
//     c.fillStyle = 'black'
//     c.fillRect(0, 0, canvas.width, canvas.height)
//     c.restore()

//     // Handle door closing
//     resetDoors()

// }

// function resetDoors() {
//     // If a door was open for teleportation, close the door
//     for (let i = 0; i < currentMap.doors.length; i++) {
//         const door = currentMap.doors[i]
//         if (door.autoplay && door.currentFrame === door.frameRate-1) {
//             door.reset()
//             player.preventInput = false
//         }
//     }
// }


class GameEngine {
    constructor(canvas) {
      // Existing game initialization
      this.currentScreen = 'title'; // Start with the title screen
    }
  
    drawTitleScreen() {
      this.clearScreen();
      this.context.fillText("GAME TITLE", 100, 100);
      this.context.fillText("A thrilling adventure awaits!", 100, 150);
      this.context.fillText("[Press ENTER to start]", 100, 200);
    }
  
    drawStoryScreen() {
      this.clearScreen();
      this.context.fillText("STORY", 100, 100);
      this.context.fillText("You awaken in a mysterious world...", 100, 150);
      this.context.fillText("[Press ENTER to continue]", 100, 200);
    }
  
    drawControlsScreen() {
      this.clearScreen();
      this.context.fillText("CONTROLS", 100, 100);
      this.context.fillText("Move Left: [A] or [←]", 100, 150);
      this.context.fillText("Move Right: [D] or [→]", 100, 180);
      this.context.fillText("Jump: [Space]", 100, 210);
      this.context.fillText("[Press ENTER to continue]", 100, 240);
    }
  
    drawObjectiveScreen() {
      this.clearScreen();
      this.context.fillText("OBJECTIVE", 100, 100);
      this.context.fillText("Find and activate the hidden portals...", 100, 150);
      this.context.fillText("[Press ENTER to begin your journey]", 100, 200);
    }
  
    startGame() {
      // Initialize the main game
      this.currentScreen = 'game';
    }
  
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        switch (this.currentScreen) {
          case 'title':
            this.currentScreen = 'story';
            break;
          case 'story':
            this.currentScreen = 'controls';
            break;
          case 'controls':
            this.currentScreen = 'objective';
            break;
          case 'objective':
            this.startGame();
            break;
        }
      }
    }
  
    gameLoop() {
      window.requestAnimationFrame(() => this.gameLoop());
  
      switch (this.currentScreen) {
        case 'title':
          this.drawTitleScreen();
          break;
        case 'story':
          this.drawStoryScreen();
          break;
        case 'controls':
          this.drawControlsScreen();
          break;
        case 'objective':
          this.drawObjectiveScreen();
          break;
        case 'game':
          this.update();
          this.render();
          break;
      }
    }
  }