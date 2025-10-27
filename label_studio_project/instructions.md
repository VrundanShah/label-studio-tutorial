# RGB Extraction Instructions

## How to use:

1. **Click on the image** at any pixel location to extract RGB values
2. **View RGB information** in the RGB Color Information section
3. **Store extraction data** in the RGB data text area (JSON format)
4. **Mark important points** using the KeyPoint tool if needed
5. **Categorize the image** using the classification options

## RGB Data Format:

Store your RGB extractions in this JSON format:
```json
{
  "clicks": [
    {
      "x": 100,
      "y": 150,
      "rgb": [255, 128, 64],
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Tips:

- Use the zoom feature to get precise pixel locations
- The crosshair cursor helps with accurate clicking
- RGB values range from 0-255 for each color channel
- Store multiple clicks for comprehensive color analysis
