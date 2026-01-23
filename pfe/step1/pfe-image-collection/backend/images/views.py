from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ImageUploadForm
from .models import ImageModel

def upload_image(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            image_instance = form.save()
            return redirect('success')  # Redirect to a success page or another view
    else:
        form = ImageUploadForm()
    return render(request, 'upload_image.html', {'form': form})

def success(request):
    return HttpResponse("Image uploaded successfully!")