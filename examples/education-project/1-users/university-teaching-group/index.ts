import { Person } from '@/util';

export class UniversityTeachingGroup extends Person {
    static connections = {
        wantsTo: {
            'understand their collection of courses': {},
            'explain & present ideas to management group': {},
            'scale group\'s courses to more students': {},
            'provide rhythmic, transformative learning experience of multiple courses': {}
        }
    } as const;

    department: string;

    constructor(name: string, department: string) {
        super(name, '');
        this.department = department;
    }
}
