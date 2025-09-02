#!/usr/bin/env python3
"""
Create sample images for testing the annotation system
"""

import numpy as np
from PIL import Image, ImageDraw
import os

def create_sample_images():
    """Create a set of sample images for testing"""
    
    # Create images directory if it doesn't exist
    os.makedirs('images', exist_ok=True)
    
    # Sample image configurations
    configs = [
        {"name": "sample_1.png", "color": (100, 150, 200), "shape": "circle"},
        {"name": "sample_2.png", "color": (150, 100, 200), "shape": "rectangle"},
        {"name": "sample_3.png", "color": (200, 150, 100), "shape": "triangle"},
        {"name": "sample_4.png", "color": (120, 180, 150), "shape": "circle"},
        {"name": "sample_5.png", "color": (180, 120, 150), "shape": "rectangle"},
    ]
    
    for config in configs:
        # Create a 400x300 image
        img = Image.new('RGB', (400, 300), color=(240, 240, 240))
        draw = ImageDraw.Draw(img)
        
        # Add some background patterns
        for i in range(0, 400, 20):
            draw.line([(i, 0), (i, 300)], fill=(220, 220, 220), width=1)
        for i in range(0, 300, 20):
            draw.line([(0, i), (400, i)], fill=(220, 220, 220), width=1)
        
        # Draw the main shape
        if config["shape"] == "circle":
            draw.ellipse([150, 100, 250, 200], fill=config["color"], outline=(0, 0, 0), width=2)
        elif config["shape"] == "rectangle":
            draw.rectangle([150, 100, 250, 200], fill=config["color"], outline=(0, 0, 0), width=2)
        elif config["shape"] == "triangle":
            draw.polygon([(200, 100), (150, 200), (250, 200)], fill=config["color"], outline=(0, 0, 0), width=2)
        
        # Add some additional elements
        draw.ellipse([100, 50, 130, 80], fill=(255, 255, 0), outline=(0, 0, 0))
        draw.rectangle([320, 220, 350, 250], fill=(255, 0, 255), outline=(0, 0, 0))
        
        # Save the image
        img.save(f'images/{config["name"]}')
        print(f"Created: {config['name']}")
    
    print(f"\n✓ Created {len(configs)} sample images in the 'images' directory")
    print("You can now load these images in the annotation interface!")

if __name__ == "__main__":
    create_sample_images()