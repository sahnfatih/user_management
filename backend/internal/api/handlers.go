package api

import (
    "encoding/json"
    "net/http"
    "strconv"
    "github.com/gorilla/mux"
    "user_management/internal/models"
)

type UserHandler struct {
    db *sql.DB
}

func NewUserHandler(db *sql.DB) *UserHandler {
    return &UserHandler{db: db}
}

// GetUsers returns all users
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
    users := []models.User{}
    rows, err := h.db.Query("SELECT * FROM users")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    // Scan rows into users slice
    // ... scanning logic ...

    json.NewEncoder(w).Encode(users)
}

// GetUser returns a specific user
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, _ := strconv.ParseInt(vars["id"], 10, 64)
    
    var user models.User
    err := h.db.QueryRow("SELECT * FROM users WHERE id = ?", id).Scan(
        &user.ID, &user.FirstName, &user.LastName, &user.Email,
        &user.CreatedAt, &user.UpdatedAt)

    if err == sql.ErrNoRows {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(user)
}

// CreateUser creates a new user
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var user models.User
    json.NewDecoder(r.Body).Decode(&user)

    result, err := h.db.Exec(`
        INSERT INTO users (first_name, last_name, email)
        VALUES (?, ?, ?)`,
        user.FirstName, user.LastName, user.Email)

    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user.ID, _ = result.LastInsertId()
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

// UpdateUser updates an existing user
func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    var user models.User
    json.NewDecoder(r.Body).Decode(&user)

    _, err := h.db.Exec(`
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        user.FirstName, user.LastName, user.Email, id)

    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    w.WriteHeader(http.StatusOK)
}

// DeleteUser deletes a user
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    result, err := h.db.Exec("DELETE FROM users WHERE id = ?", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if rows, _ := result.RowsAffected(); rows == 0 {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}