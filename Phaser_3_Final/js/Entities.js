class Entity extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, key, type) 
    {
        super(scene, x, y, key)
        this.scene = scene
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }
}

class Statics extends Entity
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key, "Platform")
    }
}

class Player extends Entity 
{
    constructor(scene, x, y, key) 
    {
        super(scene, x, y, key, "Player");
        this.setData("speed", 200);
        this.states = {
            DEFAULT: "DEFAULT",
            JUMP: "JUMP",
            FALL: "FALL",
            FIRE: "FIRE",
            CROUCH: "CROUCH",
            AERIAL: "AERIAL",
            DASH: "DASH",
            BACKSTEP: "BACKSTEP"
        }
        this.setData("isAttacking", false);
        this.setData("timerSlashDelay", 8);
        this.setData("timerSlashTick", this.getData("timerSlashDelay") - 1);
        this.play("idle");
    }
    
    last_dir = 1

    /*
    controls()
    {
        left = -Number(this.LEFT.isDown);
        right = Number(this.RIGHT.isDown);
        return(left+right);
    }

    movement(body_param, speed, bool1, bool2)
    {
        body_param.body.setVelocityX((-Number(bool1) + Number(bool2))*speed) //acceleration should be added
    }
    */
    grounded()
    {
        movement(player, 340);
        //movement direction
        //if (controls() !== 0) {last_dir = -Number(keys.LEFT.isDown) + Number(keys.RIGHT.isDown)}
        //if (controls() < 0) {player.anims.play('left', true)}
        //else if (controls() > 0) {player.anims.play('right', true)}
        //else if(controls() == 0) {player.anims.play('idle')}

        //state transitions
        if (Phaser.Input.Keyboard.JustDown(keys.UP) && player.body.touching.down)
        {
            player.setVelocityY(-720);
            this.state = this.states.JUMP;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.Q))
        {
            player.setVelocityX(0);
            this.state = this.states.FIRE
        }
        if (keys.DOWN.isDown)
        {
            player.setVelocityX(0);
            this.state = this.states.CROUCH;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {this.state = this.states.DASH}
        
        if (Phaser.Input.Keyboard.JustDown(keys.SHIFT)) {this.state = this.states.BACKSTEP}
        
        if (player.body.velocity.y > 0) {this.state = this.states.FALL}
    }

    jump()
    {
        //movement(player, 340);
        player.anims.play('jump', true);
        if (keys.UP.isUp) {player.body.velocity.y *= 0.65}
        if (Phaser.Input.Keyboard.JustDown(keys.Q)) {this.state = this.states.AERIAL}
        if (player.body.velocity.y > 0) {this.state = this.states.FALL}
        if (player.body.touching.down) {this.state = this.states.DEFAULT;}
    }

    fall()
    {
        //movement(player, 340);
        player.anims.play('fall', true);
        if (Phaser.Input.Keyboard.JustDown(keys.Q)) {this.state = this.states.AERIAL}
        if (player.body.touching.down) {this.state = this.states.DEFAULT;}
    }

    fire()
    {
        //something.disableBody(true,true) //this method will be used to delete the slash sprite from attacks
        player.anims.play('fire', true)

        if (player.anims.getProgress() == 1) {this.state = this.states.DEFAULT;}
    }

    crouch()
    {
        player.anims.play('crouch');
        if(keys.DOWN.isUp) {this.state = this.states.DEFAULT;}
    }

    aerial()
    {
        //movement(player, 340);
        player.anims.play('fire', true);
        
        if (player.anims.getProgress() == 1) 
        {
            if (player.body.velocity.y > 0) {this.state = this.states.FALL}
            else this.state = this.states.JUMP
        }
        if (player.body.touching.down) {this.state = this.states.DEFAULT;}
    }

    dash()
    {
        player.anims.play('fire', true);

        if (last_dir == -1) {player.setVelocityX(-800)}
        else player.setVelocityX(800);

        if (player.anims.getProgress() == 1) 
        {
            player.setVelocityX(0);
            this.state = this.states.DEFAULT;
        }
    }

    backstep()
    {
        player.anims.play('fall', true);

        if (last_dir == -1) {player.setVelocityX(500)}
        else player.setVelocityX(-500);

        if (player.anims.getProgress() == 1) 
        {
            player.setVelocityX(0);
            this.state = this.states.DEFAULT;
        }
    }
    
    update()
    {
        /*
        switch (this.state)
        {
            case this.states.DEFAULT: 
                grounded();
                break;
            case this.states.JUMP: 
                jump();
                break;
            case this.states.FALL:
                fall();
                break;
            case this.states.FIRE:
                fire();
                break;
            case this.states.CROUCH:
                crouch();
                break;
            case this.states.AERIAL:
                aerial();
                break;
            case this.states.DASH:
                dash();
                break;
            case this.states.BACKSTEP:
                backstep();
                break;
            default:
                grounded();
        }
        */
    }
}