import GamePlay from "./GamePlay";

import newLiv1 from "./test/newLiv1";
import Livello1 from "./Livello1";

export default class Hud extends Phaser.Scene {
  private _livelloTest: newLiv1;
  private _livello1: Livello1;

  private _keyBonus: Phaser.GameObjects.Sprite;
  private _keyBonusText: Phaser.GameObjects.Text;
  private _keyCounter: number = 0;

  constructor() {
    super({
      key: "Hud",
    });
  }

  //questa funzione riceve 1 o -1 a seconda se la chiave è stata raccolta o utilzzata
  keyPicked(value: number): void {
    console.log("key picked HUD");
    this._keyCounter += value;
    this._keyBonusText.setText("x" + this._keyCounter);
  }

  create() {
    console.log("HUD");

    this._livelloTest = <newLiv1>this.scene.get("testLivello1");
    this._livelloTest.events.on(
      "key-event",
      (value: number) => this.keyPicked(value),
      this
    );

    this._livello1 = <Livello1>this.scene.get("Livello1");
    this._livello1.events.on(
      "key-event",
      (value: number) => this.keyPicked(value),
      this
    );

    const keyBonusGroup = this.add.container(0, 50);

    this._livello1.events.on(
      "level1-finish",
      () => keyBonusGroup.setVisible(false),
      this
    );

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
