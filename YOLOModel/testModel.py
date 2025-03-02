import cv2
from collections import Counter
from ultralytics import YOLO

# Load the YOLO model
model = YOLO("yolo12s.pt")  # Make sure to download the YOLOv8 model first

# Open webcam (change to video file path if needed)
capture = cv2.VideoCapture(0)

while capture.isOpened():
    ret, frame = capture.read()
    if not ret:
        break

    # Run YOLO model inference
    results = model(frame)
    
    class_counts = Counter()
    
    # Process results
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0].item())  # Class ID
            class_counts[class_id] += 1
    
    # Determine most common class
    if class_counts:
        most_common_class = class_counts.most_common(1)[0][0]
        print(f"Most common class: {model.names[most_common_class]}")
    
    # Show frame
    cv2.imshow("YOLO Detection", frame)
    
    # Exit when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
capture.release()
cv2.destroyAllWindows()
