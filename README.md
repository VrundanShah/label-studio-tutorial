# Advanced Label Studio RGB Extractor with Graph Visualization

This project implements comprehensive RGB pixel value extraction functionality for Label Studio, featuring real-time graph visualization, brush annotation tools, and advanced color analysis capabilities.

## 🎨 Features

### Core RGB Extraction
- **Click-to-Extract**: Click anywhere on an image to get RGB values at that pixel
- **Real-time Display**: See RGB values, hex codes, and color previews instantly
- **Position Tracking**: Get both display and actual pixel coordinates
- **History Tracking**: Keep track of multiple RGB extractions with timestamps
- **Label Studio Integration**: Seamlessly integrates with Label Studio's annotation workflow
- **Zoom Support**: Works with Label Studio's zoom functionality for precise pixel selection

### Advanced Visualization
- **📊 Real-time Graphs**: Interactive Chart.js graphs showing RGB trends across samples
- **📈 Statistical Analysis**: View averages, ranges, and color distributions
- **🎯 Live Updates**: Graphs update in real-time as you extract RGB values
- **📋 Export Capabilities**: Export RGB data and graphs for further analysis

### Brush Annotation Integration
- **🖌️ Paint on Images**: Use brush tools to mark objects and regions
- **🎨 Multiple Categories**: Different colors for objects, defects, backgrounds, etc.
- **🔗 Data Correlation**: Link brush annotations with RGB extraction data
- **📊 Region Analysis**: Analyze color consistency within annotated regions

### Object Detection Support  
- **📦 Rectangle Annotations**: Draw bounding boxes around objects
- **📍 Point Markers**: Mark specific points of interest for RGB sampling
- **⭐ Quality Ratings**: Rate color quality and image clarity
- **📝 Comprehensive Notes**: Document findings and analysis

## 📁 Project Structure

```
├── README.md                                    # This comprehensive guide
├── requirements.txt                             # Python dependencies
├── integration_guide.md                        # Advanced integration guide
│
├── Basic RGB Extraction:
├── label_config.xml                            # Basic Label Studio configuration
├── custom_rgb_extractor.html                  # Standalone RGB extractor demo
├── custom_label_studio_frontend.js            # Basic JavaScript plugin
├── label_studio_config.py                     # Basic setup script
├── start_label_studio.sh                      # Basic startup script
└── label_studio_project/                      # Basic project files
    ├── label_config.xml                       # Basic Label Studio config
    ├── tasks.json                             # Sample tasks
    └── instructions.md                        # Basic usage instructions
│
├── Advanced Features:
├── advanced_label_config.xml                  # Advanced Label Studio configuration
├── advanced_rgb_visualizer.html               # Advanced standalone demo with graphs
├── advanced_label_studio_plugin.js            # Advanced plugin with graph visualization
├── advanced_setup.py                          # Advanced setup script
├── start_advanced_label_studio.sh             # Advanced startup script
└── advanced_label_studio_project/             # Advanced project files
    ├── label_config.xml                       # Advanced config with brush + graphs
    ├── tasks.json                             # Sample tasks with real product images
    └── instructions.md                        # Comprehensive usage guide
```

## 🚀 Quick Start

### Option 1: Advanced Features (Recommended)

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up advanced project**:
   ```bash
   python3 advanced_setup.py
   ```

3. **Start advanced Label Studio**:
   ```bash
   ./start_advanced_label_studio.sh
   ```

4. **Open Label Studio**: 
   - Navigate to http://localhost:8080
   - Try the comprehensive features:
     - Click images for RGB extraction with real-time graphs
     - Use brush tools to annotate objects and regions
     - Draw rectangles around objects
     - Export detailed analysis data

### Option 2: Basic Features

1. **Install Label Studio**:
   ```bash
   pip install label-studio
   ```

2. **Start basic RGB extraction**:
   ```bash
   ./start_label_studio.sh
   ```

