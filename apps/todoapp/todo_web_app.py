import streamlit as st
import functions
import time

FILEPATH = "C:\\Users\\harin\\Desktop\\Newt Global\\apps\\todoapp\\todos.txt"
todos =functions.get_todos(FILEPATH)

def add_todo():
    todo = st.session_state["new_todo"]
    todos.append(todo + "\n")
    functions.write_todos(FILEPATH, todos)

st.title("Todo App")

for index,todo in enumerate(todos):
    checkbox=st.checkbox(todo,key=todo)
    if checkbox:
        todos.pop(index)
        functions.write_todos(FILEPATH, todos)
        del st.session_state[todo]
        st.rerun()

st.text_input(label="",placeholder="Add new todo...",on_change=add_todo,key="new_todo")


#cd apps\todoapp
