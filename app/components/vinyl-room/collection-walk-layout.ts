// Four pairs for the walking prototype. Replace these repeated entries with new artists later.
export const WALK_ROWS = 4;
export const WALK_SPACING = 1250;

export function collectionWalkEntries(artistIds: string[]) {
  if (!artistIds.length) return [];
  const rows = Math.max(WALK_ROWS, Math.ceil(artistIds.length / 2));
  return Array.from({ length: rows * 2 }, (_, index) => ({
    id: `box-${index}`, artistId: artistIds[index % artistIds.length], artistIndex: index % artistIds.length,
    column: index % 2, row: Math.floor(index / 2),
  }));
}

export function collectionWalkStops(width: number, rows = WALK_ROWS) {
  return width < 760 ? rows * 2 : rows;
}

export function collectionWalkArrival(row: number, column: number, width: number, rows = WALK_ROWS) {
  return (width < 760 ? row * 2 + column % 2 : row) / Math.max(1, collectionWalkStops(width, rows) - 1);
}

export function collectionWalkPose(row: number, column: number, progress: number, width: number, height: number, rows = WALK_ROWS) {
  const mobile = width < 760;
  // Narrow screens have one box at each depth, alternating sides along the path.
  const distance = ((mobile ? row * 2 + column % 2 : row)
    - Math.max(0, Math.min(1, progress)) * (collectionWalkStops(width, rows) - 1)) * WALK_SPACING
    + (!mobile && column % 2 ? -85 : 0);
  const groundAngle = Math.atan(height * .42 / 1300);
  const artWidth = Math.min(mobile ? width * .82 : width * .39, 520);
  const artHeight = artWidth * .6;
  const scale = Math.min(artWidth / 3.7, artHeight / 2.25);
  const lane = (column % 2 ? 1 : -1) * (mobile ? width * (.075 + .16 * Math.min(1, Math.max(0, distance / WALK_SPACING))) : Math.min(width * .245, 335));
  // Moving the ground toward the camera is equivalent to walking forward on it.
  const x = lane + Math.sin(row * 2.1 + column) * (mobile ? 5 : 34);
  const y = scale * .42 + distance * Math.sin(groundAngle) - height * (mobile ? .07 : .025);
  const z = -distance * Math.cos(groundAngle);
  const perspective = 1300 / Math.max(100, 1300 - z);
  return { x, y, z, scale, pitch: .38, yaw: column % 2 ? -.28 : .28, roll: column % 2 ? .025 : -.035, distance, artWidth, artHeight, perspective,
    screenX: width / 2 + x * perspective, screenY: height / 2 - y * perspective,
    visible: z < 1120 && distance < WALK_SPACING * 3.2,
  };
}
