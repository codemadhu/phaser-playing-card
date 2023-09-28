import "phaser";

export interface CardConfig {
  scene: Phaser.Scene;
  suit: string;
  rank: number;
  texture: string;
  isFaceUp?: boolean;
  options?: {
    flipSpeed?: number;
    flipZoom?: number;
  };
}

export class Card extends Phaser.GameObjects.Container {
  private isFaceUp: boolean;
  private isFlipping: boolean;
  private flipAnimationTimeline: Phaser.Time.Timeline;

  constructor(private config: CardConfig) {
    super(config.scene, 0, 0);

    this.isFaceUp = this.config.isFaceUp || false;
    this.isFlipping = false;

    this.createCard();
    this.flipAnimationTimeline = this.createFlipAnimationTimeline();
  }

  public flip() {
    if (!this.isFlipping) this.flipAnimationTimeline.play();
  }

  private createFlipAnimationTimeline(): Phaser.Time.Timeline {
    const totalTween = 4;
    const flipSpeed = this.config.options?.flipSpeed || 500;
    const duration = flipSpeed / totalTween;
    const sprite = this.getAt(0) as Phaser.GameObjects.Sprite;

    return this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: sprite,
          scale: 1.2,
          duration,
          onStart: () => {
            this.isFlipping = true;
          },
        },
      },
      {
        at: duration,
        tween: {
          targets: sprite,
          scaleX: 0,
          duration,
          onComplete: () => {
            const name = this.isFaceUp
              ? "back-red"
              : `${this.config.suit}${this.config.rank}`;
            sprite.setTexture(this.config.texture, name);
          },
        },
      },
      {
        at: duration * 2,
        tween: {
          targets: sprite,
          scale: 1.1,
          duration,
        },
      },
      {
        at: duration * 3,
        tween: {
          targets: sprite,
          scale: 1,
          duration: duration / 4,
          onComplete: () => {
            this.isFlipping = false;
            this.isFaceUp = !this.isFaceUp;
          },
        },
      },
    ]);
  }

  private createCard() {
    const name = this.isFaceUp
      ? `${this.config.suit}${this.config.rank}`
      : "back-red";

    const card = new Phaser.GameObjects.Sprite(
      this.scene,
      0,
      0,
      this.config.texture,
      name
    );

    this.add(card);

    const { width, height } = card;
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );
  }
}
