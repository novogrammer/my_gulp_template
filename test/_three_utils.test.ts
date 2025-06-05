import {
  calcCameraZ,
} from '../src/assets/js/_three_utils';


describe('calcCameraZ', () => {
  test('calcCameraZ(100,90) equal 50', () => {
    expect(calcCameraZ(100, 90)).toBeCloseTo(50, 5);
  });
  test('calcCameraZ(100,60) equal (50 * Math.sqrt(3)) ', () => {
    expect(calcCameraZ(100, 60)).toBeCloseTo(50 * Math.sqrt(3), 5);
  });
});
