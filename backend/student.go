package main

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"simple-site-backend/connection"

	"github.com/gofiber/fiber/v2"
)

type Student struct {
	StudentId   string `json:"student_id"`
	StudentName string `json:"student_name"`
	Class       int    `json:"class"`
	CenterID    string `json:"center_id"`
}

func StudentRoutes() *fiber.App {
	r := fiber.New()

	r.Get("/", getStudents)
	r.Get("/:id", getStudent)
	r.Post("/", createStudent)
	r.Put("/:id", updateStudent)
	r.Delete("/:id", deleteStudent)
	r.Post("/signin", getStudentByCredentials)

	return r
}

func getStudents(c *fiber.Ctx) error {
	rows, err := connection.DB.Query("SELECT student_id, student_name, class, center_id FROM student")
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch students"})
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var student Student
		if err := rows.Scan(&student.StudentId, &student.StudentName, &student.Class, &student.CenterID); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to scan student"})
		}
		students = append(students, student)
	}

	return c.Status(http.StatusOK).JSON(students)
}

func getStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	var student Student
	err := connection.DB.QueryRow("SELECT student_id, student_name, class, center_id FROM student WHERE student_id = ?", id).Scan(&student.StudentId, &student.StudentName, &student.Class, &student.CenterID)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Student not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch student"})
	}

	return c.Status(http.StatusOK).JSON(student)
}

func createStudent(c *fiber.Ctx) error {
	var student Student
	if err := c.BodyParser(&student); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("INSERT INTO student (student_name, class, center_id) VALUES (?, ?, ?)", student.StudentName, student.Class, student.CenterID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create student"})
	}

	return c.Status(http.StatusCreated).JSON(student)
}

func updateStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	var student Student
	if err := c.BodyParser(&student); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("UPDATE student SET student_name = ?, class = ?, center_id = ? WHERE student_id = ?", student.StudentName, student.Class, student.CenterID, id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update student"})
	}

	return c.Status(http.StatusOK).JSON(student)
}

func deleteStudent(c *fiber.Ctx) error {
	id := c.Params("id")

	_, err := connection.DB.Exec("DELETE FROM student WHERE student_id = ?", id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete student"})
	}

	return c.Status(http.StatusNoContent).SendString("")
}

func getStudentByCredentials(c *fiber.Ctx) error {
	var credentials struct {
		UserId   string `json:"userId"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&credentials); err != nil {
		fmt.Printf("Error parsing body: %v\n", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Log received credentials for debugging
	fmt.Printf("Received credentials: %+v\n", credentials)

	var student Student
	err := connection.DB.QueryRow("SELECT student_id, student_name, class, center_id FROM student WHERE student_id = ? AND password = ?", credentials.UserId, credentials.Password).Scan(&student.StudentId, &student.StudentName, &student.Class, &student.CenterID)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			fmt.Printf("Student not found for userId: %s\n", credentials.UserId)
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Student not found"})
		}
		fmt.Printf("Error fetching student: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch student"})
	}

	fmt.Printf("Fetched student: %+v\n", student)
	return c.Status(http.StatusOK).JSON(student)
}
