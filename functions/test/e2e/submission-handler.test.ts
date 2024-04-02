import { beforeAll, describe, it } from "vitest";
import { DIContainer, initContainer } from "../../src/lib/di";
import { submissionCreatedHandler } from "../../src/lib/handlers";
import { SubmissionDoc } from "../../src/lib/submission-repo";
import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

describe("Submission Handler", () => {
  let container: DIContainer;

  beforeAll(() => {
    container = initContainer();
  });

  it("should grade a submission", async () => {
    const problemId = await container.problemRepo.upsertProblem({
      params: {
        passage:
          "Strong borders build strong nations\nBy Ken McNiel, border security advocate\nBorder walls are fundamental to national security. They have been proven to deter illegal immigration and keep nations safer by protecting against terrorism or other nefarious activity. Without a clear demarcation between countries, our borders are open floodgates, allowing our land to be overcome by a deluge. It's also important to consider the financial strain put on countries that take in high numbers of immigrants and refugees. In his book, Suicide of a Superpower, politician Pat Buchanan writes, “We have accepted today the existence in perpetuity of a permanent underclass of scores of millions who cannot cope and must be carried by society—fed, clothed, housed, tutored, medicated at taxpayer's expense their entire lives.” This sentiment, that those who would choose to immigrate to a new country will be an unwelcome drain on resources, is not unwarranted. Countries must look to advocating for their own self-interest first and foremost, before they open their arms to welcome strangers.",
        question: "Is McNiel for or against immigration? Why?",
        criteria: [
          "The answer states that McNiel is against immigration.",
          "The answer references a direct quote from the passage AND the quote supports the notion that McNiel is against immigration.",
        ],
      },
    });

    const submission: SubmissionDoc = {
      status: "submitted",
      input: {
        answer:
          'The statement, "Border walls are fundamental to national security," implies that McNiel is against immigration.',
      },
    };
    const submissionId = await container.submissionRepo.upsertSubmission(
      submission,
      problemId
    );

    const handler = submissionCreatedHandler(container);
    await handler({
      data: {
        ref: container.firestore
          .collection("problems")
          .doc(problemId)
          .collection("submissions")
          .doc(submissionId),
        data() {
          return submission;
        },
      },
    } as unknown as FirestoreEvent<QueryDocumentSnapshot | undefined, Record<string, string>>);
  });
});
