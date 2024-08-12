class Map {
    constructor(type, color, portalMap={}) {
        this.type = type // 'home' or 'dungeon'
        this.color = color
        this.portalMap = portalMap
        this.entrances = [];
        this.doors = [];
        this.exit = null;
        if (this.type == 'home') {
            this.width = homeWidth
            this.height = homeHeight
            this.collisionBlocks = homeMapCollisions.parse2D().createObjectsFrom2D();    
        } else {
            this.width = dungeonWidth
            this.height = dungeonHeight
            this.collisionBlocks = dungeonCollisions.parse2D().createObjectsFrom2D();
        }
    }

    init() {
        console.log(`${this.type} map`);
        game.currentMap = this;
        
        if (this.type === 'home') {
            game.player.position.x = homePosition.x;
            game.player.position.y = homePosition.y;
            this.setupHomeMap();
        } else { // dungeon map
            game.player.position.x = startPosition.x;
            game.player.position.y = startPosition.y;
            this.setupDungeonMap();
        }
        game.player.collisionBlocks = this.collisionBlocks; // set collision blocks for the level
    }

    setupHomeMap() {
        game.canvas.width = homeWidth 
        game.canvas.height = homeHeight
        // Home map has no doors or exit
        this.doors = []
        this.exit = null
        // Setup two entrances for home map
        this.entrances = []
        home_y_positions.forEach((y_position) => {
            home_x_positions.forEach((x_position) => {
                let entrance = new Sprite({
                    position: {
                        x: x_position,
                        y: y_position
                    }, 
                    imageSrc: './img/doorOpen.png',
                    scale: door_scale,
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false
                })
                this.entrances.push(entrance)
            });
        });
    }

    setupDungeonMap() {
        game.canvas.width = dungeonWidth
        game.canvas.height = dungeonHeight
        // Dungeon doesn't have any entrances
        this.entrances = []
        // Dungeon has one exit
        this.exit = new Sprite({
            position: {
                x: 64 * 10,
                // y: 64 * 8 // for 4 stories
                y: 64 * 11 // for 6 stories
            }, 
            imageSrc: './img/escape.png',
            scale: 1/7.8,
            loop: false 
        });
        // Setup doors for dungeon
        this.doors = []
        dungeon_y_positions.forEach((y_position) => {
            dungeon_x_positions.forEach((x_position) => {
                let door = new Sprite({
                    position: {
                        x: x_position,
                        y: y_position
                    }, 
                    imageSrc: './img/doorOpen.png',
                    scale: door_scale,
                    frameRate: 5,
                    frameBuffer: 10,
                    loop: false,
                    autoplay: false
                })
            this.doors.push(door)
            });
        });
    }

    draw() {
        this.drawBackground()
        
        this.entrances.forEach((entrance) => {
            entrance.draw();
        });
        this.doors.forEach((door) => {
            door.draw();
        });
        if (this.exit) {
            this.exit.draw();
        }

        this.collisionBlocks.forEach(collisionBlock => {
            collisionBlock.draw()
        })
    }

    drawBackground() {
        const drawVerticalSide = (x, height) => {
            c.fillStyle = this.color;  // Set color before each drawing operation
            c.fillRect(x, 0, 64, 64 * height);
        };
        
        const drawHorizontalLayer = (y, width, color) => {
            c.fillStyle = color;  // Use specified color
            c.fillRect(0, 64 * y, 64 * width, 64);
        };
    
        // Draw vertical sides
        drawVerticalSide(0, 19);       // Left side (6 story)
        drawVerticalSide(64 * 11, 19); // Right side (6 story)
    
        if (this.type === "home") {
            // Draw horizontal layers for home
            const homeLayers = [0, 1, 2, 3, 6, 7, 8];
            homeLayers.forEach(layer => drawHorizontalLayer(layer, 14, this.color));

            // Draw white background for dashboard display
            drawHorizontalLayer(9, 14, "white");
        } else { // dungeon
            // Draw horizontal layers for dungeon
            const dungeonLayers = [0, 3, 6, 9, 12, 15, 18];
            dungeonLayers.forEach(layer => drawHorizontalLayer(layer, 14, this.color));
    
            // Draw white background for dashboard display
            drawHorizontalLayer(19, 14, "white");
        }
    }

    

}