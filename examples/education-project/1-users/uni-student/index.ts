import { Person } from "@/util";

type Course = {
  courseCode: string;
  courseName: string;
  semester: string;
  year: number;

  learningMaterial: any[];
  pastExams: any[];
};

/**
 * This represents a human person studying at a university
 */
class UniversityStudent extends Person {
  /* Properties available to us */
  dob: string | undefined; // provide suitable style of experience
  courses: Course[]; // find topics & provide suitable practice context

  /**
   * The actions they perform
   *
   * NOTE: can be done in several different ways?
   * E.g. using another practice app or during class time
   */

  // how they get practice?
  requestPracticeFromTeacher() {}
  forcedToReceivePractice() {}

  // what to do with practice after recieving it (e.g. homework)
  savePracticeForLater() {}
  ignorePractice() {}
  throwPracticeAway = this.ignorePractice;
  scheduleTimeForPractice() {}
  findLocationForPractice() {}
  startPractice() {}

  /**
   * Student can perform actions
   */
  constructor(name: string, email: string, dob: string, courses: Course[]) {
    super(name, email);
    this.dob = dob;
    this.courses = courses;
  }
}
