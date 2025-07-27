#!/usr/bin/env python3
"""
Advanced Label Studio RGB Extractor Setup with Graph Visualization and Brush Annotation
This script sets up a comprehensive Label Studio project with RGB extraction, graph visualization, and brush annotation capabilities.
"""

import json
import os
from pathlib import Path

# Advanced Label Studio configuration with RGB extraction, graphs, and brush annotation
ADVANCED_LABEL_CONFIG = """
<View>
  <Header value="Advanced Image Analysis with RGB Extraction and Brush Annotation"/>
  
  <!-- Load Chart.js for graph visualization -->
  <HyperText name="chart_loader" value='&lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;'/>
  
  <!-- Image display with zoom and crosshair -->
  <Image name="image" value="$image" zoom="true" zoomBy="1.5" crosshair="true"/>
  
  <!-- Brush annotation for painting on image -->
  <BrushLabels name="brush" toName="image">
    <Label value="object" background="red"/>
    <Label value="background" background="blue"/>
    <Label value="region_of_interest" background="green"/>
    <Label value="defect" background="orange"/>
    <Label value="highlight" background="yellow"/>
    <Label value="shadow" background="purple"/>
    <Label value="edge" background="cyan"/>
  </BrushLabels>
  
  <!-- Point annotation for marking clicked locations -->
  <KeyPointLabels name="points" toName="image">
    <Label value="rgb_sample" background="purple"/>
    <Label value="reference_point" background="cyan"/>
    <Label value="color_check" background="orange"/>
  </KeyPointLabels>
  
  <!-- Rectangle annotation for object detection -->
  <RectangleLabels name="objects" toName="image">
    <Label value="main_object" background="red"/>
    <Label value="secondary_object" background="blue"/>
    <Label value="anomaly" background="orange"/>
  </RectangleLabels>
  
  <!-- RGB Information Display -->
  <View style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
    <Header value="RGB Color Information &amp; Analysis"/>
    <Text name="rgb_info" value="Click on the image to extract RGB values and see them plotted on the graph" />
  </View>
  
  <!-- RGB Data Storage with Graph Data -->
  <TextArea name="rgb_data" 
            toName="image" 
            placeholder="RGB extraction data with graph visualization will be stored here in JSON format..." 
            rows="6"
            required="false"/>
  
  <!-- Brush Annotation Analysis -->
  <TextArea name="brush_analysis" 
            toName="image" 
            placeholder="Analysis of brush annotations and their correlation with RGB data..." 
            rows="4"
            required="false"/>
  
  <!-- Analysis Notes -->
  <TextArea name="analysis_notes" 
            toName="image" 
            placeholder="Add your comprehensive analysis notes about the image, colors, objects, and annotations..." 
            rows="3"
            required="false"/>
  
  <!-- Object Type Classification -->
  <Choices name="object_type" toName="image" choice="single">
    <Choice value="product"/>
    <Choice value="defective_item"/>
    <Choice value="sample"/>
    <Choice value="reference"/>
    <Choice value="test_image"/>
    <Choice value="calibration"/>
    <Choice value="other"/>
  </Choices>
  
  <!-- Color Analysis Type -->
  <Choices name="color_analysis_type" toName="image" choice="multiple">
    <Choice value="dominant_colors"/>
    <Choice value="color_variance"/>
    <Choice value="color_distribution"/>
    <Choice value="color_defects"/>
    <Choice value="color_matching"/>
  </Choices>
  
  <!-- Quality Assessment -->
  <Rating name="color_quality" toName="image" maxRating="5" icon="star" size="medium"/>
  
  <!-- Image Processing Quality -->
  <Rating name="image_clarity" toName="image" maxRating="5" icon="circle" size="medium"/>
  
</View>
"""

