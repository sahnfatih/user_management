package models

type User struct {
    ID        int64  `json:"id"`
    FirstName string `json:"firstName"`
    LastName  string `json:"lastName"`
    Email     string `json:"email"`
    CreatedAt string `json:"createdAt"`
    UpdatedAt string `json:"updatedAt"`
}