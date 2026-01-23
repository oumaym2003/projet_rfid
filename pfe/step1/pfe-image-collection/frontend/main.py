from tkinter import Tk, Label, Button, Entry, StringVar, IntVar, Radiobutton, Checkbutton, filedialog, messagebox
import os

class ImageUploader:
    def __init__(self, master):
        self.master = master
        master.title("Image Upload Interface")

        self.label = Label(master, text="Select an Image:")
        self.label.pack()

        self.image_path = StringVar()
        self.entry = Entry(master, textvariable=self.image_path, width=50)
        self.entry.pack()

        self.browse_button = Button(master, text="Browse", command=self.browse_image)
        self.browse_button.pack()

        self.disease_label = Label(master, text="Select Disease Type:")
        self.disease_label.pack()

        self.disease_var = StringVar()
        self.disease_options = ["Disease 1", "Disease 2", "Disease 3", "Disease 4", "Disease 5", "Disease 6", "Healthy"]
        for disease in self.disease_options:
            Radiobutton(master, text=disease, variable=self.disease_var, value=disease).pack(anchor='w')

        self.type_label = Label(master, text="Select Type:")
        self.type_label.pack()

        self.type_var = IntVar()
        Checkbutton(master, text="Type A", variable=self.type_var, onvalue=1, offvalue=0).pack(anchor='w')
        Checkbutton(master, text="Type B", variable=self.type_var, onvalue=1, offvalue=0).pack(anchor='w')

        self.submit_button = Button(master, text="Submit", command=self.submit)
        self.submit_button.pack()

    def browse_image(self):
        filename = filedialog.askopenfilename(filetypes=[("Image Files", "*.jpg;*.jpeg;*.png")])
        if filename:
            self.image_path.set(filename)

    def submit(self):
        image_file = self.image_path.get()
        disease_type = self.disease_var.get()
        selected_type = "Type A" if self.type_var.get() == 1 else "Type B"

        if not image_file or not disease_type:
            messagebox.showerror("Error", "Please select an image and a disease type.")
            return

        # Here you would typically send the data to the backend or process it
        # For now, we will just show a message
        messagebox.showinfo("Success", f"Image: {os.path.basename(image_file)}\nDisease: {disease_type}\nType: {selected_type} submitted successfully!")

if __name__ == "__main__":
    root = Tk()
    app = ImageUploader(root)
    root.mainloop()