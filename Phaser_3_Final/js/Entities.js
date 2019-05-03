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

class Player extends Entity 
{
    constructor(scene, x, y, key) 
    {
        super(scene, x, y, key, "Player");
        this.setData("speed", 200);
        this.setData("isAttacking", false);
        this.setData("timerSlashDelay", 8);
        this.setData("timerSlashTick", this.getData("timerSlashDelay") - 1);
        //this.play("sprPlayer");
        state = 0
    }

    last_dir = 1

    controls()
    {
        left = -Number(keys.LEFT.isDown);
        right = Number(keys.RIGHT.isDown);
        return(left+right);
    }

    movement(body_param, speed)
    {
        body_param.setVelocityX(controls()*speed) //acceleration has to be accomplished with this
    }

    state_default()
    {
        movement(player, 340);
        //movement direction
        if (controls() !== 0) {last_dir = controls()}
        if (controls() < 0) {player.anims.play('left', true)}
        else if (controls() > 0) {player.anims.play('right', true)}
        else if(controls() == 0) {player.anims.play('idle')}
        //state transitions
        if (Phaser.Input.Keyboard.JustDown(keys.UP) && player.body.touching.down)
        {
            player.setVelocityY(-720);
            state = 1;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.Q))
        {
            player.setVelocityX(0);
            state = 3
        }
        if (keys.DOWN.isDown)
        {
            player.setVelocityX(0);
            state = 4;
        }
        if (Phaser.Input.Keyboard.JustDown(keys.SPACE)) {state = 6}
        
        if (Phaser.Input.Keyboard.JustDown(keys.SHIFT)) {state = 7}
        
        if (player.body.velocity.y > 0) {state = 2}
    }

    state_jump()
    {
        movement(player, 340);
        player.anims.play('jump', true);
        if (keys.UP.isUp) {player.body.velocity.y *= 0.65}
        if (Phaser.Input.Keyboard.JustDown(keys.Q)) {state = 5}
        if (player.body.velocity.y > 0) {state = 2}
        if (player.body.touching.down) {state = 0}
    }

    state_fall()
    {
        movement(player, 340);
        player.anims.play('fall', true);
        if (Phaser.Input.Keyboard.JustDown(keys.Q)) {state = 5}
        if (player.body.touching.down) {state = 0}
    }

    state_fire()
    {
        //something.disableBody(true,true) //this method will be used to delete the slash sprite from attacks
        player.anims.play('fire', true)

        if (player.anims.getProgress() == 1) {state = 0}
    }

    state_crouch()
    {
        player.anims.play('crouch');
        if(keys.DOWN.isUp) {state = 0}
    }

    state_aerial()
    {
        movement(player, 340);
        player.anims.play('fire', true);
        
        if (player.anims.getProgress() == 1) 
        {
            if (player.body.velocity.y > 0) {state = 2}
            else state = 1
        }
        if (player.body.touching.down) {state = 0}
    }

    state_dash()
    {
        player.anims.play('fire', true);

        if (last_dir == -1) {player.setVelocityX(-800)}
        else player.setVelocityX(800);

        if (player.anims.getProgress() == 1) 
        {
            player.setVelocityX(0);
            state = 0;
        }
    }

    state_backstep()
    {
        player.anims.play('fall', true);

        if (last_dir == -1) {player.setVelocityX(500)}
        else player.setVelocityX(-500);

        if (player.anims.getProgress() == 1) 
        {
            player.setVelocityX(0);
            state = 0;
        }
    }

    update()
    {
        switch (state)
        {
            case 0: 
                state_default();
                break;
            case 1: 
                state_jump();
                break;
            case 2:
                state_fall();
                break;
            case 3:
                state_fire();
                break;
            case 4:
                state_crouch();
                break;
            case 5:
                state_aerial();
                break;
            case 6:
                state_dash();
                break;
            case 7:
                state_backstep();
                break;
            default:
                state_default();
        }
    }
}