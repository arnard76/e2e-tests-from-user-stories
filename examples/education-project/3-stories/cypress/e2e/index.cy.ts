import { Course } from '@/cypress/actions/courseActions';
import { User } from '@/cypress/actions/userActions';
import { courses, futureCourses } from '@/cypress/data/courses';

function analyseAssessments() {
	cy.url().should('include', `/course/analyse/`);

	// check that graphs are correct and any explanations and summaries are helpful
}

function readExplanationAndDescribeCourseAndAnalyseAssessments(course: Course) {
	cy.visit('/'); // read explanation
	cy.findByRole('link', { name: /describe your course/i })
		.should('be.visible')
		.should('not.be.disabled')
		.click();
	course.identifyCourse();
	cy.findByRole('button', { name: /describe course/i })
		.should('be.visible')
		.should('not.be.disabled')
		.click();
	course.describeCourse();
	cy.findByRole('button', { name: /analyse/i })
		.should('be.visible')
		.should('not.be.disabled')
		.click();
	analyseAssessments();
	cy.findByRole('link', { name: /edit course/i })
		.should('be.visible')
		.should('not.be.disabled')
		.click();
	cy.findByRole('button', { name: /analyse/i })
		.should('be.visible')
		.should('not.be.disabled')
		.click(); // back to dashboard
}

describe('describing courses', () => {
	const UoAUser = new User('instructor1@auckland.ac.nz');
	const UoSUser = new User('instructor2@sydney.edu.au');

	describe('UoA', () => {
		beforeEach(() => {
			cy.visit('/');
			UoAUser.becomeUser('email & otp', {});
			UoAUser.loginShouldWork();
		});

		it('evaluate a random course', () => {
			const randomCourse = courses[Math.floor(Math.random() * courses.length)];
			readExplanationAndDescribeCourseAndAnalyseAssessments(randomCourse);
		});

		it('evaluate a future course', () => {
			const randomCourse = futureCourses[Math.floor(Math.random() * futureCourses.length)];
			console.log({ randomCourse });
			readExplanationAndDescribeCourseAndAnalyseAssessments(randomCourse);
		});
	});

	describe('UoS', () => {
		beforeEach(() => {
			cy.visit('/');
			UoSUser.becomeUser('email & otp', {});
			UoSUser.loginShouldWork();
		});

		it('evaluate a UoS course', () => {
			const course = new Course('PHYS4123', 2025, 'Semester Two', ['Bachelor of Science']);
			readExplanationAndDescribeCourseAndAnalyseAssessments(course);
		});
	});
});
