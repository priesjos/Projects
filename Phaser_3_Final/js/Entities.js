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

class Projectile extends Entity
{
    constructor(scene, x, y, dir) 
    {
        super(scene, x, y, "star");
        this.body.velocity.x = 750 * dir;
        this.body.setGravityY(-1600);
    }
}
