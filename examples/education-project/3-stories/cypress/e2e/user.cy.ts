/**
 * All user features
 *
 * sign-up, login, profile, logout, forget password and change password
 * TODO: TESTING: Google SSO login & sign-up & switch too
 * TODO: TESTING: start with Google SSO or OTP login then switch to email & pass
 */

import { User } from './actions/userActions';

describe('User features', () => {
	describe('a flow with multiple login methods', { testIsolation: false }, () => {
		const newUser = new User(`b${window.crypto.randomUUID()}@auckland.ac.nz`);
		before(() => {
			cy.clearAllCookies();
			cy.visit('/');
		});

		it('has a new user', () => {
			newUser.becomeUser('email & password', { password: 'password1A' });
			newUser.loginShouldWork();
			newUser.verifyIfPossible();
			newUser.logout();
		});

		it('switch to email & otp login', () => {
			newUser.becomeUser('email & otp', {});
			newUser.loginShouldWork();
			newUser.logout();
		});

		it('switch back to email & password', () => {
			newUser.becomeUser('email & password', { password: 'password1A' });
			newUser.loginShouldWork();
			newUser.logout();
		});

		it('changes password', () => {
			newUser.becomeUser('email & password', { password: 'password1A' });
			const newPassword = 'password2A';
			newUser.changePassword('password1A', newPassword);
			newUser.logout();
			newUser.becomeUser('email & password', { password: newPassword });
			newUser.loginShouldWork();
			newUser.logout();
		});

		it.skip('switch to Google login', () => {
			newUser.becomeUser('google', {});
			newUser.loginShouldWork();
			newUser.logout();
		});

		it('forgets password', () => {
			const newPassword = 'password10A';
			newUser.forgotPasswordSoReset(newPassword);
			newUser.becomeUser('email & password', { password: newPassword });
			newUser.loginShouldWork();
		});
	});
});
