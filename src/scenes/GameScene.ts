import { Card } from "../objects";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "game-scene" });
  }

  preload() {
    this.load.image("qr", "./assets/qr.png");
    this.load.atlas("cards", "./assets/cards.png", "./assets/cards.json");
    console.log("preloading");
  }

  create() {
    this.createObjects();
  }

  private createObjects() {
    const card = new Card({
      scene: this,
      texture: "cards",
      suit: "heart",
      rank: 1,
      isFaceUp: false,
    });
    card.scale = 0.5;
    card.x = 200;
    card.y = 200;

    this.add.existing(card);
    card.on("pointerdown", () => {
      console.log("pointerdown");
      card.flip();
    });
  }
}
