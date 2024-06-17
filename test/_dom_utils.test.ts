import {
  domReady,
} from '../src/assets/js/_dom_utils';


describe('domReady', () => {
  beforeEach(() => {
    (global as any).document = {
      readyState: "loading",
      addEventListener: jest.fn(),
    };
  });
  afterEach(() => {
    (global as any).document = undefined;
  });

  test('If document.readyState is "loading", the callback waits.', () => {
    const onReady = jest.fn();

    expect(domReady(onReady)).toBeUndefined();
    expect(onReady).toHaveBeenCalledTimes(0);
    expect((global as any).document.addEventListener).toHaveBeenCalledTimes(1);
    expect((global as any).document.addEventListener.mock.calls[0][0]).toBe("DOMContentLoaded");

    expect((global as any).document.addEventListener.mock.calls[0][1]).toBe(onReady);
    (global as any).document.addEventListener.mock.calls[0][1]();

    expect(onReady).toHaveBeenCalledTimes(1);
  });
  test('If document.readyState is "interactive", the callback runs.', () => {
    const onReady = jest.fn();
    (global as any).document.readyState = "interactive";
    expect(domReady(onReady)).toBeUndefined();
    expect((global as any).document.addEventListener).toHaveBeenCalledTimes(0);
    expect(onReady).toHaveBeenCalledTimes(1);

  });
  test('If document.readyState is "complete", the callback runs.', () => {
    const onReady = jest.fn();
    (global as any).document.readyState = "complete";
    expect(domReady(onReady)).toBeUndefined();
    expect((global as any).document.addEventListener).toHaveBeenCalledTimes(0);
    expect(onReady).toHaveBeenCalledTimes(1);

  });
});
