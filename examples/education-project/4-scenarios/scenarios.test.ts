/**
 * Scenario that exists for a specific person that matches one of the categories in stories.ts
 * They have specific needs, use specific tool version and specific feature versions
 * and perform specific actions, and receive specific outcomes
 *
 * Format:
 * person P1 can do (their want, W1) by doing the following flow (list of actions in order):
 *    - Tool T1 > Feature F2 > Action A3              which results in outcomes O1, O2, O3
 *    - Tool T9 > Feature F78 > Action A100           which results in outcomes O9, O10, O12
 *    - ....
 *
 *
 * Testing:
 *
 * Each action has corresponding UI actions that can be performed in an actual web browser by Playwright.
 * An action could be:
 *    - interaction
 *    - checking an outcome/result
 *
 * Format of testable actions:
 *
 * A1: (params) => { // UI Actions go here }
 *
 */

import { thisPerson } from '../../../src';
import { courseAnalysisMapper } from '@/2-tools/CourseAnalysisMapper';
import { UniversityHOD } from '@/1-users/university-head-of-department';
import { hodJames } from '@/1-users/university-head-of-department/examples';
import { karina } from '@/1-users/university-programme-leads/example';
import { UniversityProgrammeLead } from '@/1-users/university-programme-leads';
import { exerciseScienceDepartment } from '@/1-users/university-teaching-group/examples';
import { exersciPGCourses } from '@/cypress/data/courses';
import { UniversityCourseCoordinator } from '@/1-users/university-course-coordinator';
import { guyDale } from '@/1-users/university-course-coordinator/examples';

export const twoLMApp = courseAnalysisMapper.features;

thisPerson(HSA)
	.whoIsA(UniversityCourseCoordinator)
	.can('understand their course')
	.byDoingTheFollowingActions([
		twoLMApp.user.becomeUser('google', { email: guyDale.email }),
		twoLMApp.navigate.gotoPage('/'),
		twoLMApp.courseSecurity.identify(),
		twoLMApp.courseSecurity.describe(),
		twoLMApp.courseSecurity.inspectAnalysis()
	])
	.test();

thisPerson(hodJames)
	.whoIsA(UniversityHOD)
	.can('support the programme leads')
	.andAlsoCan('support the course coordinators')
	.byDoingTheFollowingActions([
		// TODO: idea 💡 use a list here to provide multiple alternative actions?
		// e.g. [twoLMApp.navigate.gotoPage('/features'), twoLMApp.navigate.clickButton('features')]
		// or better, slightly more explicit:
		// Action.oneOf(twoLMApp.navigate.gotoPage('/features'), Action.combine("navigate via button", twoLMApp.navigate.openWebApp(), twoLMApp.)),
		twoLMApp.user.becomeUser('google', { email: hodJames.email }),
		twoLMApp.navigate.gotoPage('/features'),
		twoLMApp.toolFeatures.providePaymentMethod(),
		twoLMApp.toolFeatures.enableFeature('learning security flow'),
		twoLMApp.toolFeatures.enableFeature('mapping courses'),
		twoLMApp.user.addSupportUser('Analyse courses', karina.email),
		twoLMApp.user.addSupportUser('Analyse courses', exerciseScienceDepartment.name),
		twoLMApp.user.logout()
	])
	.test();

thisPerson(karina)
	.whoIsA(UniversityProgrammeLead)
	.can('understand their programme')
	.byDoingTheFollowingActions([
		twoLMApp.user.becomeUser('google', { email: karina.email }),
		twoLMApp.navigate.gotoPage('/courses/analyse'),
		twoLMApp.securityOfGroupOfCourses.addCourses(exersciPGCourses),
		twoLMApp.securityOfGroupOfCourses.filterCoursesToAnalyse([]),
		twoLMApp.securityOfGroupOfCourses.inspectAnalysis({}),
		twoLMApp.user.logout()
	])
	.test();

thisPerson(guyDale)
	.whoIsA(UniversityCourseCoordinator)
	.can('improve course')
	.byDoingTheFollowingActions([
		twoLMApp.user.becomeUser('google', { email: guyDale.email }),
		twoLMApp.navigate.gotoPage('/course/3/analyse'),
		twoLMApp.courseSecurity.inspectAnalysis(),
		twoLMApp.courseSecurity.test(),
		twoLMApp.courseSecurity.redesign(),
		twoLMApp.user.logout()
	])
	.test();
