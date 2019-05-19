class Timer extends Phaser.Time.Clock
{
    constructor(scene)
    {
        super(scene);
        this.scene = scene;
        this.scene.add.existing(this)
    }
}

class Clock extends Timer
{
    constructor(scene)
    {
        super(scene);
    }
}