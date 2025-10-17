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
