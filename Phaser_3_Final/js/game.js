var config = {
    type: Phaser.WebGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 500
    },
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1600 }
        }
    },
    scene: [
        SceneMainMenu,
        SceneMain
    ],
    pixelArt: true,
    roundPixels: true
}

var game = new Phaser.Game(config);