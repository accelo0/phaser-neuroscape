export default class Livello2 extends Phaser.Scene {

    //diachiarazione immagini e assets
    private _liv2BG: Phaser.GameObjects.Image;
    private _terreno: Phaser.Physics.Arcade.StaticGroup;
    private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  
    //player
    private _player: Phaser.Physics.Arcade.Sprite;
    private _playerBody: Phaser.Physics.Arcade.Body;
    //private _playerState: playerState = playerState.IDLE; //gestire lo stato del giocatore per far capire quale animazione partire
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  
    private _animations: Array<{ key: string, frames: Array<number>, frameRate: number, yoyo: boolean, repeat: number }> = [
      { key: "player-walking-toRight", frames: [48, 49, 50, 51, 52, 53], frameRate: 10, yoyo: false, repeat: -1 },
      { key: "player-walking-toLeft", frames: [56, 57, 58, 59, 60, 61], frameRate: 10, yoyo: false, repeat: -1 },
      { key: "player-running-toLeft", frames: [54, 55], frameRate: 5, yoyo: false, repeat: -1 },
      { key: "player-running-toRight", frames: [62, 63], frameRate: 5, yoyo: false, repeat: -1 },
      { key: "player-jumping-toLeft", frames: [21, 22, 23], frameRate: 5, yoyo: false, repeat: 0 },
      { key: "player-jumping-toRight", frames: [29, 30, 31], frameRate: 5, yoyo: false, repeat: 0 }
    ];
  
    constructor() {
      super({
        key: "Livello2",
      });
    }
  
    preload() {
      // Preload the images
      this.load.image("liv2BG", "path/to/liv2BG.png");
      this.load.image("terreno", "path/to/terreno.png");
      this.load.image("piattaforma", "Template/src/assets/images/livello1/platform.png");
      this.load.spritesheet("player", "path/to/player_spritesheet.png", { frameWidth: 32, frameHeight: 48 });
    }
  
    create() {
      // Set the background color to black
      this.cameras.main.setBackgroundColor("#000000");
      console.log("Livello1 passato");
  
      // Add the background image
      this._liv2BG = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "liv2BG");
  
      // Create the ground object with physics
      this._terreno = this.physics.add.staticGroup();
      const groundWidth = this.textures.get('terreno').getSourceImage().width;
      const groundHeight = this.textures.get('terreno').getSourceImage().height;
      const numGroundTiles = Math.ceil(this.game.canvas.width / groundWidth);
  
      for (let i = 0; i < numGroundTiles; i++) {
        this._terreno.create(i * groundWidth, this.game.canvas.height - groundHeight / 2, 'terreno').setOrigin(0, 0.5);
      }
  
      // Create a group of platforms
      this._piattaforme = this.physics.add.staticGroup();
  
      // Add multiple platforms to create a climbing path
      this._piattaforme.create(100, 600, 'piattaforma');
      this._piattaforme.create(400, 600, 'piattaforma');
      this._piattaforme.create(200, 650, 'piattaforma');
      this._piattaforme.create(500, 650, 'piattaforma');
      this._piattaforme.create(300, 400, 'piattaforma');
      this._piattaforme.create(300, 400, 'piattaforma');
      this._piattaforme.create(500, 300, 'piattaforma');
      this._piattaforme.create(1000, 250, 'piattaforma');
      this._piattaforme.create(700, 200, 'piattaforma');
      this._piattaforme.create(1200, 150, 'piattaforma');
      this._piattaforme.create(900, 100, 'piattaforma');
  
      // Create the player and its animation
      this._player = this.physics.add.sprite(1280, 800, 'player').setOrigin(0.5, 0.5).setScale(2);
      this._player.setCollideWorldBounds(true);
  
      // Add collision between the player and the platforms
      this.physics.add.collider(this._player, this._terreno);
      this.physics.add.collider(this._player, this._piattaforme);
  
      // Set the size of the player's body
      this._player.body.setSize(16, 16);
  
      // Create animations
      this._animations.forEach(element => {
        let _animation: Phaser.Types.Animations.Animation = {
          key: element.key,
          frames: this.anims.generateFrameNumbers("player", { frames: element.frames }),
          frameRate: element.frameRate,
          yoyo: element.yoyo,
          repeat: element.repeat
        };
        this.anims.create(_animation);
      });
  
      // Create cursor keys for input
      this._cursors = this.input.keyboard.createCursorKeys();
  
      // Play initial animation
      //this._player.play("player-idle");
    }
  
    update(time: number, delta: number): void {
      // Handle player movement
      if (this._cursors.left.isDown) {
        this._player.setVelocityX(-160);
        this._player.play("player-walking-toLeft", true);
      } else if (this._cursors.right.isDown) {
        this._player.setVelocityX(160);
        this._player.play("player-walking-toRight", true);
      } else {
        this._player.setVelocityX(0);
        //this._player.play("player-idle", true);
      }
  
      // Handle player jumping
      if (this._cursors.up.isDown && this._player.body.touching.down) {
        this._player.setVelocityY(-330);
      }
  

      this.scene.stop("Livello1");
      this.scene.start("testLivello1");
    }
}
