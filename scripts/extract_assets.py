import os
from PIL import Image
import numpy as np
from collections import deque

os.makedirs('public/assets/sprites', exist_ok=True)
os.makedirs('public/assets/arenas', exist_ok=True)
os.makedirs('public/assets/portraits', exist_ok=True)
os.makedirs('public/assets/vfx', exist_ok=True)

IMG1_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735199716.png'
IMG2_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735457312.png'
IMG3_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735715538.png'

TARGET_FRAME_H = 120

def remove_bg_white(im, threshold=230):
    im = im.convert("RGBA")
    arr = np.array(im)
    is_white = (arr[:, :, 0] > threshold) & (arr[:, :, 1] > threshold) & (arr[:, :, 2] > threshold)
    arr[is_white, 3] = 0
    return Image.fromarray(arr)

def remove_bg_dark(im, threshold=35):
    im = im.convert("RGBA")
    arr = np.array(im)
    is_dark = (arr[:, :, 0] < threshold) & (arr[:, :, 1] < threshold) & (arr[:, :, 2] < threshold)
    arr[is_dark, 3] = 0
    return Image.fromarray(arr)

def floodfill_bg(im, tolerance=30):
    im = im.convert('RGBA')
    w, h = im.size
    arr = np.array(im)
    seeds = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    visited = np.zeros((h, w), dtype=bool)
    to_clear = np.zeros((h, w), dtype=bool)
    
    for sx, sy in seeds:
        seed_color = arr[sy, sx, :3].astype(float)
        # Skip if seed is dark suit/clothing or face
        if visited[sy, sx] or (seed_color[0] < 40 and seed_color[1] < 40 and seed_color[2] < 40):
            continue
        queue = deque([(sx, sy)])
        visited[sy, sx] = True
        while queue:
            x, y = queue.popleft()
            curr = arr[y, x, :3].astype(float)
            diff = np.sqrt(np.sum((curr - seed_color)**2))
            if diff <= tolerance:
                to_clear[y, x] = True
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((nx, ny))
    arr[to_clear, 3] = 0
    return Image.fromarray(arr)

def anchor_bottom(img, target_h=120):
    """Normalize sprite canvas so feet are anchored at the bottom, centered horizontally."""
    # Find bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    
    w, h = img.size
    # Scale proportionally if too tall
    if h > target_h:
        scale = target_h / h
        w = int(w * scale)
        h = target_h
        img = img.resize((w, h), Image.Resampling.NEAREST)
    
    canvas_w = max(90, w + 16)
    canvas = Image.new('RGBA', (canvas_w, target_h), (0, 0, 0, 0))
    # Paste centered horizontally, anchored to bottom
    paste_x = (canvas_w - w) // 2
    paste_y = target_h - h
    canvas.paste(img, (paste_x, paste_y), img)
    return canvas

print("1. Extracting Mama Gufron...")
im1 = Image.open(IMG1_PATH)

# IKN Stage Background
ikn_stage = im1.crop((512, 78, 1016, 248)).resize((800, 450), Image.Resampling.NEAREST)
ikn_stage.save('public/assets/arenas/ikn_palace.png')

# Portrait
gufron_port = im1.crop((518, 56, 565, 106)).resize((80, 80), Image.Resampling.NEAREST)
gufron_port.save('public/assets/portraits/gufron.png')

# Sprites with exact bounding boxes
gufron_moves = {
    'idle': (27, 45, 85, 160),
    'walk': (115, 45, 175, 160),
    'crouch': (200, 65, 260, 160),
    'jump': (300, 40, 380, 140),
    'punch': (115, 235, 195, 360),
    'kick': (305, 235, 420, 360),
    'point': (195, 235, 295, 360)
}

for name, box in gufron_moves.items():
    cropped = remove_bg_white(im1.crop(box))
    anchored = anchor_bottom(cropped, TARGET_FRAME_H)
    anchored.save(f'public/assets/sprites/gufron_{name}.png')
    print(f"Saved gufron_{name}.png")

