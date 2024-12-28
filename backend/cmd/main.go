package main

import (
	"log"
	"net/http"
	"user_management/internal/api"
	"user_management/internal/database"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	db, err := database.InitDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	handler := api.NewUserHandler(db)
	router := mux.NewRouter()

	router.HandleFunc("/api/users", handler.GetUsers).Methods("GET")
	router.HandleFunc("/api/users/{id}", handler.GetUser).Methods("GET")
	router.HandleFunc("/api/users", handler.CreateUser).Methods("POST")
	router.HandleFunc("/api/users/{id}", handler.UpdateUser).Methods("PUT")
	router.HandleFunc("/api/users/{id}", handler.DeleteUser).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(router)))
}
