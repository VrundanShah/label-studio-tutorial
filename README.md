# Multi-Image Segmentation Annotator

A powerful web-based tool for creating segmentation annotations that can be automatically relayed across multiple images. Perfect for datasets where you want to annotate one image and apply similar annotations to all images in your collection.

## 🌟 Features

- **Brush-based Segmentation**: Intuitive brush tool for creating precise segmentation masks
- **Automatic Relay**: Annotate one image and automatically apply to all images
- **Intelligent Matching**: Advanced template matching for better annotation transfer
- **Real-time Processing**: Annotations are relayed as soon as you complete them
- **Multiple Export Formats**: Export to Label Studio, binary masks, or raw data
- **Undo/Redo Support**: Full history management with undo/redo functionality
- **Batch Processing**: Process multiple images efficiently
- **Auto-save**: Automatic saving and recovery of annotations

## 🚀 Quick Start

1. **Setup the environment**:
   ```bash
   python setup.py
   ```

2. **Add your images**:
   - Place your images in the `images/` directory
   - Supported formats: JPG, PNG, BMP, TIFF, WebP

3. **Start the server**:
   ```bash
   python server.py
   ```

4. **Open the interface**:
   - Navigate to `http://localhost:5000` in your browser
   - Load your images using the file input
   - Start annotating!

## 🎨 How to Use

### Basic Annotation
1. Load your images using the "Load Images" button
2. Select the brush tool and adjust size/opacity
3. Draw your segmentation mask on the first image
4. The annotation will automatically relay to all other images

### Relay Modes
- **Immediate**: Annotations relay automatically as you draw
- **Manual**: Relay only when you click "Relay to All Images"
- **Intelligent**: Uses template matching for better accuracy

### Keyboard Shortcuts
- `B`: Switch to brush tool
- `E`: Switch to eraser tool
- `Ctrl+R`: Relay annotations to all images
- `Ctrl+S`: Save annotations
- `Ctrl+C`: Clear current annotation
- `Ctrl+I`: Toggle intelligent matching
- `Ctrl+P`: Batch process
- `Arrow Keys`: Navigate between images

## 📤 Export Options

### Label Studio Format
Export directly to Label Studio JSON format for integration with Label Studio projects.

### Binary Masks
Export individual PNG masks for each annotated image.

### Raw Annotations
Save raw annotation data in JSON format for custom processing.

## 🔧 Advanced Features

### Intelligent Template Matching
When enabled, the system analyzes image features to better transform annotations when relaying to different images.

### Batch Processing
Process multiple images simultaneously with server-side optimization.

### Quality Analysis
Automatic analysis of annotation quality with suggestions for improvement.

## 📁 File Structure

```
├── index.html              # Main web interface
├── annotator.js            # Core annotation functionality
├── advanced-annotator.js   # Advanced features and controls
├── enhanced-annotator.js   # Enhanced features with server integration
├── server.py              # Flask backend server
├── annotation_processor.py # Core annotation processing logic
├── setup.py               # Setup and installation script
├── requirements.txt       # Python dependencies
├── images/                # Directory for your images
├── exports/               # Directory for exported annotations
└── annotations/           # Directory for saved annotation files
```

## 🛠️ Technical Details

### Client-Side Architecture
- HTML5 Canvas for drawing and display
- JavaScript classes for modular functionality
- Real-time annotation relay system
- Local storage for auto-save

### Server-Side Architecture
- Flask REST API for advanced processing
- OpenCV for image processing and template matching
- NumPy for efficient array operations
- Batch processing capabilities

### Annotation Format
Annotations are stored as base64-encoded PNG images with transparency, allowing for:
- Precise brush strokes
- Variable opacity
- Easy conversion to binary masks
- Compatibility with Label Studio

## 🔍 Use Cases

- **Medical Imaging**: Annotate anatomical structures across multiple scans
- **Satellite Imagery**: Mark features across multiple satellite images
- **Manufacturing QC**: Identify defects across product images
- **Research Datasets**: Create consistent annotations for machine learning
- **Batch Labeling**: Efficiently annotate large image datasets

## 🤝 Contributing

This tool is designed to be extensible. Key areas for enhancement:
- More sophisticated template matching algorithms
- Integration with popular annotation platforms
- Support for additional image formats
- Advanced brush tools and shapes
- Collaborative annotation features

## 📝 License

Open source - feel free to modify and distribute.