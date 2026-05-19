"""
Generate the Glixyswarm app icon (1024x1024 PNG).
Original design by Glixy Labs — dark rounded square with an orange
coordinator node and four satellites connected by soft edges.
"""

import math
from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
OUT = "glixyswarm-app/assets/glixyswarm-1024.png"

INK = (26, 20, 16, 255)        # ink-100
ORANGE = (255, 106, 31, 255)   # accent-orange
PEACH = (255, 138, 61, 255)    # accent-peach
LIGHT = (255, 179, 122, 255)   # accent-light
CREAM = (255, 222, 184, 255)
WHITE = (255, 255, 255, 255)


def rounded_rect_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def vertical_gradient(size, top, bottom):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        c = lerp(top, bottom, t)
        for x in range(size):
            px[x, y] = c
    return img


def radial_glow(size, color, center, radius):
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = glow.load()
    cx, cy = center
    for y in range(size):
        for x in range(size):
            dx, dy = x - cx, y - cy
            d = math.sqrt(dx * dx + dy * dy)
            if d >= radius:
                continue
            t = 1 - (d / radius)
            t = t * t  # softer falloff
            r, g, b, a = color
            px[x, y] = (r, g, b, int(a * t))
    return glow


def draw_node(draw, cx, cy, r, fill, ring=None, ring_width=8):
    bbox = (cx - r, cy - r, cx + r, cy + r)
    if ring:
        draw.ellipse(bbox, fill=ring)
        inner = (cx - r + ring_width, cy - r + ring_width,
                 cx + r - ring_width, cy + r - ring_width)
        draw.ellipse(inner, fill=fill)
    else:
        draw.ellipse(bbox, fill=fill)


def main():
    base = vertical_gradient(SIZE, (15, 11, 8, 255), INK)

    # Soft warm glow from top-right
    glow = radial_glow(SIZE, (255, 138, 61, 110),
                       center=(int(SIZE * 0.72), int(SIZE * 0.28)),
                       radius=int(SIZE * 0.6))
    base = Image.alpha_composite(base, glow)

    canvas = base.copy()
    draw = ImageDraw.Draw(canvas, "RGBA")

    cx, cy = SIZE // 2, SIZE // 2
    r_orbit = int(SIZE * 0.32)

    # 5 satellite nodes around the coordinator
    satellites = []
    for i, color in enumerate([ORANGE, PEACH, LIGHT, CREAM, PEACH]):
        angle = math.radians(-90 + i * (360 / 5))
        nx = int(cx + r_orbit * math.cos(angle))
        ny = int(cy + r_orbit * math.sin(angle))
        satellites.append((nx, ny, color))

    # Edges first (so they sit under nodes)
    for nx, ny, color in satellites:
        draw.line((cx, cy, nx, ny), fill=(255, 255, 255, 38), width=10)
        # Brighter accent stroke on top of the soft edge
        draw.line((cx, cy, nx, ny), fill=(*color[:3], 95), width=4)

    # Coordinator halo (soft)
    halo = radial_glow(SIZE, (255, 106, 31, 180),
                       center=(cx, cy), radius=int(SIZE * 0.30))
    canvas = Image.alpha_composite(canvas, halo)
    draw = ImageDraw.Draw(canvas, "RGBA")

    # Re-draw edges + nodes on top of the halo layer for crisp edges
    for nx, ny, color in satellites:
        draw.line((cx, cy, nx, ny), fill=(*color[:3], 90), width=4)

    # Satellite nodes
    for nx, ny, color in satellites:
        draw_node(draw, nx, ny, r=int(SIZE * 0.07), fill=color,
                  ring=(255, 255, 255, 40), ring_width=10)

    # Coordinator (large center node, two-tone)
    r_coord = int(SIZE * 0.115)
    draw_node(draw, cx, cy, r=r_coord, fill=ORANGE,
              ring=(255, 255, 255, 55), ring_width=14)
    # Inner highlight
    draw.ellipse(
        (cx - r_coord + 28, cy - r_coord + 24,
         cx + r_coord - 28, cy + r_coord - 56),
        fill=(255, 200, 160, 80),
    )

    # Subtle inner shadow at edges so the round-rect feels lit
    inner = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(inner).rectangle((0, 0, SIZE, SIZE), outline=(0, 0, 0, 160), width=12)
    inner = inner.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, inner)

    # Rounded corner mask (~22% radius like macOS app icons)
    mask = rounded_rect_mask(SIZE, radius=int(SIZE * 0.22))
    final = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    final.paste(canvas, (0, 0), mask)

    final.save(OUT, "PNG")
    print(f"Wrote {OUT} ({SIZE}x{SIZE})")


if __name__ == "__main__":
    main()
