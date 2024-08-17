export class GameTracker {
    constructor() {
        this.participantId = "";
        this.startTime = new Date(); // Capture the time when the application starts
        this.currentRound = 1; // Default starting round
        this.currentDungeon = "home"; // Start at home
        this.events = [];
    }

    trackEvent(eventType, enteredPortal = null, dungeonPortalMap = null) {
        const timestamp = new Date().toISOString();
        const eventData = {
            participantId: this.participantId,
            startTime: this.startTime.toISOString(), // Include the start time in every row
            round: this.currentRound,
            dungeon: this.currentDungeon,
            event_type: eventType,
            timestamp: timestamp,
            enteredPortal: enteredPortal ? enteredPortal : "",
            dungeonPortalMap: dungeonPortalMap ? dungeonPortalMap : ""
        };
        this.events.push(eventData);
    }

    trackPortalTravel(portal, dungeonPortalMap = null) {
        this.trackEvent('portal_travel', portal, dungeonPortalMap);
    }

    trackInstructionScreen(screenNumber) {
        this.trackEvent(`instruction_screen_${screenNumber}`);
    }

    updateRoundAndDungeon(round, dungeon) {
        this.currentRound = round;
        this.currentDungeon = dungeon;
    }

    exportToCSV() {
        console.log("starting export to CSV")
        const headers = "participantId,startTime,round,dungeon,event_type,timestamp,enteredPortal,dungeonPortalMap\n";
        const rows = this.events.map(event => [
            event.participantId,
            event.startTime,
            event.round,
            event.dungeon,
            event.event_type,
            event.timestamp,
            event.enteredPortal,
            event.dungeonPortalMap
        ].join(",")).join("\n");

        const csvContent = headers + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `game_data_${this.participantId}.csv`);
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    }

    
    saveToDatabase() {
        console.log("starting save to database")
    }
}


// class GameTracker {
//     constructor(participantId) {
//         this.participantId = participantId;
//         this.currentRound = null;
//         this.currentDungeon = null;
//         this.startTime = new Date.toISOString();
//         this.startNewRound();
//     }

//     async startNewRound() {
//         const roundNumber = await this.getNewRoundNumber();
//         this.currentRound = {
//             id: await this.createRoundInDatabase(roundNumber),
//             number: roundNumber,
//             startedAt: new Date(),
//         };
//     }

//     async enterDungeon(dungeonName, portalMap) {
//         this.currentDungeon = {
//             id: await this.createDungeonInDatabase(dungeonName, portalMap),
//             name: dungeonName,
//             enteredAt: new Date(),
//         };
//     }


//     async trackRound(round) {
//         // Create a new round in the database and return the round ID
//         // Use your ORM or raw SQL queries here
//     }

//     async trackDungeon(dungeonName, portalMap) {
//         // Create a new dungeon entry in the database and return the dungeon ID
//         // Store portalMap as JSON
//     }

//     async enterPortal(portalName) {
//         await this.createPortalEntryInDatabase(portalName, this.currentDungeon.id);
//     }

//     async trackPortalEntry(portalMap, entryPortal, exitPortal) {
//         // Create a new portal entry in the database
//     }

//     async getNewRoundNumber() {
//         // Logic to get the new round number for the user
//     }

//     async saveToDatabase() {
//         try {
//             const response = await fetch('/save-game', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user_id: this.userId,
//                     start_time: this.startTime,
//                     actions: this.actions
//                 })
//             });

//             if (response.ok) {
//                 console.log('Game data saved successfully');
//             } else {
//                 console.error('Failed to save game data');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
    
//     async exportToCSV() {

//     }

// }



// class GameTracker {
//     constructor(userId) {
//         this.userId = userId;
//         this.actions = [];
//         this.startTime = new Date().toISOString();
//     }

//     trackAction(action) {
//         const timestamp = new Date().toISOString();
//         this.actions.push({ action, timestamp });
//     }

//     async saveSession() {
//         try {
//             const response = await fetch('/save-game', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user_id: this.userId,
//                     start_time: this.startTime,
//                     actions: this.actions
//                 })
//             });

//             if (response.ok) {
//                 console.log('Game data saved successfully');
//             } else {
//                 console.error('Failed to save game data');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// }