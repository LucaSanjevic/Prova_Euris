import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProductService } from '../../services/product.service';

// Registriamo i componenti di Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-product-chart',
  standalone: true,
  template: `
    <div class="container mt-4">
      <div class="card shadow p-4 text-center">
        <h5 class="mb-4">Statistiche Categorie</h5>
        <div style="height: 350px;">
          <canvas #myChart></canvas>
        </div>
      </div>
    </div>
  `
})
export class ProductChartComponent implements OnInit {
  private productService = inject(ProductService);
  
  // Riferimento al canvas per Chart.js
  @ViewChild('myChart') canvas!: ElementRef;

  ngOnInit() {
    // carica i prodotti
    this.productService.fetchProducts();

    // aspetta un attimo per essere sicuri che i dati siano caricati (in un caso reale, sarebbe meglio usare un approccio reattivo)
    setTimeout(() => {
      this.initChart();
    }, 500);
  }

  initChart() {
    const products = this.productService.products();
    
    if (products.length === 0) return;

    // Conta quanti prodotti ci sono per ogni categoria
    const counts: any = {};
    for (const p of products) {
      const cat = p.category || 'Varie';
      counts[cat] = (counts[cat] || 0) + 1;
    }

    // crea il grafico a torta
    new Chart(this.canvas.nativeElement, {
      // Settiamo lo stile a polarArea
      type: 'polarArea',
      data: {
        // Mette la legenda con le categorie (le chiavi dell'oggetto counts) e i dati (i valori dell'oggetto counts)
        labels: Object.keys(counts),
        datasets: [{
          // Decide la lunghezza di ogni fetta in base al numero di prodotti per categoria
          data: Object.values(counts),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}