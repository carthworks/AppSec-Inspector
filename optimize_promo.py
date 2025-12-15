"""
Optimize promotional images for Chrome Web Store
- Small promo tile: 440x280 (JPEG or 24-bit PNG, no alpha)
- Marquee promo tile: 1400x560 (JPEG or 24-bit PNG, no alpha)
"""

from PIL import Image
import os

# Configuration
INPUT_DIR = "promo"
OUTPUT_DIR = "promo/store_ready"

# Promo tile specifications
SMALL_PROMO_SIZE = (440, 280)
MARQUEE_PROMO_SIZE = (1400, 560)

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def optimize_image(input_path, output_path, target_size, image_name):
    """Optimize image to target size, 24-bit PNG (no alpha)"""
    try:
        # Open image
        img = Image.open(input_path)
        
        print(f"\nProcessing: {image_name}")
        print(f"  Original size: {img.size}")
        print(f"  Original mode: {img.mode}")
        
        # Convert RGBA to RGB (remove alpha channel)
        if img.mode == 'RGBA':
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
            print(f"  Converted RGBA to RGB")
        elif img.mode != 'RGB':
            img = img.convert('RGB')
            print(f"  Converted {img.mode} to RGB")
        
        # Calculate aspect ratio
        original_ratio = img.width / img.height
        target_ratio = target_size[0] / target_size[1]
        
        # Resize to fit within target size while maintaining aspect ratio
        if original_ratio > target_ratio:
            # Image is wider - fit to width
            new_width = target_size[0]
            new_height = int(target_size[0] / original_ratio)
        else:
            # Image is taller - fit to height
            new_height = target_size[1]
            new_width = int(target_size[1] * original_ratio)
        
        # Resize image with high-quality resampling
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create canvas with target size and white background
        canvas = Image.new('RGB', target_size, (255, 255, 255))
        
        # Center the resized image on canvas
        x_offset = (target_size[0] - new_width) // 2
        y_offset = (target_size[1] - new_height) // 2
        canvas.paste(img_resized, (x_offset, y_offset))
        
        # Save as 24-bit PNG
        canvas.save(output_path, 'PNG', optimize=True)
        
        print(f"  ✓ Saved: {output_path}")
        print(f"  Final size: {canvas.size}")
        print(f"  Mode: {canvas.mode} (24-bit RGB)")
        
        # Get file size
        file_size = os.path.getsize(output_path)
        print(f"  File size: {file_size:,} bytes ({file_size/1024:.2f} KB)")
        
        return True
        
    except Exception as e:
        print(f"  ✗ ERROR: {e}")
        return False

# Process promotional images
print("=" * 70)
print("CHROME WEB STORE PROMOTIONAL IMAGE OPTIMIZER")
print("=" * 70)

# Find small promo tile
small_promo_files = [f for f in os.listdir(INPUT_DIR) if 'small_promo' in f.lower()]
if small_promo_files:
    input_file = os.path.join(INPUT_DIR, small_promo_files[0])
    output_file = os.path.join(OUTPUT_DIR, "small_promo_tile.png")
    optimize_image(input_file, output_file, SMALL_PROMO_SIZE, "Small Promo Tile (440x280)")
else:
    print("\n⚠ No small promo tile found")

# Find marquee promo tile
marquee_files = [f for f in os.listdir(INPUT_DIR) if 'marquee' in f.lower()]
if marquee_files:
    input_file = os.path.join(INPUT_DIR, marquee_files[0])
    output_file = os.path.join(OUTPUT_DIR, "marquee_promo_tile.png")
    optimize_image(input_file, output_file, MARQUEE_PROMO_SIZE, "Marquee Promo Tile (1400x560)")
else:
    print("\n⚠ No marquee promo tile found")

print("\n" + "=" * 70)
print("✅ OPTIMIZATION COMPLETE!")
print("=" * 70)
print(f"📁 Output folder: {OUTPUT_DIR}")
print(f"📐 Small promo tile: {SMALL_PROMO_SIZE[0]}x{SMALL_PROMO_SIZE[1]} pixels")
print(f"📐 Marquee promo tile: {MARQUEE_PROMO_SIZE[0]}x{MARQUEE_PROMO_SIZE[1]} pixels")
print(f"🎨 Format: 24-bit PNG (no alpha)")
print("=" * 70)
