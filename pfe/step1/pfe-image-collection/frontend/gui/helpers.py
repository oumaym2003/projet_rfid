def validate_image_file(file_path):
    # Function to validate if the uploaded file is an image
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    return any(file_path.lower().endswith(ext) for ext in valid_extensions)

def resize_image(image, max_size=(800, 800)):
    # Function to resize an image while maintaining aspect ratio
    from PIL import Image
    image.thumbnail(max_size, Image.ANTIALIAS)
    return image

def save_image(image, save_path):
    # Function to save the image to the specified path
    image.save(save_path)

def get_disease_types():
    # Function to return a list of disease types for the dropdown menu
    return [
        "Maladie 1",
        "Maladie 2",
        "Maladie 3",
        "Maladie 4",
        "Maladie 5",
        "Maladie 6",
        "Saine"
    ]