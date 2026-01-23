# pfe-image-collection

This project is dedicated to the collection and classification of medical images to assist in the development of an algorithm for disease recognition. The application is designed for medical professionals to upload images and categorize them based on specific diseases.

## Project Structure

The project is divided into two main components: the backend and the frontend.

### Backend

The backend is built using Django and includes the following components:

- **manage.py**: Command-line utility for managing the Django project.
- **pfe_backend/**: Contains the main settings and configuration for the Django application.
  - **settings.py**: Configuration settings for the Django project.
  - **urls.py**: URL routing for the application.
  - **wsgi.py**: Entry point for WSGI-compatible web servers.
- **images/**: The application responsible for handling image uploads and processing.
  - **models.py**: Defines the data models for storing images and metadata.
  - **views.py**: Contains the logic for handling requests and responses.
  - **forms.py**: Defines forms for user input, including image uploads and disease selection.
  - **admin.py**: Registers models with the Django admin site for management.
  - **urls.py**: URL routing specific to the images application.
- **requirements.txt**: Lists the required Python packages for the backend.

### Frontend

The frontend is built using Tkinter and includes the following components:

- **main.py**: Entry point for the Tkinter application, initializing the GUI.
- **gui/**: Contains the GUI-related code.
  - **tkinter_interface.py**: Implements the Tkinter interface for image upload and disease selection.
  - **helpers.py**: Includes helper functions for image processing and validation.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd pfe-image-collection
   ```

2. **Set up the backend**:
   - Navigate to the `backend` directory.
   - Install the required packages:
     ```
     pip install -r requirements.txt
     ```
   - Run database migrations:
     ```
     python manage.py migrate
     ```
   - Start the Django server:
     ```
     python manage.py runserver
     ```

3. **Set up the frontend**:
   - Navigate to the `frontend` directory.
   - Run the Tkinter application:
     ```
     python main.py
     ```

## Usage

- Medical professionals can use the Tkinter interface to upload images and classify them into predefined disease categories.
- The application will assist in collecting a dataset that can be used for training machine learning algorithms for disease recognition.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.