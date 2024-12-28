import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:8080/api';

export const getUsers = () => axios.get<User[]>(`${API_URL}/users`);
export const getUser = (id: number) => axios.get<User>(`${API_URL}/users/${id}`);
export const createUser = (user: User) => axios.post<User>(`${API_URL}/users`, user);
export const updateUser = (id: number, user: User) => axios.put(`${API_URL}/users/${id}`, user);
export const deleteUser = (id: number) => axios.delete(`${API_URL}/users/${id}`);