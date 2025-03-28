import Phaser from "phaser";

import Player from "./player/Player";

export default class Livello2 extends Phaser.Scene {
  private _terreni: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Player;

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _bluemeth: Phaser.Physics.Arcade.Sprite;
  private _bluemethCounter: number = 0;

  private _waltMethText: Phaser.GameObjects.Text;
  private _waltMeth: Phaser.Physics.Arcade.Sprite;

  private _useBluemethText: Phaser.GameObjects.Text;

  private _activeCollider: Phaser.Physics.Arcade.Collider;

  private _piattaformeGruppo1: Phaser.Physics.Arcade.StaticGroup;
  private _piattaformeGruppo2: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: "Livello2" });
  }

  preload() {
    this.load.tilemapTiledJSON(
      "mappa",
      "assets/images/livello1/livello1map.json"
    );
    this.load.video("meth_effect", "assets/videos/meth_effect.mp4");
    this.load.image("terreno", "assets/images/terreno.png");
    this.load.image("player", "assets/images/player.png");
  }

  creaTerreni(): void {
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

    this._piattaformeGruppo1 = this.physics.add.staticGroup();
    this._piattaformeGruppo2 = this.physics.add.staticGroup();
    this._piattaforme = this.physics.add.staticGroup();

    const piattaformeObjects = map.getObjectLayer("Collisioni").objects;

    const shuffledPlatforms = [...piattaformeObjects].sort(
      () => Math.random() - 0.5
    );

    const midPoint = Math.floor(shuffledPlatforms.length / 2);

    const group1Platforms = shuffledPlatforms.slice(0, midPoint);
    const group2Platforms = shuffledPlatforms.slice(midPoint);

    group1Platforms.forEach((obj) => {
      const platform = this._piattaformeGruppo1
        .create(obj.x, obj.y, "piattaforma2")
        .setScale(1.3);
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

    this._piattaformeGruppo2.getChildren().forEach((platform) => {
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(false);
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.switchPlatformGroups,
      callbackScope: this,
      loop: true,
    });

    this._piattaforme.addMultiple(this._piattaformeGruppo1.getChildren());
    this._piattaforme.addMultiple(this._piattaformeGruppo2.getChildren());
  }

  private switchPlatformGroups(): void {
    this._piattaformeGruppo1.getChildren().forEach((platform) => {
      const isVisible = (platform as Phaser.Physics.Arcade.Sprite).visible;
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(!isVisible);
    });

    this._piattaformeGruppo2.getChildren().forEach((platform) => {
      const isVisible = (platform as Phaser.Physics.Arcade.Sprite).visible;
      (platform as Phaser.Physics.Arcade.Sprite).setVisible(!isVisible);
    });

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
      .setVisible(false);
  }

  spawnBluemeth(): void {
    this._bluemeth = this.physics.add
      .sprite(this._waltMeth.x - 200, this._waltMeth.y - 80, "bluemeth")
      .setGravityY(0)
      .setScale(2)
      .setVisible(false);
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

    this.spawnBluemeth();

    this.tweens.add({
      targets: this._bluemeth,
      y: { from: this._bluemeth.y, to: this._bluemeth.y + 10 },
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        if (this._bluemeth.active) this._bluemeth.setVelocityY(0);
      },
    });

    this.physics.add.overlap(
      this._player,
      this._bluemeth,
      () => {
        if (this._bluemeth.visible) {
          this._bluemeth.destroy();
          this.events.emit("bluemeth-event", 1);
          this._bluemethCounter++;
        }
      },
      null,
      this
    );

    this._activeCollider = this.physics.add.collider(
      [this._player, this._bluemeth],
      [this._terreni, this._piattaforme]
    );

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

      this.playMethEffectVideo();
    }

    if (
      this._waltMethText.visible &&
      this._bluemethCounter == 0 &&
      this._bluemeth.visible
    ) {
      this._waltMethText.setText("La Bluemeth è\nstata spawnata");
    }

    if (
      this._waltMethText.visible &&
      this.input.keyboard.checkDown(this.input.keyboard.addKey("A"), 250) &&
      this._bluemethCounter == 0
    ) {
      this._bluemeth.setVisible(true);
    }
  }

  private playMethEffectVideo(): void {
    const methEffectVideo = this.add.video(
      this.scale.width / 2,
      this.scale.height / 2,
      "meth_effect"
    );

   // methEffectVideo.setDisplaySize(1280, 800);
    methEffectVideo.setOrigin(0.25, 0.25);
    methEffectVideo.play();

    // Se hai un HUD, nascondilo
    const hudScene = this.scene.get("Hud"); // Ottieni la scena HUD
    if (hudScene) {
        hudScene.scene.setVisible(false); // Nascondi la scena HUD
    }

    this._player.setVisible(false);
    this._waltMeth?.setVisible(false);
    this._bluemeth.setVisible(false);
    this._useBluemethText.setVisible(false);
    this._waltMethText.setVisible(false);

    this.time.delayedCall(8000, () => {
      methEffectVideo.destroy();
      this.scene.start("Livello3");
    });
  }
}
