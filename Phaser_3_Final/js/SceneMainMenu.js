class SceneMainMenu extends Phaser.Scene 
{
    constructor() {super({key: "SceneMainMenu"})}
    preload()
    {
        this.load.image("block", "assets/block.png");
    }

    create()
    {
        this.block = this.add.sprite(this.game.config.width * 0.5, this.game.config.height * 0.5, "block");
        this.block.setInteractive();
        this.block.on("pointerdown", function(){this.scene.start("Scene1")}, this)
    }
}