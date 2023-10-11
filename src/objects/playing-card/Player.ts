import { Card, ORIGIN } from ".";

export interface IPlayerConfig {
  scene: Phaser.Scene;
  name: string;
  x: number;
  y: number;
  rotation: number;
  isPlayer: boolean;
  cardSettings?: {
    origin?: { x: number; y: number };
    scale?: number;
    faceup?: boolean;
    spacing?: number;
  };
}

export interface ICardMoveAnimation {
  x: number;
  y: number;
  faceup: boolean;
  spacing?: number;
  scale?: number;
  rotation?: number;
  options?: {
    duration?: number;
    ease?: string;
  };
  onAnimationComplete?: () => void;
}

export interface ICardArrangeAnimation {
  target: Card;
  x: number;
  y: number;
  rotation?: number;
  duration?: number;
  ease?: number;
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
    faceup: boolean;
  } {
    const { name, x, y } = this.config;
    const faceup = this.config.cardSettings?.faceup || false;

    return { name, x, y, faceup };
  }

  public addCards(cards: Array<Card>) {
    cards.forEach((card) => {
      this.addCard(card);
    });
  }

  public addCard(card: Card) {
    const { x, y, faceup } = this.getProperties();
    const scale = this.config.cardSettings?.scale || 0;
    const spacing = this.config.cardSettings?.spacing || 0;

    card.removeAllListeners();
    this.playCardMoveAnimation(card, {
      x,
      y,
      scale,
      spacing,
      faceup,
      onAnimationComplete: () => {
        this.makeCardSelectable(card);
        this.hand.push(card);
        card.setDepth(this.hand.length + 1);
        this.selectedCards = [];
      },
    });
  }

  public removeCards(cards: Array<Card>, animationConfig: ICardMoveAnimation) {
    cards.forEach((card) => {
      this.removeCard(card, animationConfig);
    });
  }

  public removeCard(card: Card, config: ICardMoveAnimation) {
    const { x, y, scale, faceup, spacing, options } = config;

    card.removeAllListeners();
    const cardIndex = this.hand.indexOf(card);
    this.hand.splice(cardIndex, 1);

    this.playCardMoveAnimation(card, {
      x,
      y,
      scale,
      spacing,
      faceup,
      options,
    });
  }

  private arrangeCardsPosition() {
    const spacing = this.config.cardSettings?.spacing || 30;
    const handCardsWidth: number = this.hand.length * spacing;
    const handCardsXPos: number = handCardsWidth / 2 - spacing / 2;

    this.hand.forEach((card: Card, index: number) => {
      const { rotation, x, y } = this.config;

      const cardX: number =
        rotation === -90 || rotation === 90
          ? x
          : x - handCardsXPos + index * spacing;

      const cardY: number =
        rotation === -90 || rotation === 90
          ? y - handCardsXPos + index * spacing
          : y;

      this.playCardArrangeAnimation({
        target: card,
        x: cardX,
        y: cardY,
        rotation,
      });
    });
  }

  private playCardArrangeAnimation(config: ICardArrangeAnimation) {
    const { target, x, y } = config;
    const rotation = config.rotation || 0;
    const duration = config.duration || 200;
    const ease = config.ease || "linear";
    const origin = this.config.cardSettings?.origin || ORIGIN.MiddleCenter;

    target.setOrigin(origin.x, origin.y);

    this.scene.add.tween({
      targets: target,
      x,
      y,
      rotation: Phaser.Math.DegToRad(rotation),
      ease,
      duration,
    });
  }

  private playCardMoveAnimation(card: Card, config: ICardMoveAnimation) {
    const { x, y, scale, faceup, options, rotation, onAnimationComplete } =
      config;

    const cardSpacing = this.config.cardSettings?.spacing || 0;
    const cardXPos = x + cardSpacing * (this.hand.length - 1);

    const showFace = card.getProperties().isFaceUp !== faceup;

    card.moveTo({
      x: cardXPos,
      y,
      scale,
      rotation,
      options,
      onAnimationComplete: () => {
        if (onAnimationComplete) onAnimationComplete();
        if (showFace) card.flip();
        this.arrangeCardsPosition();
      },
    });
  }

  private makeCardSelectable(card: Card) {
    if (this.config.isPlayer) {
      card.on("pointerdown", () => {
        if (!card.selected()) this.toggleCardSelection(card, true);
      });
    }
  }

  private toggleCardSelection(card: Card, playSelectionAnimation?: boolean) {
    let cardXPos;
    let cardYPos;

    if (this.selectedCards.includes(card)) {
      const index = this.selectedCards.indexOf(card);
      cardYPos = card.y + card.displayHeight / 2;

      this.selectedCards.splice(index, 1);
    } else {
      cardYPos = card.y - card.displayHeight / 2;

      this.selectedCards.push(card);
    }

    cardXPos = card.x;

    if (playSelectionAnimation) {
      this.selectCardAnimation(card, cardXPos, cardYPos);
    }
  }

  private selectCardAnimation(card: Card, x: number, y: number) {
    card.selected(true);

    this.scene.add.tween({
      targets: card,
      x,
      y,
      ease: "linear",
      duration: 200,
      onComplete: () => {
        card.selected(false);
      },
    });
  }
}
