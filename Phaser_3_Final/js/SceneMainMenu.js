class SceneMainMenu extends Phaser.Scene 
{
    constructor() {super({key: "SceneMainMenu"})}
    preload()
    {
        this.scene.start("Scene1")
    }
}