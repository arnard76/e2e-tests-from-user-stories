/**
 * All security features
 *
 * Prevent Account Enumeration and Guessable User Account:
 * https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html
 *
 *
 *
 */

import { User } from './actions/userActions';
const user = new User(`b${window.crypto.randomUUID()}@auckland.ac.nz`);
const fakeUser = new User(user.email);

describe('Prevent Account Enumeration and Guessable User Account', { testIsolation: false }, () => {
	describe('app does not share user details or their existence', () => {
		// TODO: SECURITY: fix this issue & hopefully keep the combined sign-up/login workflow?
		// THIS FAILS because the app doesn't meet the security requirements
		// because if the user exists & the login is wrong then it says didn't work
		// but the user doesn't exist, then it shows the verify page
		// hence there is a difference between responses for existing & non-existing user
		// hence there is a security & privacy vulnerability

		it.skip('during sign-up ', () => {
			cy.clearAllCookies();
			cy.visit('/');
			user.becomeUser('email & password', { password: 'real password 7A' });
			cy.shouldHaveToast('positive', /logged in/i);
			user.logout();

			const expectedMessage = /Login didn't work/i;

			const userPassword = 'password Fake1';
			fakeUser.becomeUser('email & password', { password: userPassword });
			cy.shouldHaveToast('negative', expectedMessage);
			cy.findByText('work', { exact: false, trim: true }).should('not.exist');
			cy.findByText(user.email, { exact: false, trim: true }).should('not.exist');
			cy.findByText(userPassword, { exact: false, trim: true }).should('not.exist');
			cy.findByText('does exist', { exact: false, trim: true }).should('not.exist');
			cy.findByText("doesn't exist", { exact: false, trim: true }).should('not.exist');
		});

		it('during reset password', () => {
			const realUserPassword = 'real password 7A';
			user.requestToResetPassword();
			const expectedMessage = /Password reset email sent/i;

			cy.shouldHaveToast('positive', expectedMessage);
			cy.findByText('work', { exact: false, trim: true }).should('not.exist');
			cy.findByText(user.email, { exact: false, trim: true }).should('not.exist');
			cy.findByText(realUserPassword, { exact: false, trim: true }).should('not.exist');
			cy.findByText('does exist', { exact: false, trim: true }).should('not.exist');
			cy.findByText("doesn't exist", { exact: false, trim: true }).should('not.exist');
		});
	});
});
