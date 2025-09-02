#!/usr/bin/env python3
"""
Advanced annotation processor for multi-image segmentation
Provides backend support for intelligent annotation relay and processing
"""

import json
import base64
import numpy as np
import cv2
from PIL import Image
import io
import os
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class AnnotationData:
    image_name: str
    annotation_mask: np.ndarray
    confidence: float = 1.0
    metadata: Dict = None

class AnnotationProcessor:
    def __init__(self):
        self.images = {}
        self.annotations = {}
        self.template_matcher = TemplateMatcher()
        
    def load_images_from_directory(self, directory_path: str) -> List[str]:
        """Load all images from a directory"""
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
        image_files = []
        
        for file_path in Path(directory_path).iterdir():
            if file_path.suffix.lower() in image_extensions:
                image_files.append(str(file_path))
                
        return sorted(image_files)
    
    def base64_to_mask(self, base64_data: str, image_shape: Tuple[int, int]) -> np.ndarray:
        """Convert base64 annotation data to binary mask"""
        try:
            # Remove data URL prefix if present
            if ',' in base64_data:
                base64_data = base64_data.split(',')[1]
            
            # Decode base64 to image
            image_data = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to numpy array
            mask_array = np.array(image)
            
            # Convert to binary mask (assuming red channel contains annotation)
            if len(mask_array.shape) == 3:
                # Use alpha channel if available, otherwise red channel
                if mask_array.shape[2] == 4:
                    binary_mask = (mask_array[:, :, 3] > 0).astype(np.uint8)
                else:
                    binary_mask = (mask_array[:, :, 0] > 0).astype(np.uint8)
            else:
                binary_mask = (mask_array > 0).astype(np.uint8)
            
            return binary_mask
            
        except Exception as e:
            print(f"Error converting base64 to mask: {e}")
            return np.zeros(image_shape, dtype=np.uint8)
    
    def mask_to_base64(self, mask: np.ndarray) -> str:
        """Convert binary mask to base64 annotation data"""
        # Create RGBA image from mask
        rgba_image = np.zeros((mask.shape[0], mask.shape[1], 4), dtype=np.uint8)
        rgba_image[:, :, 0] = mask * 255  # Red channel
        rgba_image[:, :, 3] = mask * 180  # Alpha channel (semi-transparent)
        
        # Convert to PIL Image and then to base64
        pil_image = Image.fromarray(rgba_image, 'RGBA')
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        
        base64_data = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{base64_data}"
    
    def intelligent_relay(self, source_annotation: AnnotationData, 
                         target_images: List[str]) -> Dict[str, AnnotationData]:
        """Apply intelligent relay using template matching and image analysis"""
        results = {}
        
        source_mask = source_annotation.annotation_mask
        
        for target_image_path in target_images:
            try:
                # Load target image
                target_image = cv2.imread(target_image_path)
                if target_image is None:
                    continue
                
                # Apply template matching and transformation
                transformed_mask = self.template_matcher.match_and_transform(
                    source_mask, target_image
                )
                
                # Calculate confidence based on image similarity
                confidence = self.calculate_relay_confidence(source_annotation, target_image)
                
                results[target_image_path] = AnnotationData(
                    image_name=os.path.basename(target_image_path),
                    annotation_mask=transformed_mask,
                    confidence=confidence,
                    metadata={
                        'relay_method': 'intelligent',
                        'source_image': source_annotation.image_name
                    }
                )
                
            except Exception as e:
                print(f"Error processing {target_image_path}: {e}")
                continue
        
        return results
    
    def calculate_relay_confidence(self, source_annotation: AnnotationData, 
                                 target_image: np.ndarray) -> float:
        """Calculate confidence score for annotation relay"""
        # Simplified confidence calculation
        # In practice, you'd use more sophisticated image similarity metrics
        return 0.8  # Placeholder
    
    def batch_process_annotations(self, annotation_file: str, 
                                image_directory: str) -> Dict[str, any]:
        """Process annotations in batch mode"""
        try:
            with open(annotation_file, 'r') as f:
                annotation_data = json.load(f)
            
            image_files = self.load_images_from_directory(image_directory)
            results = {
                'processed_images': len(image_files),
                'successful_annotations': 0,
                'failed_annotations': 0,
                'annotations': {}
            }
            
            # Process each annotation
            for image_index, base64_annotation in annotation_data.get('annotations', {}).items():
                try:
                    image_index = int(image_index)
                    if image_index < len(image_files):
                        image_path = image_files[image_index]
                        image = cv2.imread(image_path)
                        
                        # Convert annotation to mask
                        mask = self.base64_to_mask(base64_annotation, image.shape[:2])
                        
                        # Store annotation
                        annotation = AnnotationData(
                            image_name=os.path.basename(image_path),
                            annotation_mask=mask
                        )
                        
                        results['annotations'][image_path] = annotation
                        results['successful_annotations'] += 1
                        
                except Exception as e:
                    print(f"Error processing annotation for image {image_index}: {e}")
                    results['failed_annotations'] += 1
            
            return results
            
        except Exception as e:
            print(f"Error in batch processing: {e}")
            return {'error': str(e)}

