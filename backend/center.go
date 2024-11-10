package main

import (
	"database/sql"
	"errors"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"simple-site-backend/connection"
)

type Center struct {
	CenterID       string `json:"center_id"`
	CenterName     string `json:"center_name"`
	CenterLocation string `json:"center_location"`
}

func CenterRoutes() *fiber.App {
	r := fiber.New()

	r.Get("/", getCenters)
	r.Get("/:id", getCenter)
	r.Post("/", createCenter)
	r.Put("/:id", updateCenter)
	r.Delete("/:id", deleteCenter)

	return r
}

func getCenters(c *fiber.Ctx) error {
	rows, err := connection.DB.Query("SELECT center_id, center_name, center_location FROM center")
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch centers"})
	}
	defer rows.Close()

	var centers []Center
	for rows.Next() {
		var center Center
		if err := rows.Scan(&center.CenterID, &center.CenterName, &center.CenterLocation); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to scan center"})
		}
		centers = append(centers, center)
	}

	return c.Status(http.StatusOK).JSON(centers)
}

func getCenter(c *fiber.Ctx) error {
	id := c.Params("id")
	var center Center
	err := connection.DB.QueryRow("SELECT center_id, center_name, center_location FROM center WHERE center_id = ?", id).Scan(&center.CenterID, &center.CenterName, &center.CenterLocation)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Center not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch center"})
	}

	return c.Status(http.StatusOK).JSON(center)
}

func createCenter(c *fiber.Ctx) error {
	var center Center
	if err := c.BodyParser(&center); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("INSERT INTO center (center_name, center_location) VALUES (?, ?)", center.CenterName, center.CenterLocation)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create center"})
	}

	return c.Status(http.StatusCreated).JSON(center)
}

func updateCenter(c *fiber.Ctx) error {
	id := c.Params("id")
	var center Center
	if err := c.BodyParser(&center); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	_, err := connection.DB.Exec("UPDATE center SET center_name = ?, center_location = ? WHERE center_id = ?", center.CenterName, center.CenterLocation, id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update center"})
	}

	return c.Status(http.StatusOK).JSON(center)
}

func deleteCenter(c *fiber.Ctx) error {
	id := c.Params("id")

	_, err := connection.DB.Exec("DELETE FROM center WHERE center_id = ?", id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete center"})
	}

	return c.Status(http.StatusNoContent).SendString("")
}
