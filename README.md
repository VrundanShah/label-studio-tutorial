# Label Studio RGB Extractor

This project implements RGB pixel value extraction functionality for Label Studio, allowing you to click on images and extract the RGB color values at specific pixel locations.

## 🎨 Features

- **Click-to-Extract**: Click anywhere on an image to get RGB values at that pixel
- **Real-time Display**: See RGB values, hex codes, and color previews instantly
- **Position Tracking**: Get both display and actual pixel coordinates
- **History Tracking**: Keep track of multiple RGB extractions with timestamps
- **Label Studio Integration**: Seamlessly integrates with Label Studio's annotation workflow
- **Zoom Support**: Works with Label Studio's zoom functionality for precise pixel selection

## 📁 Project Structure

```
├── README.md                           # This file
├── label_config.xml                    # Basic Label Studio configuration
├── custom_rgb_extractor.html           # Standalone RGB extractor demo
├── custom_label_studio_frontend.js     # JavaScript plugin for Label Studio
├── label_studio_config.py              # Setup script
├── start_label_studio.sh              # Label Studio startup script
└── label_studio_project/               # Generated project files
    ├── label_config.xml                # Complete Label Studio config
    ├── tasks.json                      # Sample tasks with images
    └── instructions.md                 # Usage instructions
```

## 🚀 Quick Start

### Option 1: Use with Label Studio (Recommended)

1. **Install Label Studio**:
   ```bash
   pip install label-studio
   ```

2. **Start the RGB extraction project**:
   ```bash
   ./start_label_studio.sh
   ```

3. **Open Label Studio**:
   - Navigate to http://localhost:8080
   - Create an account or log in
   - Start annotating images with RGB extraction

### Option 2: Standalone Demo

1. **Open the standalone demo**:
   ```bash
   # Open custom_rgb_extractor.html in your browser
   python3 -m http.server 8000
   # Then visit http://localhost:8000/custom_rgb_extractor.html
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