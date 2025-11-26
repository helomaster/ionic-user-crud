import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
@Injectable({ providedIn: 'root' })
export class UserService {
private storageKey = 'users:v1';
private usersSubject = new BehaviorSubject<User[]>(this.loadFromStorage());
users$ = this.usersSubject.asObservable();
constructor() {}
private loadFromStorage(): User[] {
try {
const raw = localStorage.getItem(this.storageKey);
return raw ? JSON.parse(raw) : [];
} catch {
return [];
}
}
private saveToStorage(users: User[]): void {
localStorage.setItem(this.storageKey, JSON.stringify(users));
}

get snapshot(): User[] {
return this.usersSubject.value;
}
add(user: Omit<User, 'id'>): void {
const newUser: User = { ...user, id: crypto.randomUUID() };
const updated = [newUser, ...this.snapshot];
this.usersSubject.next(updated);
this.saveToStorage(updated);
}
remove(id: string): void {
const updated = this.snapshot.filter(u => u.id !== id);
this.usersSubject.next(updated);
this.saveToStorage(updated);
}
update(id: string, patch: Partial<Omit<User, 'id'>>): void {
const updated = this.snapshot.map(u => u.id === id ? { ...u, ...patch } : u);
this.usersSubject.next(updated);
this.saveToStorage(updated);
}
clear(): void {
this.usersSubject.next([]);
this.saveToStorage([]);
}
}