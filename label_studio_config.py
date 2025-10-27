#!/usr/bin/env python3
"""
Label Studio RGB Extractor Setup
This script sets up a Label Studio project with RGB extraction capabilities.
"""

import json
import os
from pathlib import Path

# Label Studio configuration with RGB extraction
LABEL_CONFIG = """
<View>
  <Header value="Click on the image to extract RGB values"/>
  
  <!-- Image display with zoom capabilities -->
  <Image name="image" value="$image" zoom="true" zoomBy="1.5" crosshair="true"/>
  
  <!-- RGB Information Display -->
  <View style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
    <Header value="RGB Color Information"/>
    <Text name="rgb_info" value="Click coordinates and RGB values will appear here" />
  </View>
  
  <!-- Text area to store RGB extraction data -->
  <TextArea name="rgb_data" 
            toName="image" 
            placeholder="RGB extraction data (JSON format)&#10;Format: {&quot;clicks&quot;: [{&quot;x&quot;: 100, &quot;y&quot;: 150, &quot;rgb&quot;: [255, 128, 64]}]}" 
            rows="6"
            required="false"/>
  
  <!-- Point annotation for marking clicked locations -->
  <KeyPointLabels name="points" toName="image">
    <Label value="rgb_point" background="red"/>
  </KeyPointLabels>
  
  <!-- Optional classification -->
  <Choices name="image_category" toName="image" choice="single">
    <Choice value="processed"/>
    <Choice value="needs_analysis"/>
    <Choice value="completed"/>
  </Choices>
</View>
"""

# Sample task data
SAMPLE_TASKS = [
    {
        "data": {
            "image": "https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Sample+Image+1"
        }
    },
    {
        "data": {
            "image": "https://via.placeholder.com/800x600/4ecdc4/ffffff?text=Sample+Image+2"
        }
    },
    {
        "data": {
            "image": "https://via.placeholder.com/800x600/45b7d1/ffffff?text=Sample+Image+3"
        }
    }
]

def create_label_studio_project():
    """Create Label Studio project configuration files."""
    
    # Create project directory
    project_dir = Path("label_studio_project")
    project_dir.mkdir(exist_ok=True)
    
    # Save label configuration
    config_file = project_dir / "label_config.xml"
    with open(config_file, "w") as f:
        f.write(LABEL_CONFIG)
    
    # Save sample tasks
    tasks_file = project_dir / "tasks.json"
    with open(tasks_file, "w") as f:
        json.dump(SAMPLE_TASKS, f, indent=2)
    
    # Create instructions file
    instructions_file = project_dir / "instructions.md"
    with open(instructions_file, "w") as f:
        f.write("""# RGB Extraction Instructions

## How to use:

1. **Click on the image** at any pixel location to extract RGB values
2. **View RGB information** in the RGB Color Information section
3. **Store extraction data** in the RGB data text area (JSON format)
4. **Mark important points** using the KeyPoint tool if needed
5. **Categorize the image** using the classification options

## RGB Data Format:

Store your RGB extractions in this JSON format:
```json
{
  "clicks": [
    {
      "x": 100,
      "y": 150,
      "rgb": [255, 128, 64],
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Tips:

- Use the zoom feature to get precise pixel locations
- The crosshair cursor helps with accurate clicking
- RGB values range from 0-255 for each color channel
- Store multiple clicks for comprehensive color analysis
""")
    
    print(f"✅ Label Studio project created in: {project_dir.absolute()}")
    print(f"📁 Files created:")
    print(f"   - {config_file}")
    print(f"   - {tasks_file}")
    print(f"   - {instructions_file}")
    
    return project_dir

def create_startup_script():
    """Create a script to start Label Studio with the RGB extraction project."""
    
    startup_script = """#!/bin/bash

# Label Studio RGB Extractor Startup Script

echo "🚀 Starting Label Studio with RGB Extraction capabilities..."

# Check if Label Studio is installed
if ! command -v label-studio &> /dev/null; then
    echo "❌ Label Studio not found. Installing..."
    pip install label-studio
fi

# Create project directory if it doesn't exist
mkdir -p label_studio_project

# Start Label Studio
echo "🎯 Starting Label Studio on http://localhost:8080"
echo "📊 Project: RGB Color Extraction"

label-studio start \\
    --init \\
    --project-name "RGB Color Extraction" \\
    --label-config label_studio_project/label_config.xml \\
    --input-path label_studio_project/tasks.json \\
    --port 8080 \\
    --host 0.0.0.0

echo "🏁 Label Studio started successfully!"
echo "🌐 Open http://localhost:8080 in your browser"
"""
    
    with open("start_label_studio.sh", "w") as f:
        f.write(startup_script)
    
    # Make it executable
    os.chmod("start_label_studio.sh", 0o755)
    print("✅ Startup script created: start_label_studio.sh")

def main():
    """Main function to set up the complete RGB extraction project."""
    print("🎨 Setting up Label Studio RGB Extraction Project...")
    print("=" * 50)
    
    # Create project files
    project_dir = create_label_studio_project()
    
    # Create startup script
    create_startup_script()
    
    print("\n" + "=" * 50)
    print("🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Install Label Studio: pip install label-studio")
    print("2. Run the startup script: ./start_label_studio.sh")
    print("3. Open http://localhost:8080 in your browser")
    print("4. Click on images to extract RGB values!")
    print("\n💡 For custom images, update the tasks.json file with your image URLs")

if __name__ == "__main__":
    main()