#!/bin/bash

echo "🧪 Testing RGB Extractor Demos..."
echo ""

# Check if files exist
echo "📁 Checking demo files:"
if [ -f "advanced_rgb_visualizer.html" ]; then
    echo "✅ Advanced RGB Visualizer found"
else
    echo "❌ Advanced RGB Visualizer missing"
fi

if [ -f "custom_rgb_extractor.html" ]; then
    echo "✅ Basic RGB Extractor found"
else
    echo "❌ Basic RGB Extractor missing"
fi

echo ""
echo "🚀 Starting test server on port 8000..."
echo ""
echo "🎯 Test the following URLs:"
echo "   📊 Advanced Demo: http://localhost:8000/advanced_rgb_visualizer.html"
echo "   📋 Basic Demo: http://localhost:8000/custom_rgb_extractor.html"
echo ""
echo "🔍 What to test:"
echo "   1. Images should load automatically (with fallbacks)"
echo "   2. Click on images to extract RGB values"
echo "   3. Advanced demo: Try brush painting and view graphs"
echo "   4. Use 'Try Next Image' button if images don't load"
echo ""
echo "Press Ctrl+C to stop the test server"
echo "================================================"

python3 -m http.server 8000