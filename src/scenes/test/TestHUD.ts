/* export default class testHud extends Phaser.Scene {

    constructor() {
      super({
        key: "TestHud",
      });
    }
  
  
    create() {
      console.log("HUD");

      // Create a text object to display the timer
      this.timerText = this.add.text(this.cameras.main.centerX, 20, '60', {
          fontSize: '32px',
          color: '#ffffff'
      }).setOrigin(0.5, 0);

      // Initialize the timer
      this.timeLeft = 60; // 1 minute in seconds

      // Update the timer every second
      this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true
      });
    }

    updateTimer() {
      // Decrease the time left
      this.timeLeft--;

      // Update the timer text
      this.timerText.setText(this.timeLeft.toString());

      // Stop the timer when it reaches 0
      if (this.timeLeft <= 0) {
          this.time.removeAllEvents();
      }
    }
  } */