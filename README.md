Framework for long-term specification and testing of features. It starts by document user stories as code, for example:

```ts
personWhoIs(UniversityStudent)
.wantsTo("take rich notes for class topics")
.canUseTool(practice2Learn)
.becauseItHasFeatures(["makeRichNotesNaturally"]);

personWhoIs(UniversityStudent)
.wantsTo("practice theory learnt after class")
.canUseTool(practice2Learn)
.becauseItHasFeatures(["practice"]);

personWhoIs(UniversityStudent)
.wantsTo("practice more complex questions before exams")
.canUseTool(practice2Learn)
.becauseItHasFeatures(["practice"]);
```

These stories can now be expanded into specific scenarios with a specific user and their context.

```ts
const james = new UniversityStudent(
"James",
"james@daps.ac.io",
"9/99",
[COMPSCI732], // enrolled course
);

thisPerson(arnav)
.whoIsA(UniversityStudent)
.can("take rich notes for class topics")
.byDoingTheFollowingActions([
    navigate.openWebApp(), 
    // ... more actions ...
    notebook.saveNotes(), 
])
```

Actions are specific to the automation package used for testing (e.g. Cypress, Playwright, etc.). They are also specific to each tool being tested, for example:

```ts
export class Practice2Learn extends Tool {
    features = {
        identify: (courseIdentifier: CourseIdentifier) =>
            action('identifyCourse').setUIAction(async ({ page }) => {
                // page is a playwright element that provides an browser automation API
                await page.getByRole('navigation').getByRole('link', { name: '/course/identify' }).click();
                await page.getByLabel(/.* code/i).fill(courseIdentifier.courseCode);
                await page.getByLabel(/year/i).fill(courseIdentifier.year.toString());
                if (courseIdentifier.term) await page.getByLabel(/semester/i).fill(courseIdentifier.term);
                await this.commonUIActions.checkToast('rgb(80, 255, 123)', new RegExp(``, 'i'))({ page });
            })
    }
}
```