import { CourseIdentifier } from 'types';

export class Course implements CourseIdentifier {
	semester: string;
	year: number;
	courseCode: string;

	constructor(courseCode: string, year: number, semester: string) {
		this.courseCode = courseCode;
		this.year = year;
		this.semester = semester;
	}

	identifyCourse() {
		cy.location('pathname').should('include', 'identify');

		cy.findByLabelText(/course code/i).type(this.courseCode, { delay: 0 });
		cy.findByLabelText(/year/i).type(this.year.toString());
		cy.findByLabelText(/semester/i).select(this.semester);

		cy.findByRole('button', { name: /describe course/i }).click();
	}

	describeCourse() {
		function getRandomIntInclusive(min: number, max: number) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		cy.location('pathname').should('include', 'describe');

		// category / type
		cy.get('td')
			.filter(':nth-child(2)')
			.find('select')
			.each(($select) => {
				cy.wrap($select).select(getRandomIntInclusive(1, 5));
			});

		// access level
		cy.get('td')
			.filter(':nth-child(5)')
			.find('select')
			.each(($select) => {
				cy.wrap($select).select(getRandomIntInclusive(1, 3));
			});

		// invigilation status
		cy.get('td')
			.filter(':nth-child(6)')
			.find('select')
			.each(($select) => {
				cy.wrap($select).select(getRandomIntInclusive(1, 3));
			});

		cy.findByRole('button', { name: /analyse course/i }).click();
	}

	fixCourse({ LOs, assessments, name }: { LOs?: string[]; assessments: any[]; name: string }) {
		cy.location('pathname').should('include', /\/course\/\d+\/fix/i);

		console.info(LOs, assessments, name);
	}
}
