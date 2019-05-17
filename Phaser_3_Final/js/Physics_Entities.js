class PhysicsEntity extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, key, frame, type)
    {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }
}

class Player extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, speed, dir, health, state) 
    {
        super(scene, x, y, key, frame, speed, dir, health, state, "Player");
        this.state = state;
        this.speed = speed;
        this.dir = dir; 
        this.health = health;
    }
}

class Dummy extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, dir, state) 
    {
        super(scene, x, y, key, frame, dir, "Enemy");
        this.state = state;
        this.dir = dir; 
    }

    update()
    {
        switch(this.state)
        {
            case "IDLE":
                this.setVelocityX(0);
                this.anims.play("idle", true);
                break;
            case "FALL":
                this.anims.play("fall", true);
                if (this.body.touching.down) {this.state = "GROUND"}
                break;
            case "HITSTUN":
                this.anims.play("right", true);
                this.setVelocityX(50 * this.knockback * this.dir);
                if (!this.body.touching.down) {this.setVelocityY(-35)}
                if (this.body.touching.down) {this.state = "IDLE"}
                if (this.anims.getProgress() == 1) {this.state = "IDLE"}
                break;
            case "LAUNCHED":
                this.anims.play("right", true);
               
                break;
            case "ATTACK":
                this.anims.play("fire", true);
                break;
            default:
                this.state = "IDLE";
        }
    }
}
