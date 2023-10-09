import { Card, Player, POSITIONS } from ".";

export interface IDeckConfig {
  scene: Phaser.Scene;
  texture: string;
  suitInitials: Array<string>;
  backFaceTextureName: string;
  options?: {
    isFaceUp?: boolean;
    xOffset?: number;
    yOffset?: number;
    rotation?: number;
    flipSpeed?: number;
    flipZoom?: number;
    allowJoker?: boolean;
  };
  onDeckClick?: (card: Card) => void;
  onCardFlipAnimationComplete?: (card: Card) => void;
}

export interface ICardDealConfig {
  totalCardsForEachPlayer: number;
  players: Array<Player>;
  options?: {
    delay?: number;
    ease?: string;
  };
  onDealComplete?: () => void;
}

export class Deck extends Phaser.GameObjects.GameObject {
  private _cards: Array<Card>;

  constructor(private config: IDeckConfig) {
    super(config.scene, "playing-card-deck");
    this._cards = [];
  }

  public addTo(scene: Phaser.Scene, x: number, y: number) {
    this.createDeck(scene, x, y);
  }

  public deal(config: ICardDealConfig) {
    let cardCount = 0;
    const delay = config.options?.delay || 200;
    const totalPlayers = config.players.length;
    const totalCount = config.totalCardsForEachPlayer * totalPlayers;

    const dealEvent = this.scene.time.addEvent({
      delay,
      callback: () => {
        cardCount += 1;
        const currentPlayerIndex = cardCount % totalPlayers;
        const currentPlayer = config.players[currentPlayerIndex];

        this.dealSingleCardTo({
          player: currentPlayer,
          onAnimationComplete: () => {
            if (cardCount === totalCount) {
              if (
                currentPlayer.hand.length === config.totalCardsForEachPlayer
              ) {
                currentPlayer.arrangeCardsPosition();
              }
              dealEvent.remove(false);
            }
          },
        });
      },
      callbackScope: this,
      loop: true,
    });
  }

  public dealSingleCardTo(config: {
    player: Player;
    options?: { duration?: number; ease?: string };
    onAnimationComplete?: () => void;
  }) {
    const { x, y, position } = config.player.getProperties();
    const { options } = config;
    const rotation =
      position === POSITIONS.Bottom || position === POSITIONS.Top ? 0 : 90;

    if (this._cards.length > 0) {
      const card = this._cards.pop();
      if (card) {
        card.moveTo({
          x,
          y,
          rotation,
          options,
          onAnimationComplete: () => {
            config.player.addCard(card);
            if (config.onAnimationComplete) config.onAnimationComplete();
          },
        });
      }
    }
  }

  public getTopCard(): Card {
    const card: Card = this._cards[this._cards.length - 1];
    return card;
  }

  public isTopCard(card: Card): boolean {
    const topCard = this._cards[this._cards.length - 1].getProperties().name;
    if (card.getProperties().name === topCard) {
      return true;
    } else {
      return false;
    }
  }

  public setScale(x: number, y: number) {
    this._cards.forEach((card) => {
      card.setScale(x, y);
    });
  }

  public setOrigin(origin: { x: number; y: number }) {
    this._cards.forEach((card) => {
      card.setOrigin(origin.x, origin.y);
    });
  }

  private createDeck(scene: Phaser.Scene, x: number, y: number) {
    const totalCardsInSuit = 13;
    const xOffset = this.config.options?.xOffset || 0;
    const yOffset = this.config.options?.yOffset || 0;
    const rotation = this.config.options?.rotation || 0;

    this.config.suitInitials.forEach((suit) => {
      for (let i = 0; i < totalCardsInSuit; i += 1) {
        const frontFaceTextureName = `${suit}${i + 1}`;
        const card = new Card({
          scene: this.config.scene,
          suit,
          rank: i + 1,
          graphics: {
            texture: this.config.texture,
            frontFaceTextureName,
            backFaceTextureName: this.config.backFaceTextureName,
          },
          isFaceUp: this.config?.options?.isFaceUp || false,
          animationOptions: {
            onFlipAnimationComplete: (card) => {
              if (this.config.onCardFlipAnimationComplete)
                this.config.onCardFlipAnimationComplete(card);
            },
          },
        });

        this._cards.push(card);
        scene.add.existing(card);

        if (this.config.onDeckClick) {
          card.on("pointerdown", () => {
            if (this.config.onDeckClick) this.config.onDeckClick(card);
          });
        }
      }
    });
    this.setCardsPosition(x, y, xOffset, yOffset, rotation);
  }

  private setCardsPosition(
    x: number,
    y: number,
    xOffset: number,
    yOffset: number,
    rotation: number
  ) {
    this._cards.forEach((card, index) => {
      card.x = x + xOffset * index;
      card.y = y + yOffset * index;
      card.rotation = Phaser.Math.DegToRad(rotation * index);
    });
  }
}
