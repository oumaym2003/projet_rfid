from django.contrib import admin
from .models import ImageModel  # Assuming you have an ImageModel defined in models.py

class ImageModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'disease_type', 'created_at')  # Customize as per your model fields
    search_fields = ('disease_type',)
    list_filter = ('disease_type',)

admin.site.register(ImageModel, ImageModelAdmin)