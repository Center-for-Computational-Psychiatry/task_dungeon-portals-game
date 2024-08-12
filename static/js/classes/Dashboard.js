class Dashboard {
    // constructor(game) {
    constructor() {
        // this.game = game
        this.points = 0
        this.x = 0
        this.y = 0
        this.change = 0
        this.round = 1
    }
    draw() {
        // Draw point counter
        c.font = "bold 20px Verdana";
        c.fillStyle = "black";
        let pointCounter = "Total Points: " + this.points
        c.fillText(pointCounter, canvas.width / 2 - 75, canvas.height - 25)
        
        // Draw round counter
        c.font = "16px Verdana";
        let roundCounter = "Round " + this.round + " out of " + totalRounds
        c.fillText(roundCounter, canvas.width / 2 + 200, canvas.height - 25)
    }

    // draw() {
    //     // Draw point counter
    //     game.c.font = "bold 20px Verdana";
    //     game.c.fillStyle = "black";
    //     let pointCounter = "Total Points: " + this.points
    //     game.c.fillText(pointCounter, game.canvas.width / 2 - 75, game.canvas.height - 25)
        
    //     // Draw round counter
    //     game.c.font = "16px Verdana";
    //     let roundCounter = "Round " + this.round + " out of " + game.totalRounds
    //     game.c.fillText(roundCounter, game.canvas.width / 2 + 200, game.canvas.height - 25)
    // }
    updatePoints(change) {
        this.change = change
    }
    // nextRound() {
    //     this.round += 1
    // }
    refresh() {
        this.points += this.change
        this.change = 0
    }
}