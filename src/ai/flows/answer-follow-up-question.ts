// src/ai/flows/answer-follow-up-question.ts
'use server';

/**
 * @fileOverview A Genkit flow to answer follow-up questions about a math solution.
 *
 * - answerFollowUpQuestion - A function that handles answering follow-up questions.
 * - AnswerFollowUpQuestionInput - The input type for the answerFollowUpQuestion function.
 * - AnswerFollowUpQuestionOutput - The return type for the answerFollowUpQuestion function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnswerFollowUpQuestionInputSchema = z.object({
  question: z.string().describe('The follow-up question about the math solution.'),
  previousSolution: z.string().describe('The previous math solution.'),
});
export type AnswerFollowUpQuestionInput = z.infer<typeof AnswerFollowUpQuestionInputSchema>;

const AnswerFollowUpQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the follow-up question.'),
});
export type AnswerFollowUpQuestionOutput = z.infer<typeof AnswerFollowUpQuestionOutputSchema>;

export async function answerFollowUpQuestion(input: AnswerFollowUpQuestionInput): Promise<AnswerFollowUpQuestionOutput> {
  return answerFollowUpQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFollowUpQuestionPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The follow-up question about the math solution.'),
      previousSolution: z.string().describe('The previous math solution.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer to the follow-up question.'),
    }),
  },
  prompt: `You are a helpful math tutor. A student has asked a follow-up question about a previous solution.

Previous Solution: {{{previousSolution}}}

Follow-up Question: {{{question}}}

Answer the follow-up question clearly and concisely, providing further explanation if needed.`,
});

const answerFollowUpQuestionFlow = ai.defineFlow<
  typeof AnswerFollowUpQuestionInputSchema,
  typeof AnswerFollowUpQuestionOutputSchema
>({
  name: 'answerFollowUpQuestionFlow',
  inputSchema: AnswerFollowUpQuestionInputSchema,
  outputSchema: AnswerFollowUpQuestionOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
