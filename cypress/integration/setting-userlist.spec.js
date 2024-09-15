import * as data from '../../cypress.json';

describe('Setting/User List Page Test', function() {


  beforeEach(function() {
    cy.login(data.email, data.password);
  })
  afterEach(function() {
    cy.logout();
  })
  //it should visit setting/userList page, page have option to add user in list
  it('Visits the Setting/UserList Setting Page, check page options', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#userList_table table').should('be.exist')
    cy.get('#add-user a').should('be.exist')
  })

  // user list for login email, it should not be presented there
  it('Check Loged In user"s email, that should not be there', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#userList-table table').then(function() {
      cy.get('#userList-table tbody').within(function() {
        cy.get('tr>td').should(($el) => {
          expect($el).not.to.contain(data.email)
        })
      })
    })
  })


  //if user click on add user button from page it should open a Add New User pop up with a form. if user click on close button
  //this popus must be closed and user list remain same
  it('test add user button and close button functionality', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#add-user').click()
    cy.get('#addUserForm')
    cy.get('#addUserForm #close-add-user-button').click()
  })

  //check if form is invalid save button must be disable
  it('check add USER button validation', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#add-user a').click()
    cy.get('#addUserForm').then(function() {
      cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
      cy.get('#addUserForm #close-add-user-button').click()
    })
  })


  //if user fill eamilId, select role, password and confirm password but form is still invalid
  //then save button must be disable
  it('check add button with invalid form data', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#add-user a').click()
    cy.get('#addUserForm').then(function() {
      cy.get('#addUserForm #add-user-email').type("afs").then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
      });
      cy.get('#addUserForm #user-role-select').click().then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled');
        cy.get('md-option#md-option-0').click();
      });
      cy.get('#addUserForm #add-user-password').type("12").then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
      });;
      cy.get('#addUserForm #add-user-cpassword').type('32').then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
        cy.get('#addUserForm #close-add-user-button').click()
      });
    })
  })


  // if user fill eamilId, select role, password and confirm password and form is valid then save button must be enable,
  // if user click add user button, it should close popup and add a user in user list with filled details
  it('check add button with valid form data, and user list', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#add-user a').click()
    cy.get('#addUserForm').then(function() {
      cy.get('#addUserForm #add-user-email').type(data.userEmail).then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
      });
      cy.get('#addUserForm #user-role-select').click().then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled');
        cy.get('md-option#md-option-0').click();
      });
      cy.get('#addUserForm #add-user-password').type(data.userPass).then(function() {
        cy.get('#addUserForm #add-user-button').should('have.attr', 'disabled')
      });
      cy.get('#addUserForm #add-user-cpassword').type(data.userPass).then(function() {
        cy.get('#addUserForm #add-user-button').should('not.have.attr', 'disabled')
        cy.get('#addUserForm #add-user-button').click()
      });
    });
    cy.get("#addUserForm").should("not.be.visible");    
    cy.get('#userList-table table').then(function() {
      cy.get('#userList-table tbody').within(function() {
        cy.get('tr>td').contains(data.userEmail)
      })
    })
  })

  //logout the current user, go to login page and login with latest added user, it should login
  it('login with current added user', function() {
    cy.logout()
    cy.login(data.userEmail, data.userPass)
  })


  //logout again and login with admin user togo userlist page,
  //in every user have a option to delete user, click on last added user's delete button,
  //it should open a confirm popup, it have 2 option 'yes' and 'no' buttons, if user click on 'no' popup will close
  // and user list should be remain same, or if user hit yes user should be deleted and user list should be updated
  it('test user delete functionality', function() {
    cy.visit(data.baseUrl + 'core/setting/usersList');
    cy.get('#userList-table table').then(function() {
      cy.get('#userList-table tbody').within(function() {
        cy.get('tr:first>td i').click()
      })
      cy.get('#confirm #confirmNo').click()
      cy.get("#confirm").should("not.be.visible");      
      cy.get('#userList-table tbody').within(function() {
        cy.get('tr>td').should(($el) => {
          expect($el).to.contain(data.userEmail)
        })
        cy.get('tr:first>td i').click()
      })
      cy.get('#confirm #confirmYes').click()
      cy.get("#confirm").should("not.be.visible");      
      cy.get('#userList-table tbody').within(function() {
        cy.get('tr>td').should(($el) => {
          expect($el).not.to.contain(data.userEmail)
        })
      })
    })
  })
})
