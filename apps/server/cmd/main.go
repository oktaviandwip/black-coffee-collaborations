package main

import (
	"log"

	"github.com/Roisfaozi/black-coffee-collaborations/internal/routers"
	"github.com/Roisfaozi/black-coffee-collaborations/pkg"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	db, err := pkg.Posql()
	if err != nil {
		log.Fatal("ini error db start", err)
	}

	router := routers.New(db)
	server := pkg.Server(router)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
