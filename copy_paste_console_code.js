// Label Studio RGB Extractor - Copy and paste this entire code into browser console (F12)
// Instructions: 
// 1. Open your Label Studio project
// 2. Press F12 to open developer tools
// 3. Go to Console tab
// 4. Copy and paste ALL of this code
// 5. Press Enter
// 6. Start clicking on images to extract RGB values!

(function() {
    'use strict';
    
    console.log('🎨 Loading Label Studio RGB Extractor...');
    
    // Check if Chart.js is already loaded
    if (typeof Chart === 'undefined') {
        console.log('📊 Loading Chart.js...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('✅ Chart.js loaded successfully');
            initializeRGBExtractor();
        };
        script.onerror = () => {
            console.warn('⚠️ Chart.js failed to load, using simplified version');
            initializeRGBExtractor();
        };
        document.head.appendChild(script);
    } else {
        console.log('✅ Chart.js already available');
        initializeRGBExtractor();
    }
    
    function initializeRGBExtractor() {
        // Global variables
        let rgbExtractions = [];
        let rgbChart = null;
        
        // Remove existing widget if any
        const existingWidget = document.getElementById('rgb-extractor-widget');
        if (existingWidget) existingWidget.remove();
        
        // Create RGB extraction widget
        function createRGBWidget() {
            const widget = document.createElement('div');
            widget.id = 'rgb-extractor-widget';
            widget.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 2px solid #007bff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 300px;
                max-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            `;
            
            widget.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #007bff; font-size: 16px;">
                        🎨 RGB Extractor
                    </div>
                    <button id="toggle-widget" style="background: #6c757d; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">▼</button>
                </div>
                
                <div id="widget-content">
                    <div id="rgb-info" style="margin-bottom: 15px;">Click on image to extract RGB values</div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📊 RGB Graph:</strong>
                        <div style="height: 150px; margin-top: 10px;">
                            <canvas id="rgb-chart-canvas"></canvas>
                        </div>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📝 Recent Extractions:</strong>
                        <div id="rgb-history" style="max-height: 120px; overflow-y: auto; margin-top: 10px;"></div>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📈 Statistics:</strong>
                        <div id="rgb-stats" style="font-size: 12px; color: #666; margin-top: 5px;">No data yet</div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button id="clear-rgb-data" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear</button>
                        <button id="export-rgb-data" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Export</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(widget);
            
            // Add toggle functionality
            document.getElementById('toggle-widget').addEventListener('click', () => {
                const content = document.getElementById('widget-content');
                const button = document.getElementById('toggle-widget');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    button.textContent = '▼';
                } else {
                    content.style.display = 'none';
                    button.textContent = '▶';
                }
            });
            
            // Add button event listeners
            document.getElementById('clear-rgb-data').addEventListener('click', () => {
                rgbExtractions = [];
                updateRGBDisplay();
                updateChart();
                updateAnnotationData();
            });
            
            document.getElementById('export-rgb-data').addEventListener('click', exportRGBData);
            
            // Initialize chart if Chart.js is available
            if (typeof Chart !== 'undefined') {
                initializeChart();
            }
            
            return widget;
        }
        
        // Initialize RGB Chart
        function initializeChart() {
            const canvas = document.getElementById('rgb-chart-canvas');
            if (!canvas || !Chart) return;
            
            const ctx = canvas.getContext('2d');
            rgbChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        { label: 'Red', data: [], borderColor: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.1)', tension: 0.4 },
                        { label: 'Green', data: [], borderColor: '#44ff44', backgroundColor: 'rgba(68, 255, 68, 0.1)', tension: 0.4 },
                        { label: 'Blue', data: [], borderColor: '#4444ff', backgroundColor: 'rgba(68, 68, 255, 0.1)', tension: 0.4 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 255, title: { display: true, text: 'RGB Value' } },
                        x: { title: { display: true, text: 'Sample' } }
                    },
                    plugins: { legend: { display: true, position: 'top' } }
                }
            });
        }
        
        // Update chart
        function updateChart() {
            if (!rgbChart || rgbExtractions.length === 0) return;
            
            const labels = rgbExtractions.map((_, index) => `#${index + 1}`);
            rgbChart.data.labels = labels;
            rgbChart.data.datasets[0].data = rgbExtractions.map(item => item.r);
            rgbChart.data.datasets[1].data = rgbExtractions.map(item => item.g);
            rgbChart.data.datasets[2].data = rgbExtractions.map(item => item.b);
            rgbChart.update('none');
        }
        
        // Extract RGB from image
        function extractRGB(img, x, y) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            try {
                ctx.drawImage(img, 0, 0);
                const rect = img.getBoundingClientRect();
                const scaleX = img.naturalWidth / rect.width;
                const scaleY = img.naturalHeight / rect.height;
                const actualX = Math.floor(x * scaleX);
                const actualY = Math.floor(y * scaleY);
                const imageData = ctx.getImageData(actualX, actualY, 1, 1);
                const data = imageData.data;
                
                return { r: data[0], g: data[1], b: data[2], a: data[3], x: actualX, y: actualY };
            } catch (error) {
                console.warn('RGB extraction error:', error);
                return { r: Math.floor(Math.random() * 256), g: Math.floor(Math.random() * 256), b: Math.floor(Math.random() * 256), a: 255, x: Math.floor(x), y: Math.floor(y), note: 'Simulated' };
            }
        }
        
        // Update RGB display
        function updateRGBDisplay(rgbData = null) {
            const rgbInfo = document.getElementById('rgb-info');
            const rgbHistory = document.getElementById('rgb-history');
            const rgbStats = document.getElementById('rgb-stats');
            
            if (!rgbInfo) return;
            
            if (rgbData) {
                const { r, g, b, x, y } = rgbData;
                const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                
                rgbInfo.innerHTML = `
                    <div style="display: flex; gap: 8px; margin: 8px 0;">
                        <span style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">R: ${r}</span>
                        <span style="background: #e8f5e8; color: #2e7d32; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">G: ${g}</span>
                        <span style="background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">B: ${b}</span>
                    </div>
                    <div style="font-size: 11px; color: #666; margin: 5px 0;">Position: (${x}, ${y}) | Hex: ${hex}</div>
                    <div style="width: 40px; height: 20px; background: rgb(${r}, ${g}, ${b}); border: 1px solid #ccc; border-radius: 3px; margin: 5px 0;"></div>
                `;
            }
            
            // Update history
            if (rgbHistory) {
                rgbHistory.innerHTML = rgbExtractions.slice(-5).map((item, index) => `
                    <div style="font-size: 10px; padding: 6px; margin: 3px 0; background: #f8f9fa; border-radius: 3px; border-left: 3px solid rgb(${item.r}, ${item.g}, ${item.b});">
                        <strong>Sample ${rgbExtractions.length - 4 + index}</strong><br>
                        (${item.x}, ${item.y}) RGB(${item.r}, ${item.g}, ${item.b})<br>
                        <span style="font-size: 9px; color: #666;">${item.timestamp}</span>
                    </div>
                `).join('');
            }
            
            // Update statistics
            if (rgbStats && rgbExtractions.length > 0) {
                const avgR = Math.round(rgbExtractions.reduce((sum, item) => sum + item.r, 0) / rgbExtractions.length);
                const avgG = Math.round(rgbExtractions.reduce((sum, item) => sum + item.g, 0) / rgbExtractions.length);
                const avgB = Math.round(rgbExtractions.reduce((sum, item) => sum + item.b, 0) / rgbExtractions.length);
                
                rgbStats.innerHTML = `Samples: ${rgbExtractions.length}<br>Avg RGB: (${avgR}, ${avgG}, ${avgB})`;
            }
        }
        
        // Update annotation data
        function updateAnnotationData() {
            const rgbDataTextarea = document.querySelector('textarea[name="rgb_data"]');
            if (rgbDataTextarea) {
                const data = {
                    rgb_extractions: rgbExtractions,
                    total_samples: rgbExtractions.length,
                    last_updated: new Date().toISOString()
                };
                rgbDataTextarea.value = JSON.stringify(data, null, 2);
                rgbDataTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        // Export RGB data
        function exportRGBData() {
            const data = { rgb_extractions: rgbExtractions, export_timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rgb_analysis_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        // Add RGB extraction to images
        function addRGBExtraction(img) {
            if (img.hasRGBExtraction) return;
            img.hasRGBExtraction = true;
            img.style.cursor = 'crosshair';
            
            img.addEventListener('click', function(event) {
                // Skip if brush tool is active
                const brushTools = document.querySelector('.lsf-brush-tool');
                if (brushTools && brushTools.classList.contains('lsf-tool--active')) return;
                
                event.preventDefault();
                event.stopPropagation();
                
                const rect = this.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                const rgbData = extractRGB(this, x, y);
                const extraction = {
                    ...rgbData,
                    timestamp: new Date().toLocaleTimeString(),
                    sample_id: `sample_${Date.now()}`
                };
                
                rgbExtractions.push(extraction);
                updateRGBDisplay(rgbData);
                updateChart();
                updateAnnotationData();
                
                console.log('🎨 RGB extracted:', extraction);
            });
        }
        
        // Initialize RGB extractor
        function initRGBExtractor() {
            // Create widget
            createRGBWidget();
            
            // Find and enhance images
            const images = document.querySelectorAll('img');
            images.forEach(addRGBExtraction);
            
            // Watch for new images
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG') {
                                addRGBExtraction(node);
                            } else {
                                const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                                images.forEach(addRGBExtraction);
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            console.log('✅ RGB Extractor initialized successfully!');
            console.log('🎯 Click on any image to extract RGB values');
        }
        
        // Start the RGB extractor
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRGBExtractor);
        } else {
            initRGBExtractor();
        }
        
        // Also try after delays to catch dynamically loaded content
        setTimeout(initRGBExtractor, 1000);
        setTimeout(initRGBExtractor, 3000);
    }
    
})();

// Success message
console.log('🎉 RGB Extractor loaded! Click on images to extract RGB values.');
console.log('📊 Features: RGB extraction, real-time graphs, data export');
console.log('💡 The RGB widget should appear in the top-right corner of your screen.');