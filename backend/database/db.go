package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error

	dsn := "root:Sarthak@123@tcp(127.0.0.1:3306)/gologin"

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Database open error:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database connection failed:", err)
	}

	log.Println("Database connected successfully")

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(0)
}
