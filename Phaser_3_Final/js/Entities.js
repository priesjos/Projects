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