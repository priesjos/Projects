class Scene1 extends Phaser.Scene 
{
    constructor() {super({key: "Scene1"})}

    preload()
    {
        this.load.image("ground", "assets/concrete.png")
        this.load.image("sky", "assets/sky.png")
        this.load.image("star", "assets/star.png")
        this.load.spritesheet("player_sheet", "assets/prototype_sprites.png", {frameWidth: 24, frameHeight: 48})
    }

    create()
    {
        //platform = new Platform(this, 300, 400, "ground")

        //player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player_sheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'player_sheet', frame: 5 } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player_sheet', { start: 6, end: 10 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 11, end: 14}),
            frameRate: 20
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 15, end: 17}),
            frameRate: 10,
        })

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 18, end: 20}),
            frameRate: 10
        })

        this.anims.create({
            key: 'crouch',
            frames: [ { key: 'player_sheet', frame: 20 } ],
            frameRate: 20
        })

        this.player = new Player(this, this.game.config.width * 0.5, this.game.config.height * 0.5, "idle")
        this.ground = new Concrete(this, this.game.config.width * 0.5, this.game.config.height * 0.9, 800, 40, "ground")
        this.player.body.checkWorldBounds()
    
        //collisions
        this.physics.add.collider(this.player, this.ground)

        //input detection
        this.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    update()
    {
        this.player.update();
        this.ground.update()

        if (this.player.body.onFloor()){this.player.state == "GROUNDED"}
        if (this.LEFT.isDown){this.player.moveLeft()}
        if (this.RIGHT.isDown){this.player.moveRight()}
        if (this.UP.isDown && this.player.state == "GROUNDED")
        {
            this.player.state = "JUMPING"
            this.player.jump()
        } 
        //this.player.body.touching.down probably works as another condition for jump input, just have to implement platforms
        
    }
}