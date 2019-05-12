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

class Player extends Entity 
{
    constructor(scene, x, y, key) 
    {
        super(scene, x, y, key, "Player");
        this.state = "FALL"
        this.setData("speed", 320);
        this.setData("direction", 1) //-1 is left, 1 is right
        this.setData("isAttacking", false);
        this.setData("timerSwingDelay", 12);
        this.setData("timerSwingTick", this.getData("timerSwingDelay") - 1);
        this.play("idle");
    }

    moveLeft() 
    {
        this.setData("direction", -1)
        this.body.velocity.x = -this.getData("speed")
    }
    moveRight() 
    {
        this.setData("direction", 1)
        this.body.velocity.x = this.getData("speed")
    }

    jump() {this.body.velocity.y = -760}
    crouch() {this.body.velocity.x = 0}

    update()
    {
        this.body.setVelocityX(0);

        if (this.getData("isAttacking"))
        {
            if (this.getData("timerSwingTick") < this.getData("timerSwingDelay")) {
                this.setData("timerSwingTick", this.getData("timerSwingTick") + 1); // every game update, increase timerSwingTick by one until we reach the value of timerShootDelay
            }
            else { // when the "manual timer" is triggered:
                var slash = new PlayerSlash(this.scene, this.x, this.y, this.getData("direction"));
                this.scene.playerSlashes.add(slash);
            
                this.setData("timerSwingTick", 0);
            }
        }
        
            
        
    }
}

class PlayerSlash extends Entity
{
    constructor(scene, x, y, dir) 
    {
        super(scene, x, y, "star");
        this.body.velocity.x = 650 * dir;
        this.body.setGravityY(-1600)
    }
}