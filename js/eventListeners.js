// listen for user key presses

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        game.currentScreen++;
        if (game.currentScreen <= game.screens);
            game.displayInstructions();
    } else {
        game.gameStarted = true;
        game.startGame();
    }
};
window.addEventListener('keydown', (e) => this.handleKeyPress(e));

window.addEventListener('keydown', (event) => {
    if (game.gameStarted = false) return
    if (game.player.preventInput) return
    switch (event.key) {
        case 'ArrowLeft':
            game.keys.ArrowLeft.pressed = true
            // if (exit !== 0) { // if there's an exit
            //     if ( // if player runs into ESCAPE/EXIT door
            //         player.position.x + player.displayWidth <= exit.position.x + exit.displayWidth && // right side of player hits right side of collision block
            //         player.position.x + player.displayWidth/2 >= exit.position.x && // left side of player hits left side of collision
            //         player.position.y + player.displayHeight >= exit.position.y && // bottom of player hits collision block
            //         player.position.y <= exit.position.y + exit.displayHeight // top of player hits collision block) {
            //     ) {
            //         player.velocity.x = 0 // this doesn't work
            //         player.velocity.y = 0 // this doesn't work
            //         player.preventInput = true // this doesn't work
            //         level = 0 // set level back to home
            //         player.enterLevel(level) // enter home screen
            //         break
            //     }
            // }
            break
        case 'ArrowRight':
            game.keys.ArrowRight.pressed = true
            // if (exit !== 0) { // if there's an exit
            //     if ( // if player runs into ESCAPE/EXIT door
            //         player.position.x + player.displayWidth <= exit.position.x + exit.displayWidth && // right side of player hits right side of collision block
            //         player.position.x + player.displayWidth/2 >= exit.position.x && // left side of player hits left side of collision
            //         player.position.y + player.displayHeight >= exit.position.y && // bottom of player hits collision block
            //         player.position.y <= exit.position.y + exit.displayHeight // top of player hits collision block) {
            //     ) {
            //         player.velocity.x = 0 // this doesn't work
            //         player.velocity.y = 0 // this doesn't work
            //         player.preventInput = true // this doesn't work
            //         level = 0 // set level back to home
            //         player.enterLevel(level) // enter home screen
            //         break
            //     }
            // }
            break
        case 'ArrowUp': 
            if (game.currentMap.exit) { // if there's an exit
                if ( // if player is standing in front of dungeon exit
                    game.player.position.x + game.player.displayWidth <= game.currentMap.exit.position.x + game.currentMap.exit.displayWidth && // right side of player hits right side of collision block
                    game.player.position.x + game.player.displayWidth/2 >= game.currentMap.exit.position.x && // left side of player hits left side of collision
                    game.player.position.y + game.player.displayHeight >= game.currentMap.exit.position.y && // bottom of player hits collision block
                    game.player.position.y <= game.currentMap.exit.position.y + game.currentMap.exit.displayHeight // top of player hits collision block) {
                ) {
                    // player.velocity.x = 0 // this doesn't work if jumping is enabled
                    // player.velocity.y = 0 // this doesn't work if jumping is enabled
                    game.player.preventInput = true // TODO: debug
                    game.level = 0 // set level back to home
                    game.player.enterLevel(game.level) // enter home screen
                    game.dashboard.round += 1
                    if (game.dashboard.round > game.totalRounds) { game.endGame() }
                    break
                }
            }
        
            // if player is standing in front of a dungeon entrance in home screen
            for (let i = 0; i < game.currentMap.entrances.length; i++) {
                const entrance = game.currentMap.entrances[i]
                if (
                    // player.position.x + player.displayWidth <= entrance.position.x + entrance.displayWidth && // right side of player hits right side of collision block
                    // player.position.x >= entrance.position.x && // left side of player hits left side of collision
                    // make it easier to enter doors
                    game.player.position.x <= entrance.position.x + entrance.displayWidth && // right side of player hits right side of collision block
                    game.player.position.x + game.player.displayWidth >= entrance.position.x && // left side of player hits left side of collision
                    game.player.position.y + game.player.displayHeight >= entrance.position.y && // bottom of player hits collision block
                    game.player.position.y <= entrance.position.y + entrance.displayHeight // top of player hits collision block) {
                ) {
                    game.player.velocity.x = 0 // this doesn't work
                    game.player.velocity.y = 0 // this doesn't work
                    game.player.preventInput = true // this doesn't stay when enterlevel sets to false
                    console.log("this is being called")
                    game.level = i+1 // set index to appropriate dungeon number, e.g. entrance 0 = dungeon 1
                    game.player.switchSprite('emergeFromPortal') // this works
                    entrance.play() // this works but doesn't show when player enters level
                    console.log("entrance door is playing")
                    game.player.enterLevel(level)
                    if (i == 0) {
                        game.dashboard.updatePoints(50)
                    } else {
                        game.dashboard.updatePoints(100)
                    }
                    // setTimeout(player.enterLevel, 1000, level) // this makes the input permanently true
                    break // this break doesn't stop player from jumping to enter dungeon
                }
            }
            
            for (let i = 0; i < game.currentMap.doors.length; i++) {
                const door = game.currentMap.doors[i]
                if ( // if player is standing in front of a portal door
                    game.player.position.x <= door.position.x + door.displayWidth && // right side of player hits right side of collision block
                    game.player.position.x + game.player.displayWidth >= door.position.x && // left side of player hits left side of collision
                    game.player.position.y + game.player.displayHeight >= door.position.y && // bottom of player hits collision block
                    game.player.position.y <= door.position.y + door.displayHeight // top of player hits collision block) {
                ) {
                    // teleport player to the other door
                    game.player.velocity.x = 0 // stops player from moving when entering door
                    game.player.velocity.y = 0 // stops player from moving when entering door
                    game.player.preventInput = true // // this works, stops player movement when entering door
                    game.player.switchSprite('emergeFromPortal') // TODO: fix, doesn't work
                    door.play()
                    game.player.teleport(i)
                    if (game.currentMap === game.dungeon2) {
                        game.dashboard.updatePoints(-50)
                    }
                    break // prevents player from jumping up when inside a door frame, 
                            // ...but doesn't stop player from jumping whenup when inside an entrance door?
                }
            }
            // jumping motion 
            // if (player.velocity.y === 0) player.velocity.y = -20
            break
    }
})

window.addEventListener('keyup', (event) => {
    if (game.gameStarted = false) return
    // if (game.player.preventInput) return
    switch (event.key) {
        case 'ArrowLeft':
            game.keys.ArrowLeft.pressed = false // stop moving player if key up
            break
        case 'ArrowRight':
            game.keys.ArrowRight.pressed = false // stop moving player if key up
            break
        // case 'ArrowUp':
        //     console.log("i pressed UP")
        //     keys.ArrowUp.pressed = false // stop moving player if key up
        //     break
    }
})