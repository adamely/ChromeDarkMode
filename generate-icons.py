"""
Generates dark-mode-toggle extension icons as PNG files.
Pure Python — no external dependencies.
Renders a crescent moon on a dark background.
"""
import zlib
import struct
import os


def make_chunk(chunk_type: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(chunk_type + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)


def encode_png(width: int, height: int, pixels: list) -> bytes:
    """pixels: flat list of (R, G, B, A) tuples, row-major order."""
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr = make_chunk(b"IHDR", ihdr_data)

    raw = bytearray()
    for row in range(height):
        raw.append(0)  # filter type: None
        for col in range(width):
            r, g, b, a = pixels[row * width + col]
            raw.extend([r, g, b, a])

    idat = make_chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    iend = make_chunk(b"IEND", b"")
    return sig + ihdr + idat + iend


def create_moon_icon(size: int) -> bytes:
    cx, cy = size / 2.0, size / 2.0
    r_outer = size * 0.38
    r_inner = size * 0.27
    offset_x = size * 0.13

    BG   = (26,  27,  38,  255)   # dark navy background
    MOON = (224, 175, 104, 255)   # warm gold crescent

    pixels = []
    for y in range(size):
        for x in range(size):
            dx_o = x - cx
            dy_o = y - cy
            in_outer = dx_o ** 2 + dy_o ** 2 <= r_outer ** 2

            dx_i = x - (cx + offset_x)
            dy_i = y - cy
            in_inner = dx_i ** 2 + dy_i ** 2 <= r_inner ** 2

            pixels.append(MOON if (in_outer and not in_inner) else BG)

    return encode_png(size, size, pixels)


os.makedirs("icons", exist_ok=True)

for size in [16, 48, 128]:
    data = create_moon_icon(size)
    path = f"icons/icon{size}.png"
    with open(path, "wb") as f:
        f.write(data)
    print(f"  {path}  ({len(data)} bytes)")

print("Done.")
