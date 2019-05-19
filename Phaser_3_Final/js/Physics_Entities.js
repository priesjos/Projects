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
    constructor(scene, x, y, key, frame, speed, dir, health, state) 
    {
        super(scene, x, y, key, frame, speed, dir, health, state, "Player");
        this.state = state;
        this.speed = speed;
        this.dir = dir; 
        this.health = health;
        this.hits = 0;

        this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width - 10, this.height - 10, 0x000000, 0.4, false, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
        this.hitbox.overlapping = false;
        //input booleans
        this.setData("RightDown", false);
        this.setData("LeftDown", false);
        this.setData("UpDown", false);
        this.setData("DownDown", false);
        this.setData("ADown", false);
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

    update()
    {
        this.setVelocityX(0);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        switch (this.state)
        {
            case "GROUND":    
                this.player_hit_detection();
                if (this.getData("RightDown") == true)
                {
                    this.anims.play("right", true);
                    this.setVelocityX(this.speed); 
                    this.dir = 1;
                }
                else if (this.getData("LeftDown") == true)
                {
                    this.anims.play("left", true);
                    this.setVelocityX(-this.speed);
                    this.dir = -1;
                }
                else this.anims.play("idle", true);

                if (this.getData("DownDown") == true) {this.state = "CROUCH"}

                if (this.getData("AJustDown") == true) {this.state = "ATTACK"}

                if (this.getData("ShiftDown") == true && this.getData("ADown") == true) {this.state = "CHAIN_HOLD"}

                if (this.getData("SJustDown") == true) {this.state = "ATTACK_HARD"}

                if (this.getData("DJustDown") == true){this.state = "ATTACK_LAUNCH"} 

                if (this.getData("UpJustDown") == true) 
                {
                    this.state = "JUMP";
                    this.setVelocityY(-720);
                }

                if (this.body.velocity.y > 0) {this.state = "FALL"}
                
                if (this.getData("SpaceJustDown") == true) {this.state = "DASH"}
                //if (this.getData("ShiftJustDown") == true) {this.state = "BACKSTEP"}
                break;

            case "JUMP": 
                this.player_hit_detection();
                if (this.getData("RightDown") == true) {this.setVelocityX(this.speed); this.dir = 1}
                if (this.getData("LeftDown") == true) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.getData("UpDown") !== true) {this.body.velocity.y *= 0.35} //less airtime when up released

                this.anims.play("jump", true);

                if (this.getData("AJustDown") == true) {this.state = "AERIAL"}

                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.body.touching.down) {this.state = "GROUND"}
                break;

            case "FALL":
                this.player_hit_detection();
                if (this.getData("RightDown") == true) {this.setVelocityX(this.speed); this.dir = 1}
                else if (this.getData("LeftDown") == true) {this.setVelocityX(-this.speed); this.dir = -1}
                this.anims.play("fall", true);

                if (this.getData("AJustDown") == true) {this.state = "AERIAL"}

                if (this.body.touching.down) {this.state = "GROUND"}
                break;

            case "CROUCH":
                this.player_hit_detection();
                this.body.velocity.x = 0;
                this.hitbox.height = 20;
                this.hitbox.y += 20;
                this.anims.play("crouch", true);
                if (this.getData("DownDown") == false)
                {
                    this.state = "GROUND";
                    this.hitbox.height = this.height - 10;
                }
                break;

            case "HITSTUN":
                this.scene.playerSlashes.clear(true, true);
                if (this.health <= 0)
                {
                    console.log("YOU SHOULD BE DEAD");
                    this.state = "DEAD";
                }

                this.hitbox.height = this.height - 10;
                this.hitbox.overlapping = false;
                this.anims.play("right", true);
                this.setVelocityX(225 * -this.dir);
                if (this.anims.getProgress() == 1) 
                {
                    console.log(this.health);
                    if (this.body.velocity.y < 0){this.state = "FALL"}
                    this.state = "GROUND";
                }
                
                break;

            case "ATTACK":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(95 * this.dir);
                this.anims.play("fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.45)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, 95, 20, 0xffffff, 0.7);
                    this.scene.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.hits = 0;
                    this.playerHurtBox.dir = this.dir;
                    this.playerHurtBox.force = 1.5;
                    /*
                    this.playerHitZone = new HitZone(this, this.x + (50 * this.dir), this.y, 95, 20);
                    this.scene.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.dir;
                    this.playerHitZone.force = 1.5;
                    */
                    
                    
                    this.scene.playerSlashes.add(this.playerHurtBox);
                    this.hits += this.playerHurtBox.hits;
                }

                //animation cancel inputs
                if (this.getData("RightDown") == true || this.getData("LeftDown") == true) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }

                if (this.getData ("UpJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "JUMP";
                }

                if (this.getData("DownDown") == true) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "CROUCH";
                }

                if (this.getData("SpaceJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "DASH";
                }
                
                if (this.anims.getProgress() == 1) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }
                break;

           
            case "CHAIN_HOLD":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);
            
                if (this.getData("RightDown") == true)
                {
                    this.anims.play("right", true);
                    this.setVelocityX(this.speed * 0.4); 
                    this.dir = 1;
                }
                else if (this.getData("LeftDown") == true)
                {
                    this.anims.play("left", true);
                    this.setVelocityX(-this.speed * 0.4);
                    this.dir = -1;
                }
                else this.anims.play("fire", true);
               
                //attack hurt zone  
                if (this.scene.playerSlashes.getLength() < 1)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, 95, 20, 0xffffff, 0.7);
                    this.scene.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.dir;
                    this.playerHurtBox.force = 1.1;

                    /*
                    this.playerHitZone = new HitZone(this, this.x + (50 * this.dir), this.y, 95, 20);
                    this.scene.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.dir;
                    this.playerHitZone.force = 1.1;
                    */
                    
                    this.scene.playerSlashes.add(this.playerHurtBox);
                }

                if (this.getData("ADown") == false || this.getData("ShiftDown") == false)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }

                if (this.body.velocity.y > 0) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "FALL"
                }
                break;

            case "ATTACK_HARD":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(45 * this.dir);
                this.anims.play("fire", true);

                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.45)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, 75, 40, 0xffffff, 0.7);
                    this.scene.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.dir;
                    this.playerHurtBox.force = 2.0;

                    /*
                    this.playerHitZone = new HitZone(this, this.x + (50 * this.dir), this.y, 95, 20);
                    this.scene.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.dir;
                    this.playerHitZone.force = 2.0;
                    */
                    
                    this.scene.playerSlashes.add(this.playerHurtBox);
                }

                if (this.getData("RightDown") == true || this.getData("LeftDown") == true) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }

                if (this.getData ("UpJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "JUMP";
                }

                if (this.getData("DownDown") == true) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "CROUCH";
                }

                if (this.getData("SpaceJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "DASH";
                }
                
                if (this.anims.getProgress() == 1) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }
                break;
           
            case "ATTACK_LAUNCH":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                this.setVelocityX(35 * this.dir);
                this.anims.play("fire", true);

                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.45)
                {
                    //this.setVelocityY(-720);
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, 75, 40, 0xffffff, 0.7);
                    this.scene.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.dir;
                    this.playerHurtBox.force = 2.3;

                    /*
                    this.playerHitZone = new HitZone(this, this.x + (50 * this.dir), this.y, 95, 20);
                    this.scene.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.dir;
                    this.playerHitZone.force = 2.3;
                    */
                    
                    this.scene.playerSlashes.add(this.playerHurtBox);
                }

                if (this.getData("RightDown") == true || this.getData("LeftDown") == true) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }

                if (this.getData ("UpJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "JUMP";
                }

                if (this.getData("SpaceJustDown") == true)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "DASH";
                }
                
                if (this.anims.getProgress() == 1) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "JUMP";
                }

                break;
           
            case "AERIAL":
                this.player_hit_detection();
                this.scene.playerSlashes.clear(true, true);

                if (this.getData("RightDown") == true) {this.setVelocityX(this.speed); this.dir = 1}
                else if (this.getData("LeftDown") == true) {this.setVelocityX(-this.speed); this.dir = -1}
                if (this.getData("UpDown") == false) {this.body.velocity.y *= 0.85} //air swings leave player airborne for a while

                this.anims.play("fire", true);
                
                //attack hurt zone
                if (this.scene.playerSlashes.getLength() < 1 && this.anims.getProgress() >= 0.25)
                {
                    //rectangle for debug
                    this.playerHurtBox = new HurtBox(this.scene, this.x + (50 * this.dir), this.y, 95, 33, 0xffffff, 0.7);
                    this.scene.physics.world.enable(this.playerHurtBox, 0);
                    this.playerHurtBox.body.moves = false;
                    this.playerHurtBox.body.onOverlap = true;
                    this.playerHurtBox.dir = this.dir;
                    this.playerHurtBox.force = 1.3;

                    /*
                    this.playerHitZone = new HitZone(this, this.x + (50 * this.dir), this.y, 95, 33);
                    this.scene.physics.world.enable(this.playerHitZone, 0);
                    this.playerHitZone.body.moves = false;
                    this.playerHitZone.body.onOverlap = true;
                    this.playerHitZone.dir = this.dir;
                    this.playerHitZone.force = 1.3;
                    */

                    this.scene.playerSlashes.add(this.playerHurtBox);
                }

                if (this.anims.getProgress() == 1) 
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "JUMP";
                }

                if (this.body.touching.down)
                {
                    this.scene.playerSlashes.clear(true, true);
                    this.state = "GROUND";
                }
                break;

            case "DASH":
                this.player_hit_detection();
                //this.hitbox.overlapping = false;  //might enable this for some kind of upgraded dash
                this.setVelocityX(this.speed * 2.7 * this.dir)
                this.anims.play("fire", true);
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.anims.getProgress() == 1) {this.state = "GROUND"}
                break;

            case "BACKSTEP":
                this.player_hit_detection();
                this.setVelocityX(this.speed * 1.7 * -this.dir)
                this.anims.play("fall", true);
                if (this.body.velocity.y > 0) {this.state = "FALL"}
                if (this.anims.getProgress() == 1) {this.state = "GROUND"}
                break;
           
            case "DEAD":
                this.disableBody(true, true);
                this.scene.healthText.destroy();
                break;

            default:
                this.anims.play("idle", true);
       }
    }
}

