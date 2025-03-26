import GamePlay from "./GamePlay";

import newLiv1 from "./test/newLiv1";

export default class Hud extends Phaser.Scene {
  private _livello1: newLiv1;

  private _keyBonus: Phaser.GameObjects.Sprite;
  private _keyBonusText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "Hud",
    });
  }

  keyPicked(): void {
    console.log("key picked");
    this._keyBonusText.setText("x1");
  }

  create() {
    console.log("HUD");

    this._livello1 = <newLiv1>this.scene.get("testLivello1");
    this._livello1.events.on("key-picked", this.keyPicked, this);

    const keyBonusGroup = this.add.container(0, 50);

    // Aggiungi l'icona e testo della chiave
    this._keyBonus = this.add.sprite(0, 0, "chiave").setScale(1.5);
    this._keyBonusText = this.add
      .text(25, 0, "x0", {
        fontSize: "25px",
        fontFamily: "PressStart2P",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5); // Centra verticalmente il testo rispetto all'icona

    keyBonusGroup.add([this._keyBonus, this._keyBonusText]).setPosition(
      this.cameras.main.width - keyBonusGroup.width - 100, // Posiziona a destra con un margine
      50
    );
  }

  update(time: number, delta: number): void {}
}
