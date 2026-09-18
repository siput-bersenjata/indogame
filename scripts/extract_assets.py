import os
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('public/assets/sprites', exist_ok=True)
os.makedirs('public/assets/arenas', exist_ok=True)
os.makedirs('public/assets/portraits', exist_ok=True)
os.makedirs('public/assets/vfx', exist_ok=True)

IMG1_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735199716.png'
IMG2_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735457312.png'
IMG3_PATH = r'C:\Users\bram\.gemini\antigravity-ide\brain\94aefae2-adda-4513-b9a3-e85b8a2e7d72\.user_uploaded\media_1789735715538.png'

def make_transparent(im, bg_color=(255, 255, 255), tolerance=35):
    im = im.convert("RGBA")
    datas = im.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        if a < 10:
            new_data.append((r, g, b, 0))
        elif abs(r - bg_color[0]) <= tolerance and abs(g - bg_color[1]) <= tolerance and abs(b - bg_color[2]) <= tolerance:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
    im.putdata(new_data)
    return im

print("Processing Mama Gufron assets...")
im1 = Image.open(IMG1_PATH).convert("RGBA")

# Extract IKN Stage from top-right gameplay box in img1
# Coordinates: x: 512, y: 78, w: 504, h: 170 (below health bar)
ikn_stage = im1.crop((512, 78, 1016, 248))
# Resize cleanly to 800x450 for stage background
ikn_stage = ikn_stage.resize((800, 450), Image.Resampling.NEAREST)
ikn_stage.save('public/assets/arenas/ikn_palace.png')
print("Saved arena: public/assets/arenas/ikn_palace.png")

# Mama Gufron Portrait (top-left health bar box)
gufron_portrait = im1.crop((518, 56, 565, 106))
gufron_portrait = gufron_portrait.resize((80, 80), Image.Resampling.NEAREST)
gufron_portrait.save('public/assets/portraits/gufron.png')
print("Saved portrait: public/assets/portraits/gufron.png")

# Mama Gufron Sprites from sprite sheet (x: 0-480, y: 30-480)
# Let's extract key poses
gufron_idle = make_transparent(im1.crop((23, 65, 87, 175)))
gufron_idle.save('public/assets/sprites/gufron_idle.png')

gufron_walk = make_transparent(im1.crop((113, 65, 170, 175)))
gufron_walk.save('public/assets/sprites/gufron_walk.png')

gufron_crouch = make_transparent(im1.crop((197, 85, 260, 175)))
gufron_crouch.save('public/assets/sprites/gufron_crouch.png')

gufron_jump = make_transparent(im1.crop((295, 50, 375, 150)))
gufron_jump.save('public/assets/sprites/gufron_jump.png')

gufron_punch = make_transparent(im1.crop((114, 275, 185, 365)))
gufron_punch.save('public/assets/sprites/gufron_punch.png')

gufron_kick = make_transparent(im1.crop((300, 275, 385, 365)))
gufron_kick.save('public/assets/sprites/gufron_kick.png')

gufron_point = make_transparent(im1.crop((205, 275, 285, 365)))
gufron_point.save('public/assets/sprites/gufron_point.png')

# Mama Gufron Babi Hutan Move (from bottom left or top right)
# Top-right has Mama Gufron riding Babi Hutan
gufron_babi = make_transparent(im1.crop((186, 715 if im1.size[1]>700 else 430, 345, 840 if im1.size[1]>700 else 545))) if im1.size[1]>560 else None
# Extract Babi Hutan from bottom-left or top-right
# In top-right: (690, 110, 840, 235)
babi_stage = im1.crop((700, 110, 840, 230))
# Also in bottom-left Babi Hutan Charge area: (185, 430, 345, 545)
babi_sub = make_transparent(im1.crop((185, 430, 345, 545)))
babi_sub.save('public/assets/sprites/gufron_babi.png')
print("Saved gufron_babi.png")

# Ant Swarm Eruption from bottom right (x: 230 to 520, y: 340 to 540)
ant_geyser = im1.crop((230, 340, 520, 520))
ant_geyser.save('public/assets/vfx/ant_swarm.png')
print("Saved ant_swarm.png")


