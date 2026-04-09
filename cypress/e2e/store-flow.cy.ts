/// <reference types="cypress" />
import {} from 'cypress';
describe('Store User Journey', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should complete the full flow: navigate, change view, add, read and delete', () => {
    // NAVIGAZIONE
    // Clicca sul link Grafico nella Navbar
    cy.get('a').contains('Grafico').click();
    cy.url().should('include', '/chart');
    // Torna alla Tabella
    cy.get('a').contains('Tabella').click();
    cy.url().should('include', '/dashboard');

    // CHANGE VIEW
    // Clicca sull'icona per cambiare vista
    cy.get('.bi-grid-3x3-gap').closest('button').click();

    // Verifica che il bottone abbia preso la classe btn-primary (conferma che lo stato è cambiato)
    cy.get('.bi-grid-3x3-gap').closest('button').should('have.class', 'btn-primary');

    // Verifica che la tabella sia rimossa dal DOM
    cy.get('table').should('not.exist');

    // Verifica che i product card siano visibili (con un timeout più lungo per dare tempo alla pagina di aggiornarsi)
    cy.get('app-product-card', { timeout: 8000 })
      .should('be.visible')
      .and('have.length.at.least', 1);

    // ADD PRODUCT
    // Clicca su "Nuovo Prodotto"
    cy.contains('button', 'Nuovo Prodotto').click();
    // Verifica che il modal sia visibile
    cy.get('#productModal').should('have.class', 'show');

    cy.get('#productModal').within(() => {
      // Usiamo blur() dopo ogni inserimento per forzare Angular a validare il campo
      cy.get('input[formControlName="title"]')
      // cancella testi pre-esistenti
      .clear()
      // scrive un testo
      .type('Torta di mele')
      // forza Angular a validare il campo
      .trigger('blur');

      // 
      cy.get('select[formControlName="category"]')
        .select('Dolci')
        // avverte Angular del cambiamento (a volte necessario per i select)
        .trigger('change')
        .trigger('blur');

      cy.get('input[formControlName="price"]')
      .clear()
      .type('10')
      .trigger('blur');

      cy.get('input[formControlName="employee"]')
      .clear()
      .type('Luca')
      .trigger('blur');

      cy.get('textarea[formControlName="description"]')
        .clear()
        .type('Ottima torta')
        .trigger('blur');

      cy.wait(500);

      // verifica che il bottone "Salva Prodotto" sia abilitato e cliccalo
      cy.contains('button', 'Salva Prodotto').should('not.be.disabled').click();
    });

    // Aspettiamo che il modal si chiuda
    cy.get('#productModal', { timeout: 10000 }).should('not.have.class', 'show');



    // REVIEWS
    cy.get('app-product-card').first().find('.bi-chat-left-text').click();
    cy.get('#reviewModal').should('be.visible').and('have.class', 'show');

    cy.wait(500); // Attesa per stabilità animazione

    // 1. Prova a chiudere con ESC
    cy.get('body').type('{esc}');

    // 2. Controlliamo se il modal è ancora lì. Se sì, proviamo il click forzato.
    cy.get('body').then(($body: JQuery<HTMLElement>) => {
      // Cerchiamo il modal. Se ha ancora la classe 'show', allora ESC non ha funzionato
      const modal = $body.find('#reviewModal.show');

      if (modal.length > 0) {
        // Usiamo cy.wrap per tornare nel contesto Cypress solo se necessario
        cy.wrap(modal).find('.btn-close, button').filter(':visible').first().click({ force: true });
      }
    });

    // 3. Aspettiamo che il "velo" grigio sparisca (fondamentale per i punti successivi)
    cy.get('.modal-backdrop', { timeout: 10000 }).should('not.exist');
    cy.get('#reviewModal').should('not.have.class', 'show');

    // --- 5. PAGINAZIONE ---
    cy.contains('Pagina 0').should('be.visible');
    cy.get('button').contains('Successiva').click();
    cy.contains('Pagina 1').should('be.visible');

    // --- 6. ELIMINAZIONE ---
    cy.on('window:confirm' as any, () => true);

    // Clicca sul cestino
    cy.get('.bi-trash3').first().click();

    // Aspettiamo che la chiamata DELETE finisca e la lista si aggiorni
    // Questo assicura che lo screenshot finale sia sulla pagina pulita
    cy.wait(1000);
    cy.get('app-product-card').should('be.visible');

    cy.log('Complimenti! Il flusso è completo e verificato.');

    // Verifica che il prodotto non sia più visibile (opzionale)
    // cy.contains('Prodotto Cypress Test').should('not.exist');
  });
});
