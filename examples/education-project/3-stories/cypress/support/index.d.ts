// TODO: DRY: failed DRY because this is also in types -> client
type Feedback = 'positive' | 'negative' | 'neutral' | 'slightly-negative';

declare namespace Cypress {
	interface Chainable {
		recursionLoop(fn: (times?: number) => any, times?: number): Chainable<void>;
		findParentByHeading<K extends keyof HTMLElementTagNameMap>(
			parent: K,
			heading: string | RegExp
		): Chainable<JQuery<HTMLElementTagNameMap[K]>>;
		shouldHaveToast(type: Feedback, message: string | RegExp): Chainable<void>;
		enterOTPFromInbox(email: string): Chainable<void>;
	}
}
