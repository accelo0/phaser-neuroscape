import Phaser from "phaser";

import Player from "./player/Player";

export default class Livello2 extends Phaser.Scene {
  private _terreni: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Player; // Cambiato il tipo

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _bluemeth: Phaser.Physics.Arcade.Sprite;
  private _bluemethCounter: number = 0;
  private _bluemethYCoo: number;

  private _waltMethText: Phaser.GameObjects.Text;
  private _waltMeth: Phaser.Physics.Arcade.Sprite;

  private _useBluemethText: Phaser.GameObjects.Text;

  private _activeCollider: Phaser.Physics.Arcade.Collider;

  private _piattaformeGruppo1: Phaser.Physics.Arcade.StaticGroup;
  private _piattaformeGruppo2: Phaser.Physics.Arcade.StaticGroup;
  private _switchTimer: number = 3000; // 3 seconds between switches

  constructor() {
    super({ key: "Livello2" });
  }

  preload() {
    this.load.tilemapTiledJSON(
      "mappa",
      "assets/images/livello1/livello1map.json"
    );
  }

  creaTerreni(): void {
    // **Creazione del terreno con collisioni corrette**
    this._terreni = this.physics.add.staticGroup();

    this._terreni
      .create(640, 810, "terreno")
      .setDisplaySize(1280, 10)
      .setOrigin(0.5, 0)
      .setTint(0x000000);

    const secondFloor = this._terreni
      .create(640, 350, "terreno")
      .setDisplaySize(1280, 40)
      .setOrigin(0.5, 1)
      .setTint(0x000000);

    // Jump-through platform
    (secondFloor.body as Phaser.Physics.Arcade.StaticBody)
      .setSize(1280, 40)
      .setOffset(0, 12).checkCollision.down = false;
  }

  creaPlayer(): void {
    this._player = new Player({
      scene: this,
      x: 0,
      y: 700,
      key: "player",
    });
    this._player.setScale(3);
  }

