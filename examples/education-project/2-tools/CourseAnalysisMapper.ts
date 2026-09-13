// A tool or a type of tool doesn't mention or specify the type of user or type of stakeholder or type of person
// And vice versa is true (check User section)

import { LoginInformation, LoginMethod } from '@/cypress/actions/userActions';
import { action, Action, Tool } from '@/util';
import { expect, Page } from '@playwright/test';
import { mailServer } from './mocks/email';
import { Course } from '@/cypress/actions/courseActions';
import { CourseIdentifier } from 'types';
import { existingAccounts } from '@/cypress/util/google-sso';

type UserFeature = CourseAnalysisMapper['userRelevantFeatures'][number];

export class CourseAnalysisMapper extends Tool {
	constructor() {
		super('Course Analysis Mapper SvelteKit App');
	}

	commonUIActions = {
		checkToast(colour?: string, messageContent?: RegExp | string) {
			return async ({ page }: { page: Page }) => {
				const toast = page.getByRole('alert').filter({ visible: true, hasText: messageContent });
				await toast.scrollIntoViewIfNeeded();
				if (colour) expect(toast).toHaveCSS('border-color', colour);
				return toast;
			};
		}
	};

	userRelevantFeatures = ['course security analysis', 'learning security flow', 'group of courses security analysis'] as const;

	features = {
		user: {
			becomeUser: (method: LoginMethod, credentials: LoginInformation) => {
				return action('becomeUser').setUIAction(async ({ page, baseURL }) => {
					await page.route('https://accounts.google.com/gsi/fedcm/listaccounts', async (route) => {
						await route.fulfill({ json: existingAccounts });
					});

					const methods: Record<LoginMethod, any> = {
						google: async () => {
							const continueWithGoogleButton = page
								.frameLocator('[title="Sign in with Google Button"]')
								.getByText('Continue with Google', { exact: true });
							await continueWithGoogleButton.click();
						},
						'email & otp': async () => {
							const loginMethodButton = page.getByRole('button', { name: RegExp(`${method}`, 'i') });
							expect(loginMethodButton).toBeVisible();
							await loginMethodButton.scrollIntoViewIfNeeded();
							await loginMethodButton.click();

							await page.getByLabel(/email/i).fill(credentials.email);
							await page.getByRole('button', { name: /send OTP email/i }).click();

							await page.waitForTimeout(1000);
							await enterOTPFromInbox();
							await page.locator('form').getByRole('button', { name: 'Continue' }).click();
						},
						'email & password': async () => {}
					};

					async function enterOTPFromInbox() {
						const lastEmail = await mailServer.getLastEmail(credentials.email);
						if (!lastEmail) return;

						const emailBody = lastEmail['data']['body'];

						console.log({ emailBody });
						const otpMatches = (emailBody as string).match(/>\d{6}</);

						expect(otpMatches).toBeDefined();
						expect(otpMatches).toHaveLength(1);

						const otp = otpMatches![0].replace('<', '').replace('>', '');
						await page.getByLabel(/OTP/i, { exact: false }).fill(otp);
					}

					await page.goto('/become-user');
					await page.waitForTimeout(10000);
					await methods[method]();

					await this.commonUIActions.checkToast('rgb(80, 255, 123)', new RegExp(`logged in`, 'i'))({ page });
					if (!baseURL) return;
					await page.waitForURL(baseURL);
					const userMenu = page.getByRole('navigation').getByRole('menu');
					expect(userMenu).toBeInViewport();
					await userMenu.hover();
					expect(userMenu.getByRole('heading', { name: /user/i })).toBeVisible();
				});
			},
			addSupportUser: () => action('addSupportUser'),
			logout: () => action('logout').setUIAction(({ page }) => {})
		},
		navigate: {
			openWebApp() {
				const openWebApp = new Action('openWebApp');

				openWebApp.uiAction = async ({ page }) => {
					// new Outcome("shows landing page if not logged in"),
					// openWebApp.hasEffect(new Outcome("shows home page if logged in"));
					// "redirects to last notebook if logged in and using notebook",
					await page.goto('/');
				};

				return openWebApp;
			},
			gotoPage(pageRoute: string) {
				return action('gotoPage').setUIAction(async ({ page }) => {
					await page.goto(pageRoute);
				});
			}
		},
		toolFeatures: {
			providePaymentMethod: (paymentDetails: any) => {
				return action('providePaymentMethod').setUIAction(() => {});
			},
			requestFeatureToBeEnabled: (featureRequestInfo: {
				supervisorEmail?: string;
				groupName?: string;
				courseCodes: string[];
				feature: UserFeature;
			}) => {
				return action('requestFeatureToBeEnabledForCourses').setUIAction(async ({ page }) => {});
			},
			requestCoursesToBeAddedToGroups: () => {
				return action('requestCoursesToBeAddedToGroups').setUIAction(async ({ page }) => {});
			},
			enableFeature: (featureName: UserFeature | RegExp) => {
				return action('enableFeature').setUIAction(async ({ page }) => {
					const featuresTable = page.locator('table#features');
					const featureNameCell = page.getByRole('cell').filter({ hasText: featureName });
					const featureRow = featuresTable.getByRole('row').filter({ has: featureNameCell });
					const enableFeatureButton = featureRow.locator('label', { hasText: /enabled/i });

					await enableFeatureButton.click();
					await this.commonUIActions.checkToast(undefined, new RegExp(`${featureName} is enabled now`, 'i'))({ page });
				});
			},
			disableFeature: (featureName: string | RegExp) => {
				return action('disableFeature').setUIAction(async ({ page }) => {});
			}
		},
		courseSecurity: {
			identify: (courseIdentifier: CourseIdentifier) =>
				action('identifyCourse').setUIAction(async ({ page }) => {
					await page.getByRole('navigation').getByRole('link', { name: '/course/identify' }).click();
					await page.getByLabel(/.* code/i).fill(courseIdentifier.courseCode);
					await page.getByLabel(/year/i).fill(courseIdentifier.year.toString());
					if (courseIdentifier.term) await page.getByLabel(/semester/i).fill(courseIdentifier.term);
					await this.commonUIActions.checkToast('rgb(80, 255, 123)', new RegExp(``, 'i'))({ page });
				}),
			describe: (description?: string) =>
				action('describeCourse').setUIAction(async ({ page }) => {
					expect(page.url).toContain(/describe/i);
					// await page.getByRole('link', { name: '/course/identify' }).click();
					// await page.getByLabel(/.* code/i).fill(courseIdentifier.courseCode);
					// await page.getByLabel(/year/i).fill(courseIdentifier.year.toString());
					await this.commonUIActions.checkToast('rgb(80, 255, 123)', new RegExp(`analysed`, 'i'))({ page });
				}),
			inspectAnalysis: () => action('analyseCourse').setUIAction(({ page }) => {}),
			test: () => action('testCourseLearning').setUIAction(({ page }) => {}),
			redesign: () => action('redesignCourse').setUIAction(({ page }) => {})
		},

		securityOfGroupOfCourses: {
			addCourses: (courses: Course[]) => action('addCourse'),
			removeCourses: (courses: Course[]) => action('removeCourse'),
			filterCoursesToAnalyse: (filters: any) => action('filterCoursesToAnalyse').setUIAction(({ page }) => {}),
			inspectAnalysis: (clues: { numberOfCourses: number }) => action('inspectAnalysis').setUIAction(({ page }) => {}),
			adjustMap: (mapFormat: any) => action('adjustMap')
		}
	} as const;
}

export const courseAnalysisMapper = new CourseAnalysisMapper();
