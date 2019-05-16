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

        //formation of player and properties
        this.player = this.physics.add.sprite(500, 255, "player_sheet");
        this.player.anims.play("idle");
        this.player.speed = 350;
        this.player.dir = 1; //facing right
        this.player.state = "FALL";
        this.player.hitbox = new HurtBox(this, this.player.x, this.player.y, this.player.width - 10, this.player.height - 10, 0x000000, 0.4);
        this.physics.world.enable(this.player.hitbox, 0);
        this.player.hitbox.body.moves = false;
        this.player.hitbox.overlapping = false;
        this.player.hitbox.dir = this.player.dir;
        this.player.health = 10;

        this.dummy = this.physics.add.sprite(525, 255, "player_sheet");
        this.dummy.anims.play("crouch");
        this.dummy.dir = -1; //facing left
        this.dummy.state = "IDLE";

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
        this.entities.add(this.dummy);

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

        //this.add.text()
    
        //collision
        this.physics.add.collider(this.entities, this.platforms);
        this.physics.add.overlap(this.playerSlashes, this.dummy, this.body_hit);
        this.physics.add.overlap(this.player.hitbox, this.dummy, this.hitbox_overlap);

        //input detection
        this.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
    }

    body_hit(body1, body2)
    {
        if (body2.state !== "HITSTUN")
        {
            console.log("is hit");
            body2.state = "HITSTUN";
            body2.dir = body1.dir;
        }
    }

    hitbox_overlap(body1, body2)
    {
        if (!body1.overlapping && body2.state !== "HITSTUN")
        {
            body1.overlapping = true;
            console.log("getting hit");
        }
    }

    update_hitbox()
    {
        this.player.hitbox.x = this.player.x;
        this.player.hitbox.y = this.player.y;
    }

    update()
    {
        this.player.setVelocityX(0);
        this.update_hitbox();

        //rudimentary player state machine
        switch (this.player.state)
        {
            case "GROUND":    
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                if (this.RIGHT.isDown)
                {
                    this.player.anims.play("right", true);
                    this.player.setVelocityX(this.player.speed); 
                    this.player.dir = 1;
                }
                else if (this.LEFT.isDown)
                {
                    this.player.anims.play("left", true);
                    this.player.setVelocityX(-this.player.speed);
                    this.player.dir = -1;
                }
                else this.player.anims.play("idle", true);

                if (this.DOWN.isDown) {this.player.state = "CROUCH"}

                if (Phaser.Input.Keyboard.JustDown(this.Q)) {this.player.state = "ATTACK"}

                if (this.SHIFT.isDown && this.Q.isDown) {this.player.state = "CHAINHOLD"}

                if (Phaser.Input.Keyboard.JustDown(this.UP)) 
                {
                    this.player.state = "JUMP";
                    this.player.setVelocityY(-720);
                }

                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                
                if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {this.player.state = "DASH"}
                //if (Phaser.Input.Keyboard.JustDown(this.SHIFT)) {this.player.state = "BACKSTEP"}
                break;

            case "JUMP": 
                if (this.player.hitbox.overlapping)
                {
                    this.player.setVelocityY(-400);
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                if (this.RIGHT.isDown) {this.player.setVelocityX(this.player.speed); this.player.dir = 1}
                if (this.LEFT.isDown) {this.player.setVelocityX(-this.player.speed); this.player.dir = -1}
                if (this.UP.isUp) {this.player.body.velocity.y *= 0.65} //less airtime when up released

                this.player.anims.play("jump", true);

                if (Phaser.Input.Keyboard.JustDown(this.Q)) {this.player.state = "AERIAL"}

                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                if (this.player.body.touching.down) {this.player.state = "GROUND"}
                break;

            case "FALL":
                if (this.player.hitbox.overlapping)
                {   
                    this.player.setVelocityY(-400);
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                if (this.RIGHT.isDown) {this.player.setVelocityX(this.player.speed); this.player.dir = 1}
                else if (this.LEFT.isDown) {this.player.setVelocityX(-this.player.speed); this.player.dir = -1}
                this.player.anims.play("fall", true);

                if (Phaser.Input.Keyboard.JustDown(this.Q)) {this.player.state = "AERIAL"}

                if (this.player.body.touching.down) {this.player.state = "GROUND"}
                break;

            case "CROUCH":
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                this.player.body.velocity.x = 0;
                this.player.anims.play("crouch", true);
                if (this.DOWN.isUp){this.player.state = "GROUND"}
                break;

            case "HITSTUN":
                this.playerSlashes.clear(true, true);
                if (this.player.health <= 0)
                {
                    console.log("YOU SHOULD BE DEAD");
                    this.player.state = "DEAD";
                }

                this.player.hitbox.overlapping = false;
                this.player.anims.play("right", true);
                this.player.setVelocityX(225 * -this.player.dir);
                if (this.player.anims.getProgress() == 1) 
                {
                    console.log(this.player.health);
                    if (this.player.body.velocity.y < 0){this.player.state = "FALL"}
                    this.player.state = "GROUND";
                }
                
                break;

            case "ATTACK":
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                this.playerSlashes.clear(true, true);

                this.player.setVelocityX(95 * this.player.dir);
                this.player.anims.play("fire", true);
                if (this.playerSlashes.getLength() < 1 && this.player.anims.getProgress() >= 0.45)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 20, 0xffffff, 0.7);
                    this.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.player.dir;

                    /*
                    this.playerHitZone = new HitZone(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 20);
                    this.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.player.dir;
                    */
                    
                    this.playerSlashes.add(this.playerHurtBox);
                }
                
                if (this.player.anims.getProgress() == 1) 
                {
                    this.playerSlashes.clear(true, true);
                    this.player.state = "GROUND";
                }
                break;
            
            case "CHAINHOLD":
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }

                this.playerSlashes.clear(true, true);

                if (this.RIGHT.isDown)
                {
                    this.player.anims.play("right", true);
                    this.player.setVelocityX(this.player.speed * 0.4); 
                    this.player.dir = 1;
                }
                else if (this.LEFT.isDown)
                {
                    this.player.anims.play("left", true);
                    this.player.setVelocityX(-this.player.speed * 0.4);
                    this.player.dir = -1;
                }
                else this.player.anims.play("fire", true);

                if (this.playerSlashes.getLength() < 1)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 20, 0xffffff, 0.7);
                    this.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.player.dir;

                    /*
                    this.playerHitZone = new HitZone(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 20);
                    this.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.player.dir;
                    */
                    
                    this.playerSlashes.add(this.playerHurtBox);
                }

                if (this.Q.isUp || this.SHIFT.isUp)
                {
                    this.playerSlashes.clear(true, true);
                    this.player.state = "GROUND";
                }

                if (this.player.body.velocity.y > 0) 
                {
                    this.playerSlashes.clear(true, true);
                    this.player.state = "FALL"
                }

                break;
            
            case "AERIAL":
                if (this.player.hitbox.overlapping)
                {
                    this.player.health -= 1;
                    this.player.setVelocityY(-400);
                    this.player.state = "HITSTUN";
                }
                this.playerSlashes.clear(true, true);

                if (this.RIGHT.isDown) {this.player.setVelocityX(this.player.speed); this.player.dir = 1}
                else if (this.LEFT.isDown) {this.player.setVelocityX(-this.player.speed); this.player.dir = -1}
                if (this.UP.isUp) {this.player.body.velocity.y *= 0.85} //air swings leave player airborne for a while

                this.player.anims.play("fire", true);

                if (this.playerSlashes.getLength() < 1 && this.player.anims.getProgress() >= 0.25)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 33, 0xffffff, 0.7);
                    this.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.player.dir;

                    /*
                    this.playerHitZone = new HitZone(this, this.player.x + (50 * this.player.dir), this.player.y, 95, 33);
                    this.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.player.dir;
                    */

                    this.playerSlashes.add(this.playerHurtBox);
                }

                if (this.player.anims.getProgress() == 1) 
                {
                    this.playerSlashes.clear(true, true);
                    if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                    else this.player.state = "JUMP";
                }

                if (this.player.body.touching.down)
                {
                    this.playerSlashes.clear(true, true);
                    this.player.state = "GROUND";
                }
                break;

            case "DASH":
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                //this.player.hitbox.overlapping = false;  //might enable this for some kind of upgraded dash
                this.player.setVelocityX(this.player.speed * 2.7 * this.player.dir)
                this.player.anims.play("fire", true);
                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                if (this.player.anims.getProgress() == 1) {this.player.state = "GROUND"}
                break;

            case "BACKSTEP":
                if (this.player.hitbox.overlapping)
                {
                    this.player.state = "HITSTUN";
                    this.player.health -= 1;
                }
                this.player.setVelocityX(this.player.speed * 1.7 * -this.player.dir)
                this.player.anims.play("fall", true);
                if (this.player.body.velocity.y > 0) {this.player.state = "FALL"}
                if (this.player.anims.getProgress() == 1) {this.player.state = "GROUND"}
                break;
            
            case "DEAD":
                this.player.disableBody(true, true);
                break;

            default:
                this.player.anims.play("idle", true);
        }

        //dummy state machine
        switch(this.dummy.state)
        {
            case "IDLE":
                this.dummy.setVelocityX(0);
                this.dummy.anims.play("idle", true);
                break;
            case "HITSTUN":
                this.dummy.anims.play("right", true);
                this.dummy.setVelocityX(90 * this.dummy.dir);
                if (this.dummy.anims.getProgress() == 1) {this.dummy.state = "IDLE"}
                break;
            case "ATTACK":
                this.dummy.anims.play("fire", true);
                break;
            default:
                this.dummy.state = "IDLE";
        }
        
    }
    
}
