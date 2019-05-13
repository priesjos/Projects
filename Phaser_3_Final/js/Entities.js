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
        this.state = "FALL";
        this.setData("speed", 320);
        this.setData("direction", 1); //-1 is left, 1 is right
        this.setData("isAttacking", false);
        this.setData("timerSwingDelay", 12);
        this.setData("timerSwingTick", this.getData("timerSwingDelay") - 1);
        this.play("idle");
    }

    moveLeft() 
    {
        this.setData("direction", -1);
        this.body.velocity.x = -this.getData("speed");
    }
    moveRight() 
    {
        this.setData("direction", 1);
        this.body.velocity.x = this.getData("speed");
    }

    jump() {this.body.velocity.y = -760}
    crouch() {this.body.velocity.x = 0}

    dash() {this.body.velocity.x = this.getData("speed") * 2.7 * this.getData("direction")}
    backstep() {this.body.velocity.x = this.getData("speed") * 1.7 * -this.getData("direction")}

    update()
    {
        this.body.setVelocityX(0);
    }
}

class PlayerSlash extends Entity
{
    constructor(scene, x, y, dir) 
    {
        super(scene, x, y, "star");
        this.body.velocity.x = 650 * dir;
        this.body.setGravityY(-1600);
    }
}

class HitZone extends Phaser.GameObjects.Zone
{
    constructor(scene, x, y, width, height, type)
    {
        super(scene, x, y, width, height)
        this.scene = scene
        this.scene.add.existing(this);
        this.setData("type", type);
    }
}

class PlayerHurtBox extends HitZone
{
    constructor(scene, x, y, width, height)
    {
        super(scene, x, y, width, height, "playerHurtBox");
    }
}