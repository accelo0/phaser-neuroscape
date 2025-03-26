import IPlayer from "./IPlayer";
import newLiv1 from "../test/newLiv1";

export default class Player
  extends Phaser.GameObjects.Sprite
  implements IPlayer
{
  private _config: genericConfig;
  private _scene: newLiv1;
  private _body: Phaser.Physics.Arcade.Body;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _velocity: number = 200;
  private _animations: Array<{
    key: string;
    frames: Array<number>;
    frameRate: number;
    yoyo: boolean;
    repeat: number;
  }> = [
    {
      key: "player-walking-toRight",
      frames: [48, 49, 50, 51, 52, 53],
      frameRate: 10,
      yoyo: false,
      repeat: 1,
    },
    {
      key: "player-walking-toLeft",
      frames: [56, 57, 58, 59, 60, 61],
      frameRate: 10,
      yoyo: false,
      repeat: 1,
    },
    {
      key: "player-jumping-toRight",
      frames: [21, 22, 23],
      frameRate: 2,
      yoyo: false,
      repeat: 0,
    },
    {
      key: "player-jumping-toLeft",
      frames: [29, 30, 31],
      frameRate: 2,
      yoyo: false,
      repeat: 0,
    },
    { key: "idle", frames: [0], frameRate: 5, yoyo: false, repeat: -1 },
  ];

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this.create();
    this.createAnimations();
  }

  create() {
    this._scene = <newLiv1>this._config.scene;
    this._scene.physics.world.enable(this);
    this._body = <Phaser.Physics.Arcade.Body>this.body;
    this._body.setCollideWorldBounds(true);
    this._cursors = this._scene.input.keyboard.createCursorKeys();
    this.setDepth(11);
    this._scene.add.existing(this);

    this._body.setSize(12, 23);
    this._body.setGravityY(100);
  }

  createAnimations() {
    this._animations.forEach((element) => {
      if (!this._scene.anims.exists(element.key)) {
        let _animation: Phaser.Types.Animations.Animation = {
          key: element.key,
          frames: this.anims.generateFrameNumbers("player", {
            frames: element.frames,
          }),
          frameRate: element.frameRate,
          yoyo: element.yoyo,
          repeat: element.repeat,
        };

        this._scene.anims.create(_animation);
      }
    });
  }

  update(time: number, delta: number) {
    this._body.setVelocityX(0);

    if (this._cursors.right.isDown) {
      this._body.setVelocityX(200);
      if (!this._body.touching.down) {
        this.anims.play("player-jumping-toRight", true);
      } else if (this._body.blocked.down) {
        this.anims.play("player-walking-toRight", true);
      }
    } else if (this._cursors.left.isDown) {
      this._body.setVelocityX(-200);
      if (!this._body.touching.down) {
        this.anims.play("player-jumping-toLeft", true);
      } else if (this._body.blocked.down) {
        this.anims.play("player-walking-toLeft", true);
      }
    } else {
      this.anims.play("idle", true);
    }

    if (this._cursors.up.isDown && this._body.blocked.down) {
      this._body.setVelocityY(-400);
    }
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this._body;
  }
}
