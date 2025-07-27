# Advanced Integration Guide

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