class TemplateMatcher:
    """Handles template matching and transformation for annotation relay"""
    
    def __init__(self):
        self.feature_detector = cv2.SIFT_create()
        self.matcher = cv2.BFMatcher()
    
    def match_and_transform(self, source_mask: np.ndarray, 
                          target_image: np.ndarray) -> np.ndarray:
        """Match template and transform annotation mask"""
        try:
            # For now, return the source mask as-is
            # In a real implementation, you'd:
            # 1. Detect keypoints in both images
            # 2. Match features
            # 3. Calculate homography
            # 4. Transform the mask accordingly
            
            target_height, target_width = target_image.shape[:2]
            
            # Resize mask to match target image dimensions
            if source_mask.shape != (target_height, target_width):
                transformed_mask = cv2.resize(source_mask, (target_width, target_height))
            else:
                transformed_mask = source_mask.copy()
            
            return transformed_mask
            
        except Exception as e:
            print(f"Error in template matching: {e}")
            return np.zeros((target_image.shape[0], target_image.shape[1]), dtype=np.uint8)
    
    def find_keypoints_and_match(self, img1: np.ndarray, img2: np.ndarray) -> Optional[np.ndarray]:
        """Find keypoints and match between two images"""
        try:
            # Convert to grayscale
            gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY) if len(img1.shape) == 3 else img1
            gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY) if len(img2.shape) == 3 else img2
            
            # Detect keypoints and descriptors
            kp1, des1 = self.feature_detector.detectAndCompute(gray1, None)
            kp2, des2 = self.feature_detector.detectAndCompute(gray2, None)
            
            if des1 is None or des2 is None:
                return None
            
            # Match features
            matches = self.matcher.knnMatch(des1, des2, k=2)
            
            # Apply ratio test
            good_matches = []
            for match_pair in matches:
                if len(match_pair) == 2:
                    m, n = match_pair
                    if m.distance < 0.75 * n.distance:
                        good_matches.append(m)
            
            if len(good_matches) < 4:
                return None
            
            # Extract matched keypoints
            src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
            dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)
            
            # Find homography
            homography, _ = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
            
            return homography
            
        except Exception as e:
            print(f"Error in keypoint matching: {e}")
            return None

def create_sample_config():
    """Create a sample configuration file"""
    config = {
        "annotation_settings": {
            "brush_size": 10,
            "opacity": 0.7,
            "auto_relay": True,
            "relay_mode": "immediate"
        },
        "export_settings": {
            "format": "label_studio",
            "include_confidence": True,
            "export_masks": True
        },
        "processing_settings": {
            "use_template_matching": True,
            "similarity_threshold": 0.7,
            "max_transformation_error": 10.0
        }
    }
    
    with open('/workspace/config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    return config

if __name__ == "__main__":
    # Create sample configuration
    config = create_sample_config()
    print("Annotation processor initialized")
    print("Configuration saved to config.json")
    
    # Example usage
    processor = AnnotationProcessor()
    
    # Load images from directory (if exists)
    if os.path.exists('/workspace/images'):
        image_files = processor.load_images_from_directory('/workspace/images')
        print(f"Found {len(image_files)} images in /workspace/images")
    else:
        print("Create an 'images' directory and add your images there")
        os.makedirs('/workspace/images', exist_ok=True)