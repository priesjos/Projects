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
        this.hits = 0;

        this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width - 10, this.height - 10, 0x000000, 0.4, false, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
    }

    update()
    {
        this.setVelocityX(0);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }
}

class Dummy extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, dir, health, state) 
    {
        super(scene, x, y, key, frame, dir, "Enemy");
        this.state = state;
        this.dir = dir; 
        this.health = health;
        
        this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width, this.height, 0x000000, 0.4, false, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
        
    }

    update()
    {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

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
                if (!this.body.touching.down) {this.setVelocityY(-30)}
                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down) {this.state = "FALL"}
                    else this.state = "IDLE"
                }
                break;
            case "LAUNCHED":
                this.anims.play("right", true);
                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down) {this.state = "FALL"}
                    else this.state = "IDLE"
                }
                break;
            case "ATTACK":
                this.anims.play("fire", true);
                break;
            default:
                this.state = "IDLE";
        }
    }
}
