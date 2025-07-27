# Label Studio RGB Extractor Setup Instructions

Since Label Studio's command-line interface has changed, here are the updated setup instructions:

## 🚀 Quick Setup

### Step 1: Start Label Studio

```bash
# Install Label Studio if not already installed
pip install -r requirements.txt

# Start Label Studio (this will create the web interface)
./start_advanced_label_studio.sh
```

This will start Label Studio on http://localhost:8080

### Step 2: Create Account and Project

1. **Open your browser** and go to http://localhost:8080
2. **Create an account** (first time users) or log in
3. **Create a new project** by clicking "Create Project"

### Step 3: Configure the Project

1. **Project Settings**:
   - Project Name: "Advanced RGB Analysis"
   - Description: "RGB extraction with graph visualization and brush annotation"

2. **Data Import**:
   - Click "Data Import" tab
   - Choose "Upload Files" or "Import from URLs"
   - **Option A - Upload Files**: Upload your own images
   - **Option B - Use URLs**: Copy and paste these sample URLs:
     ```
     https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80
     https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80
     https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop&q=80
     https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80
     https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop&q=80
     ```

3. **Labeling Setup**:
   - Click "Labeling Setup" tab
   - **Copy and paste** the configuration from `advanced_label_studio_project/label_config.xml`
   - Or use this configuration:

```xml
<View>
  <Header value="Advanced Image Analysis with RGB Extraction and Brush Annotation"/>
  
  <!-- Load Chart.js for graph visualization -->
  <HyperText name="chart_loader" value='&lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;'/>
  
  <!-- Image display with zoom and crosshair -->
  <Image name="image" value="$image" zoom="true" zoomBy="1.5" crosshair="true"/>
  
  <!-- Brush annotation for painting on image -->
  <BrushLabels name="brush" toName="image">
    <Label value="object" background="red"/>
    <Label value="background" background="blue"/>
    <Label value="region_of_interest" background="green"/>
    <Label value="defect" background="orange"/>
    <Label value="highlight" background="yellow"/>
    <Label value="shadow" background="purple"/>
    <Label value="edge" background="cyan"/>
  </BrushLabels>
  
  <!-- Point annotation for marking clicked locations -->
  <KeyPointLabels name="points" toName="image">
    <Label value="rgb_sample" background="purple"/>
    <Label value="reference_point" background="cyan"/>
    <Label value="color_check" background="orange"/>
  </KeyPointLabels>
  
  <!-- Rectangle annotation for object detection -->
  <RectangleLabels name="objects" toName="image">
    <Label value="main_object" background="red"/>
    <Label value="secondary_object" background="blue"/>
    <Label value="anomaly" background="orange"/>
  </RectangleLabels>
  
  <!-- RGB Information Display -->
  <View style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
    <Header value="RGB Color Information &amp; Analysis"/>
    <Text name="rgb_info" value="Click on the image to extract RGB values and see them plotted on the graph" />
  </View>
  
  <!-- RGB Data Storage with Graph Data -->
  <TextArea name="rgb_data" 
            toName="image" 
            placeholder="RGB extraction data with graph visualization will be stored here in JSON format..." 
            rows="6"
            required="false"/>
  
  <!-- Brush Annotation Analysis -->
  <TextArea name="brush_analysis" 
            toName="image" 
            placeholder="Analysis of brush annotations and their correlation with RGB data..." 
            rows="4"
            required="false"/>
  
  <!-- Analysis Notes -->
  <TextArea name="analysis_notes" 
            toName="image" 
            placeholder="Add your comprehensive analysis notes about the image, colors, objects, and annotations..." 
            rows="3"
            required="false"/>
  
  <!-- Object Type Classification -->
  <Choices name="object_type" toName="image" choice="single">
    <Choice value="product"/>
    <Choice value="defective_item"/>
    <Choice value="sample"/>
    <Choice value="reference"/>
    <Choice value="test_image"/>
    <Choice value="calibration"/>
    <Choice value="other"/>
  </Choices>
  
  <!-- Color Analysis Type -->
  <Choices name="color_analysis_type" toName="image" choice="multiple">
    <Choice value="dominant_colors"/>
    <Choice value="color_variance"/>
    <Choice value="color_distribution"/>
    <Choice value="color_defects"/>
    <Choice value="color_matching"/>
  </Choices>
  
  <!-- Quality Assessment -->
  <Rating name="color_quality" toName="image" maxRating="5" icon="star" size="medium"/>
  
  <!-- Image Processing Quality -->
  <Rating name="image_clarity" toName="image" maxRating="5" icon="circle" size="medium"/>
  
</View>
```

### Step 4: Add RGB Extraction Plugin

After setting up the project, you need to add the RGB extraction plugin:

1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Copy and paste** the content from `advanced_label_studio_plugin.js` into the console and press Enter
4. **Alternatively**, you can add it to the project:
   - In Label Studio, go to Settings → Custom Code
   - Add the JavaScript code there

### Step 5: Start Annotating

1. **Click "Label All Tasks"** to start annotating
2. **Try the features**:
   - Click on images to extract RGB values (see the floating widget)
   - View real-time graphs of RGB data
   - Use brush tools to paint objects and regions
   - Draw rectangles around objects
   - Add notes and ratings

## 🎯 Features You'll Have

### RGB Extraction
- Click any pixel to get RGB values
- Real-time graph visualization
- Statistical analysis
- Export capabilities

### Brush Annotation
- Paint directly on images
- Multiple categories (object, background, defect, etc.)
- Correlate with RGB data

### Object Detection
- Rectangle annotations for objects
- Point markers for specific locations
- Quality ratings and notes

## 🔧 Troubleshooting

### If RGB extraction isn't working:
1. Make sure the JavaScript plugin is loaded (check browser console)
2. Refresh the page and reload the plugin
3. Check that Chart.js is loaded (included in the configuration)

### If brush tools aren't visible:
1. Make sure the labeling configuration is saved correctly
2. Refresh the Label Studio interface
3. Check that all brush labels are properly defined

### For CORS issues with external images:
1. Use images from the same domain when possible
2. The plugin includes fallback functionality for CORS-restricted images

## 📊 Alternative: Standalone Demo

If you want to test the functionality without Label Studio:

```bash
# Start a local server
python3 -m http.server 8000

# Open in browser:
# http://localhost:8000/advanced_rgb_visualizer.html
```

This standalone version includes all the RGB extraction and graph visualization features.

## 💡 Tips

- Use the zoom feature for precise pixel selection
- Take multiple RGB samples for statistical analysis
- Use different brush categories to organize your annotations
- Export data regularly for external analysis
- The floating RGB widget can be collapsed/expanded using the arrow button

Happy analyzing! 🎨