# Sample tasks with object images for analysis
ADVANCED_SAMPLE_TASKS = [
    {
        "data": {
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80"
        },
        "annotations": [],
        "predictions": [],
        "meta": {
            "description": "Product watch for color analysis",
            "expected_objects": ["watch", "strap", "face"],
            "analysis_focus": "color consistency, material analysis"
        }
    },
    {
        "data": {
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80"
        },
        "annotations": [],
        "predictions": [],
        "meta": {
            "description": "Nike shoe for quality inspection",
            "expected_objects": ["shoe", "logo", "sole"],
            "analysis_focus": "color matching, defect detection"
        }
    },
    {
        "data": {
            "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop&q=80"
        },
        "annotations": [],
        "predictions": [],
        "meta": {
            "description": "Sunglasses for color analysis",
            "expected_objects": ["frame", "lenses", "bridge"],
            "analysis_focus": "color distribution, reflection analysis"
        }
    },
    {
        "data": {
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80"
        },
        "annotations": [],
        "predictions": [],
        "meta": {
            "description": "Headphones for material and color analysis",
            "expected_objects": ["headband", "ear_cups", "logo"],
            "analysis_focus": "color uniformity, surface analysis"
        }
    },
    {
        "data": {
            "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop&q=80"
        },
        "annotations": [],
        "predictions": [],
        "meta": {
            "description": "Smartphone for screen and body color analysis",
            "expected_objects": ["screen", "body", "camera", "buttons"],
            "analysis_focus": "color accuracy, screen analysis"
        }
    }
]

def create_advanced_project():
    """Create advanced Label Studio project with comprehensive analysis capabilities."""
    
    # Create project directory
    project_dir = Path("advanced_label_studio_project")
    project_dir.mkdir(exist_ok=True)
    
    # Save advanced label configuration
    config_file = project_dir / "label_config.xml"
    with open(config_file, "w") as f:
        f.write(ADVANCED_LABEL_CONFIG)
    
    # Save advanced sample tasks
    tasks_file = project_dir / "tasks.json"
    with open(tasks_file, "w") as f:
        json.dump(ADVANCED_SAMPLE_TASKS, f, indent=2)
    
    # Create comprehensive instructions
    instructions_file = project_dir / "instructions.md"
    with open(instructions_file, "w") as f:
        f.write("""# Advanced RGB Extraction with Graph Visualization and Brush Annotation

## 🎨 Features

### RGB Extraction & Visualization
- **Click-to-Extract**: Click anywhere on images to get precise RGB values
- **Real-time Graphs**: See RGB data visualized in interactive charts
- **Position Tracking**: Get exact pixel coordinates and color information
- **Statistical Analysis**: View averages, ranges, and color distributions

### Brush Annotation
- **Object Painting**: Paint directly on images to mark objects and regions
- **Multiple Categories**: Use different colors for different object types
- **Region Analysis**: Correlate RGB data with annotated regions

### Advanced Analysis
- **Object Detection**: Use rectangle annotations for object boundaries
- **Point Marking**: Mark specific points of interest for RGB sampling
- **Quality Assessment**: Rate color quality and image clarity
- **Comprehensive Notes**: Document findings and analysis

## 🎯 How to Use

### RGB Extraction Mode:
1. **Click on any pixel** in the image to extract RGB values
2. **View real-time graph** showing RGB trends across samples
3. **Check statistics** for averages, ranges, and distributions
4. **Export data** for further analysis

### Brush Annotation Mode:
1. **Select brush tool** from Label Studio toolbar
2. **Choose category** (object, background, defect, etc.)
3. **Paint regions** directly on the image
4. **Correlate with RGB data** to analyze color consistency

### Object Analysis:
1. **Draw rectangles** around main objects
2. **Mark key points** for RGB sampling
3. **Use brush tools** to highlight specific regions
4. **Document findings** in analysis notes

## 📊 Data Format

### RGB Extraction Data:
```json
{
  "rgb_extractions": [
    {
      "r": 255, "g": 128, "b": 64,
      "x": 100, "y": 150,
      "timestamp": "2024-01-01T12:00:00Z",
      "sample_id": "sample_123456789"
    }
  ],
  "statistics": {
    "total_samples": 5,
    "avg_red": 128,
    "avg_green": 64,
    "avg_blue": 192,
    "color_range": {
      "red": {"min": 50, "max": 200},
      "green": {"min": 30, "max": 150},
      "blue": {"min": 100, "max": 255}
    }
  }
}
```

## 🔍 Analysis Workflow

### Product Quality Inspection:
1. **Load product image**
2. **Use rectangle tool** to mark main product area
3. **Extract RGB samples** from various product regions
4. **Use brush tool** to mark any defects or inconsistencies
5. **Analyze RGB graph** for color uniformity
6. **Rate quality** and document findings

### Color Consistency Analysis:
1. **Extract RGB from multiple points** on the same object
2. **View graph trends** to identify variations
3. **Use brush annotations** to mark consistent vs. variable regions
4. **Calculate statistics** for quality metrics

### Defect Detection:
1. **Extract RGB from suspect areas**
2. **Compare with reference colors**
3. **Use brush tool** to mark defective regions
4. **Correlate RGB data** with visual defects

## 💡 Tips for Effective Analysis

- **Use zoom feature** for precise pixel-level analysis
- **Take multiple samples** for statistical significance
- **Correlate brush annotations** with RGB extraction data
- **Export data regularly** for external analysis
- **Use different brush categories** for organized annotation

## 🎨 Color Categories

- **Red**: Primary objects or main features
- **Blue**: Background or secondary elements  
- **Green**: Regions of interest or good areas
- **Orange**: Defects or problem areas
- **Yellow**: Highlights or important features
- **Purple**: Shadow areas or depth analysis
- **Cyan**: Edge detection or boundaries

## 📈 Quality Metrics

Use the rating systems to evaluate:
- **Color Quality**: Consistency, accuracy, and uniformity
- **Image Clarity**: Focus, lighting, and visibility

This comprehensive analysis framework enables detailed color and object analysis for quality control, product inspection, and research applications.
""")
    
    print(f"✅ Advanced Label Studio project created in: {project_dir.absolute()}")
    print(f"📁 Files created:")
    print(f"   - {config_file}")
    print(f"   - {tasks_file}")
    print(f"   - {instructions_file}")
    
    return project_dir

