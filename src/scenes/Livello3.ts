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
        this.load.tilemapTiledJSON("mappa", "assets/images/Livello3/cervellolivello3.json"); // Load tilemap
        this.load.image("terreno", "assets/images/terreno.png"); // Load terrain image
        this.load.image("player", "assets/images/player.png"); // Load player image
        this.load.image("SFONDO", "assets/images/Livello3/sfondocervello.png"); // Load background image
        this.load.json("background", "assets/images/Livello3/cervellolivello3.json"); // Load JSON file for platforms
    }

    // Create the scene
    create() {
        console.log("LIVELLO 3"); // Log scene initialization
        this.cameras.main.setBackgroundColor("#000000"); // Set background color
        this.add
        .image(this.scale.width / 2, this.scale.height / 2, "SFONDO") // Add background image
        .setDisplaySize(1280, 800) // Set the size of the background image
        .setOrigin(0.5, 0.5);

        this.creaTerreni();
        this.creaPiattaforme();
        this.creaPlayer();
    }

    // Method to create terrain
    private creaTerreni(): void {
        this._terreni = this.physics.add.staticGroup(); // Create a static group for terrain

        this._terreni
      .create(640, 810, "terreno")
      .setDisplaySize(1280, 10)
      .setOrigin(0.5, 0);
    
    }

    // Method to create platforms
    creaPiattaforme(): void {
        // Carica la mappa dal file JSON
        const map = this.make.tilemap({ key: "mappa" });

        // Aggiungi il tileset associato alla mappa
        const tileset = map.addTilesetImage("terreno", "terreno");

        // Crea il layer delle piattaforme dalla mappa
        const piattaformeLayer = map.getObjectLayer("collisioni");

        // Controlla se il layer "collisioni" esiste
        if (!piattaformeLayer || !piattaformeLayer.objects) {
            console.error('Layer "collisioni" o i suoi oggetti non sono stati trovati nella mappa!');
            return;
        }

        // Crea un gruppo statico per le piattaforme
        this._piattaforme = this.physics.add.staticGroup();

        // Itera sugli oggetti del layer "collisioni" per creare le piattaforme
        piattaformeLayer.objects.forEach((obj) => {
            const x = obj.x ?? 0; // Usa 0 come valore predefinito per x
            const y = obj.y ?? 0; // Usa 0 come valore predefinito per y

            // Crea una piattaforma nel gruppo
            const platform = this._piattaforme.create(x, y, "terreno");

            // Configura il corpo fisico della piattaforma
            (platform.body as Phaser.Physics.Arcade.StaticBody).setSize(obj.width ?? 128, obj.height ?? 32);
            (platform.body as Phaser.Physics.Arcade.StaticBody).setOffset(0, 0);
        });

        // Aggiungi collisioni tra il giocatore e le piattaforme
        this.physics.add.collider(this._player, this._piattaforme);
    }

    // Method to create the player (currently commented out)
    creaPlayer(): void {
        this._player = new Player({
              scene: this,
              x: 100,
              y: 700,
              key: "player",
            });
        this.add.existing(this._player); // Add the player to the scene
        this._player.setScale(3); // Scale the player
        this.physics.add.collider(this._player, this._terreni); // Add collision between player and terrain
    }
    update(time: number, delta: number): void {
        this._player.update(0,0); // Update the player

    }
}
