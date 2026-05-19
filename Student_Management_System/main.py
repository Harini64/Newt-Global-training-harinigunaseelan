import sys
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QLineEdit, QPushButton, QMessageBox, QTableWidget,
    QTableWidgetItem, QDialog, QFormLayout, QDialogButtonBox
)
from PyQt6.QtCore import Qt

import db


class StudentDialog(QDialog):
    def __init__(self, parent=None, title="Student", student=None):
        super().__init__(parent)
        self.setWindowTitle(title)
        self.setMinimumWidth(350)

        self.name_input = QLineEdit()
        self.course_input = QLineEdit()
        self.mobile_input = QLineEdit()

        if student:
            self.name_input.setText(student["name"])
            self.course_input.setText(student["course"])
            self.mobile_input.setText(student["mobile"])

        form = QFormLayout()
        form.addRow("Name:", self.name_input)
        form.addRow("Course:", self.course_input)
        form.addRow("Mobile:", self.mobile_input)

        self.buttons = QDialogButtonBox(
            QDialogButtonBox.StandardButton.Ok | QDialogButtonBox.StandardButton.Cancel
        )
        self.buttons.accepted.connect(self.validate_and_accept)
        self.buttons.rejected.connect(self.reject)

        layout = QVBoxLayout()
        layout.addLayout(form)
        layout.addWidget(self.buttons)
        self.setLayout(layout)

    def validate_and_accept(self):
        name = self.name_input.text().strip()
        course = self.course_input.text().strip()
        mobile = self.mobile_input.text().strip()

        if not name or not course or not mobile:
            QMessageBox.warning(self, "Missing Data", "Please fill all fields.")
            return

        if not mobile.isdigit() or len(mobile) < 10:
            QMessageBox.warning(self, "Invalid Mobile", "Mobile number must contain at least 10 digits.")
            return

        self.accept()

    def get_data(self):
        return {
            "name": self.name_input.text().strip(),
            "course": self.course_input.text().strip(),
            "mobile": self.mobile_input.text().strip(),
        }


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Student Management System - PyQt6 + PostgreSQL")
        self.setMinimumSize(800, 500)

        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Search by name, course, or mobile...")
        self.search_input.textChanged.connect(self.load_data)

        self.add_button = QPushButton("Add")
        self.update_button = QPushButton("Update")
        self.delete_button = QPushButton("Delete")
        self.refresh_button = QPushButton("Refresh")

        self.add_button.clicked.connect(self.add_student)
        self.update_button.clicked.connect(self.update_student)
        self.delete_button.clicked.connect(self.delete_student)
        self.refresh_button.clicked.connect(self.load_data)

        button_layout = QHBoxLayout()
        button_layout.addWidget(self.add_button)
        button_layout.addWidget(self.update_button)
        button_layout.addWidget(self.delete_button)
        button_layout.addWidget(self.refresh_button)

        self.table = QTableWidget()
        self.table.setColumnCount(4)
        self.table.setHorizontalHeaderLabels(["ID", "Name", "Course", "Mobile"])
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.table.horizontalHeader().setStretchLastSection(True)

        layout = QVBoxLayout()
        layout.addWidget(QLabel("Student CRUD App"))
        layout.addWidget(self.search_input)
        layout.addLayout(button_layout)
        layout.addWidget(self.table)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.safe_start()

    def safe_start(self):
        try:
            db.create_table()
            self.load_data()
        except Exception as e:
            QMessageBox.critical(
                self,
                "Database Error",
                f"Could not connect to PostgreSQL.\n\nCheck your .env file and pgAdmin/PostgreSQL server.\n\nError: {e}",
            )

    def load_data(self):
        try:
            search_text = self.search_input.text().strip()
            students = db.fetch_students(search_text)
            self.table.setRowCount(0)

            for student in students:
                row = self.table.rowCount()
                self.table.insertRow(row)
                self.table.setItem(row, 0, QTableWidgetItem(str(student["id"])))
                self.table.setItem(row, 1, QTableWidgetItem(student["name"]))
                self.table.setItem(row, 2, QTableWidgetItem(student["course"]))
                self.table.setItem(row, 3, QTableWidgetItem(student["mobile"]))

                self.table.item(row, 0).setTextAlignment(Qt.AlignmentFlag.AlignCenter)
        except Exception as e:
            QMessageBox.critical(self, "Load Error", str(e))

    def get_selected_student(self):
        selected_row = self.table.currentRow()
        if selected_row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a student first.")
            return None

        return {
            "id": int(self.table.item(selected_row, 0).text()),
            "name": self.table.item(selected_row, 1).text(),
            "course": self.table.item(selected_row, 2).text(),
            "mobile": self.table.item(selected_row, 3).text(),
        }

    def add_student(self):
        dialog = StudentDialog(self, "Add Student")
        if dialog.exec():
            data = dialog.get_data()
            try:
                db.add_student(data["name"], data["course"], data["mobile"])
                self.load_data()
                QMessageBox.information(self, "Success", "Student added successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Add Error", str(e))

    def update_student(self):
        student = self.get_selected_student()
        if not student:
            return

        dialog = StudentDialog(self, "Update Student", student)
        if dialog.exec():
            data = dialog.get_data()
            try:
                db.update_student(student["id"], data["name"], data["course"], data["mobile"])
                self.load_data()
                QMessageBox.information(self, "Success", "Student updated successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Update Error", str(e))

    def delete_student(self):
        student = self.get_selected_student()
        if not student:
            return

        confirm = QMessageBox.question(
            self,
            "Confirm Delete",
            f"Delete {student['name']}?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )

        if confirm == QMessageBox.StandardButton.Yes:
            try:
                db.delete_student(student["id"])
                self.load_data()
                QMessageBox.information(self, "Success", "Student deleted successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Delete Error", str(e))


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
