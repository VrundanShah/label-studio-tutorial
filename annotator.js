class MultiImageAnnotator {
    constructor() {
        this.images = [];
        this.annotations = new Map(); // Map of image index to annotation data
        this.currentImageIndex = 0;
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.brushSize = 10;
        this.brushOpacity = 0.7;
        this.autoRelay = true; // Auto-relay annotations as they're created
        
        this.initializeCanvases();
        this.bindEvents();
        this.showStatus('Load images to start annotating', false);
    }
    
    initializeCanvases() {
        this.imageCanvas = document.getElementById('imageCanvas');
        this.annotationCanvas = document.getElementById('annotationCanvas');
        this.imageCtx = this.imageCanvas.getContext('2d');
        this.annotationCtx = this.annotationCanvas.getContext('2d');
        
        // Set canvas properties
        this.annotationCtx.lineCap = 'round';
        this.annotationCtx.lineJoin = 'round';
    }
    
    bindEvents() {
        // File input
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.loadImages(e.target.files);
        });
        
        // Brush controls
        const brushSizeSlider = document.getElementById('brushSize');
        const brushOpacitySlider = document.getElementById('brushOpacity');
        
        brushSizeSlider.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeValue').textContent = this.brushSize;
        });
        
        brushOpacitySlider.addEventListener('input', (e) => {
            this.brushOpacity = parseFloat(e.target.value);
            document.getElementById('brushOpacityValue').textContent = this.brushOpacity;
        });
        
        // Tool buttons
        document.getElementById('brushTool').addEventListener('click', () => {
            this.setTool('brush');
        });
        
        document.getElementById('eraserTool').addEventListener('click', () => {
            this.setTool('eraser');
        });
        
        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearCurrentAnnotation();
        });
        
        // Action buttons
        document.getElementById('relayAnnotations').addEventListener('click', () => {
            this.relayAnnotationsToAll();
        });
        
        document.getElementById('saveAnnotations').addEventListener('click', () => {
            this.saveAnnotations();
        });
        
        document.getElementById('loadAnnotations').addEventListener('click', () => {
            this.loadAnnotations();
        });
        
        // Canvas events
        this.annotationCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.annotationCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.annotationCanvas.addEventListener('mouseup', () => this.stopDrawing());
        this.annotationCanvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events for mobile support
        this.annotationCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.annotationCanvas.dispatchEvent(mouseEvent);
        });
        
        this.annotationCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.annotationCanvas.dispatchEvent(mouseEvent);
        });
        
        this.annotationCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.annotationCanvas.dispatchEvent(mouseEvent);
        });
    }
    
    async loadImages(files) {
        this.images = [];
        this.annotations.clear();
        
        this.showStatus('Loading images...', false);
        
        const imagePromises = Array.from(files).map((file, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        image: img,
                        name: file.name,
                        file: file,
                        index: index
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        });
        
        try {
            this.images = await Promise.all(imagePromises);
            this.currentImageIndex = 0;
            this.updateImageList();
            this.displayCurrentImage();
            this.updateStats();
            this.showStatus(`Loaded ${this.images.length} images successfully`, false);
        } catch (error) {
            this.showStatus('Error loading images: ' + error.message, true);
        }
    }
    
    updateImageList() {
        const container = document.getElementById('imageListContainer');
        container.innerHTML = '';
        
        this.images.forEach((imgData, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';
            if (index === this.currentImageIndex) {
                item.classList.add('active');
            }
            if (this.annotations.has(index)) {
                item.classList.add('annotated');
            }
            
            item.innerHTML = `
                <div style="font-weight: bold;">${imgData.name}</div>
                <div style="font-size: 12px; color: #666;">
                    ${imgData.image.width} x ${imgData.image.height}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.switchToImage(index);
            });
            
            container.appendChild(item);
        });
    }
    
    switchToImage(index) {
        if (index >= 0 && index < this.images.length) {
            // Save current annotation before switching
            this.saveCurrentAnnotation();
            
            this.currentImageIndex = index;
            this.displayCurrentImage();
            this.loadCurrentAnnotation();
            this.updateImageList();
            this.updateStats();
        }
    }
    
    displayCurrentImage() {
        if (this.images.length === 0) return;
        
        const imgData = this.images[this.currentImageIndex];
        const img = imgData.image;
        
        // Resize canvases to fit image
        this.imageCanvas.width = img.width;
        this.imageCanvas.height = img.height;
        this.annotationCanvas.width = img.width;
        this.annotationCanvas.height = img.height;
        
        // Clear and draw image
        this.imageCtx.clearRect(0, 0, img.width, img.height);
        this.imageCtx.drawImage(img, 0, 0);
        
        // Update current image name
        document.getElementById('currentImageName').textContent = imgData.name;
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // Update button states
        document.querySelectorAll('.controls button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tool === 'brush') {
            document.getElementById('brushTool').classList.add('active');
            this.annotationCanvas.style.cursor = 'crosshair';
        } else if (tool === 'eraser') {
            document.getElementById('eraserTool').classList.add('active');
            this.annotationCanvas.style.cursor = 'crosshair';
        }
    }
    
    getMousePos(e) {
        const rect = this.annotationCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        
        this.annotationCtx.globalCompositeOperation = 
            this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        this.annotationCtx.globalAlpha = this.brushOpacity;
        this.annotationCtx.strokeStyle = '#ff0000'; // Red color for annotations
        this.annotationCtx.lineWidth = this.brushSize;
        
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(this.lastX, this.lastY);
        this.annotationCtx.lineTo(pos.x, pos.y);
        this.annotationCtx.stroke();
        
        this.lastX = pos.x;
        this.lastY = pos.y;
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            
            // Auto-save annotation and relay if enabled
            this.saveCurrentAnnotation();
            
            if (this.autoRelay) {
                this.relayAnnotationsToAll();
            }
        }
    }
    
    saveCurrentAnnotation() {
        if (this.images.length === 0) return;
        
        // Save the current annotation canvas as image data
        const annotationData = this.annotationCanvas.toDataURL();
        this.annotations.set(this.currentImageIndex, annotationData);
        
        this.updateImageList();
        this.updateStats();
    }
    
    loadCurrentAnnotation() {
        if (this.images.length === 0) return;
        
        // Clear annotation canvas
        this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
        
        // Load annotation if exists
        const annotationData = this.annotations.get(this.currentImageIndex);
        if (annotationData) {
            const img = new Image();
            img.onload = () => {
                this.annotationCtx.drawImage(img, 0, 0);
            };
            img.src = annotationData;
        }
    }
    
    clearCurrentAnnotation() {
        if (this.images.length === 0) return;
        
        this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
        this.annotations.delete(this.currentImageIndex);
        this.updateImageList();
        this.updateStats();
        this.showStatus('Annotation cleared', false);
    }
    
    relayAnnotationsToAll() {
        if (this.images.length === 0) {
            this.showStatus('No images loaded', true);
            return;
        }
        
        // Get the current annotation
        const currentAnnotation = this.annotations.get(this.currentImageIndex);
        if (!currentAnnotation) {
            this.showStatus('No annotation to relay', true);
            return;
        }
        
        this.showStatus('Relaying annotations to all images...', false);
        
        // Apply current annotation to all images
        let relayedCount = 0;
        for (let i = 0; i < this.images.length; i++) {
            if (i !== this.currentImageIndex) {
                this.annotations.set(i, currentAnnotation);
                relayedCount++;
            }
        }
        
        this.updateImageList();
        this.updateStats();
        this.showStatus(`Annotation relayed to ${relayedCount} images`, false);
    }
    
    saveAnnotations() {
        if (this.annotations.size === 0) {
            this.showStatus('No annotations to save', true);
            return;
        }
        
        const annotationData = {
            images: this.images.map(img => img.name),
            annotations: Object.fromEntries(this.annotations),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(annotationData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annotations_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('Annotations saved successfully', false);
    }
    
    loadAnnotations() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Load annotations
                    this.annotations.clear();
                    for (const [index, annotationData] of Object.entries(data.annotations)) {
                        this.annotations.set(parseInt(index), annotationData);
                    }
                    
                    this.loadCurrentAnnotation();
                    this.updateImageList();
                    this.updateStats();
                    this.showStatus('Annotations loaded successfully', false);
                } catch (error) {
                    this.showStatus('Error loading annotations: ' + error.message, true);
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    updateStats() {
        document.getElementById('totalImages').textContent = this.images.length;
        document.getElementById('annotatedCount').textContent = this.annotations.size;
    }
    
    showStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = isError ? 'status error' : 'status';
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
    
    // Export annotations in Label Studio format
    exportLabelStudioFormat() {
        const tasks = [];
        
        this.images.forEach((imgData, index) => {
            const annotation = this.annotations.get(index);
            if (annotation) {
                // Convert canvas annotation to Label Studio brush format
                const task = {
                    id: index + 1,
                    data: {
                        image: `/data/upload/${imgData.name}`
                    },
                    annotations: [{
                        id: 1,
                        created_username: "annotator",
                        created_ago: "0 minutes",
                        result: [{
                            id: "brush_" + index,
                            type: "brushlabels",
                            value: {
                                format: "rle", // Run-length encoding
                                brushlabels: ["object"],
                                rle: this.canvasToRLE(annotation)
                            },
                            to_name: "image",
                            from_name: "tag",
                            image_rotation: 0,
                            original_width: imgData.image.width,
                            original_height: imgData.image.height
                        }]
                    }]
                };
                tasks.push(task);
            }
        });
        
        return tasks;
    }
    
    // Convert canvas annotation to RLE format (simplified)
    canvasToRLE(annotationDataUrl) {
        // This is a simplified RLE conversion
        // In a real implementation, you'd want to properly convert the canvas data
        return []; // Placeholder - would need proper RLE encoding
    }
    
    // Advanced feature: Template matching for automatic relay
    async relayWithTemplateMatching() {
        if (this.images.length === 0 || !this.annotations.has(this.currentImageIndex)) {
            this.showStatus('No annotation to relay with template matching', true);
            return;
        }
        
        this.showStatus('Applying template matching for intelligent relay...', false);
        
        // This would implement more sophisticated template matching
        // For now, we'll use the simple relay method
        this.relayAnnotationsToAll();
    }
}

// Initialize the annotator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.annotator = new MultiImageAnnotator();
});

// Add some utility functions for advanced features
class AnnotationUtils {
    static async preprocessImage(imageData) {
        // Placeholder for image preprocessing (normalization, etc.)
        return imageData;
    }
    
    static calculateSimilarity(annotation1, annotation2) {
        // Placeholder for annotation similarity calculation
        return 0.5;
    }
    
    static async applyTransformation(annotation, sourceImage, targetImage) {
        // Placeholder for applying transformations when relaying
        return annotation;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!window.annotator) return;
    
    switch(e.key) {
        case 'b':
        case 'B':
            window.annotator.setTool('brush');
            break;
        case 'e':
        case 'E':
            window.annotator.setTool('eraser');
            break;
        case 'c':
        case 'C':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                window.annotator.clearCurrentAnnotation();
            }
            break;
        case 'r':
        case 'R':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                window.annotator.relayAnnotationsToAll();
            }
            break;
        case 's':
        case 'S':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                window.annotator.saveAnnotations();
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (window.annotator.currentImageIndex > 0) {
                window.annotator.switchToImage(window.annotator.currentImageIndex - 1);
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (window.annotator.currentImageIndex < window.annotator.images.length - 1) {
                window.annotator.switchToImage(window.annotator.currentImageIndex + 1);
            }
            break;
    }
});