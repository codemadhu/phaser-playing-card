import { Card, Player } from ".";

export interface IDeckConfig {
  scene: Phaser.Scene;
  texture: string;
  suitPrefixes: {
    club: string;
    spade: string;
    diamond: string;
    heart: string;
    joker?: string;
  };
  backFaceTextureName: string;
  options?: {
    isFaceUp?: boolean;
    xSpace?: number;
    ySpace?: number;
    rotation?: number;
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

  public appendTo(scene: Phaser.Scene, x: number, y: number) {
    this.createDeck(scene, x, y);
    console.log(this._cards.length, this._cards);
  }

  public deal(config: ICardDealConfig) {
    let cardCount = 0;
    const delay = config.options?.delay || 200;
    const totalPlayers = config.players.length;
    const totalCount = config.totalCardsForEachPlayer * totalPlayers;

    const dealTimerEvent = this.scene.time.addEvent({
      delay,
      callback: () => {
        const currentPlayerIndex = cardCount % totalPlayers;
        const currentPlayer = config.players[currentPlayerIndex];
        if (cardCount === totalCount) {
          dealTimerEvent.remove();
          if (config.onDealComplete) config.onDealComplete();
        } else {
          const card = this._cards.pop();
          if (card) currentPlayer.addCard(card);
        }
        cardCount += 1;
      },
      callbackScope: this,
      loop: true,
    });
  }

  public getTopCard(): Card {
    const card: Card = this._cards[this._cards.length - 1];
    if (this._cards.length > 0) this._cards.pop();
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
    const xSpace = this.config.options?.xSpace || 0;
    const ySpace = this.config.options?.ySpace || 0;
    const rotation = this.config.options?.rotation || 0;

    Object.entries(this.config.suitPrefixes).forEach((suitPrefix) => {
      const suit = suitPrefix[0];
      const prefix = suitPrefix[1];
      const totalCardsInSuit = suit !== "joker" ? 13 : 2;

      for (let i = 0; i < totalCardsInSuit; i += 1) {
        const frontFaceTextureName = `${prefix}${i + 1}`;
        const rank = suit !== "joker" ? i + 1 : 0;

        const card = new Card({
          scene: this.config.scene,
          suit,
          rank,
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

        if (this.config.onDeckClick) {
          card.on("pointerdown", () => {
            if (this.config.onDeckClick) this.config.onDeckClick(card);
          });
        }
      }
    });

    // Shuffle and to scene
    Phaser.Utils.Array.Shuffle(this._cards);
    this._cards.forEach((card) => {
      scene.add.existing(card);
    });

    this.setCardsPosition(x, y, xSpace, ySpace, rotation);
  }

  private setCardsPosition(
    x: number,
    y: number,
    xSpace: number,
    ySpace: number,
    rotation: number
  ) {
    this._cards.forEach((card, index) => {
      card.x = x + xSpace * index;
      card.y = y + ySpace * index;
      card.rotation = Phaser.Math.DegToRad(rotation * index);
    });
  }
}
