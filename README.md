# SAEV - Smart Autonomous Electric Vehicle

## Overview

SAEV (Smart Autonomous Electric Vehicle) is an autonomous vehicle prototype that combines 5G communication, LiDAR-based mapping, QR-code localization, and edge computing to achieve intelligent navigation, real-time tracking, and vehicle-to-vehicle communication.

The system leverages ROS for modular software integration, MQTT for lightweight communication, and 5G network slicing to provide reliable low-latency connectivity for autonomous operations.

---

## Features

### Autonomous Navigation
- LiDAR-based obstacle detection
- Real-time environment mapping
- Autonomous path planning
- Dynamic obstacle avoidance

### Localization
- QR-code based absolute positioning
- Wheel encoder odometry
- Extended Kalman Filter (EKF) sensor fusion
- Improved localization accuracy

### 5G Connectivity
- Low-latency communication
- Network slicing for QoS management
- Real-time vehicle monitoring
- Remote access and control

### Vehicle-to-Vehicle (V2V) Communication
- Position sharing between vehicles
- Traffic awareness
- Cooperative autonomous behavior

### Edge Computing
- Raspberry Pi hosted web application
- Local processing for reduced latency
- Real-time telemetry visualization

### IoT Integration
- MQTT-based communication
- Sensor data streaming
- Remote monitoring dashboard

---

## System Architecture

```
Sensors
│
├── LiDAR
├── QR Camera
└── Wheel Encoders
        │
        ▼
Localization & Mapping
(EKF + SLAM)
        │
        ▼
ROS Control Stack
        │
        ▼
Motor Control System
        │
        ▼
Vehicle Motion
        │
        ▼
5G Network
        │
        ▼
MQTT Broker
        │
        ▼
Web Dashboard
(Raspberry Pi Edge Server)
```

---

## Technologies Used

### Hardware
- Raspberry Pi
- LiDAR Sensor
- Camera Module
- Wheel Encoders
- Motor Driver
- Electric Vehicle Chassis
- 5G Communication Module

### Software
- ROS (Robot Operating System)
- Python
- MQTT
- SLAM Algorithms
- EKF Sensor Fusion
- Linux
- Web Technologies (HTML, CSS, JavaScript)

---

## Applications

- Autonomous Transportation Research
- Smart Mobility Solutions
- Intelligent Traffic Systems
- Warehouse Automation
- Campus Navigation Systems
- Vehicle-to-Vehicle Communication Research

---

## Objectives

- Develop a low-cost autonomous vehicle prototype.
- Achieve accurate localization using QR markers and sensor fusion.
- Enable real-time monitoring through a web interface.
- Utilize 5G network slicing for reliable communication.
- Demonstrate autonomous navigation and obstacle avoidance.

---

## Project Highlights

- Real-time LiDAR mapping
- QR-based localization system
- 5G-enabled communication framework
- ROS-based modular architecture
- MQTT telemetry system
- Edge-hosted dashboard on Raspberry Pi
- V2V communication capability

---

## Future Improvements

- AI-based object detection
- Traffic sign recognition
- Multi-vehicle coordination
- Cloud analytics integration
- Autonomous parking
- Advanced route optimization

---

## Team Project

This project was developed as a capstone project focusing on autonomous mobility, robotics, IoT, and next-generation communication technologies.

---

## License

This project is intended for educational and research purposes.