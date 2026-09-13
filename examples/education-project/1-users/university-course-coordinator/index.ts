import { Person } from '../../../../src';

export class UniversityCourseCoordinator extends Person {
	static connections = {
		wantsTo: {
			'understand their course': {},

			'explain & present ideas to programme lead': {},
			'explain & present ideas to management group': {},
			'scale course to more students': {},
			'improve course': {},

			// .... more go here ....
			'provide rhythmic, transformative learning experience within related courses': {}
		}
	} as const;

	department: string;

	constructor(name: string, email: string, department: string) {
		super(name, email);
		this.department = department;
	}
}