print("Processing Bahlil assets...")
im2 = Image.open(IMG2_PATH).convert("RGBA")

# Bahlil Portrait (top left)
bahlil_portrait = im2.crop((17, 18, 77, 80))
bahlil_portrait = bahlil_portrait.resize((80, 80), Image.Resampling.NEAREST)
bahlil_portrait.save('public/assets/portraits/bahlil.png')

# Bahlil Sprites from top left sprite sheet
bahlil_idle = make_transparent(im2.crop((34, 210, 83, 310)), (135, 145, 160), tolerance=40)
bahlil_idle.save('public/assets/sprites/bahlil_idle.png')

bahlil_walk = make_transparent(im2.crop((113, 210, 163, 310)), (135, 145, 160), tolerance=40)
bahlil_walk.save('public/assets/sprites/bahlil_walk.png')

bahlil_crouch = make_transparent(im2.crop((256, 250, 305, 312)), (135, 145, 160), tolerance=40)
bahlil_crouch.save('public/assets/sprites/bahlil_crouch.png')

bahlil_punch = make_transparent(im2.crop((340, 210, 400, 310)), (135, 145, 160), tolerance=40)
bahlil_punch.save('public/assets/sprites/bahlil_punch.png')

bahlil_kick = make_transparent(im2.crop((38, 445, 100, 535)), (135, 145, 160), tolerance=40)
bahlil_kick.save('public/assets/sprites/bahlil_kick.png')

bahlil_jump = make_transparent(im2.crop((110, 440, 175, 535)), (135, 145, 160), tolerance=40)
bahlil_jump.save('public/assets/sprites/bahlil_jump.png')

# Hot Ethanol Splash (startup & action)
bahlil_ethanol_startup = make_transparent(im2.crop((495, 275, 630, 465)), (135, 145, 160), tolerance=40)
bahlil_ethanol_startup.save('public/assets/sprites/bahlil_ethanol_startup.png')

bahlil_ethanol_action = make_transparent(im2.crop((655, 290, 810, 475)), (135, 145, 160), tolerance=40)
bahlil_ethanol_action.save('public/assets/sprites/bahlil_ethanol_action.png')

# Fire impact
fire_impact = make_transparent(im2.crop((825, 275, 965, 465)), (135, 145, 160), tolerance=40)
fire_impact.save('public/assets/vfx/fire_impact.png')

# Crude Oil Geyser (Action & Impact)
oil_startup = make_transparent(im2.crop((365, 680 if im2.size[1]>700 else 440, 445, 800 if im2.size[1]>700 else 545)), (135, 145, 160), tolerance=40)
oil_startup.save('public/assets/sprites/bahlil_oil_startup.png')

oil_geyser = make_transparent(im2.crop((500, 650 if im2.size[1]>700 else 420, 635, 800 if im2.size[1]>700 else 545)), (135, 145, 160), tolerance=40)
oil_geyser.save('public/assets/vfx/oil_geyser.png')

oil_trap = make_transparent(im2.crop((660, 650 if im2.size[1]>700 else 420, 790, 800 if im2.size[1]>700 else 545)), (135, 145, 160), tolerance=40)
oil_trap.save('public/assets/vfx/oil_trap.png')


print("Processing Wowo assets...")
im3 = Image.open(IMG3_PATH).convert("RGBA")

# Wowo Portrait (from idle face)
wowo_portrait = im3.crop((23, 140, 68, 195))
wowo_portrait = wowo_portrait.resize((80, 80), Image.Resampling.NEAREST)
wowo_portrait.save('public/assets/portraits/wowo.png')

# Wowo Sprites
wowo_idle = make_transparent(im3.crop((21, 140, 72, 245)), (25, 25, 30), tolerance=30)
wowo_idle.save('public/assets/sprites/wowo_idle.png')

wowo_walk = make_transparent(im3.crop((92, 140, 145, 245)), (25, 25, 30), tolerance=30)
wowo_walk.save('public/assets/sprites/wowo_walk.png')

