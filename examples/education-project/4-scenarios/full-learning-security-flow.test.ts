import { thisPerson } from '../../../src';
import { courseAnalysisMapper } from '@/2-tools/CourseAnalysisMapper';
import { UniversityHOD } from '@/1-users/university-head-of-department';
import { hodJames } from '@/1-users/university-head-of-department/examples';
import { karina } from '@/1-users/university-programme-leads/example';
import { UniversityProgrammeLead } from '@/1-users/university-programme-leads';
import { exerciseScienceDepartment } from '@/1-users/university-teaching-group/examples';
import { compsysPGCourses } from '@/cypress/data/courses';
import { UniversityCourseCoordinator } from '@/1-users/university-course-coordinator';
import { guyDale } from '@/1-users/university-course-coordinator/examples';
import test from '@playwright/test';

export const twoLMApp = courseAnalysisMapper.features;

thisPerson(guyDale)
	.whoIsA(UniversityCourseCoordinator)
	.can('understand their course')
	.byDoingTheFollowingActions([
		twoLMApp.user.becomeUser('email & otp', { email: guyDale.email }),
		// twoLMApp.navigate.gotoPage('/'),
		twoLMApp.courseSecurity.identify(compsysPGCourses[0]),
		twoLMApp.courseSecurity.describe(),
		twoLMApp.courseSecurity.inspectAnalysis(),
		twoLMApp.toolFeatures.requestFeatureToBeEnabled({
			supervisorEmail: 'brucie@auckland.ac.nz',
			courseCodes: [compsysPGCourses[0].courseCode],
			feature: 'learning security flow'
		})
	])
	.test();

thisPerson(hodJames)
	.whoIsA(UniversityHOD)
	.can('support the programme leads')
	.byDoingTheFollowingActions([
		twoLMApp.user.becomeUser('google', { email: hodJames.email }),
		twoLMApp.toolFeatures.providePaymentMethod({}),
		twoLMApp.toolFeatures.enableFeature('learning security flow')
	])
	.test();
