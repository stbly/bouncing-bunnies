export const getDistanceY = (y1, y2) => {
  return y2 - y1;
};

export const getDistanceX = (x1, x2) => {
  return x2 - x1;
};

export const getDistance = (x1, y1, x2, y2) => {
  const dx = Math.pow(getDistanceX(x1, x2), 2);
  const dy = Math.pow(getDistanceY(y1, y2), 2);
  return Math.sqrt( dx + dy );
};

export const bodyPositions = {
  TOP_LEFT: 'bodyPositions/TOP_LEFT',
  TOP_RIGHT: 'bodyPositions/TOP_RIGHT',
  BOTTOM_RIGHT: 'bodyPositions/BOTTOM_RIGHT',
  BOTTOM_LEFT: 'bodyPositions/BOTTOM_LEFT',
  LEFT: 'bodyPositions/LEFT',
  RIGHT: 'bodyPositions/RIGHT',
  TOP: 'bodyPositions/TOP',
  BOTTOM: 'bodyPositions/BOTTOM',
};


export const getBodyCoordinate = (body, position) => {
  const {x: bodyX, y: bodyY} = body.position;
  const {x: maxX, y: maxY} = body.bounds.max;
  const {x: minX, y: minY} = body.bounds.min;

  const height = maxY - minY;
  const width = maxX - minX;
  const top = bodyY - height / 2;
  const bottom = bodyY + height / 2;
  const left = bodyX - width / 2;
  const right = bodyX + width / 2;
  const centerHorz = width / 2;
  const centerVert = height / 2;

  const positions = {
    [bodyPositions.TOP_LEFT]: {x: left, y: top},
    [bodyPositions.TOP_RIGHT]: {x: right, y: top},
    [bodyPositions.BOTTOM_LEFT]: {x: left, y: bottom},
    [bodyPositions.BOTTOM_RIGHT]: {x: right, y: bottom},
    [bodyPositions.LEFT]: {x: left, y: centerVert},
    [bodyPositions.RIGHT]: {x: right, y: centerVert},
    [bodyPositions.TOP]: {x: centerHorz, y: top},
    [bodyPositions.BOTTOM]: {x: centerHorz, y: bottom},
  };

  try {
    return positions[position];
  } catch (err) {
    console.error('Could not find position ' + position);
  }
};
