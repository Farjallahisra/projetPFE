# Intelligent Public Transport System

This project is designed to provide a comprehensive and intelligent public transport system for managing and tracking transportation services in real-time. It uses modern web technologies including MongoDB, Express.js, React, and Docker to ensure efficient and scalable service delivery.

## Features
- **Real-Time Tracking:** Provides live updates of vehicle locations and trip statuses.
- **Agency Management:** Allows the creation and management of transport agencies.
- **Route and Trip Management:** Manages routes, trips, stops, and schedules.
- **User Management:** Users can be assigned to agencies with JWT-based authentication.
- **Superadmin Functionality:** Default superadmin account is created for system initialization.
- **Scalable Data Storage:** MongoDB is used to store all data related to the system, including routes, trips, stops, and vehicles.
- **Web Interface:** React frontend provides a modern interface for users to interact with the system.

## Installation

### Prerequisites
- **Docker**: Ensure Docker is installed on your machine.
- **Docker Compose**: This is required to manage multi-container Docker applications.

### Getting Started

1. **Clone the Repository:**
   First, clone the repository to your local machine.

   ```bash
   git clone https://github.com/azizBfth/ipts-backend.git
   cd smart-bus-backend
   docker compose build
   docker compose up
