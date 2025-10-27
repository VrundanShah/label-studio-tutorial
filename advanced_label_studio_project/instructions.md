# Advanced RGB Extraction with Graph Visualization and Brush Annotation

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