  creaPiattaforme(): void {
    const map = this.make.tilemap({ key: "mappa" });

    // Create two static groups for platforms
    this._piattaformeGruppo1 = this.physics.add.staticGroup();
    this._piattaformeGruppo2 = this.physics.add.staticGroup();
    this._piattaforme = this.physics.add.staticGroup();

    // Get all platform objects from the map
    const piattaformeObjects = map.getObjectLayer("Collisioni").objects;

    // Shuffle the platforms array
    const shuffledPlatforms = [...piattaformeObjects].sort(
      () => Math.random() - 0.5
    );

    // Calculate the midpoint
    const midPoint = Math.floor(shuffledPlatforms.length / 2);

    // Split platforms into two groups
    const group1Platforms = shuffledPlatforms.slice(0, midPoint);
    const group2Platforms = shuffledPlatforms.slice(midPoint);

    // Create platforms for group 1
    group1Platforms.forEach((obj) => {
      const platform = this._piattaformeGruppo1
        .create(obj.x, obj.y, "piattaforma2")
        .setScale(1.3);
      //.setOrigin(0, 0.5);
      (
        platform.body as Phaser.Physics.Arcade.StaticBody
      ).updateFromGameObject();
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.down =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.left =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.right =
        false;
    });

    // Create platforms for group 2
    group2Platforms.forEach((obj) => {
      const platform = this._piattaformeGruppo2.create(
        obj.x,
        obj.y,
        "piattaforma2"
      );
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.down =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.left =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.right =
        false;
    });

    // Initially hide group 2
    this._piattaformeGruppo2.getChildren().forEach((platform) => {
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(false);
      //(platform.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    });

    // Set up the alternating timer
    this.time.addEvent({
      delay: this._switchTimer,
      callback: this.switchPlatformGroups,
      callbackScope: this,
      loop: true,
    });

    // Add both groups to the main platforms group for collision handling
    this._piattaforme.addMultiple(this._piattaformeGruppo1.getChildren());
    this._piattaforme.addMultiple(this._piattaformeGruppo2.getChildren());
  }

  private switchPlatformGroups(): void {
    this._piattaformeGruppo1.getChildren().forEach((platform) => {
      const isVisible = (platform as Phaser.Physics.Arcade.Sprite).visible;
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(!isVisible);
      //(platform.body as Phaser.Physics.Arcade.StaticBody).enable = !isVisible;
    });

    this._piattaformeGruppo2.getChildren().forEach((platform) => {
      const isVisible = (platform as Phaser.Physics.Arcade.Sprite).visible;
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(!isVisible);
      //(platform.body as Phaser.Physics.Arcade.StaticBody).enable = !isVisible;
    });

    // Optional: Add a flash effect when platforms switch
    this.cameras.main.flash(
      150,
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      false
    );
  }

  setupWaltMeth(): void {
    const terreno2 =
      this._terreni.getChildren()[1] as Phaser.Physics.Arcade.Sprite;
    this._waltMeth = this.physics.add
      .sprite(1100, terreno2.y - 95, "waltMeth")
      .setScale(1.8);
    this.physics.add.collider(this._waltMeth, this._terreni);

    this._waltMethText = this.add
      .text(
        this._waltMeth.x - 85,
        this._waltMeth.y - 120,
        "Premi 'A'\nper prendere\nla Bluemeth",
        {
          fontSize: "13px",
          fontFamily: "PressStart2P",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        }
      )
      //.setOrigin(0.5)
      .setVisible(false);
  }

  spawnBluemeth(): void {
    // Crea la chiave sopra la piattaforma scelta
    this._bluemeth = this.physics.add
      .sprite(this._waltMeth.x - 200, this._waltMeth.y - 80, "bluemeth")
      .setGravityY(0)
      .setScale(2)
      .setVisible(false);

    this._bluemethYCoo = this._bluemeth.y;
    //this._bluemeth.play("bluemeth-anim");
  }

  bluemethHandle(): void {
    if (this._bluemeth.visible) {
      this._bluemeth.destroy();
      this.events.emit("bluemeth-event", 1);
      this._bluemethCounter++;
      console.log("bluemeth presa a:", this._bluemeth.x, this._bluemeth.y);
      //testo di uso bluemeth che segue il player
      this._useBluemethText = this.add
        .text(this.game.canvas.width / 2, 150, "PREMI A PER USARE LA METH", {
          fontFamily: "PressStart2P",
          fontSize: "32px",
          stroke: "#000000",
          strokeThickness: 5,
        })
        .setVisible(true)
        .setOrigin(0.5, 0.5);
    }
  }

  create() {
    console.log("LIVELLO 2");
    this.cameras.main.setBackgroundColor("#000000");
    this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "liv2BG"
    );

    this.creaTerreni();
    this.setupWaltMeth();
    this.creaPiattaforme();
    this.creaPlayer();

    this._useBluemethText = this.add
      .text(this.game.canvas.width / 2, 150, "PREMI A PER USARE LA METH", {
        fontFamily: "PressStart2P",
        fontSize: "16px",
        stroke: "#000000",
        strokeThickness: 5,
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    // Interazione tra player e waltMeth
    this.physics.add.overlap(
      this._player,
      this._waltMeth,
      () => {
        this._waltMethText.setVisible(true);
        if (this._bluemethCounter == 1) {
          this._waltMethText
            .setText("Usa la tua Bluemeth")
            .setPosition(this._waltMeth.x - 100, this._waltMeth.y - 100);
          this._waltMethText.setVisible(true);
        }
      },
      null,
      this
    );

    //animazione della chiave
    this.anims.create({
      key: "bluemeth-anim",
      frames: this.anims.generateFrameNumbers("chiave", { start: 0, end: 23 }), // 24 frame
      frameRate: 10,
      repeat: -1,
    });

    this.spawnBluemeth();

    // Aggiungi un tween per far fluttuare la chiave
    this.tweens.add({
      targets: this._bluemeth,
      y: { from: this._bluemethYCoo, to: this._bluemethYCoo + 10 }, // Movimento verticale di 10 pixel
      //duration: 1000, // Durata del movimento (1 secondo)
      yoyo: true, // Torna indietro
      repeat: -1, // Ripeti all'infinito
      ease: "Sine.easeInOut", // Movimento fluido
      onUpdate: () => {
        if (this._bluemeth.active) this._bluemeth.setVelocityY(0); // Blocca la chiave in posizione
      },
    });

    // Aggiungi interazione tra player e chiave
    this.physics.add.overlap(
      this._player,
      this._bluemeth,
      () => {
        if (this._bluemeth.visible) {
          this._bluemeth.destroy();
          this.events.emit("bluemeth-event", 1);
          this._bluemethCounter++;
          console.log("bluemeth presa a:", this._bluemeth.x, this._bluemeth.y);
          //this._useBluemethText.setVisible(true);
        }
      },
      null,
      this
    );

    // Abilitiamo le collisioni di player e chiave, con piattaforme e terreni
    this._activeCollider = this.physics.add.collider(
      [this._player, this._bluemeth],
      [this._terreni, this._piattaforme]
    );

    // setup controlli
    this._cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this._player.update(0, 0);

    const secondFloor =
      this._terreni.getChildren()[1] as Phaser.Physics.Arcade.Sprite;

    if (
      this._cursors.down.isDown &&
      this._player.getBody().blocked.down &&
      this._player.y < secondFloor.y
    ) {
      this._activeCollider.active = false;

      this.time.delayedCall(500, () => {
        this._activeCollider.active = true;
      });

      this._player.getBody().setVelocityY(100);
    }

    if (
      Phaser.Math.Distance.Between(
        this._player.x,
        this._player.y,
        this._waltMeth.x,
        this._waltMeth.y
      ) > 50
    ) {
      this._waltMethText.setVisible(false);
    }

    if (this._bluemethCounter == 1) {
      //this._useBluemethText.visible &&

      this._useBluemethText
        .setVisible(true)
        .setPosition(this._player.x, this._player.y - 90);
    }

    if (
      this._useBluemethText.visible &&
      this._bluemethCounter == 1 &&
      this.input.keyboard.checkDown(this.input.keyboard.addKey("A"))
    ) {
      this.cameras.main.flash(1000, 255, 255, 255);
      this._bluemethCounter--;
      this._useBluemethText.setVisible(false);
      //this.events.emit("key-event", -1);
      //this.scene.start("testLivello1"); // Cambia con la tua prossima scena
    }

    if (
      this._waltMethText.visible &&
      this._bluemethCounter == 0 &&
      this._bluemeth.visible
    ) {
      this._waltMethText.setText("La Bluemeth è\nstata spawnata");
    }

    // player su walt e meth con A premuto senza bluemeth
    if (
      this._waltMethText.visible &&
      this.input.keyboard.checkDown(this.input.keyboard.addKey("A"), 250) &&
      this._bluemethCounter == 0
    ) {
      this._bluemeth.setVisible(true);
    }
  }
}
