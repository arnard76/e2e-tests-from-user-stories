class MokapiMailServer {
	baseURL = 'http://localhost:8080/api/services/mail';

	async getLastEmail(email: string): Promise<any | null> {
		const mails = await fetch(`${this.baseURL}/Email%20Workflows/mailboxes/${email}/messages?limit=1`);
		// const mails = await request.get(`http://localhost:8080/api/services/mail/Email%20Workflows/mailboxes/${recipient}/messages?limit=1`);

		let mailList;
		try {
			mailList = await mails.json();
		} catch (e) {
			console.info('Unable to get email');
			return null;
		}

		console.log({ mailList });
		if (!mailList.length) return null;

		const result = await fetch(`${this.baseURL}/messages/${mailList[0].messageId}`);
		const mail = await result.json();
		console.log({ mail });

		return mail;
	}
}

export const mockapiMailServer = new MokapiMailServer();
