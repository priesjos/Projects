class Zone extends Phaser.GameObjects.Zone
{
    constructor(scene, x, y, width, height, type)
    {
        super(scene, x, y, width, height)
        this.scene = scene
        this.scene.add.existing(this);
        this.setData("type", type);
    }
}

class PlayerHurtBox extends Zone
{
    constructor(scene, x, y, width, height)
    {
        super(scene, x, y, width, height, "playerHurtBox");
    }
}