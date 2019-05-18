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

        //groups and arrays
        this.playerSlashes = this.add.group();
        this.platforms = this.physics.add.staticGroup();
        this.entities = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.dummy_array = [];
        this.enemyHitBoxes = [];

        //formation of player and properties
        this.player = new Player(this, 500, 255, "player_sheet", null, 350, 1, 10, "FALL");

        //platforms
        this.ground = new Concrete(this, 500, 450, 800, 40, "ground");
        this.ground2 = new Concrete(this, 200, 600, 700, 40, "ground");
        this.ground3 = new Concrete(this, -500, 400, 800, 40, "ground");
        for (var i = 0; i < 6; i++){this.platforms.create(i * 200, 740 + (i * 40), "ground")}
        
        //group addings
        this.platforms.add(this.ground);
        this.platforms.add(this.ground2);
        this.platforms.add(this.ground3);

        for (var i = 0; i < 5; i++){this.create_dummy("dummy" + i, 100 * i, 240, 20, 1)}
        
        this.entities.add(this.player);

        //camera/text
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
        this.healthText = this.add.text(this.cameras.main.x, this.cameras.main.y, 'Health:' + this.player.health, {fontSize:'14px', fill:'#FFF'});
        this.hitsText = this.add.text(this.cameras.main.x, 265, 'Hits:' + this.player.hits, {fontSize:'14px', fill:'#FFF'});
        
        //collision
        this.physics.add.collider(this.entities, this.platforms);
        this.physics.add.overlap(this.playerSlashes,  this.enemyHitBoxes /*this.enemiesREPLACE WITH this.enemyHitBoxes SOMEHOW*/, this.body_hit);
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

    create_dummy(obj, x, y, dir, health)
    {
        obj = new Dummy(this, x, y, "player_sheet", null, dir, health, "FALL");
        this.enemies.add(obj);
        this.entities.add(obj);
        this.dummy_array.push(obj);
        this.enemyHitBoxes.push(obj.hitbox);
        //return obj;
    }

    body_hit(body1, body2)
    {
        if (body2.damaging == true)
        {
            //body1.hits++;
            //console.log(body1.hits);
            if (body1.force > 2) {body2.hit_severity = 2}
            else {body2.hit_severity = 1} 

            body2.dir = body1.dir;
            body2.knockback = body1.force; 
            body2.damage = body1.force * 3;
        }
    }

    hitbox_overlap(body1, body2)
    {
        if (!body1.overlapping && body2.damaging == true)
        {
            console.log("getting hit");
            body1.overlapping = true;
        }
    }

    update()
    {
        //giant mess of input conditionals, serves to aid in player state machine
        if (this.RIGHT.isDown) {this.player.setData("RightDown", true)}
        else {this.player.setData("RightDown", false)}

        if (this.LEFT.isDown) {this.player.setData("LeftDown", true)}
        else {this.player.setData("LeftDown", false)}

        if (this.UP.isDown) {this.player.setData("UpDown", true)}
        else {this.player.setData("UpDown", false)}

        if (this.A.isDown) {this.player.setData("ADown", true)}
        else {this.player.setData("ADown", false)}

        if (this.SHIFT.isDown) {this.player.setData("ShiftDown", true)}
        else {this.player.setData("ShiftDown", false)}

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

        //dummy updates
        for(var i = 0; i < this.dummy_array.length; i++) {this.dummy_array[i].update()}

        this.healthText.x = this.player.x - 35;
        this.healthText.y = this.player.y - 50;
        this.healthText.text = "Health:" + this.player.health;
        this.hitsText.text = "Hits:" + this.player.hits;
    }
    
}
