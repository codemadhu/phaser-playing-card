import { Card } from ".";

export class Utils {
  public static removeCardFromArray(card: Card, array: Array<Card>) {
    const index = array.indexOf(card);
    array.splice(index, 1);
  }

  public static ORIGIN = {
    TopLeft: {
      x: 0,
      y: 0,
    },
    TopCenter: {
      x: 0.5,
      y: 0,
    },
    TopRight: {
      x: 1,
      y: 0,
    },
    MiddleLeft: {
      x: 0,
      y: 0.5,
    },
    MiddleCenter: {
      x: 0.5,
      y: 0.5,
    },
    MiddleRight: {
      x: 1,
      y: 0.5,
    },
    BottomLeft: {
      x: 0,
      y: 1,
    },
    BottomCenter: {
      x: 0.5,
      y: 1,
    },
    BottomRight: {
      x: 1,
      y: 1,
    },
  };
}
