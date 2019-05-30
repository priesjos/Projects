class Scene1 extends Phaser.Scene 
{
    constructor() {super({key: "Scene1"})}

    preload()
    {
        this.load.image("ground", "assets/concrete.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("star", "assets/star.png");
        this.load.spritesheet("player_sheet", "assets/prototype_sprites.png", {frameWidth: 24, frameHeight: 48});
        this.load.spritesheet("walker_sheet", "assets/walker.png", {frameWidth: 62, frameHeight: 94});
    }

    create()
    {
        this.add.image(300, 500, 'sky').setScale(5, 3);

        //player animations
        this.anims.create({
            key: 'player_move',
            frames: this.anims.generateFrameNumbers('player_sheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'player_idle',
            frames: [ { key: 'player_sheet', frame: 5 } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'player_hitstun',
            frames: this.anims.generateFrameNumbers('player_sheet', { start: 6, end: 10 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'player_fire',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 11, end: 14}),
            frameRate: 20
        })

        this.anims.create({
            key: 'player_jump',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 15, end: 17}),
            frameRate: 10,
        })

        this.anims.create({
            key: 'player_fall',
            frames: this.anims.generateFrameNumbers('player_sheet', {start: 18, end: 20}),
            frameRate: 10
        })

        this.anims.create({
            key: 'player_crouch',
            frames: [{ key: 'player_sheet', frame: 20 }],
            frameRate: 20
        })

        //walker anims
        this.anims.create({
            key: 'walker_idle',
            frames: [{ key: 'walker_sheet', frame: 0 }],
            frameRate: 20
        })

        this.anims.create({
            key: 'walker_move',
            frames: this.anims.generateFrameNumbers('walker_sheet', { start: 1, end: 5}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'walker_fall',
            frames: [{ key: 'walker_sheet', frame: 6}],
            frameRate: 10
        })

        this.anims.create({
            key: 'walker_hitstun',
            frames: this.anims.generateFrameNumbers('walker_sheet', { start: 7, end: 11 }),
            frameRate: 10,
            repeat: -1
        })

        //groups and arrays
        this.playerSlashes = this.add.group();
        this.platforms = this.physics.add.staticGroup();
        this.entities = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.walker_array = [];
        this.enemyHitBoxes = [];
        this.attack_history = []; //to be used in some kind of combo mechanic; explained below

        /*
        For a combo mechanic, there will be an array of attacks that is emptied whenever a value reaches 0. The value will decrement 
        to 0 by some interval amount, and every registered attack will reset the value back to its initial amount and prolong the combo
        until no hits are registered for a long enough time that the value hits 0. 
        The timer starts upon any successful hit. 
        */

        //formation of player and properties
        this.player = new Player(this, 500, 255, "player_sheet", null, 350, 1, "FALL");

        //platforms
        this.create_platform("ground", 500, 450, 800, 40);
        this.create_platform("ground2", 200, 600, 700, 40);
        this.create_platform("ground3", -450, 400, 800, 40);
        this.create_platform("ground4", 730, 900, 1200, 40);
        this.create_platform("ground5", -1130, 510, 120, 40);
        this.create_platform("wall", 1310, 400, 40, 1000);
        this.create_platform("wall2", -1200, 400, 40, 1000);

        for (var i = -6; i < 1; i++){this.platforms.create((i * 200) + 150, 860 + (i * 40), "ground")}
        for (var i = 0; i < 8; i++){this.create_walker("walker" + i, -500 + (100 * i), 240, 1)}

        this.time.addEvent({
            delay: 4500,
            callback: function() {
                if (this.player.getData("isDead") == false){
                    this.create_walker("walker" + i, Phaser.Math.Between(-1150, 1260), 80, 1);
                }
            },
            callbackScope: this,
            loop: true
        });
        
        this.entities.add(this.player);

        //camera/text
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
        this.healthText = this.add.text(this.cameras.main.x, this.cameras.main.y, 'Health:' + this.player.health, {fontSize:'14px', fill:'#FFF'});
        this.hitsText = this.add.text(this.cameras.main.x, 265, 'Hits:' + this.player.hits, {fontSize:'14px', fill:'#FFF'});
        this.killsText = this.add.text(this.cameras.main.x, this.cameras.main.y, 'Kills:' + this.player.kills, {fontSize:'14px', fill:'#FFF'});
        
        //collision
        this.physics.add.collider(this.entities, this.platforms);
        this.physics.add.overlap(this.playerSlashes,  this.enemyHitBoxes, this.body_hit);
        this.physics.add.overlap(this.player.hitbox, this.enemyHitBoxes, this.hitbox_overlap);

        //input detection
        this.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    create_platform(obj, x, y, width, height)
    {
        obj = new Concrete(this, x, y, width, height, "ground");
        this.platforms.add(obj);
    }

    create_walker(obj, x, y, dir)
    {
        obj = new Walker(this, x, y, "walker_sheet", null, dir, "FALL");
        this.enemies.add(obj);
        this.entities.add(obj);
        this.walker_array.push(obj);
        this.enemyHitBoxes.push(obj.hitbox);
        //return obj;
    }

    body_hit(body1, body2)
    {
        if (body2.active)
        {
            if (body1.force > 2) {body2.hit_severity = 2}
            else {body2.hit_severity = 1} 

            body2.dir = body1.dir;
            body2.knockback = body1.force; 
            body2.damage = body1.force * 3;

            body2.hit_history.push(body1.attack_type);
        }
    }

    hitbox_overlap(body1, body2)
    {
        if (!body1.overlapping && body2.damaging == true) {body1.overlapping = true}
    }

    update()
    {
        //giant mess of input conditionals, serves to aid in player state machine
        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {this.player.setData("SpaceJustDown", true)}
        else {this.player.setData("SpaceJustDown", false)}

        if (Phaser.Input.Keyboard.JustDown(this.UP)) {this.player.setData("UpJustDown", true)}
        else {this.player.setData("UpJustDown", false)}

        if (Phaser.Input.Keyboard.JustDown(this.A)) {this.player.setData("AJustDown", true)}
        else {this.player.setData("AJustDown", false)}

        if (Phaser.Input.Keyboard.JustDown(this.S)) {this.player.setData("SJustDown", true)}
        else {this.player.setData("SJustDown", false)}

        if (Phaser.Input.Keyboard.JustDown(this.D)) {this.player.setData("DJustDown", true)}
        else {this.player.setData("DJustDown", false)}

        this.player.update();

        //walker updates
        for(var i = 0; i < this.walker_array.length; i++) {this.walker_array[i].update()}

        this.healthText.x = this.player.x - 35;
        this.healthText.y = this.player.y - 50;
        this.healthText.text = "Health:" + this.player.health;
        this.killsText.x = this.player.x - 35;
        this.killsText.y = this.player.y - 70;
        this.killsText.text = "Kills:" + this.player.kills;
    }
    
}