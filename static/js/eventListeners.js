import * as gameModule from './index.js'

export function bindEventListeners() {
    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
}

export function handleKeyDown(event) {
    if (!gameModule.gameStarted) {
        handleInstructionsKeys(event); // Handle input to progress through instructions screens
        handleParticipantIDInput(event); // Handle input for participantId field
    } else {
        handleGameKeyDown(event);
    }
}

function handleInstructionsKeys(event) {
    if (event.key === 'Enter') {
        if (gameModule.currentScreen === 0) {
            handleParticipantIdSubmit(); // Submit on Enter key
            return // prevent currentScreen from progressing if they didn't enter participant ID
        }
        gameModule.incrementCurrentScreen();
        if (gameModule.currentScreen <= gameModule.totalScreens - 1) {
            gameModule.displayInstructions();
        } else {
            gameModule.setGameStarted(true);
            gameModule.startGame();
        }
    }
}

// Handle keyboard input for participant ID text field in beginning
function handleParticipantIDInput(event) {
    if (gameModule.currentScreen === 0) {
        if (event.key === 'Backspace') {
            gameModule.inputField.value = gameModule.inputField.value.slice(0, -1);
        } else if (event.key.length === 1) { // Add only printable characters
            gameModule.inputField.value += event.key;
        }
        gameModule.drawParticipantIDField();
    }
}

// Function to handle submission
function handleParticipantIdSubmit() {
    const participantId = gameModule.inputField.value.trim();
    if (participantId != "") {
        gameModule.gameTracker.participantId = participantId;
        gameModule.incrementCurrentScreen(); // TODO DEBUG assignmemt constant variable
        gameModule.displayInstructions();
    } else {
        alert('Please enter your participant ID.');
        gameModule.drawParticipantIDField();
    }
}

// Handle keydown events during the actual game
function handleGameKeyDown(event) {

    if (gameModule.player.preventInput) return;

    switch (event.key) {
        case 'ArrowLeft':
            gameModule.keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            gameModule.keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            // if there's an escape door
            if (gameModule.currentMap.exit) {
                if ( // if player is standing in front of dungeon exit
                    gameModule.player.position.x + gameModule.player.displayWidth <= gameModule.currentMap.exit.position.x + gameModule.currentMap.exit.displayWidth && // right side of player hits right side of collision block
                    gameModule.player.position.x + gameModule.player.displayWidth / 2 >= gameModule.currentMap.exit.position.x && // left side of player hits left side of collision
                    gameModule.player.position.y + gameModule.player.displayHeight >= gameModule.currentMap.exit.position.y && // bottom of player hits collision block
                    gameModule.player.position.y <= gameModule.currentMap.exit.position.y + gameModule.currentMap.exit.displayHeight // top of player hits collision block) {
                ) {
                    gameModule.player.preventInput = true // TODO: debug
                    gameModule.setLevel(0); // set level back to home
                    gameModule.player.enterLevel(gameModule.maps[gameModule.level], gameModule.overlay) // enter home screen
                    gameModule.dashboard.round += 1
                    if (gameModule.dashboard.round > gameModule.totalRounds) {
                        gameModule.endGame();
                    }
                    break;
                }
            }

            // if player is standing in front of a dungeon entrance in home screen
            handleDungeonEntrance();

            // if player is standing in front of portal entrance in a dungeon
            handlePortalTravel();
            break;
    }

}

function handleDungeonEntrance() {
    for (let i = 0; i < gameModule.currentMap.entrances.length; i++) {
        const entrance = gameModule.currentMap.entrances[i];
        if (
            // make it easier to enter doors
            gameModule.player.position.x <= entrance.position.x + entrance.displayWidth && // right side of player hits right side of collision block
            gameModule.player.position.x + gameModule.player.displayWidth >= entrance.position.x && // left side of player hits left side of collision
            gameModule.player.position.y + gameModule.player.displayHeight >= entrance.position.y && // bottom of player hits collision block
            gameModule.player.position.y <= entrance.position.y + entrance.displayHeight // top of player hits collision block) {
        ) {
            gameModule.player.velocity.x = 0; // this doesn't work
            gameModule.player.velocity.y = 0; // this doesn't work
            gameModule.player.preventInput = true; // this doesn't stay when enterlevel sets to false

            gameModule.setLevel(i + 1); // set index to appropriate dungeon number, e.g. entrance 0 = dungeon 1
            gameModule.player.switchSprite('emergeFromPortal'); // this works
            entrance.play(); // this works but doesn't show when player enters level

            gameModule.player.enterLevel(gameModule.maps[gameModule.level], gameModule.overlay);
            if (i == 0) {
                gameModule.dashboard.updatePoints(50);
            } else {
                gameModule.dashboard.updatePoints(100);
            }
            break;
        }
    }
}

function handlePortalTravel() {
    for (let i = 0; i < gameModule.currentMap.doors.length; i++) {
        const door = gameModule.currentMap.doors[i];
        if ( // if player is standing in front of a portal door
            gameModule.player.position.x <= door.position.x + door.displayWidth && // right side of player hits right side of collision block
            gameModule.player.position.x + gameModule.player.displayWidth >= door.position.x && // left side of player hits left side of collision
            gameModule.player.position.y + gameModule.player.displayHeight >= door.position.y && // bottom of player hits collision block
            gameModule.player.position.y <= door.position.y + door.displayHeight // top of player hits collision block) {
        ) {
            // teleport player to the other door
            gameModule.player.velocity.x = 0; // stops player from moving when entering door
            gameModule.player.velocity.y = 0; // stops player from moving when entering door
            gameModule.player.preventInput = true; // stops player movement when entering door
            gameModule.player.switchSprite('emergeFromPortal'); // TODO: fix later
            door.play();
            gameModule.player.teleport(gameModule.currentMap, i, gameModule.overlay);
            gameModule.dashboard.updatePoints(-gameModule.currentMap.pointLoss); // point loss for portal travel

            break;
        }
    }
}
export function handleKeyUp(event) {
    if (!gameModule.gameStarted) return;

    switch (event.key) {
        case 'ArrowLeft':
            gameModule.keys.ArrowLeft.pressed = false; // stop moving player if key up
            break;
        case 'ArrowRight':
            gameModule.keys.ArrowRight.pressed = false; // stop moving player if key up
            break;
    }
}

// Export CSV of user data if user exits browser window
window.addEventListener('beforeunload', (event) => {
    if (!gameModule.gameSaved) {
        gameModule.saveGameData();
    }
});