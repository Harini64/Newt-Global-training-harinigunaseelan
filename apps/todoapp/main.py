FILEPATH ="C:\\Users\\harin\\Desktop\\Newt Global\\apps\\todoapp\\todos.txt"
from functions import get_todos, write_todos
#import functions
import time 

now=time.strftime("%b %d, %Y %H:%M:%S")
print("it is ", now)


while True:
    user_action=input("Type add, show, edit or exit: ")
    user_action=user_action.strip()
    if user_action.startswith("add"):
        todo=user_action[4:]
        todos=get_todos(FILEPATH)
        todos.append(todo+"\n")
        write_todos(FILEPATH,todos)
    elif user_action.startswith("show"):
        todos=get_todos(FILEPATH)
            
        for index,item in enumerate(todos):
            item=item.strip('\n')
            #print(index+1, " ", item.capitalize())
            print(f"{index+1}-{item}")
    elif user_action.startswith("edit"):
        try:
            number = int(user_action[5:])
            number = number-1
            todos=get_todos(FILEPATH)
            new_todo=input("Enter new todo: ")
            todos[number]=new_todo+"\n"

            write_todos(FILEPATH,todos)
        except ValueError:
            print("your command is not valid")
            continue

    elif user_action.startswith("complete"):
        try:
            number = int(user_action[9:])
            todos=get_todos(FILEPATH)
            index=number-1
            todo_to_remove = todos[index].strip("\n")
            todos.pop(index)
            write_todos(FILEPATH,todos)
            message = f"Todo {todo_to_remove} was remove from list."
            print(message)
        except IndexError:
            print("There is no item with that number.")
            continue
    elif user_action.startswith("exit"):
        break
    else:
        print("Command is not valid")
print("all the best!")
 


# https://docs.python.org/3/py-modindex.html