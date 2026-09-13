import { expect, test } from "@playwright/test";

class StudentUser {
  // actions
  receivesPracticeQuestions(questions: string[]) {
    console.log("I don't want homework please");
    // stores the questions in their bag
  }

  answersPracticeQuestions(teacher: Teacher, questionAnswers: string[]) {
    console.log(`replies: "${questionAnswers}"`);

    teacher.receivePracticeReplies(questionAnswers);
  }

  recieveFeedback() {
    console.log("I don't understand what I did wrong still, let me ask...");
  }
}

class Teacher {
  // actions

  givePracticeQuestionsTo(questions: string[], students: StudentUser[]) {
    console.log(
      "Here are some questions for your topic, try complete them in the next 24 hours.",
    );

    students.forEach((student) => student.receivesPracticeQuestions(questions));
  }

  receivePracticeReplies(questionAnswers: string[]) {
    console.log("Well done on completing, I thought you would throw them away");
    // reads the questions answers
  }

  giveFeedback(student: StudentUser) {
    console.log(
      "So really good effort. You completed every question. \
      My feedback is to explain some of the things that you obviously know. \
      Pretend someone doesn't know this topic and is trying to connect the dots. ",
    );

    student.recieveFeedback();
  }
}

test.describe("practice", () => {
  test("student is given practice, followed by feedback on their answer", () => {
    const arnav = new StudentUser();
    const practiceApp = new Teacher();

    const questionsMadeByApp = [
      "How many planets are there?",
      "What is the first planet's name?",
    ];
    practiceApp.givePracticeQuestionsTo(questionsMadeByApp, [arnav]);
    arnav.answersPracticeQuestions(practiceApp, ["8", "Venus"]);
    practiceApp.giveFeedback(arnav);
    expect(true).toBeTruthy();
  });
});
