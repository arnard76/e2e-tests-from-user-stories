// A tool or a type of tool doesn't mention or specify the type of user or type of stakeholder or type of person
// And vice versa is true (check User section)

import { action, Action, Tool } from '@/util';
import { expect, test } from '@playwright/test';

export class Practice2Learn extends Tool {
	constructor() {
		super('Practice 2 Learn Next.js App');
	}

	features = {
		navigate: {
			openWebApp() {
				const openWebApp = new Action('openWebApp');

				openWebApp.uiAction = async ({ page }) => {
					// new Outcome("shows landing page if not logged in"),
					// openWebApp.hasEffect(new Outcome("shows home page if logged in"));
					// "redirects to last notebook if logged in and using notebook",
					await page.goto('http://localhost:3000');
				};

				return openWebApp;
			},
			openNotebook() {
				return action('openNotebook').setUIAction(({ page }) => {
					page.getByRole('link', { name: /notebook XXXX/i }).click();
				});
			}
		},
		makeRichNotesNaturally: {
			checkAllNotetakingToolsAreFunctional() {
				return new Action('');
			},
			setupForLecture() {
				return new Action('');
			},
			importLearningMaterial() {
				return new Action('');
			},
			findExternalResources() {
				return new Action('findExternalResources');
			},
			artificiallyGenerateImage() {
				return new Action('');
			},
			safelySaveNotes() {
				return new Action('');
			}
		},
		practice: {
			automaticallyGiveStudentPractice() {
				return action('automaticallyGiveStudentPractice').setUIAction(({ page }) => {
					// check receives appropriate difficulty of practice
				});
			},

			giveStudentPracticeOnRequest() {
				return action('');
			},

			// genuinely an action that the user can perform!
			// repeating it several times,
			// may make the user feel guilty enough to try the practice just once 🤞🧑‍🏫
			ignorePractice() {
				return new Action('');
			},

			planPractice() {
				// to fit their environment and mood
				// scheduleTimeForPractice
				// findLocationForPractice

				return new Action('');
			},

			startPractice() {
				return new Action('');
			},

			answerPracticeQuestion() {
				return new Action('');
			},

			interruptStudentPracticeDuringStruggle() {
				return new Action('');
			},

			quickInClassTopicPractice() {
				return new Action('');
			},

			completePracticeSession() {
				return new Action('');
			}
		}
	} as const;
}
