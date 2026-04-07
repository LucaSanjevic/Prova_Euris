import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // Aggiungi questi due

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html', 
  styleUrls: ['./app.scss'],
  // Aggiungi RouterLink e RouterLinkActive qui sotto
  imports: [RouterOutlet, RouterLink, RouterLinkActive] 
})
export class App {
  protected readonly title = signal('euris_test');
}