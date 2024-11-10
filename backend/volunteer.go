package main

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"simple-site-backend/connection"

	"github.com/gofiber/fiber/v2"
)

type Volunteer struct {
	VolunteerId      string `json:"volunteer_id"`
	VolunteerName    string `json:"volunteer_name"`
	NoOfSessionTaken int    `json:"no_of_session_taken"`
	CenterID         string `json:"center_id"`
}

func VolunteerRoutes() *fiber.App {
	r := fiber.New()

	r.Get("/", getVolunteers)
	r.Get("/:id", getVolunteer)
	r.Post("/", createVolunteer)
	r.Post("/signin", getVolunteerByCredentials)
	r.Put("/:id", updateVolunteer)
	r.Delete("/:id", deleteVolunteer)

	return r
}

func getVolunteers(c *fiber.Ctx) error {
	rows, err := connection.DB.Query("SELECT volunteer_id, volunteer_name, no_of_session_taken, center_id FROM volunteer")
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch volunteers"})
	}
	defer rows.Close()

	var volunteers []Volunteer
	for rows.Next() {
		var volunteer Volunteer
		if err := rows.Scan(&volunteer.VolunteerId, &volunteer.VolunteerName, &volunteer.NoOfSessionTaken, &volunteer.CenterID); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to scan volunteer"})
		}
		volunteers = append(volunteers, volunteer)
	}

	return c.Status(http.StatusOK).JSON(volunteers)
}

func getVolunteer(c *fiber.Ctx) error {
	id := c.Params("id")
	var volunteer Volunteer
	err := connection.DB.QueryRow("SELECT volunteer_id, volunteer_name, no_of_session_taken, center_id FROM volunteer WHERE volunteer_id = ?", id).Scan(&volunteer.VolunteerId, &volunteer.VolunteerName, &volunteer.NoOfSessionTaken, &volunteer.CenterID)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Volunteer not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch volunteer"})
	}

	return c.Status(http.StatusOK).JSON(volunteer)
}

func createVolunteer(c *fiber.Ctx) error {
	var volunteer Volunteer
	if err := c.BodyParser(&volunteer); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("INSERT INTO volunteer (volunteer_name, no_of_session_taken, center_id) VALUES (?, ?, ?)", volunteer.VolunteerName, volunteer.NoOfSessionTaken, volunteer.CenterID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create volunteer"})
	}

	return c.Status(http.StatusCreated).JSON(volunteer)
}

func updateVolunteer(c *fiber.Ctx) error {
	id := c.Params("id")
	var volunteer Volunteer
	if err := c.BodyParser(&volunteer); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("UPDATE volunteer SET volunteer_name = ?, no_of_session_taken = ?, center_id = ? WHERE volunteer_id = ?", volunteer.VolunteerName, volunteer.NoOfSessionTaken, volunteer.CenterID, id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update volunteer"})
	}

	return c.Status(http.StatusOK).JSON(volunteer)
}

func deleteVolunteer(c *fiber.Ctx) error {
	id := c.Params("id")

	_, err := connection.DB.Exec("DELETE FROM volunteer WHERE volunteer_id = ?", id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete volunteer"})
	}

	return c.Status(http.StatusNoContent).SendString("")
}

func getVolunteerByCredentials(c *fiber.Ctx) error {
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

	var volunteer Volunteer
	err := connection.DB.QueryRow("SELECT volunteer_id, volunteer_name, no_of_session_taken, center_id FROM volunteer WHERE volunteer_id = ? AND password = ?", credentials.UserId, credentials.Password).Scan(&volunteer.VolunteerId, &volunteer.VolunteerName, &volunteer.NoOfSessionTaken, &volunteer.CenterID)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			fmt.Printf("Volunteer not found for userId: %s\n", credentials.UserId)
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Volunteer not found"})
		}
		fmt.Printf("Error fetching volunteer: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch volunteer"})
	}

	fmt.Printf("Fetched volunteer: %+v\n", volunteer)
	return c.Status(http.StatusOK).JSON(volunteer)
}
