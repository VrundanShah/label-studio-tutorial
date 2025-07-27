# Label Studio RGB Extraction Integration Methods

Since the "Custom Code" option isn't always available, here are several alternative methods to add RGB extraction functionality to your Label Studio project.

## Method 1: Browser Console Integration (Recommended)

This is the easiest method that works with any Label Studio version.

### Steps:

1. **Start your Label Studio project** (using the setup from `setup_instructions.md`)
2. **Open browser developer tools** (F12 or right-click → Inspect)
3. **Go to the Console tab**
4. **Copy and paste the entire contents** of `advanced_label_studio_plugin.js` into the console
5. **Press Enter** to execute the code
6. **Start annotating** - the RGB extraction widget should appear

### Benefits:
- ✅ Works immediately
- ✅ No Label Studio configuration needed
- ✅ Full RGB extraction with graphs
- ✅ Integrates with brush annotations

### Note:
You'll need to re-paste the code each time you refresh the page.

## Method 2: Browser Extension/Bookmarklet

Create a bookmarklet for easy re-activation.

### Steps:

1. **Create a new bookmark** in your browser
2. **Set the URL to**:
```javascript
javascript:(function(){var script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/chart.js';document.head.appendChild(script);script.onload=function(){/* PASTE ADVANCED_LABEL_STUDIO_PLUGIN.JS CONTENT HERE */};})();
```

3. **Replace the comment** with the actual plugin code (minified)
4. **Click the bookmark** when on your Label Studio page

## Method 3: Modified Label Configuration

Add the RGB extraction directly in the Label Studio configuration.

### Steps:

1. **In your Label Studio project**, go to **Settings → Labeling Interface**
2. **Replace your current configuration** with this enhanced version:

```xml
<View>
  <Header value="Advanced Image Analysis with RGB Extraction and Brush Annotation"/>
  
  <!-- Load Chart.js -->
  <HyperText name="chart_js" value="&lt;script src='https://cdn.jsdelivr.net/npm/chart.js'&gt;&lt;/script&gt;"/>
  
  <!-- RGB Extraction Widget -->
  <HyperText name="rgb_widget" value="
    &lt;div id='rgb-extractor-widget' style='position: fixed; top: 20px; right: 20px; background: white; border: 2px solid #007bff; border-radius: 8px; padding: 15px; z-index: 10000; font-family: Arial; font-size: 14px; max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);'&gt;
      &lt;div style='font-weight: bold; color: #007bff; margin-bottom: 10px;'&gt;🎨 RGB Extractor&lt;/div&gt;
      &lt;div id='rgb-info'&gt;Click on image to extract RGB&lt;/div&gt;
      &lt;div style='height: 150px; margin: 10px 0;'&gt;
        &lt;canvas id='mini-rgb-chart'&gt;&lt;/canvas&gt;
      &lt;/div&gt;
      &lt;div id='rgb-history' style='max-height: 100px; overflow-y: auto; font-size: 12px;'&gt;&lt;/div&gt;
    &lt;/div&gt;
  "/>
  
  <!-- RGB Extraction Script -->
  <HyperText name="rgb_script" value="
    &lt;script&gt;
      // Simplified RGB extraction code
      let rgbData = [];
      let miniChart = null;
      
      function initRGBExtractor() {
        setTimeout(() => {
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            if (!img.hasRGBListener) {
              img.hasRGBListener = true;
              img.style.cursor = 'crosshair';
              img.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Extract RGB (simplified for inline use)
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                
                try {
                  ctx.drawImage(this, 0, 0);
                  const scaleX = this.naturalWidth / rect.width;
                  const scaleY = this.naturalHeight / rect.height;
                  const actualX = Math.floor(x * scaleX);
                  const actualY = Math.floor(y * scaleY);
                  const imageData = ctx.getImageData(actualX, actualY, 1, 1);
                  const data = imageData.data;
                  
                  const rgb = {r: data[0], g: data[1], b: data[2], x: actualX, y: actualY};
                  rgbData.push(rgb);
                  
                  // Update display
                  document.getElementById('rgb-info').innerHTML = 
                    '&lt;div style=&quot;display: flex; gap: 5px; margin: 5px 0;&quot;&gt;' +
                    '&lt;span style=&quot;background: #ffebee; color: #c62828; padding: 2px 6px; border-radius: 3px; font-size: 11px;&quot;&gt;R: ' + rgb.r + '&lt;/span&gt;' +
                    '&lt;span style=&quot;background: #e8f5e8; color: #2e7d32; padding: 2px 6px; border-radius: 3px; font-size: 11px;&quot;&gt;G: ' + rgb.g + '&lt;/span&gt;' +
                    '&lt;span style=&quot;background: #e3f2fd; color: #1565c0; padding: 2px 6px; border-radius: 3px; font-size: 11px;&quot;&gt;B: ' + rgb.b + '&lt;/span&gt;' +
                    '&lt;/div&gt;' +
                    '&lt;div style=&quot;font-size: 11px; color: #666;&quot;&gt;Position: (' + rgb.x + ', ' + rgb.y + ')&lt;/div&gt;' +
                    '&lt;div style=&quot;width: 30px; height: 20px; background: rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + '); border: 1px solid #ccc; margin: 5px 0;&quot;&gt;&lt;/div&gt;';
                  
                  // Update data storage
                  const textarea = document.querySelector('textarea[name=&quot;rgb_data&quot;]');
                  if (textarea) {
                    textarea.value = JSON.stringify({extractions: rgbData, total: rgbData.length}, null, 2);
                    textarea.dispatchEvent(new Event('input', {bubbles: true}));
                  }
                  
                } catch (error) {
                  console.warn('RGB extraction error:', error);
                }
              });
            }
          });
        }, 1000);
      }
      
      // Initialize when page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRGBExtractor);
      } else {
        initRGBExtractor();
      }
      
      // Re-initialize when new content loads
      setTimeout(initRGBExtractor, 2000);
      setTimeout(initRGBExtractor, 5000);
    &lt;/script&gt;
  "/>
  
  <!-- Image display -->
  <Image name="image" value="$image" zoom="true" zoomBy="1.5" crosshair="true"/>
  
  <!-- Brush annotation -->
  <BrushLabels name="brush" toName="image">
    <Label value="object" background="red"/>
    <Label value="background" background="blue"/>
    <Label value="region_of_interest" background="green"/>
    <Label value="defect" background="orange"/>
    <Label value="highlight" background="yellow"/>
  </BrushLabels>
  
  <!-- RGB Data Storage -->
  <TextArea name="rgb_data" toName="image" 
            placeholder="RGB extraction data will appear here..." 
            rows="6" required="false"/>
  
  <!-- Analysis Notes -->
  <TextArea name="analysis_notes" toName="image" 
            placeholder="Add your analysis notes..." 
            rows="3" required="false"/>
  
  <!-- Classification -->
  <Choices name="object_type" toName="image" choice="single">
    <Choice value="product"/>
    <Choice value="defective_item"/>
    <Choice value="sample"/>
    <Choice value="other"/>
  </Choices>
  
</View>
```

