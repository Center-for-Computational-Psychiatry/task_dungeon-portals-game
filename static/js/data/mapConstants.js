// MAP DIMENSIONS
// This is for 64x64 tiles. Note: 16x9 ratio works for most screens
const homeWidth = 64 * 12 
const homeHeight = 64 * 10 // 9 blocks for game, 1 block for point counter
// const dungeonWidth = 64 * 12 
// const dungeonHeight = 64 * 14 // 13 blocks for game, 1 block for point counter
const dungeonWidth = 64 * 12 
const dungeonHeight = 64 * 20 // 13 blocks for game, 1 block for point counter

// PORTAL CONNECTIONS
// simple: 12 doors, 4 floors, 2 steps to solve
const simplePortalMap1 = {2: 10, 10: 2, 6: 3, 3: 6, 9: 7, 7: 9, 11: 8, 8: 11, 1: 5, 5: 1, 4: 12, 12: 4}
const simplePortalMap2 = {11: 5, 5: 11, 12: 9, 9: 12, 2: 8, 8: 2, 1: 10, 10: 1, 3: 7, 7: 3, 6: 4, 4: 6}
// complex: 21 doors, 6 floors, 3 steps to solve
const complexPortalMap1 = {18: 12, 12: 18, 11: 15, 15: 11, 7: 8, 8: 7, 16: 3, 3: 16, 4: 5, 5: 4, 13: 17, 17: 13, 1: 9, 9: 1, 2: 6, 6: 2, 14: 10, 10: 14}
const complexPortalMap2 = {12: 6, 6: 12, 2: 13, 13: 2, 5: 4, 4: 5, 10: 16, 16: 10, 9: 8, 8: 9, 14: 17, 17: 14, 18: 1, 1: 18, 15: 7, 7: 15, 3: 11, 11: 3}


// PLAYER STARTING POSITIONS
// Home screen positions
const homePosition = { 
    x: homeWidth/2, 
    y: homeHeight/2
}
// Dungeon positions
const startPosition = {
    x: dungeonWidth/2, 
    y: 500 // complex 6 level dungeon version
    // y: 300 // simple 4 level dungeon version
}

// COLLISION BLOCK VARIABLES
// let parsedCollisions
// let collisionBlocks

// DOOR POSITIONS and SIZE
const door_scale = 2/3
const door_height = 112 * door_scale

const home_x_positions = [ 64 * 1.5, 64 * 9.5 ]
const home_y_positions = [ 64 * 6 - door_height ]

const dungeon_x_positions = [ 64 * 1.5, 64 * 5, 64 * 8.5] 
const dungeon_y_positions = [ 64 * 3 - door_height, 
                            64 * 6 - door_height, 
                            64 * 9 - door_height, 
                            64 * 12 - door_height, 
                            // for 6 stories:
                            64 * 15 - door_height,
                            64 * 18 - door_height, 
                        ]
