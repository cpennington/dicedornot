export function ballPosition(ball, playerStates) {
  if ("position" in ball) {
    return ball.position;
  }
  return playerStates[ball.heldBy]?.pitchCell;
}
