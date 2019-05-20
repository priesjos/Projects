class SceneMainMenu extends Phaser.Scene 
{
    constructor() {super({key: "SceneMainMenu"})}

    preload()
    {
        this.load.image("block", "assets/block.png");
<<<<<<< HEAD
=======
    }

    create()
    {
        this.block = this.add.sprite(this.game.config.width * 0.5, this.game.config.height * 0.5, "block");
        this.block.setInteractive();
        this.block.on("pointerdown", function(){this.scene.start("Scene1")}, this)
>>>>>>> cdb25042f751d966e168dc4e8ebb79d055d7d5b8
    }

    create()
    {
        this.block = this.add.sprite(this.game.config.width * 0.5, this.game.config.height * 0.5, "block");
        this.block.setInteractive();
        this.block.on("pointerdown", function(){
            this.scene.start("Scene1");
        }, this);
        //
    }

}