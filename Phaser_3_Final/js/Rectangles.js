class Rectangle extends Phaser.GameObjects.Rectangle
{
    constructor(scene, x, y, width, height, fillColor, fillAlpha, type)
    {
        super(scene, x, y, width, height, fillColor, fillAlpha);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setData(type);
    }
}

class HurtBox extends Rectangle
{
    constructor(scene, x, y, width, height, fillColor, fillAlpha)
    {
        super(scene, x, y, width, height, fillColor, fillAlpha, "playerHurtBox");
    }
}