class Dummy extends PhysicsEntity
{
    constructor(scene, x, y, key, frame, dir, health, state) 
    {
        super(scene, x, y, key, frame, dir, "Enemy");
        this.state = state;
        this.dir = dir; 
        this.health = health;
        
        this.hitbox = new HurtBox(this.scene, this.x, this.y, this.width, this.height + 50, 0x000000, 0.4, false, this.dir);
        this.scene.physics.world.enable(this.hitbox, 0);
        this.hitbox.body.moves = false;
        this.hitbox.hit_severity = 0; //0 means not hit, 1 induces knockback, 2 is launching
        this.hitbox.damaging = true;
        this.hitbox.active = true;
        
    }

    
    hitbox_check()
    {
        if (this.hitbox.hit_severity == 1) {this.state = "HITSTUN"}
        else if (this.hitbox.hit_severity >= 2)
            {
                this.setVelocityY(-650);
                this.state = "LAUNCHED";
            }
        this.setVelocityX(0);
    }
    

    update()
    {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        switch(this.state)
        {
            case "IDLE":
                this.hitbox_check();
                this.setVelocityX(0);
                this.anims.play("walker_idle", true);
                this.state = "PATROL";
                break;
            case "PATROL":
                this.hitbox_check();
                this.anims.play("walker_walk", true);
                this.setVelocityX(45 * this.dir);
                if (!this.body.touching.down){this.state = "FALL"}
                break;
            case "FALL":
                this.hitbox.damaging = false;
                this.hitbox_check();
                this.anims.play("walker_fall", true);
                if (this.body.touching.down) 
                {
                    this.hitbox.damaging = true;
                    this.state = "IDLE"
                }
                break;
            case "HITSTUN":
                this.hitbox.damaging = false;
                this.hitbox.active = false;
                this.anims.play("walker_hitstun", true);
                this.hitbox.hit_severity = 0;
                this.setVelocityX(50 * this.hitbox.knockback * this.hitbox.dir);
                if (!this.body.touching.down) {this.setVelocityY(-30)}
                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down){this.state = "FALL"}
                    else
                    {
                        this.hitbox.damaging = true;
                        this.state = "IDLE"
                    }
                    this.hitbox.active = true;
                }
                break;
            case "LAUNCHED":
                this.hitbox.damaging = false;
                this.hitbox.active = false;
                this.anims.play("walker_hitstun", true);
                this.hitbox.hit_severity = 0;
                if (this.anims.getProgress() == 1)
                {
                    if (!this.body.touching.down){this.state = "FALL"}
                    else
                    {
                        this.hitbox.damaging = true;
                        this.state = "IDLE"
                    }
                    this.hitbox.active = true;
                }
                break;
            case "ATTACK":
                this.hitbox_check();
                this.anims.play("fire", true);
                break;
            case "BLOCK":
                this.anims.play("crouch", true);
            default:
                this.state = "IDLE";
        }
    }
}
