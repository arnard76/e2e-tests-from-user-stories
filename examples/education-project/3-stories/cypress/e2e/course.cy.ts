/**
 * All course features
 *
 * identify, describe,
 * TODO: analysis,fix
 */

import { Course } from '@/cypress/actions/courseActions';
import { User } from '@/cypress/actions/userActions';
import { randomlySample } from '../../../../../src/util/array';

const exampleUser = new User('b@auckland.ac.nz');
const randomCourseCodes = ['EXERSCI 738', 'EXERSCI 754', 'EXERSCI 755', 'EXERSCI 790B'];

// TODO: this has to be a new course (not already analysed)
// TODO: might be time to make a local test db?
const exampleCourse = new Course(randomlySample(randomCourseCodes), 2026, 'Semester Two', ['Master of Clinical Exercise Physiology']);

describe('Course features', () => {
	before(() => {
		cy.clearAllCookies();
		cy.visit('/');
		exampleUser.becomeUser('email & otp', {});
	});
	describe('example course', { testIsolation: false }, () => {
		it('identify & describe course', () => {
			cy.findByRole('button', { name: /analyse a course/i }).click();
			exampleCourse.identifyCourse();
			cy.shouldHaveToast('positive', /description found/i);

			exampleCourse.describeCourse();
			cy.shouldHaveToast('positive', /course analysis done/i);
		});

		describe('analyses course', () => {
			// Q: has test isolation too?
			describe('LOs', () => {
				it('All LO texts are correct', () => {});

				it('All LO security statuses are correct', () => {});
			});

			describe('Assessments', () => {
				it('All assessment information is correct', () => {
					// e.g. name, type, weight, LOs assessed, access level, invigilation status etc.
				});

				it('All assessment security statuses are correct', () => {});
			});

			describe('analysis summary', () => {
				it('every courses in correct group', () => {});
			});

			describe('Quick stats', () => {
				it('has correct data values', () => {});
				it('has correct colours', () => {});
				it('has valid tooltips', () => {});
			});
		});
	});
	after(() => {
		exampleUser.logout();
	});
});
