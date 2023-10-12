import { Card, ICardMoveAnimation, Utils } from ".";

export interface IPlayer {
  scene: Phaser.Scene;
  name: string;
  x: number;
  y: number;
  rotation: number;
  isMainPlayer: boolean;
  cardSettings?: {
    isFaceUp?: boolean;
    scale?: number;
    rotation?: number;
    spacing?: number;
    origin?: { x: number; y: number };
  };
}

export interface ICardAddRemoveAnimation {
  isFaceUp: boolean;
  cardSpacing: number;
  animationOptions: ICardMoveAnimation;
}

export interface ICardArrangeAnimation {
  target: Card;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  ease?: number;
  onComplete?: () => void;
}

export class Player extends Phaser.GameObjects.GameObject {
  public selectedCards: Array<Card>;
  public hand: Array<Card>;
  public name: string;
  public x: number;
  public y: number;
  public isFaceUp: boolean;

  private _cardThrowAnimation: ICardAddRemoveAnimation;

  constructor(private config: IPlayer) {
    super(config.scene, "player");

    this.hand = [];
    this.selectedCards = [];
    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.isFaceUp = this.config?.cardSettings?.isFaceUp || false;
  }

  public setCardThrowAnimation(config: ICardAddRemoveAnimation) {
    this._cardThrowAnimation = config;
  }

  public addCards(cards: Array<Card>) {
    cards.forEach((card, index) => {
      this.addCard(card);
    });
  }

  public addCard(card: Card) {
    const { x, y, isFaceUp } = this;
    const scale = this.config?.cardSettings?.scale || 0;
    const cardSpacing = this.config?.cardSettings?.spacing || 0;
    const rotation = this.config.rotation || 0;

    card.removeAllListeners();

    this.hand.push(card);
    card.setDepth(this.hand.length);

    this.playCardMoveAnimation(card, this.hand.length - 1, {
      isFaceUp,
      cardSpacing,
      animationOptions: {
        x,
        y,
        scale,
        rotation,
        onAnimationComplete: () => {
          this.makeCardSelectable(card);
          this.selectedCards = [];
          this.arrangeHandCards();
        },
      },
    });
  }

  public removeCards(cards: Array<Card>) {
    if (cards.length > 0) {
      cards.forEach((card) => {
        this.removeCard(card);
      });
    }
  }

  public removeCard(card: Card) {
    if (card) {
      const isFaceUp = this._cardThrowAnimation.isFaceUp;
      const cardSpacing = this._cardThrowAnimation.cardSpacing;

      const { x, y, scale, rotation, onAnimationComplete } =
        this._cardThrowAnimation.animationOptions;

      const index = this.selectedCards.indexOf(card);

      card.removeAllListeners();

      this.playCardMoveAnimation(card, index, {
        isFaceUp,
        cardSpacing,
        animationOptions: {
          x,
          y,
          scale,
          rotation,
          onAnimationComplete: () => {
            Utils.removeCardFromArray(card, this.hand);
            this.arrangeThrownCards(card);
            if (onAnimationComplete) onAnimationComplete();
          },
        },
      });
    }
  }

  private arrangeHandCards() {
    const { x, y } = this;
    const scale = this.config?.cardSettings?.scale || 0;
    const cardSpacing = this.config?.cardSettings?.spacing || 0;
    const rotation = this.config.rotation || 0;

    this.arrangeCardsPosition(this.hand, cardSpacing, x, y, scale, rotation);
  }

  private arrangeThrownCards(card: Card) {
    const cardSpacing = this._cardThrowAnimation.cardSpacing;
    const { x, y, scale, rotation, onAnimationComplete } =
      this._cardThrowAnimation.animationOptions;

    this.arrangeCardsPosition(
      this.selectedCards,
      cardSpacing,
      x,
      y,
      scale,
      rotation,
      () => {
        Utils.removeCardFromArray(card, this.selectedCards);
        if (onAnimationComplete) onAnimationComplete();
      }
    );
  }

  private arrangeCardsPosition(
    hand: Array<Card>,
    cardSpacing: number,
    x: number,
    y: number,
    scale?: number,
    rotation?: number,
    onAnimationComplete?: () => void
  ) {
    const spacing = cardSpacing;
    const handCardsWidth: number = hand.length * spacing;
    const handCardsXPos: number = handCardsWidth / 2 - spacing / 2;

    hand.forEach((card: Card, index: number) => {
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
        scale,
        rotation,
        onComplete: () => {
          if (onAnimationComplete) onAnimationComplete();
        },
      });
    });
  }

  private playCardArrangeAnimation(config: ICardArrangeAnimation) {
    const { target, x, y } = config;
    const scale = config.scale || this.config.cardSettings?.scale;
    const rotation = config.rotation || 0;
    const duration = config.duration || 200;
    const ease = config.ease || "linear";
    const origin =
      this.config?.cardSettings?.origin || Utils.ORIGIN.MiddleCenter;

    target.setOrigin(origin.x, origin.y);

    this.scene.add.tween({
      targets: target,
      x,
      y,
      scale,
      rotation: Phaser.Math.DegToRad(rotation),
      ease,
      duration,
      onComplete: () => {
        if (config.onComplete) config.onComplete();
      },
    });
  }

  private playCardMoveAnimation(
    card: Card,
    index: number,
    config: ICardAddRemoveAnimation
  ) {
    const { cardSpacing, isFaceUp, animationOptions } = config;
    const { x, y, scale, rotation, options, onAnimationComplete } =
      animationOptions;

    const spacing = cardSpacing || 0;

    const cardXPos =
      rotation === 90 || rotation === -90 ? x : x + spacing * index;

    const carYPos =
      rotation === 90 || rotation === -90 ? y + spacing * index : y;

    card.moveTo({
      x: cardXPos,
      y: carYPos,
      scale,
      rotation,
      options,
      onAnimationComplete: () => {
        if (isFaceUp && !card.isFaceUp) card.flip();
        if (onAnimationComplete) onAnimationComplete();
      },
    });
  }

  private makeCardSelectable(card: Card) {
    if (this.config.isMainPlayer) {
      card.on("pointerdown", () => {
        if (!card.selected()) this.toggleCardSelection(card);
      });
    }
  }

  private toggleCardSelection(card: Card) {
    let cardXPos;
    let cardYPos;

    if (this.selectedCards.includes(card)) {
      cardYPos = card.y + card.displayHeight / 2;
      Utils.removeCardFromArray(card, this.selectedCards);
    } else {
      cardYPos = card.y - card.displayHeight / 2;
      this.selectedCards.push(card);
    }
    cardXPos = card.x;

    this.selectCardAnimation(card, cardXPos, cardYPos);
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
