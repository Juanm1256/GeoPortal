import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable(); // Observable para los componentes

  constructor() {
    const savedTheme = sessionStorage.getItem('theme'); // Usamos sessionStorage en vez de localStorage
    const isDark = savedTheme === 'dark';
    this.isDarkModeSubject.next(isDark);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newTheme);
    sessionStorage.setItem('theme', newTheme ? 'dark' : 'light'); // Usamos sessionStorage
  }
}