wowo_crouch = make_transparent(im3.crop((232, 175, 282, 245)), (25, 25, 30), tolerance=30)
wowo_crouch.save('public/assets/sprites/wowo_crouch.png')

wowo_punch = make_transparent(im3.crop((306, 170, 350, 245)), (25, 25, 30), tolerance=30)
wowo_punch.save('public/assets/sprites/wowo_punch.png')

wowo_jump = make_transparent(im3.crop((27, 355, 78, 445)), (25, 25, 30), tolerance=30)
wowo_jump.save('public/assets/sprites/wowo_jump.png')

wowo_kick = make_transparent(im3.crop((92, 355, 145, 445)), (25, 25, 30), tolerance=30)
wowo_kick.save('public/assets/sprites/wowo_kick.png')

# Wowo Poison Food Tray
wowo_tray_startup = make_transparent(im3.crop((508, 220, 615, 370)), (25, 25, 30), tolerance=30)
wowo_tray_startup.save('public/assets/sprites/wowo_tray_startup.png')

wowo_tray_impact = make_transparent(im3.crop((618, 220, 810, 390)), (25, 25, 30), tolerance=30)
wowo_tray_impact.save('public/assets/vfx/wowo_tray_impact.png')

# Wowo Megaphone "HIDUP JOKOWI"
wowo_megaphone = make_transparent(im3.crop((116, 680 if im3.size[1]>700 else 680, 245, 815 if im3.size[1]>700 else 815) if im3.size[1]>600 else (116, 680, 245, 815)), (25, 25, 30), tolerance=30) if im3.size[1]>600 else None
# Let's inspect bottom part of im3:
# Bottom coordinates: y from 350 to 500
wowo_shout = make_transparent(im3.crop((320, 690 if im3.size[1]>600 else 350, 800, 830 if im3.size[1]>600 else 500)), (25, 25, 30), tolerance=30)
wowo_shout.save('public/assets/vfx/wowo_sonic_wave.png')

print("Generating Forest Fire and Palm Oil Plantation Arenas...")
# Arena 2: Kebakaran Hutan (Forest Peatland Fire)
# Create 800x450 pixel art canvas
fire_stage = Image.new("RGBA", (800, 450), (35, 12, 10, 255))
draw = ImageDraw.Draw(fire_stage)

# Sky gradient: dark smoky purple-red to flaming orange
for y in range(250):
    r = int(50 + (220 - 50) * (y / 250))
    g = int(15 + (90 - 15) * (y / 250))
    b = int(15 + (20 - 15) * (y / 250))
    draw.line([(0, y), (800, y)], fill=(r, g, b, 255))

# Distant burning forest ridge
import random
random.seed(42)
for x in range(0, 800, 4):
    tree_h = int(180 + random.randint(-15, 25))
    draw.line([(x, tree_h), (x, 280)], fill=(40, 15, 10, 255), width=3)
    # Ember glows
    if random.random() < 0.25:
        draw.point((x, tree_h - random.randint(5, 40)), fill=(255, random.randint(120, 200), 20, 220))

