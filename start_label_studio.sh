#!/bin/bash

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

label-studio start \
    --init \
    --project-name "RGB Color Extraction" \
    --label-config label_studio_project/label_config.xml \
    --input-path label_studio_project/tasks.json \
    --port 8080 \
    --host 0.0.0.0

echo "🏁 Label Studio started successfully!"
echo "🌐 Open http://localhost:8080 in your browser"