### Option 3: Standalone Demos

1. **Advanced demo with graphs**:
   ```bash
   python3 -m http.server 8000
   # Visit: http://localhost:8000/advanced_rgb_visualizer.html
   ```

2. **Basic demo**:
   ```bash
   python3 -m http.server 8000
   # Visit: http://localhost:8000/custom_rgb_extractor.html
   ```

## 🎯 How to Use

### In Label Studio:

1. **Click on any image** to extract RGB values at that pixel location
2. **View RGB information** in the floating widget on the right
3. **Store extraction data** in the RGB data text area (automatically populated)
4. **Mark important points** using KeyPoint annotations if needed
5. **Submit your annotations** with the extracted RGB data

### Standalone Version:

1. **Load an image** by modifying the image URL in the HTML file
2. **Click anywhere on the image** to see RGB values
3. **View history** of recent clicks
4. **Clear history** using the clear button

## 📊 RGB Data Format

The extracted RGB data is stored in JSON format:

```json
{
  "clicks": [
    {
      "r": 255,
      "g": 128,
      "b": 64,
      "a": 255,
      "x": 100,
      "y": 150,
      "displayX": 95,
      "displayY": 145,
      "timestamp": "3:45:23 PM",
      "iso_timestamp": "2024-01-01T15:45:23.000Z"
    }
  ],
  "total_clicks": 1,
  "last_updated": "2024-01-01T15:45:23.000Z"
}
```

## 🔧 Configuration

### Custom Images

To use your own images, update the `label_studio_project/tasks.json` file:

```json
[
  {
    "data": {
      "image": "https://your-image-url.com/image.jpg"
    }
  }
]
```

### Label Studio Configuration

The Label Studio configuration (`label_studio_project/label_config.xml`) includes:

- **Image display** with zoom and crosshair cursor
- **RGB information display** area
- **Text area** for storing RGB extraction data
- **KeyPoint annotations** for marking important pixels
- **Classification options** for image categorization

## 🛠️ Advanced Integration

### Adding the RGB Extractor to Existing Projects

1. **Include the JavaScript plugin**:
   ```html
   <script src="custom_label_studio_frontend.js"></script>
   ```

2. **Add RGB data storage to your label config**:
   ```xml
   <TextArea name="rgb_data" toName="image" placeholder="RGB extraction data..." rows="6"/>
   ```

3. **Initialize the plugin** (automatic on page load)

### Custom Styling

Modify the CSS in `custom_label_studio_frontend.js` to customize the appearance of the RGB display widget.

## 🔒 CORS Considerations

When working with images from external domains, CORS policies may prevent direct pixel access. The plugin includes fallback functionality for such cases.

### Solutions:
- Use images from the same domain
- Configure CORS headers on your image server
- Use a proxy server for external images

## 📈 Use Cases

- **Color Analysis**: Analyze color compositions in images
- **Quality Control**: Extract color values for quality assurance
- **Design Validation**: Verify color accuracy in designs
- **Scientific Research**: Extract precise color measurements
- **Art Analysis**: Study color palettes in artworks

## 🔍 Technical Details

### RGB Extraction Method

1. **Canvas Rendering**: Images are drawn to a hidden canvas element
2. **Pixel Data Access**: `getImageData()` API extracts pixel information
3. **Coordinate Mapping**: Display coordinates are mapped to actual image pixels
4. **Scale Calculation**: Handles image scaling and zoom levels

### Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both standalone and Label Studio versions
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Common Issues:

1. **RGB values showing as 0,0,0**: Check for CORS issues with external images
2. **Plugin not loading**: Ensure JavaScript is enabled and files are served over HTTP/HTTPS
3. **Coordinates seem off**: Verify image scaling and zoom levels

### Debug Mode:

Open browser console to see detailed RGB extraction logs and any error messages.

---

🎨 **Happy color extracting!** For questions or issues, please check the troubleshooting section or create an issue.