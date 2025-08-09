//Созданы моковые данные для ингредиентов ingredients.json
describe('Перехват запроса на эндпоинт api/ingredients', () => {
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

  it('Добавляет булку в конструктор и проверяем до и после', () => {
    cy.get('[data-constructor="bun-top"]').should('not.exist');
    cy.get('[data-constructor="bun-bottom"]').should('not.exist');

    cy.get('[data-ingredient="bun"]').first()
      .find('button')
      .click();

    cy.get('[data-constructor="bun-top"]').should('exist');
    cy.get('[data-constructor="bun-bottom"]').should('exist');
  });

  it('Добавляет начинку в конструктор и проверяем до и после', () => {
    cy.get('[data-constructor="main"]').should('not.exist');
    cy.get('[data-ingredient="main"]').first()
      .find('button')
      .click();
    cy.get('[data-constructor="main"]').should('exist');    
  });

  it('Добавляет соус в конструктор и проверяем до и после', () => {
    cy.get('[data-constructor="sauce"]').should('not.exist');
    cy.get('[data-ingredient="sauce"]').first()
      .find('button')
      .click();
    cy.get('[data-constructor="sauce"]').should('exist');    
  });

  // тестирование модальных окон
  it('Открывает, перезагружает и закрывает модальное окно ингредиента', () => {
    // Находим ингредиент и назначаем ему алиас
    cy.get('[data-ingredient="bun"]').first().as('targetIngredient');

    // Сохраняем названиев в алиас как текстовое значение
    cy.get('@targetIngredient')
      .find('[data-test-id="ingredient-name"]')
      .invoke('text')
      .as('ingredientNameText');

    // Кликаем и проверяем, что это тот же элемент
    cy.then(function() {
      cy.get('@targetIngredient').click();
      cy.get('[data-modal="open-modal"]').should('contain', this.ingredientNameText);
    });

    // Перезагрузка страницы
    cy.reload();
    cy.get('[data-modal="open-modal"]')
    .should('exist')
    .and('be.visible');

    // Закрытие модалки
    cy.get('[data-modal="close-modal-button"]').click();
    cy.get('[data-modal="open-modal"]')
    .should('not.exist');
    
    cy.get('[data-ingredient="bun"]').first().click();
    // Закрытие оверлеем
    cy.get('[data-modal="overlay"]').click({ force: true });
    cy.get('[data-modal="open-modal"]')
    .should('not.exist');

    cy.get('[data-ingredient="bun"]').first().click();
    // Закрытие на кнопку Esc
    cy.get('[data-modal="overlay"]').click({ force: true });
    cy.get('body').type('{esc}');
    cy.get('[data-modal="open-modal"]')
    .should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    // Мокируем все необходимые запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Устанавливаем моковые токены авторизации.
    cy.setCookie('accessToken', 'test-token');    

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('При оформлении заказа открывается модальное окно, создается заказ, закрывается окно и очищается конструктор ', () => {
    cy.get('[data-ingredient="bun"]').first()
      .find('button')
      .click();
    cy.get('[data-ingredient="main"]').first()
      .find('button')
      .click();
    cy.contains('Оформить заказ').click();

    // Проверяем что:
    // - Был отправлен запрос с токеном
    // - Открылось модальное окно
    cy.wait('@createOrder').then((interception) => {
      expect(interception.request.headers.authorization).to.eq('test-token');
    });
    
    cy.get('[data-modal="open-modal"]').should('be.visible');

    // Новое модальное окно должно содержать номер заказа из order.json
    cy.fixture('order.json').then((order) => {
      cy.get('#modals h2:first-of-type')
      .should('have.text', order.order.number.toString());
    
    cy.get('[data-modal="close-modal-button"]').click();
    cy.get('[data-modal="open-modal"]')
    .should('not.exist');

    cy.get('[data-constructor="bun-top"]').should('not.exist');
    cy.get('[data-constructor="bun-bottom"]').should('not.exist');
    cy.get('[data-constructor="main"]').should('not.exist');
    cy.get('[data-constructor="sauce"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
});
  });
});
