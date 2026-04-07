import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Recensioni Prodotto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            @for (revText of reviews; track $index) {
              <div class="border-bottom mb-2 pb-2">
                <p class="mb-0">
                  <i class="bi bi-chat-quote text-primary me-2"></i>
                  "{{ revText }}"
                </p>
              </div>
            } @empty {
              <p class="text-center text-muted">Nessuna recensione per questo prodotto.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReviewModalComponent {
  @Input() reviews: string[] = []; 
}