
const playerAttributes = {
    position: {
        x: homePosition.x, 
        y: homePosition.y
    },
    imageSrc: './img_real/player/virtualboy_idleright.png',
    scale: 1.25,
    frameRate: 11,
    frameBuffer: 2,
    // collisionBlocks: collisionBlocks,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2, 
            imageSrc: './img_real/player/virtualboy_idleright.png',
            loop: true
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 2, 
            imageSrc: './img_real/player/virtualboy_idleleft.png',
            loop: true
        },
        runRight: {
            frameRate: 12,
            frameBuffer: 2, 
            imageSrc: './img_real/player/virtualboy_runright.png',
            loop: true
        },
        runLeft: {
            frameRate: 12,
            frameBuffer: 2, 
            imageSrc: './img_real/player/virtualboy_runleft.png',
            loop: true
        },
        // enterDoor: {
            // frameRate: ,
            // frameBuffer: , 
            // loop: false,
            // imageSrc: ,
        // },
        emergeFromPortal: {
            frameRate: 5,
            frameBuffer: 10, 
            loop: false,
            imageSrc: './img_real/player/virtualboy_emerging.png'
        }
    }
}
// // with brackets: error in processing position regardless of x,y breakdown or not
// // without brackets: no error and rest of game renders but leaves undefined file path and cannot see player
