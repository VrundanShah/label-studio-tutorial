class EnhancedAnnotator extends AdvancedMultiImageAnnotator {
    constructor() {
        super();
        this.serverUrl = 'http://localhost:5000/api';
        this.isServerAvailable = false;
        this.checkServerHealth();
        
        // Enhanced relay options
        this.relayOptions = {
            immediate: true,
            useIntelligentMatching: false,
            confidenceThreshold: 0.7,
            batchSize: 10
        };
        
        this.addEnhancedControls();
        this.bindEnhancedEvents();
    }
    
    async checkServerHealth() {
        try {
            const response = await fetch(`${this.serverUrl}/health`);
            if (response.ok) {
                this.isServerAvailable = true;
                this.showStatus('Server connected - Advanced features available', false);
            }
        } catch (error) {
            this.isServerAvailable = false;
            this.showStatus('Server not available - Using client-side features only', false);
        }
    }
    
    addEnhancedControls() {
        const controlsDiv = document.querySelector('.controls');
        
        // Add enhanced relay options
        const enhancedGroup = document.createElement('div');
        enhancedGroup.className = 'control-group';
        enhancedGroup.innerHTML = `
            <label>Enhanced Options:</label>
            <label><input type="checkbox" id="immediateRelay" checked> Immediate Relay</label>
            <label><input type="checkbox" id="intelligentMatching"> Intelligent Matching</label>
            <button id="batchProcess">Batch Process</button>
        `;
        controlsDiv.appendChild(enhancedGroup);
        
        // Add progress indicator
        const progressGroup = document.createElement('div');
        progressGroup.className = 'control-group';
        progressGroup.innerHTML = `
            <div id="progressContainer" style="display: none;">
                <label>Progress:</label>
                <div style="background: #ecf0f1; border-radius: 10px; overflow: hidden; width: 200px; height: 20px;">
                    <div id="progressBar" style="background: #3498db; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
                <span id="progressText">0%</span>
            </div>
        `;
        controlsDiv.appendChild(progressGroup);
    }
    
    bindEnhancedEvents() {
        // Enhanced options
        document.getElementById('immediateRelay').addEventListener('change', (e) => {
            this.relayOptions.immediate = e.target.checked;
        });
        
        document.getElementById('intelligentMatching').addEventListener('change', (e) => {
            this.relayOptions.useIntelligentMatching = e.target.checked;
        });
        
        document.getElementById('batchProcess').addEventListener('click', () => {
            this.batchProcessAnnotations();
        });
    }
    
    async stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            
            // Save to undo stack
            this.saveToUndoStack();
            
            // Auto-save annotation
            this.saveCurrentAnnotation();
            
            // Apply enhanced relay
            if (this.relayOptions.immediate) {
                await this.enhancedRelay();
            }
        }
    }
    
    async enhancedRelay() {
        if (this.images.length === 0) return;
        
        const currentAnnotation = this.annotations.get(this.currentImageIndex);
        if (!currentAnnotation) return;
        
        if (this.isServerAvailable && this.relayOptions.useIntelligentMatching) {
            await this.serverBasedRelay();
        } else {
            this.relayAnnotationsToAll();
        }
    }
    
    async serverBasedRelay() {
        try {
            this.showProgress(0, 'Preparing annotation data...');
            
            const currentAnnotation = this.annotations.get(this.currentImageIndex);
            const imageList = this.images.map(img => img.name);
            
            const requestData = {
                annotation: currentAnnotation,
                images: imageList,
                relay_mode: 'intelligent'
            };
            
            this.showProgress(30, 'Sending to server...');
            
            const response = await fetch(`${this.serverUrl}/process_annotation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            this.showProgress(70, 'Processing response...');
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Apply the relayed annotations
                    let appliedCount = 0;
                    for (const [imagePath, annotationData] of Object.entries(result.relayed_annotations)) {
                        const imageIndex = this.images.findIndex(img => img.name === imagePath);
                        if (imageIndex !== -1 && imageIndex !== this.currentImageIndex) {
                            this.annotations.set(imageIndex, annotationData.annotation);
                            appliedCount++;
                        }
                    }
                    
                    this.showProgress(100, 'Complete!');
                    this.updateImageList();
                    this.updateStats();
                    this.showStatus(`Intelligent relay applied to ${appliedCount} images`, false);
                } else {
                    throw new Error('Server processing failed');
                }
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
            
        } catch (error) {
            this.showStatus('Server relay failed, using local relay: ' + error.message, true);
            this.relayAnnotationsToAll();
        } finally {
            this.hideProgress();
        }
    }
    
    async batchProcessAnnotations() {
        if (!this.isServerAvailable) {
            this.showStatus('Server not available for batch processing', true);
            return;
        }
        
        try {
            this.showProgress(0, 'Starting batch process...');
            
            // Prepare annotation data
            const annotationData = {
                images: this.images.map(img => img.name),
                annotations: Object.fromEntries(this.annotations),
                timestamp: new Date().toISOString()
            };
            
            // Save annotation file temporarily
            const blob = new Blob([JSON.stringify(annotationData)], { type: 'application/json' });
            const formData = new FormData();
            formData.append('annotation_file', blob, 'temp_annotations.json');
            
            this.showProgress(50, 'Processing batch...');
            
            const response = await fetch(`${this.serverUrl}/batch_process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    annotation_file: 'temp_annotations.json',
                    image_directory: '/workspace/images'
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showProgress(100, 'Batch processing complete!');
                this.showStatus(`Batch processed: ${result.results.successful_annotations} successful, ${result.results.failed_annotations} failed`, false);
            } else {
                throw new Error(`Batch processing failed: ${response.status}`);
            }
            
        } catch (error) {
            this.showStatus('Batch processing error: ' + error.message, true);
        } finally {
            this.hideProgress();
        }
    }
    
    showProgress(percentage, text) {
        const container = document.getElementById('progressContainer');
        const bar = document.getElementById('progressBar');
        const textElement = document.getElementById('progressText');
        
        container.style.display = 'block';
        bar.style.width = `${percentage}%`;
        textElement.textContent = `${percentage}% - ${text}`;
    }
    
    hideProgress() {
        setTimeout(() => {
            document.getElementById('progressContainer').style.display = 'none';
        }, 2000);
    }
    
    async exportToLabelStudio() {
        if (this.annotations.size === 0) {
            this.showStatus('No annotations to export', true);
            return;
        }
        
        if (this.isServerAvailable) {
            // Use server-based export for enhanced features
            await this.serverBasedExport();
        } else {
            // Use client-side export
            super.exportToLabelStudio();
        }
    }
    
    async serverBasedExport() {
        try {
            this.showProgress(0, 'Preparing export data...');
            
            const exportData = {
                annotations: Object.fromEntries(this.annotations),
                images: this.images.map(img => ({
                    name: img.name,
                    width: img.image.width,
                    height: img.image.height
                }))
            };
            
            this.showProgress(50, 'Generating Label Studio format...');
            
            const response = await fetch(`${this.serverUrl}/export_labelstudio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exportData)
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Download the export
                    const blob = new Blob([JSON.stringify(result.tasks, null, 2)], {
                        type: 'application/json'
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `labelstudio_export_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    this.showProgress(100, 'Export complete!');
                    this.showStatus(`Exported ${result.total_tasks} annotated tasks`, false);
                } else {
                    throw new Error('Export processing failed');
                }
            } else {
                throw new Error(`Export failed: ${response.status}`);
            }
            
        } catch (error) {
            this.showStatus('Server export failed, using local export: ' + error.message, true);
            super.exportToLabelStudio();
        } finally {
            this.hideProgress();
        }
    }
    
    // Enhanced keyboard shortcuts
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch(e.key.toLowerCase()) {
                case 'b':
                    this.setTool('brush');
                    break;
                case 'e':
                    this.setTool('eraser');
                    break;
                case 'r':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.enhancedRelay();
                    }
                    break;
                case 'i':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('intelligentMatching').click();
                    }
                    break;
                case 'p':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.batchProcessAnnotations();
                    }
                    break;
            }
        });
    }
    
    // Auto-save functionality
    enableAutoSave(intervalMs = 30000) {
        setInterval(() => {
            if (this.annotations.size > 0) {
                const autoSaveData = {
                    annotations: Object.fromEntries(this.annotations),
                    images: this.images.map(img => img.name),
                    timestamp: new Date().toISOString(),
                    auto_save: true
                };
                
                localStorage.setItem('annotation_autosave', JSON.stringify(autoSaveData));
            }
        }, intervalMs);
    }
    
    loadAutoSave() {
        const autoSaveData = localStorage.getItem('annotation_autosave');
        if (autoSaveData) {
            try {
                const data = JSON.parse(autoSaveData);
                
                // Only load if we have matching images
                const currentImageNames = this.images.map(img => img.name);
                const savedImageNames = data.images || [];
                
                if (JSON.stringify(currentImageNames.sort()) === JSON.stringify(savedImageNames.sort())) {
                    // Load annotations
                    this.annotations.clear();
                    for (const [index, annotationData] of Object.entries(data.annotations)) {
                        this.annotations.set(parseInt(index), annotationData);
                    }
                    
                    this.loadCurrentAnnotation();
                    this.updateImageList();
                    this.updateStats();
                    this.showStatus('Auto-saved annotations restored', false);
                    
                    // Clear auto-save
                    localStorage.removeItem('annotation_autosave');
                }
            } catch (error) {
                console.error('Error loading auto-save:', error);
            }
        }
    }
    
    async loadImages(files) {
        await super.loadImages(files);
        
        // Enable auto-save after loading images
        this.enableAutoSave();
        
        // Try to load auto-save
        this.loadAutoSave();
        
        // Bind enhanced keyboard shortcuts
        this.bindKeyboardShortcuts();
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            annotationTime: [],
            relayTime: [],
            renderTime: []
        };
    }
    
    startTimer(operation) {
        this[`${operation}StartTime`] = performance.now();
    }
    
    endTimer(operation) {
        const endTime = performance.now();
        const startTime = this[`${operation}StartTime`];
        if (startTime) {
            const duration = endTime - startTime;
            this.metrics[`${operation}Time`].push(duration);
            
            // Keep only last 100 measurements
            if (this.metrics[`${operation}Time`].length > 100) {
                this.metrics[`${operation}Time`].shift();
            }
        }
    }
    
    getAverageTime(operation) {
        const times = this.metrics[`${operation}Time`];
        if (times.length === 0) return 0;
        return times.reduce((a, b) => a + b, 0) / times.length;
    }
    
    getMetricsSummary() {
        return {
            avgAnnotationTime: this.getAverageTime('annotation'),
            avgRelayTime: this.getAverageTime('relay'),
            avgRenderTime: this.getAverageTime('render'),
            totalAnnotations: this.metrics.annotationTime.length
        };
    }
}

