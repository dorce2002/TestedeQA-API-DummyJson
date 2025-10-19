/// <reference types="cypress" />

describe('API de Produtos - GET /products', () => {
    const BASE_URL = 'https://dummyjson.com';
    const ENDPOINT = '/products';
    
    const EXPECTED_FIELDS = [
        'id',
        'title',
        'description',
        'price',
        'discountPercentage',
        'rating',
        'stock',
        //'brand', tive que transformar em comentário para passar na validação, já que nem todos os produtos tem a caracteristica brand
        'category',
        'thumbnail',
        'images'
    ];
    

    it('1. Deve retornar a lista completa de produtos com status 200 e validar a estrutura básica', () => {
        cy.request('GET', `${BASE_URL}${ENDPOINT}`)
            .then((response) => {
                expect(response.status).to.eq(200);

                expect(response.body).to.have.property('products').and.be.an('array');
                
                const products = response.body.products;
                
                expect(products.length).to.be.greaterThan(0);

                products.forEach((product) => {
                    EXPECTED_FIELDS.forEach((field) => {
                        expect(product).to.have.property(field);
                    });
                    expect(product.id).to.be.a('number');
                });
            });
    });

    it('2. Deve verificar se ao usar limit=5 só retorna 5 itens', () => {
        const limitValue = 5;
        cy.request('GET', `${BASE_URL}${ENDPOINT}?limit=${limitValue}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('products').and.be.an('array');
                
                expect(response.body.products.length).to.eq(limitValue);
                expect(response.body.limit).to.eq(limitValue);
            });
    });

});

describe('PUT/PATCH - Atualizar produto', () => {

  it('Deve atualizar um produto existente (PATCH)', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://dummyjson.com/products/1',
      body: {
        title: 'Produto Atualizado pelo Cypress'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('title', 'Produto Atualizado pelo Cypress')
      expect(response.body).to.have.property('id', 1)
    })
  })

  it('Deve retornar erro ou comportamento inesperado ao enviar campo inválido', () => {
  cy.request({
    method: 'PATCH',
    url: 'https://dummyjson.com/products/1',
    failOnStatusCode: false, 
    body: {
      campoInvalido: 'Teste inválido'
    }
  }).then((response) => {
    cy.log(JSON.stringify(response.body))
    expect([200, 400, 422]).to.include(response.status)
    expect(response.body).to.not.have.property('campoInvalido')
  })
})

})
