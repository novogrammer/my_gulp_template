
export function calcCameraZ(height: number, fovDeg: number): number {
  const DEG2RAD = Math.PI / 180;
  const cameraZ = (height / 2) / Math.tan((fovDeg / 2) * DEG2RAD);
  return cameraZ;
}