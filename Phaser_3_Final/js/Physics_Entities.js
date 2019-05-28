class PhysicsEntity extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, key, frame, type)
    {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }
}

class Player extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, speed, dir, state) 
    {
        super(scene, x, y, key, frame, speed, dir, state, "Player");
        this.state = state;
        this.speed = speed;
        this.dir = dir; 
        this.health = 10;
        this.hits = 0;
        this.kills = 0;

        this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width - 10, this.height - 10, 0x000000, 0.4, false, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
        this.hitbox.overlapping = false;
        this.setData("isDead", false);
        //input booleans
        this.setData("SpaceJustDown", false);
        this.setData("UpJustDown", false);
        this.setData("AJustDown", false);
        this.setData("SJustDown", false);
        this.setData("DJustDown", false);
    }

    player_hit_detection()
    {
        if (this.hitbox.overlapping)
        {
            this.state = "HITSTUN";
            this.health -= 1;
            if (!this.body.touching.down) {this.setVelocityY(-450)}
        }
    }

    generate_hitzone(width, height, force)
    {
        this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, width, height, 0xffffff, 0.7);
        this.scene.physics.world.enable(this.playerHurtBox, 0);
        this.playerHurtBox.body.moves = false;
        this.playerHurtBox.body.onOverlap = true;
        this.playerHurtBox.hits = 0;
        this.playerHurtBox.dir = this.dir;
        this.playerHurtBox.force = force;
        
        this.scene.playerSlashes.add(this.playerHurtBox);
        this.hits += this.playerHurtBox.hits;
    }

    detect_attack_input(state1, state2, state3)
    {
        if (this.getData("AJustDown") == true) {this.state = state1}
        if (this.getData("SJustDown") == true) {this.state = state2}
        if (this.getData("DJustDown") == true) {this.state = state3} 
    }
    
    input_cancel()
    {
        if (this.getData("UpJustDown") == true) {this.scene.playerSlashes.clear(true, true); this.setVelocityY(-720); this.state = "JUMP"}
        if (this.getData("SpaceJustDown") == true) {this.scene.playerSlashes.clear(true, true); this.state = "DASH"}
    }

    crouch_attack_return()
    {
        if (this.anims.getProgress() == 1) 
        {
            this.scene.playerSlashes.clear(true, true);

            if (this.scene.DOWN.isUp) {this.hitbox.height = this.height - 10; this.state = "GROUND"}
            else this.state = "CROUCH";
        }
    }

    update()
    {
        this.setVelocityX(0);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        if (this.dir == 1){this.flipX = false}
        else if (this.dir == -1){this.flipX = true}

        switch (this.state)
        {
            case "GROUND":    
                this.player_hit_detection();
                if (this.scene.RIGHT.isDown)
                {
                    this.anims.play("player_move", true);
                    this.setVelocityX(this.speed); 
                    this.dir = 1;
                }
                else if (this.scene.LEFT.isDown)
                {
                    this.anims.play("player_move", true);
                    this.setVelocityX(-this.speed);
                    this.dir = -1;
                }
                else this.anims.play("player_idle", true);
                
                this.detect_attack_input("ATTACK", "ATTACK_HARD", "ATTACK_LAUNCH");
                if (this.scene.SHIFT.isDown && this.scene.A.isDown) {this.state = "CHAIN_HOLD"}
                if (this.scene.DOWN.isDown) {this.state = "CROUCH"}
                if (this.getData("UpJustDown") == true) {this.setVelocityY(-720); this.state = "JUMP"}
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.getData("SpaceJustDown") == true) {this.state = "DASH"}
                break;

            case "JUMP": 
                this.player_hit_detection();
                if (this.scene.RIGHT.isDown) {this.setVelocityX(this.speed); this.dir = 1}
                if (this.scene.LEFT.isDown) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.scene.UP.isUp) {this.body.velocity.y *= 0.35} //less airtime when up released
                this.anims.play("player_jump", true);

                this.detect_attack_input("AERIAL", "AERIAL_MED", "AERIAL_HARD");
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.body.touching.down) {this.state = "GROUND"}
                break;

            case "FALL":
                this.player_hit_detection();
                if (this.scene.RIGHT.isDown) {this.setVelocityX(this.speed); this.dir = 1}
                if (this.scene.LEFT.isDown) {this.setVelocityX(-this.speed); this.dir = -1}
                this.anims.play("player_fall", true);

                this.detect_attack_input("AERIAL", "AERIAL_MED", "AERIAL_HARD");
                if (this.body.touching.down) {this.state = "GROUND"}
                break;

            case "CROUCH":
                this.player_hit_detection();
                this.body.velocity.x = 0;
                this.hitbox.height = 20;
                this.hitbox.y = this.y + 20;
                this.anims.play("player_crouch", true);

                this.detect_attack_input("CROUCH_ATTACK", "CROUCH_MED_ATTACK", "CROUCH_HARD_ATTACK");
                if (this.scene.DOWN.isUp) {this.hitbox.height = this.height - 10; this.state = "GROUND"}
                break;

            case "CROUCH_ATTACK":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);
                this.hitbox.y = this.y + 20;
                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.25) {this.generate_hitzone(95, 20, 1.3)}

                this.input_cancel(); //animation cancels
                this.crouch_attack_return();
                break;
            
            case "CROUCH_MED_ATTACK":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);
                this.hitbox.y = this.y + 20;
                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.45) {this.generate_hitzone(90, 28, 1.7)}

                this.input_cancel(); //animation cancels
                this.crouch_attack_return();
                break;
            
            case "CROUCH_HARD_ATTACK":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);
                this.hitbox.y = this.y + 20;
                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.65) {this.generate_hitzone(80, 35, 2.0)}

                this.input_cancel(); //animation cancels
                this.crouch_attack_return();
                break;
           
            case "CHAIN_HOLD":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);
            
                if (this.scene.RIGHT.isDown)
                {
                    this.anims.play("player_move", true);
                    this.setVelocityX(this.speed * 0.4); 
                    this.dir = 1;
                }
                else if (this.scene.LEFT.isDown)
                {
                    this.anims.play("player_move", true);
                    this.setVelocityX(-this.speed * 0.4);
                    this.dir = -1;
                }
                else this.anims.play("player_fire", true);
               
                //attack hurt zone  
                if (this.scene.playerSlashes.getLength() < 1) {this.generate_hitzone(95, 20, 1.1)}

                if (this.scene.A.isUp || this.scene.SHIFT.isUp) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                if (this.body.velocity.y > 0) {this.scene.playerSlashes.clear(true, true); this.state = "FALL"}
                break;
            
            case "ATTACK":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(65 * this.dir);
                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.25) {this.generate_hitzone(95, 20, 1.5)}

                this.input_cancel(); //animation cancels
                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;

            case "ATTACK_HARD":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(45 * this.dir);
                this.anims.play("player_fire", true);

                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.45) {this.generate_hitzone(75, 35, 1.8)}
                
                this.input_cancel(); //animation cancels
                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;
           
            case "ATTACK_LAUNCH":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(30 * this.dir);
                this.anims.play("player_fire", true);

                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.65) {this.generate_hitzone(75, 40, 2.2)}

                this.input_cancel(); //animation cancels
                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;
           
            case "AERIAL":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                if (this.scene.RIGHT.isDown) {this.setVelocityX(this.speed); this.dir = 1}
                else if (this.scene.LEFT.isDown) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.scene.UP.isUp) {this.body.velocity.y *= 0.75} //air swings leave player airborne for a while

                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.25) {this.generate_hitzone(95, 25, 1.3)}

                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "JUMP"}
                if (this.body.touching.down) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;
            
            case "AERIAL_MED":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                if (this.scene.RIGHT.isDown) {this.setVelocityX(this.speed); this.dir = 1}
                else if (this.scene.LEFT.isDown) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.scene.UP.isUp) {this.body.velocity.y *= 0.85} //air swings leave player airborne for a while

                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.40) {this.generate_hitzone(90, 33, 1.7)}

                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "JUMP"}
                if (this.body.touching.down) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;
            
            case "AERIAL_HARD":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                if (this.scene.RIGHT.isDown) {this.setVelocityX(this.speed); this.dir = 1}
                else if (this.scene.LEFT.isDown) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.scene.UP.isUp) {this.body.velocity.y *= 0.95} //air swings leave player airborne for a while

                this.anims.play("player_fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.55) {this.generate_hitzone(80, 47, 2.0)}

                if (this.anims.getProgress() == 1) {this.scene.playerSlashes.clear(true, true); this.state = "JUMP"}
                if (this.body.touching.down) {this.scene.playerSlashes.clear(true, true); this.state = "GROUND"}
                break;

            case "DASH":
                this.player_hit_detection();
                //this.hitbox.overlapping = false;  //might enable this for some kind of upgraded dash
                this.setVelocityX(this.speed * 2.7 * this.dir);
                this.anims.play("player_jump", true);
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.anims.getProgress() == 1) {this.state = "GROUND"}
                break;

            case "BACKSTEP":
                this.player_hit_detection();
                this.setVelocityX(this.speed * 1.7 * -this.dir);
                this.anims.play("player_fall", true);
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.anims.getProgress() == 1) {this.state = "GROUND"}
                break;

            case "HITSTUN":
                this.scene.playerSlashes.clear(true, true);

                if (this.health <= 0) {this.state = "DEAD"}

                this.hitbox.height = this.height - 10;
                this.hitbox.overlapping = false;
                this.anims.play("player_hitstun", true);
                this.setVelocityX(225 * -this.dir);

                if (this.anims.getProgress() == 1) 
                {
                    if (this.body.velocity.y < 0) {this.state = "FALL"}
                    this.state = "GROUND";
                }
                
                break;
           
            case "DEAD":
                this.setData("isDead", true)
                this.hitbox.destroy();
                this.disableBody(true, true);
                this.scene.healthText.destroy();
                break;

            default:
                this.state = "IDLE";
       }
    }
}

