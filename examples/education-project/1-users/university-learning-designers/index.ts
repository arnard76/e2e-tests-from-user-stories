import { Person } from '@/util';

export class UniversityLearningDesigner extends Person {
    static connections = {
        wantsTo: {
            'analyse courses on behalf of teaching staff': {},
        }
    } as const;

    departments: string[];

    constructor(name: string, email: string, departments: string[]) {
        super(name, email);
        this.departments = departments;
    }
}
