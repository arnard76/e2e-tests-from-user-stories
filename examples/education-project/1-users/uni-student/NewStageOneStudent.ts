// the actions/needs don't mention the tool used to perform or assist with that action
// and vice versa (check the Tool section)

import { practice2Learn } from "@/2-tools/Practice2Learn";
import { CS101, UniversityStudent, type Course } from "./UniStudent";

class Year1Student extends UniversityStudent {
  /* Relevant properties */

  /* Actions = Functional wants */
  wants = {};

  /* Emotional wants */
  //   to be happy during studying
  //

  /* Social wants */
  //   to study with others
  // to teach others

  /* New Stage One Student is born   */
  constructor(name: string, email: string, dob: string, courses: Course[]) {
    super(name, email, dob, courses);
  }
}

// export class Year1StudentUsingP2L extends Year1Student {
//   P2L = new Practice2Learn();
//   needs = { toTakeNotesForLecture: this.P2L.makeRichNotesNaturally };

//   /* New Stage One Student joins Practice2Learn platform */
//   constructor(name: string, email: string, courses: Course[]) {
//     super(name, email, courses);
//   }
// }

export const sid83999 = new Year1Student("Joey", "joey@daps.ac.io", "9/9/99", [
  CS101,
]);
