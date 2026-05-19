import FreeSimpleGUI as sg
import json
import os
from datetime import datetime

class TodoManager:
    def __init__(self):
        self.data_file = "todos.json"
        self.todos = self.load_todos()
        self.window = None
        
    def load_todos(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    return json.load(f)
            except:
                return []
        return []
    
    def save_todos(self):
        with open(self.data_file, 'w') as f:
            json.dump(self.todos, f, indent=2)
    
    def add_todo(self, text, priority="Medium"):
        todo = {
            "id": len(self.todos) + 1,
            "text": text,
            "completed": False,
            "priority": priority,
            "created_date": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        self.todos.append(todo)
        self.save_todos()
    
    def delete_todo(self, todo_id):
        self.todos = [todo for todo in self.todos if todo["id"] != todo_id]
        self.save_todos()
    
    def complete_todo(self, todo_id):
        for todo in self.todos:
            if todo["id"] == todo_id:
                todo["completed"] = True
                break
        self.save_todos()
    
    def repeat_todo(self, todo_id):
        for todo in self.todos:
            if todo["id"] == todo_id:
                todo["completed"] = False
                break
        self.save_todos()
    
    def edit_todo(self, todo_id, new_text):
        for todo in self.todos:
            if todo["id"] == todo_id:
                todo["text"] = new_text
                break
        self.save_todos()

    def create_layout(self):
        todo_list = []
        for todo in self.todos:
            status = "✓" if todo["completed"] else "○"
            priority_color = {
                "High": "red",
                "Medium": "yellow", 
                "Low": "lime"
            }.get(todo["priority"], "white")
            
            todo_text = f"{status} [{todo['priority']}] {todo['text']}"
            if todo["completed"]:
                todo_text = f"[completed] {todo_text}"
            
            todo_list.append([
                sg.Text(todo_text, key=f"-TODO_{todo['id']}-", text_color=priority_color if not todo["completed"] else "gray"),
                sg.Button("Edit", key=f"-EDIT_{todo['id']}-", size=(5, 1)),
                sg.Button("Delete", key=f"-DELETE_{todo['id']}-", size=(6, 1)),
                sg.Button("Completed", key=f"-COMPLETE_{todo['id']}-", size=(8, 1), disabled=todo["completed"]),
                sg.Button("Repeat", key=f"-REPEAT_{todo['id']}-", size=(6, 1), disabled=not todo["completed"])
            ])
        
        layout = [
            [sg.Text("Todo Manager", font=("Helvetica", 16, "bold"))],
            [sg.Text("Add New Task:")],
            [
                sg.InputText(key="-NEW_TODO-", size=(40, 1)),
                sg.Combo(["High", "Medium", "Low"], default_value="Medium", key="-PRIORITY-", size=(8, 1)),
                sg.Button("Add Task", key="-ADD-", button_color=("white", "green"))
            ],
            [sg.HSeparator()],
            [sg.Text("Tasks:", font=("Helvetica", 12, "bold"))],
            [sg.Column(todo_list, scrollable=True, vertical_scroll_only=True, size=(600, 300))],
            [sg.HSeparator()],
            [
                sg.Button("Clear Completed", key="-CLEAR_COMPLETED-"),
                sg.Button("Refresh", key="-REFRESH-"),
                sg.Exit(button_color=("white", "red"))
            ]
        ]
        
        return layout
    
    def run(self):
        sg.theme('Black')
        
        layout = self.create_layout()
        self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
        
        while True:
            event, values = self.window.read()
            
            if event == sg.WIN_CLOSED or event == "Exit":
                break
            
            elif event == "-ADD-":
                todo_text = values["-NEW_TODO-"].strip()
                if todo_text:
                    self.add_todo(todo_text, values["-PRIORITY-"])
                    self.window.close()
                    layout = self.create_layout()
                    self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
            
            elif event.startswith("-EDIT_"):
                todo_id = int(event.split("_")[1].replace("-", ""))
                todo = next((t for t in self.todos if t["id"] == todo_id), None)
                if todo:
                    layout_edit = [
                        [sg.Text("Edit Task:")],
                        [sg.Text("Current: " + todo["text"])],
                        [sg.InputText(todo["text"], key="-EDIT_TEXT-", size=(40, 1))],
                        [sg.Button("Save", key="-SAVE_EDIT-"), sg.Button("Cancel", key="-CANCEL_EDIT-")]
                    ]
                    edit_window = sg.Window("Edit Task", layout_edit, modal=True)
                    
                    while True:
                        edit_event, edit_values = edit_window.read()
                        if edit_event in (sg.WIN_CLOSED, "-CANCEL_EDIT-"):
                            break
                        elif edit_event == "-SAVE_EDIT-":
                            new_text = edit_values["-EDIT_TEXT-"].strip()
                            if new_text:
                                self.edit_todo(todo_id, new_text)
                                self.window.close()
                                layout = self.create_layout()
                                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
                            break
                    edit_window.close()
            
            elif event.startswith("-DELETE_"):
                todo_id = int(event.split("_")[1].replace("-", ""))
                self.delete_todo(todo_id)
                self.window.close()
                layout = self.create_layout()
                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
            
            elif event.startswith("-COMPLETE_"):
                todo_id = int(event.split("_")[1].replace("-", ""))
                self.complete_todo(todo_id)
                self.window.close()
                layout = self.create_layout()
                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
            
            elif event.startswith("-REPEAT_"):
                todo_id = int(event.split("_")[1].replace("-", ""))
                self.repeat_todo(todo_id)
                self.window.close()
                layout = self.create_layout()
                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
            
            elif event == "-CLEAR_COMPLETED-":
                self.todos = [todo for todo in self.todos if not todo["completed"]]
                self.save_todos()
                self.window.close()
                layout = self.create_layout()
                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
            
            elif event == "-REFRESH-":
                self.window.close()
                layout = self.create_layout()
                self.window = sg.Window("Todo Manager", layout, size=(650, 500), resizable=True)
        
        self.window.close()

if __name__ == "__main__":
    app = TodoManager()
    app.run()
