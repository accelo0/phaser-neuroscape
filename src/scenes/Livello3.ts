import Phaser from "phaser";
import Player from "./player/Player";

// Main class for the "Livello3" scene
export default class Livello3 extends Phaser.Scene {
  private _terreni: Phaser.Physics.Arcade.StaticGroup; // Static group for terrain
  private _player: Player; // Player object
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup; // Static group for platforms

  constructor() {
    super({ key: "Livello3" }); // Initialize the scene with a unique key
  }

  // Preload assets required for this scene
  preload() {
    // this.load.tilemapTiledJSON("mappa", "assets/images/Livello3/cervellolivello3.json"); // Load tilemap
    // this.load.image("terreno", "assets/images/terreno.png"); // Load terrain image
    // this.load.image("player", "assets/images/player.png"); // Load player image
    // this.load.image("SFONDO", "assets/images/Livello3/sfondocervello.png"); // Load background image
    // this.load.json("background", "assets/images/Livello3/cervellolivello3.json"); // Load JSON file for platforms
  }

  // Create the scene
  create() {
    this.cameras.main.setBackgroundColor("#000000"); // Set background color
    // this.add
    // .image(this.scale.width / 2, this.scale.height / 2, "SFONDO") // Add background image
    // .setDisplaySize(1280, 800) // Set the size of the background image
    // .setOrigin(0.5, 0.5);

    // Add centered text
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "To be continued ....",
        {
          fontSize: "32px",
          fontFamily: "PressStart2P",
          stroke: "#ffffff",
        }
      )
      .setOrigin(0.5, 0.5);

    // this.creaTerreni();
    // this.creaPiattaforme();
    // this.creaPlayer();
  }

  update(time: number, delta: number): void {
    //this._player.update(0, 0); // Update the player
  }
}
