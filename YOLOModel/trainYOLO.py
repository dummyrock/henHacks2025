from ultralytics import YOLO

model = YOLO('yolo12s.pt')

results = model.train(data="C:/Users/Dylan Frajerman/Desktop/School/henHacks2025/YOLOModel/Mediready Injury classifier.v1i.yolov12/data.yaml",epochs=100, imgsz=640)
