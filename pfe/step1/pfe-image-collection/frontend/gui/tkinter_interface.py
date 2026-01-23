from tkinter import Tk, Label, Button, Entry, StringVar, IntVar, Radiobutton, filedialog, messagebox, OptionMenu
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

        self.disease_type = StringVar()
        self.disease_options = ["Disease 1", "Disease 2", "Disease 3", "Disease 4", "Disease 5", "Disease 6", "Healthy"]
        self.disease_menu = OptionMenu(master, self.disease_type, *self.disease_options)
        self.disease_menu.pack()

        self.type_label = Label(master, text="Select Type:")
        self.type_label.pack()

        self.type_var = IntVar()
        Radiobutton(master, text="Type A", variable=self.type_var, value=1).pack()
        Radiobutton(master, text="Type B", variable=self.type_var, value=2).pack()
        Radiobutton(master, text="Type C", variable=self.type_var, value=3).pack()

        self.submit_button = Button(master, text="Submit", command=self.submit)
        self.submit_button.pack()

    def browse_image(self):
        filename = filedialog.askopenfilename(filetypes=[("Image Files", "*.jpg;*.jpeg;*.png;*.gif")])
        if filename:
            self.image_path.set(filename)

    def submit(self):
        image_file = self.image_path.get()
        disease = self.disease_type.get()
        type_selected = self.type_var.get()

        if not image_file or not disease or type_selected == 0:
            messagebox.showerror("Error", "Please fill all fields.")
            return

        # Here you would typically handle the image upload and renaming logic
        # For demonstration, we will just show a success message
        messagebox.showinfo("Success", f"Image: {os.path.basename(image_file)}\nDisease: {disease}\nType: {type_selected} submitted successfully!")

if __name__ == "__main__":
    root = Tk()
    app = ImageUploader(root)
    root.mainloop()