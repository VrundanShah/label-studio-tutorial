#!/usr/bin/env python3
"""
Setup script for the Multi-Image Segmentation Annotator
"""

import os
import subprocess
import sys
from pathlib import Path

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✓ Python requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error installing requirements: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = [
        'images',
        'exports',
        'annotations',
        'temp'
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ Created directory: {directory}")

def setup_sample_images():
    """Setup sample images if none exist"""
    images_dir = Path('images')
    if not any(images_dir.iterdir()):
        print("\n📁 The 'images' directory is empty.")
        print("Please add your images to the 'images' directory to start annotating.")
        print("Supported formats: .jpg, .jpeg, .png, .bmp, .tiff, .webp")

def print_usage_instructions():
    """Print usage instructions"""
    print("\n" + "="*60)
    print("🎨 Multi-Image Segmentation Annotator Setup Complete!")
    print("="*60)
    print("\n📋 How to use:")
    print("1. Add your images to the 'images' directory")
    print("2. Run the server: python server.py")
    print("3. Open your browser to: http://localhost:5000")
    print("4. Load images using the file input")
    print("5. Start annotating with the brush tool")
    print("6. Annotations will automatically relay to all images")
    print("\n🎯 Features:")
    print("• Brush-based segmentation annotation")
    print("• Automatic annotation relay")
    print("• Intelligent template matching")
    print("• Label Studio export format")
    print("• Batch processing capabilities")
    print("• Undo/Redo functionality")
    print("• Auto-save and recovery")
    print("\n⌨️  Keyboard shortcuts:")
    print("• B: Brush tool")
    print("• E: Eraser tool")
    print("• Ctrl+R: Relay annotations")
    print("• Ctrl+S: Save annotations")
    print("• Ctrl+C: Clear current annotation")
    print("• Ctrl+I: Toggle intelligent matching")
    print("• Ctrl+P: Batch process")
    print("• Arrow keys: Navigate between images")
    print("\n📤 Export options:")
    print("• Label Studio JSON format")
    print("• Binary mask images")
    print("• Raw annotation data")

def main():
    print("Setting up Multi-Image Segmentation Annotator...")
    print("-" * 50)
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("✗ Python 3.7 or higher is required")
        sys.exit(1)
    
    print(f"✓ Python version: {sys.version.split()[0]}")
    
    # Install requirements
    if not install_requirements():
        print("Setup failed. Please install requirements manually.")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Setup sample images info
    setup_sample_images()
    
    # Print usage instructions
    print_usage_instructions()
    
    print("\n🚀 Ready to start! Run 'python server.py' to begin.")

if __name__ == "__main__":
    main()