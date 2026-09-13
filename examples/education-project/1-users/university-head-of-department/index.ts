import { Person } from '@/util';

export class UniversityHOD extends Person {
	static connections = {
		wantsTo: {
			'understand their department': {},
			'support the programme leads': {},
			'support the course coordinators': {},
			'scale programmes & courses to more students': {}
		}
	} as const;

	department: string;

	constructor(name: string, email: string, department: string) {
		super(name, email);
		this.department = department;
	}
}
