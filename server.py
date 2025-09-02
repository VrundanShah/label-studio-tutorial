#!/usr/bin/env python3
"""
Flask server for advanced annotation processing
Provides API endpoints for intelligent annotation relay
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from annotation_processor import AnnotationProcessor, AnnotationData
import base64
import numpy as np
import cv2
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Initialize the annotation processor
processor = AnnotationProcessor()

@app.route('/')
def serve_index():
    """Serve the main annotation interface"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/process_annotation', methods=['POST'])
def process_annotation():
    """Process and relay annotation to similar images"""
    try:
        data = request.get_json()
        
        source_annotation = data.get('annotation')
        image_list = data.get('images', [])
        relay_mode = data.get('relay_mode', 'simple')
        
        if not source_annotation or not image_list:
            return jsonify({'error': 'Missing annotation or image list'}), 400
        
        # Convert base64 annotation to mask
        mask = processor.base64_to_mask(source_annotation, (512, 512))  # Default size
        
        source_data = AnnotationData(
            image_name="source",
            annotation_mask=mask
        )
        
        if relay_mode == 'intelligent':
            # Apply intelligent relay
            results = processor.intelligent_relay(source_data, image_list)
        else:
            # Simple relay - copy annotation to all images
            results = {}
            for image_path in image_list:
                results[image_path] = AnnotationData(
                    image_name=os.path.basename(image_path),
                    annotation_mask=mask,
                    confidence=1.0
                )
        
        # Convert results back to base64 format
        response_data = {}
        for image_path, annotation_data in results.items():
            response_data[image_path] = {
                'annotation': processor.mask_to_base64(annotation_data.annotation_mask),
                'confidence': annotation_data.confidence,
                'metadata': annotation_data.metadata or {}
            }
        
        return jsonify({
            'success': True,
            'relayed_annotations': response_data,
            'total_relayed': len(response_data)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export_labelstudio', methods=['POST'])
def export_labelstudio():
    """Export annotations in Label Studio format"""
    try:
        data = request.get_json()
        annotations = data.get('annotations', {})
        images = data.get('images', [])
        
        tasks = []
        
        for i, image_info in enumerate(images):
            if str(i) in annotations:
                annotation_base64 = annotations[str(i)]
                
                task = {
                    "id": i + 1,
                    "data": {
                        "image": f"/data/upload/{image_info['name']}"
                    },
                    "annotations": [{
                        "id": 1,
                        "created_username": "annotator",
                        "created_ago": "0 minutes",
                        "result": [{
                            "id": f"brush_{i}",
                            "type": "brushlabels",
                            "value": {
                                "format": "base64",
                                "brushlabels": ["segmentation"],
                                "base64": annotation_base64.split(',')[1] if ',' in annotation_base64 else annotation_base64
                            },
                            "to_name": "image",
                            "from_name": "tag",
                            "image_rotation": 0,
                            "original_width": image_info.get('width', 800),
                            "original_height": image_info.get('height', 600)
                        }]
                    }]
                }
                tasks.append(task)
        
        return jsonify({
            'success': True,
            'tasks': tasks,
            'total_tasks': len(tasks)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/batch_process', methods=['POST'])
def batch_process():
    """Process multiple images in batch mode"""
    try:
        data = request.get_json()
        annotation_file = data.get('annotation_file')
        image_directory = data.get('image_directory', '/workspace/images')
        
        if not annotation_file:
            return jsonify({'error': 'No annotation file provided'}), 400
        
        # Process annotations
        results = processor.batch_process_annotations(annotation_file, image_directory)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/similarity_analysis', methods=['POST'])
def similarity_analysis():
    """Analyze similarity between images for better relay decisions"""
    try:
        data = request.get_json()
        image_paths = data.get('images', [])
        
        if len(image_paths) < 2:
            return jsonify({'error': 'Need at least 2 images for similarity analysis'}), 400
        
        similarity_matrix = []
        
        for i, img1_path in enumerate(image_paths):
            row = []
            for j, img2_path in enumerate(image_paths):
                if i == j:
                    similarity = 1.0
                else:
                    # Calculate similarity (simplified)
                    similarity = 0.5  # Placeholder
                row.append(similarity)
            similarity_matrix.append(row)
        
        return jsonify({
            'success': True,
            'similarity_matrix': similarity_matrix,
            'image_paths': image_paths
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'processor_ready': True,
        'features': [
            'brush_annotation',
            'intelligent_relay',
            'batch_processing',
            'labelstudio_export',
            'template_matching'
        ]
    })

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('/workspace/images', exist_ok=True)
    os.makedirs('/workspace/exports', exist_ok=True)
    
    print("Starting Multi-Image Annotation Server...")
    print("Features available:")
    print("- Brush-based segmentation annotation")
    print("- Automatic annotation relay")
    print("- Intelligent template matching")
    print("- Label Studio export")
    print("- Batch processing")
    print("\nAccess the interface at: http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)