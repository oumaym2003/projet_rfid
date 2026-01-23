from django import forms

class ImageUploadForm(forms.Form):
    image = forms.ImageField(label='Select an image')
    
    DISEASE_CHOICES = [
        ('disease1', 'Disease 1'),
        ('disease2', 'Disease 2'),
        ('disease3', 'Disease 3'),
        ('disease4', 'Disease 4'),
        ('disease5', 'Disease 5'),
        ('disease6', 'Disease 6'),
        ('healthy', 'Healthy'),
    ]
    
    disease_type = forms.ChoiceField(choices=DISEASE_CHOICES, label='Select Disease Type')
    
    class Meta:
        fields = ['image', 'disease_type']