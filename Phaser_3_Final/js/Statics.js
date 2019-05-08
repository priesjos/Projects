class Statics extends Phaser.GameObjects.TileSprite
{
    constructor(scene, x, y, width, height, key, type) 
    {
        super(scene, x, y, width, height, key)
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 1);
        this.setData("type", type);
    }
}

class Concrete extends Statics
{
    constructor(scene, x, y, width, height, key)
    {
        super(scene, x, y, width, height, key, "Concrete")
    }

}