import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    const savedTheme = sessionStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.isDarkModeSubject.next(isDark);
    this.toggleBodyClass(isDark);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newTheme);
    sessionStorage.setItem('theme', newTheme ? 'dark' : 'light');
    this.toggleBodyClass(newTheme);
  }

  private toggleBodyClass(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
