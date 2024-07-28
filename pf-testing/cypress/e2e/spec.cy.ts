describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Backend", () => {
  it("checks get response", () => {
    const url = "http://localhost:3000";
    cy.request({
      method: "GET",
      url: `${url}/todolist`,
    }).then((res) => {
      expect(res.body).to.be.a("array");
    });
  });
});

describe("Frontend", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  })
  // it("should select a date from the date picker", () => {
  //   // Open the date picker
  //   cy.get('.custom-datepicker').click();
    
  //   // Select a specific date
  //   cy.get('.react-datepicker__day--031').click();
    
  //   // Verify the selected date
  //   cy.get('.custom-datepicker').should('have.value', '31/07/2024');
  // })

  // it('should select an option from the dropdown', () => {
  //   // Open the dropdown and select an option
  //   cy.get('.custom-dropdown').select('Work');
    
  //   // Verify the selected option
  //   cy.get('.custom-dropdown').should('have.value', 'work');
  // });
  // it("creates todo", () => {
  //   const text = new Date().getTime().toString();
  //   cy.get("[data-cy='input-text']").type(text);
  //   cy.get(".custom-datepicker").click();
  //   cy.get(".react-datepicker__day--031").click();
  //   cy.get("[data-cy='submit']").click();
  //   cy.contains(text);
  // });
  // it('should submit the form with selected date and dropdown option', () => {
  //   // Fill the input text
  //   const text = new Date().getTime().toString();
  //   cy.get("[data-cy='input-text']").type(text);
    
  //   // Select an option from the dropdown
  //   cy.get('.custom-dropdown').select('Personal');
    
  //   // Open date picker and select a specific date
  //   cy.get('.custom-datepicker').click();
  //   cy.get('.react-datepicker__day--031').click();
    
  //   // Submit the form
  //   cy.get("[data-cy='submit']").click();
    
  //   // Verify the submission (you might need to adjust this based on your actual implementation)
  //   cy.get('div[data-cy="todo-item-wrapper"]').should('contain', text);
  //   cy.get('div[data-cy="todo-item-wrapper"]').should('contain', 'personal');
  //   cy.get('div[data-cy="todo-item-wrapper"]').should('contain', '31/07/2024'); // Adjust the expected value as per your date format
  // });
  it('should submit the form with selected due date and tag dropdown option', () => {
    // Fill the input text
    const text = new Date().getTime().toString();
    cy.get("[data-cy='input-text']").type(text);
    
    // Select an option from the dropdown
    cy.get('.custom-dropdown').select('Personal');
    
    // Open date picker and select a specific date
    cy.get('.custom-datepicker').click();
    cy.get('.react-datepicker__day--031').click();
    
    // Submit the form
    cy.get("[data-cy='submit']").click();
    
    // Verify the submission
    cy.get('div[data-cy="todo-item-wrapper"]').within(() => {
      cy.contains('[data-cy="todo-item-text"]', text).parent().within(() => {
        cy.get('[data-cy="todo-item-text"]').should('contain', text);
        cy.get('[data-cy="todo-item-due-date"]').should('contain', '31/07/2024'); 
        cy.get('[data-cy="todo-item-tag"]').should('contain', 'personal');
      });
    });
  });
});