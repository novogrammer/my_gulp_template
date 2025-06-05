import {
  zeroPadding,
} from '../src/assets/js/_string_utils';


describe('zeroPadding', () => {
  beforeEach(() => {
    (global.console as any).warn = jest.fn();
  });
  afterEach(() => {
    (console.warn as any).mockRestore();
  });

  test('zeroPadding(123,4) equal "0123"', () => {
    expect(zeroPadding(123, 4)).toBe("0123");
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
  test('zeroPadding(123,3) equal "123"', () => {
    expect(zeroPadding(123, 3)).toBe("123");
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
  test('zeroPadding(123,2) equal "123"', () => {
    expect(zeroPadding(123, 2)).toBe("123");
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
  test('zeroPadding(-1,2) throws', () => {
    expect(() => zeroPadding(-1, 2)).toThrow();
  });
  test('zeroPadding(1.5,2) throws', () => {
    expect(() => zeroPadding(1.5, 2)).toThrow();
  });
});
