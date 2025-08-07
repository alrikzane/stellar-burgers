describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { 
      fixture: 'ingredients.json' 
    }).as('getIngredients');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен загружать страницу и ингредиенты трёх видов', () => {
    cy.contains('Соберите бургер');
    cy.get('[data-ingredient="bun"]').should('exist');
    cy.get('[data-ingredient="main"]').should('exist');
    cy.get('[data-ingredient="sauce"]').should('exist');
  });
});
