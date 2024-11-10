package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"simple-site-backend/connection"
)

func main() {
	connection.InitDB()
	defer connection.DB.Close()

	app := fiber.New()

	// Enable CORS
	app.Use(cors.New())

	// Routes
	app.Mount("/api/centers", CenterRoutes())
	app.Mount("/api/students", StudentRoutes())
	app.Mount("/api/volunteers", VolunteerRoutes())

	// Start the server
	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}