def create_advanced_startup_script():
    """Create startup script for the advanced Label Studio project."""
    
    startup_script = """#!/bin/bash

# Advanced Label Studio RGB Extractor with Graph Visualization Startup Script

echo "🎨 Starting Advanced Label Studio with RGB Graph Visualization and Brush Annotation..."

# Check if Label Studio is installed
if ! command -v label-studio &> /dev/null; then
    echo "❌ Label Studio not found. Installing..."
    pip install label-studio
fi

# Create project directory if it doesn't exist
mkdir -p advanced_label_studio_project

# Start Label Studio with advanced configuration
echo "🎯 Starting Label Studio on http://localhost:8080"
echo "📊 Project: Advanced RGB Analysis with Graph Visualization"
echo "🖌️ Features: RGB Extraction + Graph Visualization + Brush Annotation"

label-studio start \\
    --init \\
    --project-name "Advanced RGB Analysis" \\
    --label-config advanced_label_studio_project/label_config.xml \\
    --input-path advanced_label_studio_project/tasks.json \\
    --port 8080 \\
    --host 0.0.0.0

echo "🏁 Advanced Label Studio started successfully!"
echo "🌐 Open http://localhost:8080 in your browser"
echo "🎨 Features available:"
echo "   - Click images for RGB extraction"
echo "   - View real-time RGB graphs"
echo "   - Use brush tools for annotation"
echo "   - Draw rectangles around objects"
echo "   - Export comprehensive analysis data"
"""
    
    with open("start_advanced_label_studio.sh", "w") as f:
        f.write(startup_script)
    
    # Make it executable
    os.chmod("start_advanced_label_studio.sh", 0o755)
    print("✅ Advanced startup script created: start_advanced_label_studio.sh")

