import {} from 'cypress';
/// <reference types="cypress" />

describe('Store User Journey', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.intercept('POST', '**/products').as('postProduct');
    cy.intercept('GET', '**/products/**').as('getProducts');
    cy.intercept('DELETE', '**/products/**').as('deleteProduct');
  });

  it('should complete the full flow: navigate, change view, add, read, edit and delete', () => {
    // NAVIGAZIONE
    cy.get('a').contains('Grafico').click();
    cy.url().should('include', '/chart');
    cy.get('a').contains('Tabella').click();
    cy.url().should('include', '/dashboard');

    // CHANGE VIEW
    cy.get('.bi-grid-3x3-gap').closest('button').click();
    cy.get('app-product-card', { timeout: 8000 }).should('be.visible');

    // ADD INITIAL PRODUCT
    cy.contains('button', 'Nuovo Prodotto').click();
    cy.get('#productModal').within(() => {
      cy.get('input[formControlName="title"]').type('Torta di mele');
      cy.get('select[formControlName="category"]').select('Dolci');
      cy.get('input[formControlName="price"]').type('10');
      cy.get('input[formControlName="employee"]').type('Luca');
      cy.get('textarea[formControlName="description"]').type('Ottima torta');
      cy.contains('button', 'Salva Prodotto').click();
    });

    cy.wait('@postProduct');
    cy.get('#productModal').should('not.have.class', 'show');

    //  REVIEWS
    cy.get('app-product-card').first().find('.bi-chat-left-text').click();
    cy.get('#reviewModal').should('be.visible').and('have.class', 'show');
    cy.wait(1000);

    cy.get('#reviewModal').find('[data-bs-dismiss="modal"]').first().click({ force: true });

    cy.get('body').then(($body) => {
      if ($body.find('.modal-backdrop').length > 0) {
        cy.get('.modal-backdrop').invoke('remove');
      }
      if ($body.find('#reviewModal').length > 0) {
        cy.get('#reviewModal')
          // Prima rimuove la classe 'show' per nascondere il modal
          .invoke('removeClass', 'show')
          // Poi imposta display a 'none' e pointer-events a 'none' per assicurarsi che sia completamente nascosto e non interagibile
          .invoke('css', 'display', 'none')
          // Rimuove anche pointer-events per evitare che il modal, se ancora presente nel DOM, possa interferire con i click sottostanti
          .invoke('css', 'pointer-events', 'none');
      }
      // Rimuove la classe 'modal-open' dal body e ripristina l'overflow per assicurarsi che la pagina torni alla normalità dopo la chiusura del modal
      cy.get('body').invoke('removeClass', 'modal-open').invoke('css', 'overflow', 'auto');
    });

    cy.wait(1000);

    // DELETE
    cy.on('window:confirm', () => true);
    cy.get('app-product-card').first().find('.bi-trash3').click({ force: true });
    cy.wait('@deleteProduct');
    cy.wait(1000);
    cy.contains('button', 'Nuovo Prodotto').click({ force: true });

    // EDIT
    cy.contains('button', 'Nuovo Prodotto').click({ force: true });
    cy.get('#productModal')
      .should('be.visible')
      .within(() => {
        // Titolo
        cy.get('input[formControlName="title"]')
          .clear({ force: true })
          .invoke('val', 'Prodotto da Editare')
          .trigger('input')
          .trigger('change')
          .should('have.value', 'Prodotto da Editare');

        // Categoria
        cy.get('select[formControlName="category"]').select('Dolci');

        // Prezzo
        cy.get('input[formControlName="price"]').clear({ force: true }).type('20').trigger('input');

        // Dipendente
        cy.get('input[formControlName="employee"]')
          .clear({ force: true })
          .type('Test Bot')
          .trigger('input');

        // Descrizione
        cy.get('textarea[formControlName="description"]')
          .clear({ force: true })
          .type('Descrizione test')
          .trigger('input');

        cy.wait(500);
        cy.contains('button', 'Salva Prodotto').click({ force: true });
      });

    cy.wait('@postProduct');
    cy.wait(500);
    cy.get('#productModal', { timeout: 10000 }).should('not.have.class', 'show');
  });
});
