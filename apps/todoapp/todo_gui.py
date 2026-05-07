# Import functions module
import functions
# pip install FreeSimpleGUI
import FreeSimpleGUI as sg
import time

# File path for todos storage
FILEPATH = "C:\\Users\\harin\\Desktop\\Newt Global\\apps\\todoapp\\todos.txt"

# GUI Layout
# Set theme to DarkPurple4
sg.theme('DarkPurple4')

# Clock display
clock=sg.Text('', key='clock')
# User instruction label
label = sg.Text("Type in a to-do")
# Input field for todos
input_box = sg.InputText(tooltip="Enter Todo", key='todo')
# Add button with image and hover effect
add_button = sg.Button("Add", size=2, image_source="C:\\Users\\harin\\Desktop\\Newt Global\\apps\\todoapp\\add.png", mouseover_colors="LightBlue2")
# Edit button
edit_button = sg.Button("Edit", size=(10, 1))
# Complete button with image
complete_button = sg.Button("Complete", size=(10, 1),image_source="C:\\Users\\harin\\Desktop\\Newt Global\\apps\\todoapp\\complete.png")
# Exit button
exit_button = sg.Button("Exit", size=(10, 1))

# Listbox to display todos
list_box = sg.Listbox(values=functions.get_todos(FILEPATH), key='todos', 
                      enable_events=True, size=(45, 10))

# Layout: rows of elements
layout = [
    [clock],                                    # Clock row
    [label],                                    # Label row
    [input_box, add_button],                    # Input and Add row
    [list_box, edit_button, complete_button],   # List and buttons row
    [exit_button]                               # Exit button row
]

# Create window with title and font
window = sg.Window("My Todo App", layout=layout, font=('Helvetica',20))

# Main event loop
while True:
    # Read user interactions (10ms timeout)
    event, values = window.read(timeout=10)
    
    # Update clock every 10ms
    current_time = time.strftime("%H:%M:%S")
    window['clock'].update(current_time)
    
    # Exit conditions
    if event == sg.WIN_CLOSED or event == "Exit":
        break
    
    # Add button handler
    if event == "Add":
        todo = values['todo']  # Get input text
        if todo.strip():  # Check if not empty
            todos = functions.get_todos(FILEPATH)  # Load todos
            todos.append(todo + '\n')  # Add new todo
            functions.write_todos(FILEPATH, todos)  # Save to file
            window['todos'].update(values=todos)  # Update list
            window['todo'].update('')  # Clear input
    
    # Edit button handler
    if event == "Edit":
        try:
            todo_to_edit = values['todos'][0]  # Get selected item
            new_todo = values['todo']  # Get new text
            
            if new_todo.strip():  # Check if not empty
                todos = functions.get_todos(FILEPATH)  # Load todos
                index = todos.index(todo_to_edit)  # Find item position
                todos[index] = new_todo + '\n'  # Replace text
                functions.write_todos(FILEPATH, todos)  # Save to file
                window['todos'].update(values=todos)  # Update list
                window['todo'].update('')  # Clear input
        except IndexError:
            sg.popup("Please select an item to edit", title="Error")
    
    # Complete button handler
    if event == "Complete":
        try:
            todo_to_complete = values['todos'][0]  # Get selected item
            todos = functions.get_todos(FILEPATH)  # Load todos
            todos.remove(todo_to_complete)  # Remove item
            functions.write_todos(FILEPATH, todos)  # Save to file
            window['todos'].update(values=todos)  # Update list
            window['todo'].update('')  # Clear input
            sg.popup(f"Completed: {todo_to_complete.strip()}", title="Task Completed")
        except IndexError:
            sg.popup("Please select an item to complete", title="Error")
    
    # Listbox selection handler
    if event == 'todos':
        try:
            selected_todo = values['todos'][0].strip('\n')  # Get selected item
            window['todo'].update(selected_todo)  # Put in input box
        except IndexError:
            pass  # Do nothing if no selection

# Close window
window.close()


















# Installed PyInstaller
# PyInstaller is used to convert Python applications into standalone .exe files

# Tried installing PyInstaller globally using pip
# pip install pyinstaller

# Got a PowerShell path error because the folder name had spaces ("Newt Global")
# Fixed it by using quotes around the full path

# Installed PyInstaller inside the virtual environment (.venv)
# & "C:\Users\harin\Desktop\Newt Global\.venv\Scripts\python.exe" -m pip install pyinstaller

# Attempted to create a standalone executable
# pyinstaller --onefile --windowed --clean todo_gui.py

# --onefile  -> Packages everything into a single .exe file
# --windowed -> Prevents terminal window from opening for GUI apps
# --clean    -> Clears old build/cache files before packaging

# PyInstaller failed because todo_gui.py was not in the current directory

# Discovered that todo_gui.py is located inside:
# apps\todoapp\

# Navigated into the correct folder
# cd apps\todoapp

# Correct command to generate the executable
# pyinstaller --onefile --windowed todo_gui.py

# The generated executable will appear inside:
# dist\todo_gui.exe

# The application also uses image assets:
# add.png
# complete.png

# If images are missing in the executable, use:
# pyinstaller --onefile --windowed --add-data "add.png;." --add-data "complete.png;." todo_gui.py

# todos.txt is used to store tasks for the application

# Successfully learned the process of converting a Python GUI app into a standalone Windows executable