### Benefits:
- ✅ Embedded directly in Label Studio
- ✅ Persists across page reloads
- ✅ Works with any Label Studio version
- ✅ No browser console needed

## Method 4: Standalone Testing First

If you want to test the full functionality before integrating:

### Steps:

1. **Run the standalone demo**:
```bash
./test_demo.sh
```

2. **Test all features** at http://localhost:8000/advanced_rgb_visualizer.html

3. **Once satisfied**, integrate using Method 1 or 3

## Method 5: User Script (Advanced)

For regular use, create a user script with Tampermonkey or Greasemonkey.

### Steps:

1. **Install Tampermonkey** browser extension
2. **Create a new user script** with this template:

```javascript
// ==UserScript==
// @name         Label Studio RGB Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add RGB extraction to Label Studio
// @author       You
// @match        http://localhost:8080/*
// @match        https://your-label-studio-domain.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Load Chart.js
    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(chartScript);
    
    chartScript.onload = function() {
        // Paste the contents of advanced_label_studio_plugin.js here
    };
})();
```

## 🎯 Recommended Approach

### For Quick Testing:
**Use Method 1** (Browser Console) - immediate results, perfect for evaluation

### For Production Use:
**Use Method 3** (Modified Label Configuration) - most reliable and persistent

### For Development:
**Use Method 4** (Standalone Testing) first, then implement Method 3

## 🔧 Troubleshooting

### If RGB extraction doesn't work:
1. **Check browser console** for errors (F12)
2. **Verify Chart.js is loaded** (should see no errors about Chart)
3. **Refresh the page** and try again
4. **Make sure images are loaded** before clicking

### If the widget doesn't appear:
1. **Wait a few seconds** after page load
2. **Try scrolling** to trigger layout updates
3. **Check if it's hidden** behind other elements (try zooming out)

### Performance considerations:
- The inline script version (Method 3) is lighter but has fewer features
- The full plugin (Method 1) has all advanced features including graphs
- Choose based on your specific needs

All methods will give you RGB extraction functionality - the difference is in features and persistence!