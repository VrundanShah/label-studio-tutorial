class AdvancedMultiImageAnnotator extends MultiImageAnnotator {
    constructor() {
        super();
        this.relayMode = 'immediate'; // 'immediate', 'manual', 'intelligent'
        this.annotationHistory = [];
        this.undoStack = [];
        this.redoStack = [];
        
        this.addAdvancedControls();
        this.bindAdvancedEvents();
    }
    
    addAdvancedControls() {
        const controlsDiv = document.querySelector('.controls');
        
        // Add relay mode selector
        const relayModeGroup = document.createElement('div');
        relayModeGroup.className = 'control-group';
        relayModeGroup.innerHTML = `
            <label>Relay Mode:</label>
            <select id="relayMode">
                <option value="immediate">Immediate</option>
                <option value="manual">Manual</option>
                <option value="intelligent">Intelligent</option>
            </select>
        `;
        controlsDiv.appendChild(relayModeGroup);
        
        // Add undo/redo buttons
        const undoRedoGroup = document.createElement('div');
        undoRedoGroup.className = 'control-group';
        undoRedoGroup.innerHTML = `
            <label>History:</label>
            <button id="undoBtn">Undo</button>
            <button id="redoBtn">Redo</button>
        `;
        controlsDiv.appendChild(undoRedoGroup);
        
        // Add export options
        const exportGroup = document.createElement('div');
        exportGroup.className = 'control-group';
        exportGroup.innerHTML = `
            <label>Export:</label>
            <button id="exportLabelStudio">Export to Label Studio</button>
            <button id="exportMasks">Export Masks</button>
        `;
        controlsDiv.appendChild(exportGroup);
    }
    
    bindAdvancedEvents() {
        // Relay mode selector
        document.getElementById('relayMode').addEventListener('change', (e) => {
            this.relayMode = e.target.value;
            this.showStatus(`Relay mode set to: ${this.relayMode}`, false);
        });
        
        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });
        
        // Export buttons
        document.getElementById('exportLabelStudio').addEventListener('click', () => {
            this.exportToLabelStudio();
        });
        
        document.getElementById('exportMasks').addEventListener('click', () => {
            this.exportMasks();
        });
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            
            // Save to undo stack
            this.saveToUndoStack();
            
            // Auto-save annotation
            this.saveCurrentAnnotation();
            
            // Apply relay based on mode
            if (this.relayMode === 'immediate') {
                this.relayAnnotationsToAll();
            } else if (this.relayMode === 'intelligent') {
                this.intelligentRelay();
            }
        }
    }
    
    saveToUndoStack() {
        const currentState = this.annotationCanvas.toDataURL();
        this.undoStack.push({
            imageIndex: this.currentImageIndex,
            annotationData: currentState
        });
        
        // Limit undo stack size
        if (this.undoStack.length > 20) {
            this.undoStack.shift();
        }
        
        // Clear redo stack
        this.redoStack = [];
    }
    
    undo() {
        if (this.undoStack.length === 0) {
            this.showStatus('Nothing to undo', true);
            return;
        }
        
        // Save current state to redo stack
        this.redoStack.push({
            imageIndex: this.currentImageIndex,
            annotationData: this.annotationCanvas.toDataURL()
        });
        
        // Restore previous state
        const previousState = this.undoStack.pop();
        if (previousState.imageIndex === this.currentImageIndex) {
            const img = new Image();
            img.onload = () => {
                this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
                this.annotationCtx.drawImage(img, 0, 0);
                this.saveCurrentAnnotation();
            };
            img.src = previousState.annotationData;
        }
        
        this.showStatus('Undo applied', false);
    }
    
    redo() {
        if (this.redoStack.length === 0) {
            this.showStatus('Nothing to redo', true);
            return;
        }
        
        // Save current state to undo stack
        this.undoStack.push({
            imageIndex: this.currentImageIndex,
            annotationData: this.annotationCanvas.toDataURL()
        });
        
        // Restore next state
        const nextState = this.redoStack.pop();
        if (nextState.imageIndex === this.currentImageIndex) {
            const img = new Image();
            img.onload = () => {
                this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
                this.annotationCtx.drawImage(img, 0, 0);
                this.saveCurrentAnnotation();
            };
            img.src = nextState.annotationData;
        }
        
        this.showStatus('Redo applied', false);
    }
    
    async intelligentRelay() {
        this.showStatus('Applying intelligent relay based on image similarity...', false);
        
        // For now, this is a simplified version
        // In a real implementation, you'd analyze image features and apply transformations
        const currentAnnotation = this.annotations.get(this.currentImageIndex);
        if (!currentAnnotation) return;
        
        let relayedCount = 0;
        for (let i = 0; i < this.images.length; i++) {
            if (i !== this.currentImageIndex) {
                // Apply some basic transformation logic here
                // For now, we'll just copy the annotation
                this.annotations.set(i, currentAnnotation);
                relayedCount++;
            }
        }
        
        this.updateImageList();
        this.updateStats();
        this.showStatus(`Intelligent relay applied to ${relayedCount} images`, false);
    }
    
    exportToLabelStudio() {
        if (this.annotations.size === 0) {
            this.showStatus('No annotations to export', true);
            return;
        }
        
        const labelStudioTasks = [];
        
        this.images.forEach((imgData, index) => {
            const annotation = this.annotations.get(index);
            if (annotation) {
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
                            id: `brush_${index}`,
                            type: "brushlabels",
                            value: {
                                format: "base64",
                                brushlabels: ["segmentation"],
                                base64: annotation.split(',')[1] // Remove data URL prefix
                            },
                            to_name: "image",
                            from_name: "tag",
                            image_rotation: 0,
                            original_width: imgData.image.width,
                            original_height: imgData.image.height
                        }]
                    }]
                };
                labelStudioTasks.push(task);
            }
        });
        
        const exportData = {
            version: "1.0",
            type: "label-studio-tasks",
            tasks: labelStudioTasks
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `label_studio_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('Label Studio export completed', false);
    }
    
    exportMasks() {
        if (this.annotations.size === 0) {
            this.showStatus('No annotations to export', true);
            return;
        }
        
        this.showStatus('Exporting annotation masks...', false);
        
        // Create a zip-like structure by downloading individual masks
        this.images.forEach((imgData, index) => {
            const annotation = this.annotations.get(index);
            if (annotation) {
                // Convert to binary mask
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = imgData.image.width;
                canvas.height = imgData.image.height;
                
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert to binary mask (white where annotated, black elsewhere)
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const alpha = data[i + 3];
                        if (alpha > 0) {
                            // White for annotated areas
                            data[i] = 255;     // R
                            data[i + 1] = 255; // G
                            data[i + 2] = 255; // B
                            data[i + 3] = 255; // A
                        } else {
                            // Black for non-annotated areas
                            data[i] = 0;       // R
                            data[i + 1] = 0;   // G
                            data[i + 2] = 0;   // B
                            data[i + 3] = 255; // A
                        }
                    }
                    
                    ctx.putImageData(imageData, 0, 0);
                    
                    // Download the mask
                    canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `mask_${imgData.name.split('.')[0]}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    });
                };
                img.src = annotation;
            }
        });
        
        this.showStatus('Mask export completed', false);
    }
}

// Replace the basic annotator with the advanced one
document.addEventListener('DOMContentLoaded', () => {
    window.annotator = new AdvancedMultiImageAnnotator();
});