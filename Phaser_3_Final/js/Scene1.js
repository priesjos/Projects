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
        this.add.image(300, 500, 'sky')
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

        //formation of player
        this.player = this.physics.add.sprite(500, 255, "player_sheet");
        this.player.anims.play("idle");
        this.playerDir = 1; //facing right
        this.player.state = "FALL";

        this.dummy = this.physics.add.sprite(525, 255, "player_sheet");
        this.dummy.anims.play("crouch");
        this.dummyDir = -1 //facing left

        this.ground = new Concrete(this, 500, 450, 800, 40, "ground");
        this.ground2 = new Concrete(this, 200, 600, 700, 40, "ground");
        this.ground3 = new Concrete(this, -500, 400, 800, 40, "ground");
        
        this.playerSlashes = this.add.group();
        this.platforms = this.physics.add.staticGroup();
        this.entities = this.physics.add.group();
        
        for (var i = 0; i < 6; i++){this.platforms.create(i * 200, 740 + (i * 40), "ground")}
        
        this.platforms.add(this.ground);
        this.platforms.add(this.ground2);
        this.platforms.add(this.ground3);

        this.entities.add(this.player);
        this.entities.add(this.dummy)

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
    
        //collisions
        this.physics.add.collider(this.entities, this.platforms);

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
        this.player.setVelocityX(0);

        //rudimentary player state machine
        switch (this.player.state)
        {
            case "GROUND":    
                if (this.RIGHT.isDown)
                {
                    this.player.anims.play("right", true);
                    this.player.setVelocityX(320); 
                    this.playerDir = 1;
                }
                else if (this.LEFT.isDown)
                {
                    this.player.anims.play("left", true);
                    this.player.setVelocityX(-320); 
                    this.playerDir = -1;
                }
                else this.player.anims.play("idle", true);

                if (this.DOWN.isDown) {this.player.state = "CROUCH"}

                if (Phaser.Input.Keyboard.JustDown(this.UP)) 
                {
                    this.player.state = "JUMP";
                    this.player.setVelocityY(-760);
                }

                if (Phaser.Input.Keyboard.JustDown(this.Q)) 
                {
                    this.player.state = "ATTACK";
                    this.slash = new PlayerSlash(this, this.player.x + (27 * this.playerDir), this.player.y, this.playerDir);
                    this.hurtBox = new PlayerHurtBox(this, this.player.x + (27 * this.playerDir), this.player.y, 120, 50);
                    this.hurtBox.active = true;
                    this.playerSlashes.add(this.slash);
                }

                if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {this.player.state = "DASH"}
                if (Phaser.Input.Keyboard.JustDown(this.SHIFT)) {this.player.state = "BACKSTEP"}
                
                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                break;

            case "JUMP": 
                if (this.RIGHT.isDown) {this.player.setVelocityX(320); this.playerDir = 1}
                if (this.LEFT.isDown) {this.player.setVelocityX(-320); this.playerDir = -1}
                if (this.UP.isUp) {this.player.body.velocity.y *= 0.65} //less airtime when up released

                this.player.anims.play("jump", true);

                if (Phaser.Input.Keyboard.JustDown(this.Q)) 
                {
                    this.player.state = "AERIAL";
                    this.slash = new PlayerSlash(this, this.player.x + (27 * this.playerDir), this.player.y, this.playerDir);
                    this.playerSlashes.add(this.slash);
                }

                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                break;

            case "FALL":
                if (this.RIGHT.isDown) {this.player.setVelocityX(320); this.playerDir = 1}
                else if (this.LEFT.isDown) {this.player.setVelocityX(-320); this.playerDir = -1}
                this.player.anims.play("fall", true);

                if (Phaser.Input.Keyboard.JustDown(this.Q)) 
                {
                    this.player.state = "AERIAL";
                    this.slash = new PlayerSlash(this, this.player.x + (27 * this.playerDir), this.player.y, this.playerDir);
                    this.playerSlashes.add(this.slash);
                }

                if (this.player.body.touching.down) {this.player.state = "GROUND"}
                break;

            case "ATTACK":
                if (this.RIGHT.isDown) {this.player.setVelocityX(320); this.playerDir = 1}
                else if (this.LEFT.isDown) {this.player.setVelocityX(-320); this.playerDir = -1}
                this.player.anims.play("fire", true);
                if (this.player.anims.getProgress() == 1) {this.player.state = "GROUND"}
                break;
            
            case "CROUCH":
                this.player.body.velocity.x = 0
                this.player.anims.play("crouch", true);
                if (this.DOWN.isUp){this.player.state = "GROUND"}
                break;

            case "AERIAL":
                if (this.RIGHT.isDown) {this.player.setVelocityX(320); this.playerDir = 1}
                else if (this.LEFT.isDown) {this.player.setVelocityX(-320); this.playerDir = -1}
                
                this.player.anims.play("fire", true);

                if (this.player.anims.getProgress() == 1) 
                {
                    if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                    else this.player.state = "JUMP"
                }

                if (this.player.body.onFloor()) {this.player.state = "GROUND"}
                break;

            case "DASH":
                this.player.setVelocityX(864 * this.playerDir)
                this.player.anims.play("fire", true);
                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                if (this.player.anims.getProgress() == 1) {this.player.state = "GROUND"}
                break;

            case "BACKSTEP":
                this.player.setVelocityX(544 * -this.playerDir)
                this.player.anims.play("fall", true);
                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                if (this.player.anims.getProgress() == 1) {this.player.state = "GROUND"}
                break;

            default:
                this.player.anims.play("idle", true);
        }
        
    }
    
}