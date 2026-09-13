import { randomlySample } from '../../../../../../src/util/array';

export type LoginMethod = 'email & password' | 'email & otp' | 'google';
export type LoginInformation = any;

export class User {
	email: string;

	constructor(email: string) {
		this.email = email;
	}

	chooseLoginMethod(loginMethod: LoginMethod) {
		cy.findByRole('button', { name: RegExp(`${loginMethod}`, 'i') })
			.should('be.visible')
			.click();
	}

	get loginMethods(): Record<LoginMethod, (requiredInformation: LoginInformation) => void> {
		return {
			'email & password': ({ password }) => {
				this.chooseLoginMethod('email & password');
				cy.findByLabelText(/email/i).type(this.email, { delay: 0 });
				cy.findByLabelText(/password/i).type(password);
				cy.get('form')
					.findByRole('button', { name: /continue/i })
					.click();
			},
			'email & otp': () => {
				this.chooseLoginMethod('email & otp');
				cy.findByLabelText(/email/i).type(this.email, { delay: 0 });
				cy.get('form')
					.findByRole('button', { name: /send OTP email/i })
					.click();

				cy.enterOTPFromInbox(this.email);

				cy.get('form')
					.findByRole('button', { name: /continue/i })
					.click();
			},

			google: (requiredInformation) => {
				cy.frameLoaded('[title="Sign in with Google Button"]');
				cy.iframe().findByRole('button').should('have.text', 'Google');
			}
		};
	}

	goToBecomeUserPage() {
		randomlySample([
			() => {
				cy.visit('/');
				cy.findByRole('main')
					.findAllByRole('link')
					.contains(/become a user/i)
					.click();
			},
			() => {
				cy.findByRole('navigation')
					.findAllByRole('link')
					.contains(/become a user/i)
					.click();
			},
			() => cy.visit('/become-user')
		])();

		cy.findByRole('heading', { name: /Become a user/i }).should('be.visible');
	}

	becomeUser(method: LoginMethod, requiredInformation: LoginInformation) {
		this.goToBecomeUserPage();
		this.loginMethods[method](requiredInformation);
	}

	loginShouldWork() {
		cy.url().should('not.include', '/become-user');
		cy.shouldHaveToast('positive', /logged in/i);
		this.shouldBeLoggedIn();
	}

	shouldBeLoggedIn() {
		this.logoutButton().should('be.visible');
		cy.get('body').realClick();
	}

	verifyIfPossible() {
		cy.url().then((url) => {
			if (!url.includes('/verify-email')) return;

			cy.get('form button')
				.contains(/send OTP email/i)
				.click();
			cy.enterOTPFromInbox(this.email);

			cy.get('form button')
				.contains(/verify email/i)
				.click();
			cy.shouldHaveToast('positive', /.*verified.*/i);
		});
	}

	private logoutButton() {
		cy.wait(2000);
		cy.get('header nav').findByRole('navigation').should('be.visible').realHover();
		return cy.findByRole('button', { name: /logout/i }).should('be.visible');
	}

	logout() {
		this.logoutButton().click();
		cy.shouldHaveToast('positive', /.*logged out.*/i);
	}

	private goToForgotPasswordPage() {
		randomlySample([
			() => {
				cy.url().should('include', '/become-user');
				this.chooseLoginMethod('email & password');
				cy.findAllByRole('link')
					.contains(/forgot password\?/i)
					.should(($a) => {
						const message = $a.parent().parent().text();
						expect($a, message).to.have.attr('href', '/forgot-password');
					})
					.click();
			},
			() => cy.visit('/forgot-password')
		])();

		cy.findByRole('heading', { name: /.*send reset password email.*/i }).should('be.visible');
		cy.wait(2000);
	}

	requestToResetPassword() {
		this.goToBecomeUserPage();
		this.chooseLoginMethod('email & password');
		cy.findByLabelText(/email/i).type(this.email, { delay: 0 });
		// no idea what my password is?

		this.goToForgotPasswordPage();
		cy.findByLabelText(/email/i).should('be.visible').type(this.email, { delay: 0 });
		cy.findByRole('button', { name: /send email/i }).click();

		cy.shouldHaveToast('positive', /.*password reset email sent.*/i);
	}

	forgotPasswordSoReset(newPasswordToResetTo: string) {
		this.requestToResetPassword();

		cy.task('getLastEmail', this.email).then((email) => {
			cy.log(email as string);
			const resetPasswordURL = (email as string).split('href="')[1].split('"')[0];
			cy.log(resetPasswordURL);
			cy.visit(resetPasswordURL);
			cy.wait(2000);
		});

		cy.url().should('include', 'reset-password');
		cy.findByRole('heading', { name: /Reset password/i }).should('be.visible');
		cy.wait(2000);
		cy.findAllByLabelText(/new password/i)
			.eq(0)
			.focus()
			.type(newPasswordToResetTo);
		cy.findByLabelText(/confirm new password/i)
			.focus()
			.type(newPasswordToResetTo);
		cy.findByRole('button', { name: /reset to new password/i }).click();
		cy.shouldHaveToast('positive', /password has reset/i);
	}

	private goToChangePasswordPage() {
		randomlySample([
			() => {
				cy.get('header nav')
					.findByRole('navigation')
					.should('be.visible')
					.realHover()
					.contains('a', /change password/i)
					.click();
			},
			() => cy.visit('/change-password')
		])();

		cy.findByRole('heading', { name: /change password/i }).should('be.visible');
	}

	changePassword(oldPassword: string, passwordToChangeTo: string) {
		this.shouldBeLoggedIn();
		this.goToChangePasswordPage();
		cy.findByLabelText(/current password/i)
			.should('be.visible')
			.type(oldPassword);
		cy.findByLabelText('New password').type(passwordToChangeTo);
		cy.findByLabelText(/confirm new password/i).type(passwordToChangeTo);
		cy.findByRole('button', { name: /change to new password/i }).click();
		cy.shouldHaveToast('positive', /password has changed/i);
	}
}
