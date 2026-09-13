import { Course } from '@/cypress/actions/courseActions';

export const exersciUGCourses = [
	new Course('EXERSCI100G', 2025, 'Semester Two'),
	new Course('EXERSCI105', 2025, 'Semester Two'),
	new Course('EXERSCI201', 2025, 'Semester One'),
	new Course('EXERSCI207', 2025, 'Semester Two')
];

export const exersciPGCourses = [
	new Course('EXERSCI704', 2025, 'Semester One'),
	new Course('EXERSCI722', 2025, 'Semester One'),
	...['EXERSCI 738', 'EXERSCI 754', 'EXERSCI 755', 'EXERSCI 790B'].map((cc) => new Course(cc, 2026, 'Semester Two'))
];

export const exersciCourses = [...exersciUGCourses, ...exersciPGCourses];

export const compsciUGCourses = [
	new Course('COMPSCI101', 2025, 'Semester Two'),
	new Course('COMPSCI110', 2025, 'Semester Two'),
	new Course('COMPSCI120', 2025, 'Semester Two'),
	new Course('COMPSCI210', 2025, 'Semester Two'),
	new Course('COMPSCI220', 2025, 'Semester Two'),
	new Course('COMPSCI235', 2025, 'Semester Two'),
	new Course('COMPSCI742', 2026, 'Semester Two'), // future course
	new Course('COMPSCI335', 2025, 'Semester Two')
];

export const compsciPGCourses = [
	new Course('COMPSCI750', 2025, 'Semester Two'),
	new Course('COMPSCI725', 2025, 'Semester Two'),
	new Course('COMPSCI705', 2025, 'Semester Two')
];

export const compsciCourses = [...compsciUGCourses, ...compsciPGCourses];

export const compsysPGCourses = [new Course('COMPSYS731', 2026, 'Semester One'), new Course('COMPSYS732', 2026, 'Semester One')];

export const courses = [
	// UG
	...compsciUGCourses,
	...exersciUGCourses,

	new Course('BIOSCI325', 2025, 'Semester Two'),
	new Course('MATHS254', 2025, 'Semester Two'),

	// PG
	...compsciPGCourses,
	...exersciPGCourses,
	...compsysPGCourses,

	new Course('AUDIOL704', 2025, 'Semester Two')
];

export const futureCourses = courses.filter((course) => course.year > 2025);
