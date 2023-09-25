import Phaser = require("phaser");

export interface CardConfig {
  scene: Phaser.Scene;
  position: Position;
  texture: string;
  suit: string;
  rank: number;
  isFaceUp: boolean;
}

type Position = {
  x: number;
  y: number;
};

export class Card extends Phaser.GameObjects.Sprite {
  constructor(private config: CardConfig) {
    super(
      config.scene,
      config.position.x,
      config.position.y,
      config.texture,
      "back-red"
    );
    this.config = config;
  }

  public getInfo(): {
    rank: number;
    suit: string;
    isFaceUp: boolean;
    position: Position;
  } {
    const { rank, suit, isFaceUp, position } = this.config;
    return { rank, suit, isFaceUp, position };
  }

  //   public flipCard() {
  //     !this.faceUp
  //       ? this.setTexture(this.atlas, this.cardName)
  //       : this.setTexture(this.atlas, "back-red");
  //   }
}
