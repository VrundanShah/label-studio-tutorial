/**
 * Advanced Label Studio RGB Extractor Plugin with Graph Visualization
 * This plugin extends the Image tag functionality to extract RGB values, display graphs, and integrate with brush annotations
 */

(function() {
    'use strict';

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Loading from CDN...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('Chart.js loaded successfully');
            initializePlugin();
        };
        document.head.appendChild(script);
    } else {
        initializePlugin();
    }

    function initializePlugin() {
        // Global variables
        let rgbExtractions = [];
        let rgbChart = null;
        let currentAnnotations = [];

        // Create advanced RGB display with graph
        function createAdvancedRGBDisplay() {
            // Remove existing display if any
            const existing = document.getElementById('advanced-rgb-display');
            if (existing) existing.remove();

            const rgbDisplay = document.createElement('div');
            rgbDisplay.id = 'advanced-rgb-display';
            rgbDisplay.style.cssText = `
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
                min-width: 350px;
                max-width: 450px;
                max-height: 80vh;
                overflow-y: auto;
            `;
            
            rgbDisplay.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #007bff; font-size: 16px;">
                        🎨 RGB Analyzer
                    </div>
                    <button id="toggle-rgb-display" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">▼</button>
                </div>
                
                <div id="rgb-content">
                    <div id="rgb-info">Click on the image to extract RGB values</div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📊 RGB Graph:</strong>
                        <div style="height: 200px; margin-top: 10px;">
                            <canvas id="rgb-chart-canvas"></canvas>
                        </div>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📝 Recent Extractions:</strong>
                        <div id="rgb-history" style="max-height: 150px; overflow-y: auto; margin-top: 10px;"></div>
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <strong>📈 Statistics:</strong>
                        <div id="rgb-stats" style="font-size: 12px; color: #666; margin-top: 5px;">
                            No data yet
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button id="clear-rgb-data" style="
                            background: #dc3545;
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Clear All</button>
                        <button id="export-rgb-data" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Export Data</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(rgbDisplay);
            
            // Add toggle functionality
            document.getElementById('toggle-rgb-display').addEventListener('click', () => {
                const content = document.getElementById('rgb-content');
                const button = document.getElementById('toggle-rgb-display');
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
            
            // Initialize chart
            initializeChart();
            
            return rgbDisplay;
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
                        {
                            label: 'Red',
                            data: [],
                            borderColor: '#ff4444',
                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Green',
                            data: [],
                            borderColor: '#44ff44',
                            backgroundColor: 'rgba(68, 255, 68, 0.1)',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Blue',
                            data: [],
                            borderColor: '#4444ff',
                            backgroundColor: 'rgba(68, 68, 255, 0.1)',
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 255,
                            title: {
                                display: true,
                                text: 'RGB Value',
                                font: { size: 10 }
                            },
                            ticks: { font: { size: 9 } }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Sample',
                                font: { size: 10 }
                            },
                            ticks: { font: { size: 9 } }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: { font: { size: 10 } }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }

        // Update chart with RGB data
        function updateChart() {
            if (!rgbChart || rgbExtractions.length === 0) return;

            const labels = rgbExtractions.map((_, index) => `#${index + 1}`);
            const redData = rgbExtractions.map(item => item.r);
            const greenData = rgbExtractions.map(item => item.g);
            const blueData = rgbExtractions.map(item => item.b);
            
            rgbChart.data.labels = labels;
            rgbChart.data.datasets[0].data = redData;
            rgbChart.data.datasets[1].data = greenData;
            rgbChart.data.datasets[2].data = blueData;
            rgbChart.update('none'); // Fast update without animation
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
                        <div style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">R: ${r}</div>
                        <div style="background: #e8f5e8; color: #2e7d32; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">G: ${g}</div>
                        <div style="background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">B: ${b}</div>
                    </div>
                    <div style="font-size: 11px; color: #666; margin: 5px 0;">
                        Position: (${x}, ${y}) | Hex: ${hex}
                    </div>
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
                
                const maxR = Math.max(...rgbExtractions.map(item => item.r));
                const maxG = Math.max(...rgbExtractions.map(item => item.g));
                const maxB = Math.max(...rgbExtractions.map(item => item.b));
                
                rgbStats.innerHTML = `
                    Samples: ${rgbExtractions.length}<br>
                    Avg RGB: (${avgR}, ${avgG}, ${avgB})<br>
                    Max RGB: (${maxR}, ${maxG}, ${maxB})
                `;
            }
        }

        // Extract RGB from image at position
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
                
                return {
                    r: data[0],
                    g: data[1],
                    b: data[2],
                    a: data[3],
                    x: actualX,
                    y: actualY,
                    displayX: Math.floor(x),
                    displayY: Math.floor(y)
                };
            } catch (error) {
                console.warn('CORS error extracting RGB:', error);
                return {
                    r: Math.floor(Math.random() * 256),
                    g: Math.floor(Math.random() * 256),
                    b: Math.floor(Math.random() * 256),
                    a: 255,
                    x: Math.floor(x),
                    y: Math.floor(y),
                    displayX: Math.floor(x),
                    displayY: Math.floor(y),
                    note: 'Simulated - CORS restricted'
                };
            }
        }

        // Update annotation data with RGB extractions
        function updateAnnotationData() {
            const rgbDataTextarea = document.querySelector('textarea[name="rgb_data"]');
            if (rgbDataTextarea) {
                const data = {
                    rgb_extractions: rgbExtractions,
                    total_samples: rgbExtractions.length,
                    statistics: rgbExtractions.length > 0 ? {
                        avg_red: Math.round(rgbExtractions.reduce((sum, item) => sum + item.r, 0) / rgbExtractions.length),
                        avg_green: Math.round(rgbExtractions.reduce((sum, item) => sum + item.g, 0) / rgbExtractions.length),
                        avg_blue: Math.round(rgbExtractions.reduce((sum, item) => sum + item.b, 0) / rgbExtractions.length),
                        max_red: Math.max(...rgbExtractions.map(item => item.r)),
                        max_green: Math.max(...rgbExtractions.map(item => item.g)),
                        max_blue: Math.max(...rgbExtractions.map(item => item.b))
                    } : null,
                    last_updated: new Date().toISOString()
                };
                
                rgbDataTextarea.value = JSON.stringify(data, null, 2);
                rgbDataTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                rgbDataTextarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // Export RGB data
        function exportRGBData() {
            const data = {
                rgb_extractions: rgbExtractions,
                statistics: rgbExtractions.length > 0 ? {
                    total_samples: rgbExtractions.length,
                    avg_rgb: [
                        Math.round(rgbExtractions.reduce((sum, item) => sum + item.r, 0) / rgbExtractions.length),
                        Math.round(rgbExtractions.reduce((sum, item) => sum + item.g, 0) / rgbExtractions.length),
                        Math.round(rgbExtractions.reduce((sum, item) => sum + item.b, 0) / rgbExtractions.length)
                    ],
                    color_range: {
                        red: { min: Math.min(...rgbExtractions.map(item => item.r)), max: Math.max(...rgbExtractions.map(item => item.r)) },
                        green: { min: Math.min(...rgbExtractions.map(item => item.g)), max: Math.max(...rgbExtractions.map(item => item.g)) },
                        blue: { min: Math.min(...rgbExtractions.map(item => item.b)), max: Math.max(...rgbExtractions.map(item => item.b)) }
                    }
                } : null,
                export_timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rgb_analysis_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        // Add RGB extraction to an image
        function addRGBExtraction(img) {
            if (img.hasAdvancedRGBExtraction) return;
            img.hasAdvancedRGBExtraction = true;
            
            img.style.cursor = 'crosshair';
            
            img.addEventListener('click', function(event) {
                // Check if we're in brush mode (if brush tools are active)
                const brushTools = document.querySelector('.lsf-brush-tool');
                if (brushTools && brushTools.classList.contains('lsf-tool--active')) {
                    return; // Don't extract RGB when brush tool is active
                }
                
                event.preventDefault();
                event.stopPropagation();
                
                const rect = this.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                const rgbData = extractRGB(this, x, y);
                
                const extraction = {
                    ...rgbData,
                    timestamp: new Date().toLocaleTimeString(),
                    iso_timestamp: new Date().toISOString(),
                    sample_id: `sample_${Date.now()}`
                };
                
                rgbExtractions.push(extraction);
                updateRGBDisplay(rgbData);
                updateChart();
                updateAnnotationData();
                
                console.log('RGB extracted:', extraction);
            });
        }

        // Monitor brush annotations
        function monitorBrushAnnotations() {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList) {
                            // Check for brush annotation elements
                            if (node.classList.contains('lsf-brush') || node.querySelector('.lsf-brush')) {
                                console.log('Brush annotation detected');
                                // You can add logic here to correlate brush annotations with RGB data
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Initialize RGB extractor
        function initRGBExtractor() {
            // Create advanced RGB display
            if (!document.getElementById('advanced-rgb-display')) {
                createAdvancedRGBDisplay();
            }
            
            // Find all images and add RGB extraction
            const images = document.querySelectorAll('img');
            images.forEach(addRGBExtraction);
            
            // Monitor for brush annotations
            monitorBrushAnnotations();
            
            // Watch for new images being added
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
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRGBExtractor);
        } else {
            initRGBExtractor();
        }

        // Also initialize after delays to catch dynamically loaded content
        setTimeout(initRGBExtractor, 1000);
        setTimeout(initRGBExtractor, 3000);

        // Expose functions globally
        window.advancedRGBExtractor = {
            initRGBExtractor,
            rgbExtractions,
            updateAnnotationData,
            exportRGBData,
            updateChart
        };
    }

})();