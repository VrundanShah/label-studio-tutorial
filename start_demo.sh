#!/bin/bash

# Standalone RGB Extractor Demo Startup Script

echo "🎨 Starting Standalone RGB Extractor Demo..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python3."
    exit 1
fi

# Start HTTP server
echo "🚀 Starting HTTP server on http://localhost:8000"
echo ""
echo "📊 Available demos:"
echo "   - Advanced RGB Visualizer with Graphs: http://localhost:8000/advanced_rgb_visualizer.html"
echo "   - Basic RGB Extractor: http://localhost:8000/custom_rgb_extractor.html"
echo ""
echo "🎯 Features in Advanced Demo:"
echo "   - Click images to extract RGB values"
echo "   - Real-time graph visualization"
echo "   - Brush tools for painting on images"
echo "   - Statistical analysis"
echo "   - Data export capabilities"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"

python3 -m http.server 8000