// Annotation quality checker
class QualityChecker {
    static analyzeAnnotationQuality(annotationCanvas) {
        const ctx = annotationCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, annotationCanvas.width, annotationCanvas.height);
        const data = imageData.data;
        
        let annotatedPixels = 0;
        let totalPixels = data.length / 4;
        
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) {
                annotatedPixels++;
            }
        }
        
        const coverage = annotatedPixels / totalPixels;
        
        return {
            coverage: coverage,
            annotatedPixels: annotatedPixels,
            totalPixels: totalPixels,
            quality: coverage > 0.01 ? (coverage < 0.8 ? 'good' : 'excessive') : 'sparse'
        };
    }
    
    static suggestImprovements(quality) {
        const suggestions = [];
        
        if (quality.coverage < 0.01) {
            suggestions.push('Annotation coverage is very low. Consider adding more detail.');
        } else if (quality.coverage > 0.8) {
            suggestions.push('Annotation coverage is very high. Consider being more selective.');
        }
        
        return suggestions;
    }
}

// Initialize enhanced annotator
document.addEventListener('DOMContentLoaded', () => {
    window.annotator = new EnhancedAnnotator();
    window.performanceMonitor = new PerformanceMonitor();
    
    // Add quality feedback
    const originalStopDrawing = window.annotator.stopDrawing;
    window.annotator.stopDrawing = async function() {
        const quality = QualityChecker.analyzeAnnotationQuality(this.annotationCanvas);
        const suggestions = QualityChecker.suggestImprovements(quality);
        
        if (suggestions.length > 0) {
            console.log('Annotation quality suggestions:', suggestions);
        }
        
        window.performanceMonitor.startTimer('annotation');
        await originalStopDrawing.call(this);
        window.performanceMonitor.endTimer('annotation');
    };
    
    // Show performance metrics periodically
    setInterval(() => {
        const metrics = window.performanceMonitor.getMetricsSummary();
        if (metrics.totalAnnotations > 0) {
            console.log('Performance metrics:', metrics);
        }
    }, 60000); // Every minute
});