class Walker extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, dir, state) 
    {
        super(scene, x, y, key, frame, dir, "Enemy");
        this.state = state;
        this.dir = dir; 
        this.health = 60;
        this.aggro = false;
        
        //this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width - 42, this.height, 0x000000, 0.4, false, this.dir); //debug
        this.hitbox = new HitZone(this.scene, this.x, this.y, this.width - 42, this.height - 13, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
        this.hitbox.hit_severity = 0; //0 means not hit, 1 induces knockback, 2 is launching
        this.hitbox.damaging = true;
        this.hitbox.active = true;
    }
    
    hitbox_check()
    {
        if (this.hitbox.hit_severity == 1) {this.health -= this.hitbox.damage; this.state = "HITSTUN"}
        else if (this.hitbox.hit_severity >= 2)
        {
            this.setVelocityY(-650);
            this.health -= this.hitbox.damage;
            this.state = "LAUNCHED";
        }
    }

    hitstun_active()
    {
        this.hitbox.damaging = false;
        this.hitbox.active = false;
        this.hitbox.hit_severity = 0;
    }

    update()
    {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        if (this.dir == 1){this.flipX = false}
        else if (this.dir == -1){this.flipX = true}

        this.dir_switcher = -1;

        switch(this.state)
        {
            case "IDLE":
                this.hitbox_check();
                this.setVelocityX(0);
                this.anims.play("walker_idle", true);
                if (this.scene.player.getData("isDead") == false && Math.abs(this.x - this.scene.player.x) <= 300 && Math.abs(this.y - this.scene.player.y) <= 70) {this.aggro = true; this.state = "STALK"}
                break;

            case "STALK":
                this.anims.play("walker_move", true);

                if (this.x - this.scene.player.x < 0) {this.dir = 1}
                else this.dir = -1;
                this.setVelocityX(75 * this.dir);

                if (this.body.touching.down && this.scene.player.y > this.y &&  Math.abs(this.x -this.scene.player.x) <= 100) {this.state = "SHESBELOWYOUIDIOT"}
                if (!this.body.touching.down) {this.state = "FALL"}
                if (this.scene.player.getData("isDead") == true) {this.state = "IDLE"}
                this.hitbox_check();
                break;

            case "SHESBELOWYOUIDIOT":
                this.anims.play("walker_move", true);
                this.setVelocityX(75 * this.dir);

                if (this.scene.player.y <= this.y * 1.1) {this.state = "STALK"}
                if (!this.body.touching.down) {this.state = "FALL"}
                if (this.scene.player.getData("isDead") == true) {this.state = "IDLE"}
                this.hitbox_check();
                break;

            case "FALL":
                this.hitbox_check();
                this.hitbox.damaging = false;
                this.anims.play("walker_fall", true);
                if (this.body.touching.down) 
                {
                    this.hitbox.damaging = true;
                    if (this.aggro) {this.state = "STALK"} 
                    else this.state = "IDLE";
                }
                break;

            case "HITSTUN":
                this.hitstun_active();
                this.anims.play("walker_hitstun", true);
                this.setVelocityX(40 * this.hitbox.knockback * this.hitbox.dir);
                if (!this.body.touching.down) {this.setVelocityY(-30)}

                if (this.health <= 0) {this.scene.player.kills += 1; this.state = "DEAD"}

                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down) {this.state = "FALL"}
                    else {this.hitbox.damaging = true; this.state = "STALK"}
                    this.hitbox.active = true;
                }
                break;

            case "LAUNCHED":
                this.hitstun_active();
                this.anims.play("walker_hitstun", true);
                this.setVelocityX(20 * this.hitbox.knockback * this.hitbox.dir);

                if (this.health <= 0) {this.state = "DEAD"}

                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down) {this.state = "FALL"}
                    else {this.hitbox.damaging = true; this.state = "STALK"}
                    this.hitbox.active = true;
                }
                break;

            case "DEAD":
                this.hitbox.destroy();
                this.disableBody(true, true);
                break;

            default:
                this.state = "IDLE";
        }
    }
}
