package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"user_management/internal/models"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	db *sql.DB
}

func NewUserHandler(db *sql.DB) *UserHandler {
	return &UserHandler{db: db}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	users := []models.User{}
	rows, err := h.db.Query(`
        SELECT id, first_name, last_name, email, 
        created_at, updated_at FROM users
    `)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID, &user.FirstName, &user.LastName,
			&user.Email, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var user models.User
	err := h.db.QueryRow(`
        SELECT id, first_name, last_name, email, 
        created_at, updated_at FROM users WHERE id = ?
    `, id).Scan(
		&user.ID, &user.FirstName, &user.LastName,
		&user.Email, &user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := h.db.Exec(`
        INSERT INTO users (first_name, last_name, email)
        VALUES (?, ?, ?)
    `, user.FirstName, user.LastName, user.Email)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	user.ID = id

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := h.db.Exec(`
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, user.FirstName, user.LastName, user.Email, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	result, err := h.db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
