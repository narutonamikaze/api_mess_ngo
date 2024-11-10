package connection

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"log"
	"os"
)

var DB *sql.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbname := os.Getenv("DB_NAME")
	dbhost := os.Getenv("DB_HOST")
	dbuser := os.Getenv("DB_USER")
	dbport := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("%s:@tcp(%s:%s)/%s", dbuser, dbhost, dbport, dbname)

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
}
