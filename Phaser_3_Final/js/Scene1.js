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

        this.playerSlashes = this.add.group()

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
    
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

        //this is a mess, but this series of code right here will set states based on conditions

        if (this.player.body.onFloor()) {this.player.state = "GROUND"} //sets ground state

        if (this.player.body.velocity.y < 0) {this.player.state = "JUMP"} //sets jump state

        if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}  //sets fall state
        
        //inputs, perform functions based on current state

        if (this.LEFT.isDown) {this.player.moveLeft()} //directional while on ground
        else if (this.RIGHT.isDown) {this.player.moveRight()}

        if (this.UP.isDown && this.player.state == "GROUND") {this.player.jump()} //jumps when on ground state
        
        if (this.UP.isUp && this.player.state == "JUMP") {this.player.body.velocity.y *= 0.65} //less airtime when input released
        
        if (this.DOWN.isDown && this.player.state == "GROUND") //crouching
        {
            this.player.state = "CROUCH"; //wish i could figure out a way to get this up with the other conditionals
            this.player.crouch();
        }

        if (this.DOWN.isDown && this.player.body.velocity.y != 0) {this.player.body.velocity.y += 25} //diving down

        if (Phaser.Input.Keyboard.JustDown(this.SPACE) && this.player.state == "GROUND")
        {
            this.player.state = "DASH"
            this.player.dash()
            if (this.player.anims.getProgress() == 1){this.player.state = "GROUND"}
        }

        if (this.Q.isDown) 
        {
            this.player.state = "ATTACK"
            this.player.setData("isAttacking", true)
        }
            else 
            {
                this.player.setData("timerSwingTick", this.player.getData("timerSwingDelay") - 1);
                this.player.setData("isAttacking", false);
            }

        //sets player animation based on current state
        switch (this.player.state)
        {
            case "GROUND": 
                this.player.anims.play("idle", true);
                if (this.RIGHT.isDown){this.player.anims.play("right", true)}
                if (this.LEFT.isDown){this.player.anims.play("left", true)}
                break;
            case "JUMP": 
                this.player.anims.play("jump", true);
                break;
            case "FALL":
                this.player.anims.play("fall", true);
                break;
            case "ATTACK":
                this.player.anims.play("fire", true);
                break;
            case "CROUCH":
                this.player.anims.play("crouch", true);
                break;
            case "AERIAL":
                this.player.anims.play("fire", true);
                break;
            case "DASH":
                this.player.anims.play("fire", true);
                break;
            case "BACKSTEP":
                this.player.anims.play("dash", true);
                break;
            default:
                this.player.anims.play("idle", true);
        }
        
        
    }
}