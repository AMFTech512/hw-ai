import OpenAI from "openai";
import { DIContainer } from "./di";

export interface ComprehensionQuestionGradeResponse {
  criteria: {
    criterion: string;
    reasoning: string;
    isSatisfactory: boolean;
  }[];
}

export class AI {
  private _openAI: OpenAI;

  constructor(container: DIContainer) {
    this._openAI = container.openAIClient;
  }

  static generateGradeQuery(
    passage: string,
    question: string,
    criteria: string[],
    answer: string
  ) {
    return `<passage${passage}</passage><question>${question}</question><criteria>${criteria
      .map((criterion) => `<value>${criterion}</value>`)
      .join()}</criteria><answer>${answer}</answer>`;
  }

  static computeScore(response: ComprehensionQuestionGradeResponse) {
    return response.criteria.reduce((acc, criterion) => {
      return acc + (criterion.isSatisfactory ? 1 : 0);
    }, 0);
  }

  async gradeResponse(query: string) {
    const response = await this._openAI.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            'You will be given a passage delimited by xml tags (<passage>...</passage>) You will also be given a question about the passage delimited by xml tags (<question>...</question>) You will also be given criteria for an answer that satisfies the question. These criteria will be represented as xml in the form<criteria><value>criterion 1</value><value>criterion 2</value>...</criteria> Finally, you\'ll be given an answer to the question, delimited by xml tags (<answer>...</answer> For each of the criteria, perform the following steps: 1. Restate the criterion 2. Reason whether or not the answer satisfies the criterion. Provide a quote from the answer that supports your reasoning. 3. If the answer satisfies the criterion, write "true". Otherwise, write "false". Put the results of the steps above into a json object of the following format: { "criteria": [{"criterion": "...", "reasoning": "...", "isSatisfactory": true/false },...]}',
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0,
      max_tokens: 7000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const topChoice = response.choices[0].message.content;
    if (!topChoice) throw new Error("No response from OpenAI");

    try {
      const results = JSON.parse(
        topChoice
      ) as ComprehensionQuestionGradeResponse;
      return {
        score: AI.computeScore(results),
        ...(JSON.parse(topChoice) as ComprehensionQuestionGradeResponse),
      };
    } catch (e) {
      throw new Error("Invalid response from OpenAI: " + topChoice);
    }
  }
}
