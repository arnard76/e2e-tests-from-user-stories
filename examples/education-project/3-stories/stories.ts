/**
 * Stories
 *  - Highlights user needs and wants
 *  - Connects each user needs to the tools and features that satisfy need/want
 *
 * Format:
 * person who is P wants W can use tool T because it has features F1, F2, F3, ... Fn.
 * where P is a type of person (e.g. Businessmen, Students, 40 year-old virgins)
 *
 * To document and test specific scenarios, take a look at scenario.test.ts
 */

import { personWhoIs } from '../../../src';
import { courseAnalysisMapper } from '@/2-tools/CourseAnalysisMapper';
import { UniversityHOD } from '@/1-users/university-head-of-department';

personWhoIs(UniversityHOD).wantsTo('support the course coordinators').canUseTool(courseAnalysisMapper).becauseItHasFeatures(['toolFeatures']);

