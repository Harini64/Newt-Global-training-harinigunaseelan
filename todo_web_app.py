import streamlit as st

FILEPATH = "todos.txt"

def get_todos(filepath=FILEPATH):
    try:
        with open(filepath, "r") as file_local:
            todos_local = file_local.readlines()
    except FileNotFoundError:
        with open(filepath, "w") as file_local:
            pass
        todos_local = []

    return todos_local


def write_todos(filepath, todos_arg):
    """Write the to do items list in the text file."""
    with open(filepath, "w") as file:
        file.writelines(todos_arg)


todos =get_todos(FILEPATH)

def add_todo():
    todo = st.session_state["new_todo"]
    todos.append(todo + "\n")
    write_todos(FILEPATH, todos)

st.title("Todo App")

for index,todo in enumerate(todos):
    checkbox=st.checkbox(todo,key=todo)
    if checkbox:
        todos.pop(index)
        write_todos(FILEPATH, todos)
        del st.session_state[todo]
        st.rerun()

st.text_input(label="",placeholder="Add new todo...",on_change=add_todo,key="new_todo")


#cd apps\todoapp
