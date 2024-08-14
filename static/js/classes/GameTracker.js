class GameTracker {
    constructor(participantId) {
        this.participantId = participantId;
        this.currentRound = null;
        this.currentDungeon = null;
        this.startTime = new Date.toISOString();
        this.startNewRound();
    }

    async startNewRound() {
        const roundNumber = await this.getNewRoundNumber();
        this.currentRound = {
            id: await this.createRoundInDatabase(roundNumber),
            number: roundNumber,
            startedAt: new Date(),
        };
    }

    async enterDungeon(dungeonName, portalMap) {
        this.currentDungeon = {
            id: await this.createDungeonInDatabase(dungeonName, portalMap),
            name: dungeonName,
            enteredAt: new Date(),
        };
    }


    async trackRound(round) {
        // Create a new round in the database and return the round ID
        // Use your ORM or raw SQL queries here
    }

    async trackDungeon(dungeonName, portalMap) {
        // Create a new dungeon entry in the database and return the dungeon ID
        // Store portalMap as JSON
    }

    async enterPortal(portalName) {
        await this.createPortalEntryInDatabase(portalName, this.currentDungeon.id);
    }

    async trackPortalEntry(portalMap, entryPortal, exitPortal) {
        // Create a new portal entry in the database
    }

    async getNewRoundNumber() {
        // Logic to get the new round number for the user
    }

    async saveToDatabase() {
        try {
            const response = await fetch('/save-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: this.userId,
                    start_time: this.startTime,
                    actions: this.actions
                })
            });

            if (response.ok) {
                console.log('Game data saved successfully');
            } else {
                console.error('Failed to save game data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async exportToCSV() {

    }

}



class GameTracker {
    constructor(userId) {
        this.userId = userId;
        this.actions = [];
        this.startTime = new Date().toISOString();
    }

    trackAction(action) {
        const timestamp = new Date().toISOString();
        this.actions.push({ action, timestamp });
    }

    async saveSession() {
        try {
            const response = await fetch('/save-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: this.userId,
                    start_time: this.startTime,
                    actions: this.actions
                })
            });

            if (response.ok) {
                console.log('Game data saved successfully');
            } else {
                console.error('Failed to save game data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}