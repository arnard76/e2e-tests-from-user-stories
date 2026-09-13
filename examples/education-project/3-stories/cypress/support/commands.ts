/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('recursionLoop', function (fn, times = 0) {
	cy.then(async () => {
		const result = await fn(++times);
		if (result !== false) {
			cy.recursionLoop(fn, times);
		}
	});
});

Cypress.Commands.add('findParentByHeading', function (parent, heading) {
	return cy.findByRole('heading', { name: heading }).parents(parent);
});

Cypress.Commands.add('shouldHaveToast', function (type, message) {
	cy.findByRole('alert').should('have.class', `border-feedback-${type}`).contains(message);
});

Cypress.Commands.add('enterOTPFromInbox', function (email: string) {
	cy.findByLabelText(/OTP/i, { collapseWhitespace: true, exact: false }).should('be.visible');
	cy.task('getLastEmail', email).then((email) => {
		cy.log(email as string);
		let otp: any = (email as string).match(/\d{6}/);
		otp = otp && otp.length && otp[0];
		cy.log(otp);
		cy.findByLabelText(/OTP/i, { collapseWhitespace: true, exact: false }).type(otp);
	});
});
