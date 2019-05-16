class Entity extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, key, type) 
    {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }
}

class EnemyOne extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, key, "Enemy");
        this.states = {
            IDLE: "IDLE",
            FOLLOW: "FOLLOW",
            HITSTUN: "HITSTUN",
            ATTACK: "ATTACK"
        }
        this.state = this.states.IDLE;
    }

    

    
}

class EnemyTwo extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, key, "Enemy");
    }
}

class EnemyThree extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, key, "Enemy");
    }
}


class Projectile extends Entity
{
    constructor(scene, x, y, dir) 
    {
        super(scene, x, y, "star");
        this.body.velocity.x = 750 * dir;
        this.body.setGravityY(-1600);
    }
}
