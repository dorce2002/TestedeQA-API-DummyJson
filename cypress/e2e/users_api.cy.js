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