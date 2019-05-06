class Entity extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, key, type) 
    {
        super(scene, x, y, key)
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }
}

class Statics extends Entity
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key, "Platform")
    }
}

class Player extends Entity 
{
    constructor(scene, x, y, key) 
    {
        super(scene, x, y, key, "Player");
        this.setData("speed", 320);
        /*
        this.setData("isAttacking", false);
        this.setData("timerSlashDelay", 8);
        this.setData("timerSlashTick", this.getData("timerSlashDelay") - 1);*/
        this.play("idle");
    }
    
    last_dir = 1
    //last dir can be connected to the move left/right functions
    //figure out how to develop states and their functions
    moveLeft() {this.body.velocity.x = -this.getData("speed")}
    moveRight() {this.body.velocity.x = this.getData("speed")}
    jump() {this.body.velocity.y = -720}

    update()
    {
        this.body.setVelocityX(0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    }
}