# Babi Hutan & Rider
gufron_babi = remove_bg_white(im1.crop((685, 105, 860, 235)))
gufron_babi.save('public/assets/sprites/gufron_babi.png')

# Ant Swarm Geyser
ant_swarm = remove_bg_white(im1.crop((410, 360, 580, 480)))
ant_swarm.save('public/assets/vfx/ant_swarm.png')


print("\n2. Extracting Bahlil...")
im2 = Image.open(IMG2_PATH)

# Bahlil Portrait
bahlil_port = im2.crop((17, 18, 77, 80)).resize((80, 80), Image.Resampling.NEAREST)
bahlil_port.save('public/assets/portraits/bahlil.png')

# Bahlil Action Sprites
bahlil_moves = {
    'idle': (35, 115, 90, 225),
    'walk': (115, 115, 175, 225),
    'crouch': (255, 140, 310, 225),
    'punch': (340, 115, 410, 225),
    'kick': (35, 240, 105, 345),
    'jump': (110, 220, 180, 345),
    'ethanol_start': (490, 145, 640, 275),
    'ethanol_act': (650, 145, 820, 275),
    'oil_start': (365, 360, 455, 495)
}

for name, box in bahlil_moves.items():
    cropped = floodfill_bg(im2.crop(box), tolerance=28)
    if 'start' in name or 'act' in name:
        cropped.save(f'public/assets/sprites/bahlil_{name}.png')
    else:
        anchored = anchor_bottom(cropped, TARGET_FRAME_H)
        anchored.save(f'public/assets/sprites/bahlil_{name}.png')
    print(f"Saved bahlil_{name}.png")

# Fire impact
fire_vfx = floodfill_bg(im2.crop((825, 145, 975, 275)), tolerance=28)
fire_vfx.save('public/assets/vfx/fire_impact.png')

# Oil Geyser & Trap
oil_gey = floodfill_bg(im2.crop((490, 350, 635, 495)), tolerance=28)
oil_gey.save('public/assets/vfx/oil_geyser.png')

oil_tr = floodfill_bg(im2.crop((650, 350, 790, 495)), tolerance=28)
oil_tr.save('public/assets/vfx/oil_trap.png')


print("\n3. Extracting Wowo...")
im3 = Image.open(IMG3_PATH)

# Wowo Portrait
wowo_port = im3.crop((20, 65, 65, 110)).resize((80, 80), Image.Resampling.NEAREST)
wowo_port.save('public/assets/portraits/wowo.png')

wowo_moves = {
    'idle': (20, 65, 65, 165),
    'walk': (90, 65, 135, 165),
    'crouch': (225, 95, 275, 165),
    'punch': (300, 90, 350, 165),
    'jump': (23, 205, 75, 315),
    'kick': (85, 205, 145, 315),
    'tray_start': (505, 105, 600, 235)
}

for name, box in wowo_moves.items():
    cropped = remove_bg_dark(im3.crop(box), threshold=35)
    if 'start' in name:
        cropped.save(f'public/assets/sprites/wowo_{name}.png')
    else:
        anchored = anchor_bottom(cropped, TARGET_FRAME_H)
        anchored.save(f'public/assets/sprites/wowo_{name}.png')
    print(f"Saved wowo_{name}.png")

# Poison Tray Impact
wowo_tray = remove_bg_dark(im3.crop((615, 105, 780, 235)), threshold=35)
wowo_tray.save('public/assets/vfx/wowo_tray_impact.png')

# Megaphone Sonic Wave
wowo_sonic = remove_bg_dark(im3.crop((380, 340, 780, 495)), threshold=35)
wowo_sonic.save('public/assets/vfx/wowo_sonic_wave.png')

print("\nAll sprites extracted, cleaned, and anchored with 100% precision!")
