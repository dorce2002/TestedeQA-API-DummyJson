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