# Midground burning peat logs & charred tree trunks
for x in range(0, 800, 35):
    trunk_x = x + random.randint(-5, 5)
    trunk_w = random.randint(12, 22)
    trunk_top = random.randint(110, 180)
    draw.rectangle([trunk_x, trunk_top, trunk_x + trunk_w, 330], fill=(22, 10, 8, 255))
    # Flames licking the trunk
    draw.polygon([(trunk_x, 300), (trunk_x + trunk_w//2, 260 + random.randint(-10, 10)), (trunk_x + trunk_w, 300)], fill=(255, 140, 0, 200))
    draw.polygon([(trunk_x+2, 295), (trunk_x + trunk_w//2, 275), (trunk_x + trunk_w-2, 295)], fill=(255, 230, 50, 230))

# Ground: Charred smoldering black/red soil
for y in range(300, 450):
    factor = (y - 300) / 150
    gr_r = int(45 - 25 * factor)
    gr_g = int(22 - 12 * factor)
    gr_b = int(15 - 8 * factor)
    draw.line([(0, y), (800, y)], fill=(gr_r, gr_g, gr_b, 255))
    # Glowing cracks in peat ground
    for x in range(0, 800, 20):
        if random.random() < 0.15:
            draw.line([(x, y), (x + random.randint(5, 15), y + 1)], fill=(255, 80, 20, 180))

fire_stage.save('public/assets/arenas/forest_fire.png')
print("Saved arena: public/assets/arenas/forest_fire.png")


# Arena 3: Tengah Hutan Kebun Sawit (Palm Oil Plantation)
palm_stage = Image.new("RGBA", (800, 450), (60, 130, 180, 255))
draw_p = ImageDraw.Draw(palm_stage)

# Tropical clear humid sky gradient
for y in range(200):
    r = int(120 + (190 - 120) * (y / 200))
    g = int(180 + (225 - 180) * (y / 200))
    b = int(230 + (245 - 230) * (y / 200))
    draw_p.line([(0, y), (800, y)], fill=(r, g, b, 255))

# White tropical cumulus clouds
for cx, cy, rad in [(150, 60, 45), (200, 50, 60), (250, 65, 40), (550, 80, 50), (620, 70, 65), (690, 85, 45)]:
    draw_p.ellipse([cx-rad, cy-rad//2, cx+rad, cy+rad//2], fill=(255, 255, 255, 210))

# Distant rows of palm canopy (deep emerald green)
for x in range(-50, 850, 60):
    for i in range(-5, 6):
        draw_p.arc([x-60, 130, x+60, 240], start=180, end=360, fill=(25, 75, 30, 255), width=4)

# Midground rows of thick Oil Palm Trees (Kelapa Sawit) with fronds & red fruit bunches
for x in range(20, 820, 110):
    px = x + random.randint(-8, 8)
    # Palm trunk with ringed bark texture
    draw_p.rectangle([px-14, 180, px+14, 340], fill=(70, 50, 35, 255))
    for ty in range(190, 340, 12):
        draw_p.line([(px-13, ty), (px+13, ty)], fill=(95, 70, 48, 255), width=2)
    # Red-Orange Palm Fruit Bunches (Tandan Buah Segar Sawit) at trunk crown
    draw_p.ellipse([px-16, 185, px-2, 215], fill=(220, 70, 15, 255))
    draw_p.ellipse([px+2, 185, px+16, 215], fill=(200, 50, 10, 255))
    # Giant palm fronds radiating outwards
    for angle_offset in [-60, -40, -20, 0, 20, 40, 60]:
        frond_end_x = px + int(angle_offset * 1.8)
        frond_end_y = 120 + abs(angle_offset) // 2
        draw_p.line([(px, 185), (frond_end_x, frond_end_y)], fill=(34, 115, 40, 255), width=4)
        # Palm leaflets
        for frac in [0.3, 0.5, 0.7, 0.9]:
            lx = int(px + (frond_end_x - px) * frac)
            ly = int(185 + (frond_end_y - 185) * frac)
            draw_p.line([(lx, ly), (lx + random.randint(-12, 12), ly + random.randint(10, 22))], fill=(45, 145, 55, 255), width=2)

# Foreground: Plantation dirt tractor track with reddish-brown tropical laterite soil and weeds
for y in range(320, 450):
    factor = (y - 320) / 130
    sr = int(140 - 30 * factor)
    sg = int(90 - 25 * factor)
    sb = int(45 - 15 * factor)
    draw_p.line([(0, y), (800, y)], fill=(sr, sg, sb, 255))

# Wheel ruts on plantation road
draw_p.line([(80, 330), (0, 450)], fill=(100, 65, 30, 255), width=8)
draw_p.line([(720, 330), (800, 450)], fill=(100, 65, 30, 255), width=8)

palm_stage.save('public/assets/arenas/palm_oil.png')
print("Saved arena: public/assets/arenas/palm_oil.png")

print("All asset extraction and stage generation complete!")
