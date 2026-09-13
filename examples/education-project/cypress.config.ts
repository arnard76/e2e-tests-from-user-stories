import { defineConfig } from 'cypress';
import ms from 'smtp-tester';

export default defineConfig({
	defaultCommandTimeout: 16000,
	video: true,
	numTestsKeptInMemory: 3,
	experimentalMemoryManagement: true,
	e2e: {
		baseUrl: 'http://localhost:5173', // local
		setupNodeEvents(on, config) {
			// implement node event listeners here
			config.env = { ...config.env, ...process.env };

			let mailServer: ms.MailServer | undefined;
			// [receiver email]: email text
			let lastEmail: Record<string, string> = {};

			function setupMailServer() {
				// starts the SMTP server at localhost:7777
				if (mailServer) return null;
				const port = 7777;
				mailServer = ms.init(port);
				console.info('mail server at port %d', port);

				// process all emails
				mailServer.bind((_addr, _id, email) => {
					console.log('--- email to %s ---', email.headers.to);
					console.log(email.body);
					console.log('--- end ---');
					// store the email by the receiver email
					lastEmail[(email.headers.to || 'global').toString()] = email.html || email.body || '';
				});
				return null;
			}

			function stopMailServer() {
				if (mailServer) mailServer.stop(() => console.info('mail server stopped'));
				mailServer = undefined;
				return null;
			}

			setupMailServer();
			// @ts-expect-error cypress doing something funny
			on('after:run', () => stopMailServer());
			on('task', {
				resetEmails(email?: string | undefined) {
					console.log('reset all emails');
					if (email) {
						delete lastEmail[email];
					} else {
						lastEmail = {};
					}
					return null;
				},

				getLastEmail(email: string): string | null {
					// cy.task cannot return undefined
					// thus we return null as a fallback
					return lastEmail[email] || null;
				}
			});

			on('before:browser:launch', (_, launchOptions) => {
				launchOptions.args.push('--js-flags=--max-old-space-size=3500');

				return launchOptions;
			});

			return config;
		}
	}
});
