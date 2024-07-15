import { DIALOG_DATA, SCALE_FACTOR } from "./constants";
import { k } from "./kaplay";
import { Map } from "./types";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "/assets/spritesheet.png", {
  sliceX: 48,
  sliceY: 9,
  anims: {
    "idle-down": { from: 66, to: 71, loop: true, speed: 8 },
    "walk-down": { from: 114, to: 119, loop: true, speed: 8 },
    "idle-side": { from: 48, to: 53, loop: true, speed: 8 },
    "walk-side": { from: 96, to: 101, loop: true, speed: 8 },
    "idle-up": { from: 54, to: 59, loop: true, speed: 8 },
    "walk-up": { from: 102, to: 107, loop: true, speed: 8 },
  },
});

k.loadSprite("map", "/assets/map.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
  const mapData: Map = await (await fetch("/assets/map.json")).json();
  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(0), k.scale(SCALE_FACTOR)]);

  const player = k.make([
    k.sprite("spritesheet", {
      anim: "idle-down",
    }),
    k.area({
      shape: new k.Rect(k.vec2(0, 8), 10, 13),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(SCALE_FACTOR),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects!) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue(
              DIALOG_DATA[boundary.name as keyof typeof DIALOG_DATA],
              () => (player.isInDialogue = false),
            );
          });
        }
      }
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects!) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x = entity.x) * SCALE_FACTOR * 1.3,
            (map.pos.y = entity.y) * SCALE_FACTOR * 1.2,
          );
          k.add(player);
        }
      }
    }
  }

  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y + 100);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.getCurAnim().name !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.getCurAnim().name !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.getCurAnim().name !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.getCurAnim().name !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });

  k.onMouseRelease(() => {
    switch (player.direction) {
      case "up":
        player.play("idle-up");
        break;
      case "down":
        player.play("idle-down");
        break;
      default:
        player.play("idle-side");
        break;
    }
  });
});

k.go("main");
