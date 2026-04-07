import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProductService } from '../../services/product.service';

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
  
  // Usiamo un nome più semplice per il riferimento
  @ViewChild('myChart') canvas!: ElementRef;

  ngOnInit() {
    // 1. Carichiamo i prodotti
    this.productService.fetchProducts();

    // 2. Aspettiamo un attimo che la pagina sia pronta e disegnamo
    // Il setTimeout è il "trucco del mestiere" più credibile del mondo
    setTimeout(() => {
      this.initChart();
    }, 500);
  }

  initChart() {
    const products = this.productService.products();
    
    if (products.length === 0) return;

    // Contiamo le categorie in modo semplice
    const counts: any = {};
    for (const p of products) {
      const cat = p.category || 'Varie';
      counts[cat] = (counts[cat] || 0) + 1;
    }

    // Creiamo il grafico
    new Chart(this.canvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels: Object.keys(counts),
        datasets: [{
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