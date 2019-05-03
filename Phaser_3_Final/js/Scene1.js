class Scene1 extends Phaser.Scene 
{
    constructor() {super({key: "Scene1"})}

    preload()
    {
        this.load.image("ground", "assets/concrete.png")
        this.load.image("sky", "assets/sky.png")
        this.load.image("star", "assets/star.png")
        this.load.spritesheet("player_sheet", "assets/prototype_sprites", {frameWidth: 24, frameHeight: 48})
    }

    create()
    {
        //player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('placeholder', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'placeholder', frame: 5 } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('placeholder', { start: 6, end: 10 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('placeholder', {start: 11, end: 14}),
            frameRate: 20
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('placeholder', {start: 15, end: 17}),
            frameRate: 10,
        })

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('placeholder', {start: 18, end: 20}),
            frameRate: 10
        })

        this.anims.create({
            key: 'crouch',
            frames: [ { key: 'placeholder', frame: 20 } ],
            frameRate: 20
        })

        //input detection
        keys = this.input.keyboard.addKeys('UP, LEFT, DOWN, RIGHT, Q, SPACE, SHIFT');
    }

    update()
    {
        this.player.update();
    }
}