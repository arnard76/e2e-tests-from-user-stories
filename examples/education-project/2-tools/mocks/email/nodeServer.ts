import ms from 'smtp-tester';
let mailServer: ms.MailServer | undefined;
// [receiver email]: email text
let lastEmail: Record<string, string> = {};

export function setupMailServer() {
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

export function stopMailServer() {
	if (mailServer) mailServer.stop(() => console.info('mail server stopped'));
	mailServer = undefined;
	return null;
}

export function resetEmails(email?: string | undefined) {
	console.log('reset all emails');
	if (email) {
		delete lastEmail[email];
	} else {
		lastEmail = {};
	}
	return null;
}

export function getLastEmail(email: string): string | null {
	// cy.task cannot return undefined
	// thus we return null as a fallback
	return lastEmail[email] || null;
}
