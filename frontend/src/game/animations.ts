export enum DefaultAnimations {
  Floating = "floatingTween",
}

export function getFloatingTween(
  tweenManager: Phaser.Tweens.TweenManager,
  object: Phaser.Physics.Arcade.Image
) {
  const tweenConfig = {
    targets: object,
    y: object.y - 8,
    duration: 1200,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  };

  return tweenManager.add(tweenConfig);
}

// #TODO find a better type for the targets
export function getFadeTween(
  tweenManager: Phaser.Tweens.TweenManager,
  targets: unknown
) {
  const tweenConfig = {
    targets: targets,
    alpha: 1,
    duration: 1500,
    ease: "Power2.easeOut",
    delay: 500,
  };

  return tweenManager.add(tweenConfig);
}
