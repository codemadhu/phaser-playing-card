import { Card, POSITIONS } from ".";

export interface IPlayerConfig {
  scene: Phaser.Scene;
  name: string;
  x: number;
  y: number;
  faceup?: boolean;
  position: POSITIONS;
}

export class Player extends Phaser.GameObjects.GameObject {
  public selectedCards: Array<Card>;
  public hand: Array<Card>;

  constructor(private config: IPlayerConfig) {
    super(config.scene, "playing-card-player");
    this.hand = [];
    this.selectedCards = [];
  }

  public getProperties(): {
    name: string;
    x: number;
    y: number;
    position: POSITIONS;
  } {
    const { name, x, y, position } = this.config;

    return { name, x, y, position };
  }

  public addCards(cards: Array<Card>) {
    cards.forEach((card) => {
      this.addCard(card);
    });
  }

  public addCard(card: Card) {
    card.removeAllListeners();
    this.hand.push(card);
  }

  public removeCards(cards: Array<Card>) {
    cards.forEach((card) => {
      this.removeCard(card);
    });
  }

  public removeCard(card: Card) {
    const cardIndex = this.hand.indexOf(card);

    card.removeAllListeners();
    this.hand.splice(cardIndex, 1);

    this.selectedCards = [];
    if (this.hand.length > 0) {
      this.arrangeCardsPosition();
    }
  }

  public arrangeCardsPosition(offset = 50) {
    const handCardsWidth = this.hand.length * offset;
    const gap = handCardsWidth / 2 - offset / 2;

    this.hand.forEach((card, index) => {
      if (
        this.config.position === POSITIONS.Left ||
        this.config.position === POSITIONS.Right
      ) {
        this.cardArrangeAnimation({
          target: card,
          x: this.config.x,
          y: this.config.y - gap + index * offset,
          rotation: 90,
        });
      } else {
        this.cardArrangeAnimation({
          target: card,
          x: this.config.x - gap + index * offset,
          y: this.config.y,
          rotation: 0,
        });
      }
    });
  }

  private cardArrangeAnimation(config: {
    target: Card;
    x: number;
    y: number;
    rotation?: number;
    duration?: number;
    ease?: number;
  }) {
    const { target, x, y } = config;
    const rotation = config.rotation || 0;
    const duration = config.duration || 200;
    const ease = config.ease || "linear";

    this.scene.add.tween({
      targets: target,
      x,
      y,
      rotation: Phaser.Math.DegToRad(rotation),
      ease,
      duration,
      onComplete: () => {
        if (this.config.faceup) {
          target.flip();
        }
      },
    });
  }

  private selectCardAnimation(card: Card, cardY: integer) {
    this.scene.add.tween({
      targets: card,
      y: cardY,
      ease: "linear",
      duration: 200,
    });
  }
}
