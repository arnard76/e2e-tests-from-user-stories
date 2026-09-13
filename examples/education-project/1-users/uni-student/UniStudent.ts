import { Person, PersonWant, Tool } from "@/util";

export const COMPSCI732: Course = {
  courseCode: "COMPSCI 732",
  courseName: "Software Tools & Methodologies",
  learningMaterial: [],
  pastExams: [],
  semester: "Semester 1",
  year: 2026,
};

export const CS101: Course = {
  courseCode: "COMPSCI 101",
  courseName: "Intro to programming",
  learningMaterial: [],
  pastExams: [],
  semester: "Semester 1",
  year: 2021,
};

export type Course = {
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
export class UniversityStudent extends Person {
  /* Properties available to us */
  dob: string | undefined; // provide suitable style of experience
  courses: Course[]; // find topics & provide suitable practice context

  static connections = {
    wants: {
      "take rich notes for class topics": {},
      "practice theory learnt after class": {},
      "practice more complex questions before exams": {},
    },
  } as const;

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

export class UniversityStudentUser extends UniversityStudent {
  requestPracticeFromTeacher() {}
  forcedToReceivePractice() {}

  savePracticeForLater() {}
  ignorePractice() {}
  throwPracticeAway = this.ignorePractice;
  scheduleTimeForPractice() {}
  findLocationForPractice() {}
  startPractice() {}

  // needs - functional, emotional & social
}
