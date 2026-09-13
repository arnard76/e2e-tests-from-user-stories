import { Person } from '@/util';

export class UniversityProgrammeLead extends Person {
    static connections = {
        wantsTo: {
            'understand their programme': {},
            'explain & present ideas to HOD': {},
            'support the course coordinators': {},
            'scale programme & it\'s courses to more students': {}
        }
    } as const;

    department: string;

    constructor(name: string, email: string, department: string) {
        super(name, email);
        this.department = department;
    }
}
