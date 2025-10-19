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
});