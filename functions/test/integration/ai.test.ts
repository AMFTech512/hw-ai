import { describe, expect, it } from "vitest";
import { createDIContainer } from "../../src/lib/di";
import { AI } from "../../src/lib/ai";
import OpenAI from "openai";

const TIMEOUT = 20000;

describe("AI", () => {
  const container = createDIContainer({
    openAIClient: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  });

  const ai = new AI(container);

  it(
    "should grade a response",
    async () => {
      const result = await ai.gradeResponse(
        AI.generateGradeQuery(
          "Strong borders build strong nations\nBy Ken McNiel, border security advocate\nBorder walls are fundamental to national security. They have been proven to deter illegal immigration and keep nations safer by protecting against terrorism or other nefarious activity. Without a clear demarcation between countries, our borders are open floodgates, allowing our land to be overcome by a deluge. It’s also important to consider the financial strain put on countries that take in high numbers of immigrants and refugees. In his book, Suicide of a Superpower, politician Pat Buchanan writes, “We have accepted today the existence in perpetuity of a permanent underclass of scores of millions who cannot cope and must be carried by society—fed, clothed, housed, tutored, medicated at taxpayer’s expense their entire lives.” This sentiment, that those who would choose to immigrate to a new country will be an unwelcome drain on resources, is not unwarranted. Countries must look to advocating for their own self-interest first and foremost, before they open their arms to welcome strangers.",
          "Is McNiel for or against immigration? Why?",
          [
            "The answer states that McNiel is against immigration.",
            "The answer references a direct quote from the passage AND the quote supports the notion that McNiel is against immigration.",
          ],
          'The statement, "Border walls are fundamental to national security," implies that McNiel is against immigration.'
        )
      );

      const score = AI.computeScore(result);

      console.log(result);
      console.log("Score:", score);
      expect(score).toBe(1);
    },
    TIMEOUT
  );
});
