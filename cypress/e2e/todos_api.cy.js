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




describe('Testes de API - Produtos (Criar e Atualizar)', () => {

    it('POST - Criar produto novo: Tem que aceitar dados válidos', () => {
        cy.request('POST', 'https://dummyjson.com/products/add', {
            title: 'Produto Teste QA do Pedro', 
            price: 49.99,
            category: 'test-category'
        }).then((response) => {
            expect(response.status).to.eq(201); 
            expect(response.body).to.have.property('id');
            expect(response.body.title).to.eq('Produto Teste QA do Pedro');
            expect(response.body.price).to.eq(49.99);
        });
    });

    it('POST - O que acontece se eu mandar o body vazio?', () => {
        cy.request({
            method: 'POST',
            url: 'https://dummyjson.com/products/add',
            failOnStatusCode: false, 
            body: {}
        }).then((response) => {
            expect(response.status).to.eq(201);
            cy.log('**Atenção:** A API está aceitando body vazio e dando 201. Isso é uma falha de validação grave!');
        });
    });

    it('PUT - Atualização Completa: Mudar o título e preço de um item existente (ID 1)', () => {
        cy.request('PUT', 'https://dummyjson.com/products/1', {
            title: 'Título Totalmente Trocado pelo PUT',
            price: 99.99
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.title).to.eq('Título Totalmente Trocado pelo PUT');
            expect(response.body.price).to.eq(99.99);
        });
    });

    it('PATCH - Atualização Parcial: Só aumentar o estoque (ID 1)', () => {
        cy.request('PATCH', 'https://dummyjson.com/products/1', {
            stock: 123
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.stock).to.eq(123); 
        });
    });

    it('PUT - Caso negativo: Tentar mandar um campo que não existe (Ex: campoInvalido)', () => {
        cy.request({
            method: 'PUT',
            url: 'https://dummyjson.com/products/1',
            failOnStatusCode: false,
            body: {
                campoInvalido: 'teste'
            }
        }).then((response) => {
            expect(response.status).to.eq(200); 
            cy.log('**Ponto de atenção:** A API está ignorando o campo inválido e dando sucesso (200). Não deveria rejeitar isso?');
            expect(response.body).to.not.have.property('campoInvalido'); 
        });
    });

});

/// <reference types="cypress" />

describe('API de Usuários - GET /users', () => {
    const BASE_URL = 'https://dummyjson.com';
    const ENDPOINT = '/users';
    
    const EXPECTED_USER_FIELDS = [
        'id',
        'firstName',
        'lastName',
        'email',
        'username',
        'gender',
        'age',
        'phone'
    ];

    it('1. Deve validar a lista completa de usuários e a estrutura básica', () => {
        cy.request('GET', `${BASE_URL}${ENDPOINT}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                
                expect(response.body).to.have.property('users').and.be.an('array');
                expect(response.body.users.length).to.be.greaterThan(0);

                response.body.users.forEach((user) => {
                    EXPECTED_USER_FIELDS.forEach((field) => {
                        expect(user).to.have.property(field);
                    });
                    
                    expect(user.id).to.be.a('number');
                    expect(user.email).to.be.a('string').and.include('@');
                    expect(user.age).to.be.a('number').and.to.be.greaterThan(0);
                });
            });
    });

    it('2. Deve verificar se ao buscar por ID válido (ID 1) retorna um único usuário válido', () => {
        const VALID_USER_ID = 1;

        cy.request('GET', `${BASE_URL}${ENDPOINT}/${VALID_USER_ID}`)
            .then((response) => {
                expect(response.status).to.eq(200);
                
                expect(response.body).to.have.property('id').and.to.eq(VALID_USER_ID);
                expect(response.body).to.not.be.an('array'); 

                EXPECTED_USER_FIELDS.forEach((field) => {
                    expect(response.body).to.have.property(field);
                });
            });
    });

    it('3. Deve testar o erro ao buscar por ID inexistente', () => {
        const INVALID_USER_ID = 9999; 

        cy.request({
            method: 'GET',
            url: `${BASE_URL}${ENDPOINT}/${INVALID_USER_ID}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            
            expect(response.body).to.have.property('message').and.include(`User with id '${INVALID_USER_ID}' not found`);
        });
    });
});

describe("API de Produtos - GET /products", () => {
  const BASE_URL = "https://dummyjson.com";

  it("5.1 Deve deletar um produto e retornar confirmação de exclusão", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE_URL}/products/1`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", 1);
      expect(response.body).to.have.property("isDeleted", true);
      expect(response.body).to.have.property("deletedOn");
    });
  });

  it("5.2 Deve tentar excluir um produto com id inexistente (ex: 9999)", () => {
    cy.request({
      method: "DELETE",
      url: `${BASE_URL}/products/9999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property(
        "message",
        "Product with id '9999' not found"
      );
    });
  });
});