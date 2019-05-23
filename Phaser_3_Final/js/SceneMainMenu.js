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
        this.block.on("pointerdown", function(){this.scene.start("Scene1")}, this);
        this.add.text(this.game.config.width * 0.40, this.game.config.height * 0.1, 'HACK & SLASH PLATFORMER', {fontSize:'14px', fill:'#FFF'});
        //giant list of text
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.15, 'CONTROLS', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.2, 'Light Attack: A', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.25, 'Med Attack: S', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.3, 'Hard Attack: D', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.35, 'Dash: Space', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.4, 'Jump: Up Arrow', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.45, 'Crouch: Down Arrow', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.2, this.game.config.height * 0.5, 'Move: Left/Right Arrows', {fontSize:'14px', fill:'#FFF'});
        this.add.text(this.game.config.width * 0.42, this.game.config.height * 0.6, 'Click this to start', {fontSize:'14px', fill:'#FFF'});
    }

}