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
    --init \
    --project-name "Advanced RGB Analysis" \
    --label-config advanced_label_studio_project/label_config.xml \
    --input-path advanced_label_studio_project/tasks.json \
    --port 8080 \
    --host 0.0.0.0

echo "🏁 Advanced Label Studio started successfully!"
echo "🌐 Open http://localhost:8080 in your browser"
echo "🎨 Features available:"
echo "   - Click images for RGB extraction"
echo "   - View real-time RGB graphs"
echo "   - Use brush tools for annotation"
echo "   - Draw rectangles around objects"
echo "   - Export comprehensive analysis data"
