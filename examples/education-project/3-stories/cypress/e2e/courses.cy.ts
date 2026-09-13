/**
 * All courses features
 *
 * TODO: analysis,
 * Q: what exactly is the goal of the map?
 */

import { Course } from '@/cypress/actions/courseActions';
import { User } from '@/cypress/actions/userActions';
import { exersciCourses, exersciUGCourses } from './data/courses';

const exampleUser = new User('b@auckland.ac.nz', 'password1A');

describe('Courses features', () => {
	before(() => {
		cy.visit('/');
		exampleUser.login();

		// sign-in as several coordinators to add their courses
		// logout and sign-in as the HOD or as a team
	});
	describe('analyse a subject', { testIsolation: false }, analyseSet(exersciCourses));
	describe(
		'analyse a programme',
		{ testIsolation: false },
		analyseSet(exersciUGCourses))
	);
	after(() => {
		exampleUser.logout();
	});
});

function analyseSet(courses: Course[]) {
	return () => {
		it('correct courses are being analysed', () => {
			console.log({ courses });
		});
		describe('Summary', () => {
			it('total number LOs and assessments', () => {});
			it('average number LOs and assessments', () => {});
			it('number of secure LOs', () => {
				// main info is a number of LOs (accompanied by % of total LOs)
			});
			it('average assessment security', () => {});
		});
		describe('Quick stats charts', () => {
			it('has correct data values', () => {});
			it('has correct colours', () => {});
			it('has valid tooltips', () => {});
		});
	};
}
