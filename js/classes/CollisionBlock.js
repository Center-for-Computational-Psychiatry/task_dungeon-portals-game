class CollisionBlock {
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64
    }
    draw(){
        c.fillStyle = 'rgba(100, 100, 100, 0.5)' // red but 50% opacity
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}