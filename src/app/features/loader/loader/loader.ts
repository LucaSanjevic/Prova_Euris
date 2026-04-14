import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrapper" [style.height]="height" [style.width]="width">
      <div class="shimmer"></div>
    </div>
  `,
  styles: [`
    .wrapper {
      background: #e9ecef;
      overflow: hidden;
      position: relative;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .shimmer {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class LoaderComponent {
  @Input() height: string = '20px';
  @Input() width: string = '100%';
}