def create_integration_guide():
    """Create a guide for integrating the advanced features."""
    
    integration_guide = """# Advanced Integration Guide

## 🔧 Setup Instructions

### 1. Quick Start
```bash
# Run the setup script
python3 advanced_setup.py

# Start Label Studio
./start_advanced_label_studio.sh
```

### 2. Manual Integration

#### Include Chart.js for graph visualization:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

#### Include the advanced RGB extractor plugin:
```html
<script src="advanced_label_studio_plugin.js"></script>
```

#### Use the advanced Label Studio configuration:
```xml
<!-- Copy content from advanced_label_studio_project/label_config.xml -->
```

## 🎛️ Configuration Options

### RGB Extraction Settings
- **Sampling Rate**: How frequently to sample pixels
- **Graph Update Rate**: Real-time vs. batch updates
- **Color Space**: RGB, HSL, HSV options
- **Statistics**: Enable/disable statistical analysis

### Brush Annotation Settings
- **Brush Sizes**: Configure available brush sizes
- **Color Palette**: Customize annotation colors
- **Opacity**: Set brush transparency levels
- **Correlation**: Link brush annotations with RGB data

### Graph Visualization Settings
- **Chart Type**: Line, bar, scatter plot options
- **Real-time Updates**: Enable live graph updates
- **Export Format**: PNG, SVG, JSON data export
- **Interactive Features**: Zoom, pan, hover details

## 🔌 API Integration

### Accessing RGB Data Programmatically
```javascript
// Get current RGB extractions
const rgbData = window.advancedRGBExtractor.rgbExtractions;

// Export data
window.advancedRGBExtractor.exportRGBData();

// Update chart manually
window.advancedRGBExtractor.updateChart();
```

### Custom Event Handling
```javascript
// Listen for RGB extraction events
document.addEventListener('rgbExtracted', function(event) {
    console.log('New RGB data:', event.detail);
});

// Listen for brush annotation events
document.addEventListener('brushAnnotated', function(event) {
    console.log('New brush annotation:', event.detail);
});
```

## 🎯 Use Cases

### Product Quality Control
- Extract RGB from product samples
- Compare against reference colors
- Mark defects with brush annotations
- Generate quality reports

### Color Consistency Analysis
- Sample multiple points on objects
- Analyze color variation graphs
- Identify inconsistent regions
- Document color specifications

### Scientific Research
- Precise color measurements
- Statistical color analysis
- Correlation with other measurements
- Reproducible methodology

## 📊 Data Export Formats

### JSON Export
```json
{
  "rgb_extractions": [...],
  "brush_annotations": [...],
  "statistics": {...},
  "metadata": {...}
}
```

### CSV Export (for analysis tools)
```csv
sample_id,x,y,r,g,b,timestamp,annotation_type
sample_1,100,150,255,128,64,2024-01-01T12:00:00Z,object
```

### Image Overlay Export
- Original image with RGB sample points
- Brush annotations overlay
- Color-coded visualization
- Statistical summary overlay

This advanced integration provides a comprehensive solution for color analysis, object annotation, and quality assessment workflows.
"""
    
    with open("integration_guide.md", "w") as f:
        f.write(integration_guide)
    
    print("✅ Integration guide created: integration_guide.md")

def main():
    """Main function to set up the complete advanced RGB extraction project."""
    print("🎨 Setting up Advanced Label Studio RGB Extractor with Graph Visualization...")
    print("=" * 70)
    
    # Create advanced project files
    project_dir = create_advanced_project()
    
    # Create advanced startup script
    create_advanced_startup_script()
    
    # Create integration guide
    create_integration_guide()
    
    print("\n" + "=" * 70)
    print("🎉 Advanced setup complete!")
    print("\n📋 Next steps:")
    print("1. Install dependencies: pip install -r requirements.txt")
    print("2. Run the advanced startup script: ./start_advanced_label_studio.sh")
    print("3. Open http://localhost:8080 in your browser")
    print("4. Try the advanced features:")
    print("   • Click images for RGB extraction with graphs")
    print("   • Use brush tools for object annotation") 
    print("   • Draw rectangles around objects")
    print("   • Export comprehensive analysis data")
    print("\n💡 Features included:")
    print("• Real-time RGB graph visualization")
    print("• Brush annotation tools")
    print("• Object detection rectangles")
    print("• Statistical analysis")
    print("• Data export capabilities")
    print("• Comprehensive analysis workflow")

if __name__ == "__main__":
    main()