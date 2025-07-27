#!/bin/bash

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

label-studio start \
    --port 8080 \
    --host 0.0.0.0

echo "🏁 Advanced Label Studio started successfully!"
echo "🌐 Open http://localhost:8080 in your browser"
echo ""
echo "📋 Next Steps:"
echo "1. Create an account or log in"
echo "2. Create a new project"
echo "3. Follow the setup instructions in setup_instructions.md"
echo ""
echo "🎨 Features available after setup:"
echo "   - Click images for RGB extraction with real-time graphs"
echo "   - Use brush tools for object annotation"
echo "   - Draw rectangles around objects"
echo "   - Export comprehensive analysis data"
echo ""
echo "📖 For detailed setup instructions, see: setup_instructions.md"
