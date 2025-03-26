import Phaser from 'phaser';

enum playerState {
  IDLE,
  WALKING,
  RUNNING,
  JUMPING
}

import Player from "../player/Player";

export default class testLivello1 extends Phaser.Scene {
  private _liv1BG: Phaser.GameObjects.Image;
  private _terreno: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Phaser.Physics.Arcade.Sprite;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _testiPiattaforme: Phaser.GameObjects.Group;

  constructor() {
    super({ key: "testLivello1" });
  }

  preload() {
    //this.load.image("liv1BG", "path/to/Background.png");
    this.load.image("terreno", "path/to/terreno.png");
    this.load.image("piattaforma", "Template/src/assets/images/livello1/platform.png");
  }

  create() {
    console.log("livelliDi1test");
    this.cameras.main.setBackgroundColor("#000000");
    this._liv1BG = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "liv1BG");

    // **Creazione del terreno con collisioni corrette**
    this._terreno = this.physics.add.staticGroup();
    const groundWidth = this.textures.get('terreno').getSourceImage().width;
    const groundHeight = this.textures.get('terreno').getSourceImage().height;
    const numGroundTiles = Math.ceil(this.game.canvas.width / groundWidth);

    for (let i = 0; i < numGroundTiles; i++) {
      this._terreno.create(i * groundWidth, this.game.canvas.height - groundHeight / 2, 'terreno')
        .setOrigin(0, 0.5)
        .setTint(0xff0000); // Aggiungi questa linea per rendere il terreno rosso
    } 

    // **Creazione piattaforme**
    this._piattaforme = this.physics.add.staticGroup();
    this._testiPiattaforme = this.add.group({ classType: Phaser.GameObjects.Text }); // Gruppo per i testi


/*     Piattaforma ID: 0 - X: 612, Y: 670
       Piattaforma ID: 1 - X: 827, Y: 620
       Piattaforma ID: 2 - X: 913, Y: 570
       Piattaforma ID: 3 - X: 107, Y: 520
       Piattaforma ID: 4 - X: 473, Y: 470
       Piattaforma ID: 5 - X: 1083, Y: 420
       Piattaforma ID: 6 - X: 408, Y: 370
       Piattaforma ID: 7 - X: 799, Y: 320
       Piattaforma ID: 8 - X: 664, Y: 270
       Piattaforma ID: 9 - X: 258, Y: 220
       Piattaforma ID: 10 - X: 664, Y: 170
       Piattaforma ID: 11 - X: 684, Y: 120
       Piattaforma ID: 12 - X: 1073, Y: 70
       Piattaforma ID: 13 - X: 1092, Y: 20
       Piattaforma ID: 14 - X: 495, Y: -30 */

       // 1- Piattaforma ID: 0 - X: 279, Y: 630
       // 2- Piattaforma ID: 1 - X: 481, Y: 566
       // 3- Piattaforma ID: 2 - X: 695, Y: 514
        // 4- Piattaforma ID: 3 - X: 1090, Y: 462
        // 5- Piattaforma ID: 4 - X: 930, Y: 540
        // 6- Piattaforma ID: 5 - X: 1099, Y: 465
        // 7- Piattaforma ID: 6 - X: 527, Y: 420
        // 8- Piattaforma ID: 7 - X: 319, Y: 361
        // 9- Piattaforma ID: 8 - X: 39, Y: 527

    const platformCoords = [
      { x: 279, y: 645 },
      { x: 481, y: 566 },
      { x: 695, y: 514 },
      { x: 1090, y: 462 },
      { x: 930, y: 540 },
      { x: 1099, y: 465 },
      { x: 527, y: 420 },
      { x: 319, y: 361 },
      { x: 39, y: 527 }

    ];

    let startY = 670; // Inizio dal basso
    let gapY = 50; // Altezza tra piattaforme, regolabile per il salto
    let numPiattaforme = 15; // Numero di piattaforme da spawnare
    let minX = 100; // Evita di spawnare troppo vicino al bordo sinistro
    let maxX = 1180; // Evita di spawnare troppo vicino al bordo destro
     
    for (let i = 0; i < platformCoords.length; i++) {
        let x = platformCoords[i].x
        let y = platformCoords[i].y
    
        let piattaforma = this._piattaforme.create(x, y, 'piattaforma');
        piattaforma.setData('id', i); // Assegna un ID alla piattaforma
    
        console.log(`Piattaforma ID: ${i} - X: ${x}, Y: ${y}`);
    
        // Crea un testo sopra la piattaforma per mostrare l'ID
        let testo = this.add.text(x, y - 20, `ID: ${i}`, {
            fontSize: '16px',
            //fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
    
        this._testiPiattaforme.add(testo);
    }
    
    

    // **Creazione player con posizione corretta**
    this._player = this.physics.add
      .sprite(0, 700, "player")
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setCollideWorldBounds(true);
    this._player.setCollideWorldBounds(true);
    this._player.setGravityY(100); // **Aggiunta gravità per il movimento naturale**
    
    // **Aggiunta collisioni**
    this.physics.add.collider(this._player, this._terreno);
    this.physics.add.collider(this._player, this._piattaforme);

    // Settaggio della hitbox più precisa
    this._player.body.setSize(12, 23);

    // **Creazione animazioni**
    // ...

    // **Controlli**
    this._cursors = this.input.keyboard.createCursorKeys();

    // **Abilita il debug per le hitbox**
    this.physics.world.createDebugGraphic();
  }

  update() {
    // Reset della velocità del player
    this._player.setVelocityX(0);

    // Controllo movimento
    if (this._cursors.right.isDown) {
      this._player.setVelocityX(200);
      this._player.anims.play("player-walking-toRight", true);
    } else if (this._cursors.left.isDown) {
      this._player.setVelocityX(-200);
      this._player.anims.play("player-walking-toLeft", true);
    } else {
      this._player.anims.play("idle", true); // Ferma l'animazione quando non si preme nulla
    }

    if (this._cursors.up.isDown && this._player.body.blocked.down) {
      this._player.setVelocityY(-400);

    
    }
    // this.physics.add.overlap(_player, , collideCallback, processCallback, callbackContext);
  }
}
