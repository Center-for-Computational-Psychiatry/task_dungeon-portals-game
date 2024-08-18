import {
    startGame, saveGameData, player, dashboard, overlay, displayInstructions, drawParticipantIDField, maps,
    currentMap, totalRounds, currentScreen, totalScreens, gameStarted, gameTracker, keys, level, setLevel,
    incrementCurrentScreen, setGameStarted, inputField, endGame, gameSaved
} from './index.js'

export function bindEventListeners() {
    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
}


export function handleKeyDown(event) {
    if (!gameStarted) {
        handleInstructionsKeys(event); // Handle input to progress through instructions screens
        handleParticipantIDInput(event); // Handle input for participantId field
    } else {
        handleGameKeyDown(event);
    }
}

function handleInstructionsKeys(event) {
    if (event.key === 'Enter') {
        if (currentScreen === 0) {
            handleParticipantIdSubmit(); // Submit on Enter key
            return // prevent currentScreen from progressing if they didn't enter participant ID
        }
        incrementCurrentScreen();
        if (currentScreen <= totalScreens - 1) {
            displayInstructions();
        } else {
            setGameStarted(true);
            startGame();
        }
    }
}

// Handle keyboard input for participant ID text field in beginning
function handleParticipantIDInput(event) {
    if (currentScreen === 0) {
        if (event.key === 'Backspace') {
            inputField.value = inputField.value.slice(0, -1);
        } else if (event.key.length === 1) { // Add only printable characters
            inputField.value += event.key;
        }
        drawParticipantIDField();
    }
}

// Function to handle submission
function handleParticipantIdSubmit() {
    const participantId = inputField.value.trim();
    if (participantId != "") {
        gameTracker.participantId = participantId;
        incrementCurrentScreen(); // TODO DEBUG assignmemt constant variable
        displayInstructions();
    } else {
        alert('Please enter your participant ID.');
        drawParticipantIDField();
    }
}

// Handle keydown events during the actual game
function handleGameKeyDown(event) {

    if (player.preventInput) return;

    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            // if there's an escape door
            if (currentMap.exit) {
                if ( // if player is standing in front of dungeon exit
                    player.position.x + player.displayWidth <= currentMap.exit.position.x + currentMap.exit.displayWidth && // right side of player hits right side of collision block
                    player.position.x + player.displayWidth / 2 >= currentMap.exit.position.x && // left side of player hits left side of collision
                    player.position.y + player.displayHeight >= currentMap.exit.position.y && // bottom of player hits collision block
                    player.position.y <= currentMap.exit.position.y + currentMap.exit.displayHeight // top of player hits collision block) {
                ) {
                    player.preventInput = true // TODO: debug
                    setLevel(0); // set level back to home
                    player.enterLevel(maps[level], overlay) // enter home screen
                    dashboard.round += 1
                    if (dashboard.round > totalRounds) {
                        endGame();
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
    for (let i = 0; i < currentMap.entrances.length; i++) {
        const entrance = currentMap.entrances[i];
        if (
            // make it easier to enter doors
            player.position.x <= entrance.position.x + entrance.displayWidth && // right side of player hits right side of collision block
            player.position.x + player.displayWidth >= entrance.position.x && // left side of player hits left side of collision
            player.position.y + player.displayHeight >= entrance.position.y && // bottom of player hits collision block
            player.position.y <= entrance.position.y + entrance.displayHeight // top of player hits collision block) {
        ) {
            player.velocity.x = 0; // this doesn't work
            player.velocity.y = 0; // this doesn't work
            player.preventInput = true; // this doesn't stay when enterlevel sets to false

            setLevel(i + 1); // set index to appropriate dungeon number, e.g. entrance 0 = dungeon 1
            player.switchSprite('emergeFromPortal'); // this works
            entrance.play(); // this works but doesn't show when player enters level

            player.enterLevel(maps[level], overlay);
            if (i == 0) {
                dashboard.updatePoints(50);
            } else {
                dashboard.updatePoints(100);
            }
            break;
        }
    }
}

function handlePortalTravel() {
    for (let i = 0; i < currentMap.doors.length; i++) {
        const door = currentMap.doors[i];
        if ( // if player is standing in front of a portal door
            player.position.x <= door.position.x + door.displayWidth && // right side of player hits right side of collision block
            player.position.x + player.displayWidth >= door.position.x && // left side of player hits left side of collision
            player.position.y + player.displayHeight >= door.position.y && // bottom of player hits collision block
            player.position.y <= door.position.y + door.displayHeight // top of player hits collision block) {
        ) {
            // teleport player to the other door
            player.velocity.x = 0; // stops player from moving when entering door
            player.velocity.y = 0; // stops player from moving when entering door
            player.preventInput = true; // stops player movement when entering door
            player.switchSprite('emergeFromPortal'); // TODO: fix later
            door.play();
            player.teleport(currentMap, i, overlay);
            dashboard.updatePoints(-currentMap.pointLoss); // point loss for portal travel

            break;
        }
    }
}
export function handleKeyUp(event) {
    if (!gameStarted) return;

    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false; // stop moving player if key up
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false; // stop moving player if key up
            break;
    }
}

// Export CSV of user data if user exits browser window
window.addEventListener('beforeunload', (event) => {
    if (!gameSaved) {
        saveGameData();
    }
});

