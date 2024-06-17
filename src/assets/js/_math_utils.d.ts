export declare function degToRad(deg: number): number;
export declare function random(min?: number, max?: number): number;
export declare function clamp(value: number, min: number, max: number): number;
export declare function map(
  inputValue: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  doClamp?: boolean
): number;

interface Point {
  x: number;
  y: number;
}
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export declare function getCenterOfRect(rect: Rect): Point;

export declare function scaledRect(
  rectOriginal: Rect,
  rectTarget: Rect,
  targetRatio: number
): Rect;
export declare function coverRectRatio(
  rectOriginal: Rect,
  rectTarget: Rect
): number;

export declare function coverRect(rectOriginal: Rect, rectTarget: Rect): Rect;

export declare function containRectRatio(
  rectOriginal: Rect,
  rectTarget: Rect
): number;

export declare function containRect(rectOriginal: Rect, rectTarget: Rect): Rect;

export declare function range(start: number, stop?: number): Array<number>;
