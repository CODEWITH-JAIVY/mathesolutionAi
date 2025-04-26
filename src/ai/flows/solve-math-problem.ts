// 'use server';

/**
 * @fileOverview Solves math problems submitted as text or image and returns a step-by-step solution.
 *
 * - solveMathProblem - A function that handles the math problem solving process.
 * - SolveMathProblemInput - The input type for the solveMathProblem function.
 * - SolveMathProblemOutput - The return type for the solveMathProblem function.
 */

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {extractMathFromImage} from '@/services/mathpix';

const SolveMathProblemInputSchema = z.object({
  problemText: z.string().optional().describe('The math problem as text.'),
  problemImage: z
    .string()
    .optional()
    .describe(
      "A photo of a math problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SolveMathProblemInput = z.infer<typeof SolveMathProblemInputSchema>;

const SolveMathProblemOutputSchema = z.object({
  solution: z.string().describe('The step-by-step solution to the math problem, suitable for display on a whiteboard.'),
});
export type SolveMathProblemOutput = z.infer<typeof SolveMathProblemOutputSchema>;

export async function solveMathProblem(input: SolveMathProblemInput): Promise<SolveMathProblemOutput> {
  return solveMathProblemFlow(input);
}

const solveMathProblemPrompt = ai.definePrompt({
  name: 'solveMathProblemPrompt',
  input: {
    schema: z.object({
      problem: z.string().describe('The math problem to solve.'),
    }),
  },
  output: {
    schema: z.object({
      solution: z.string().describe('The step-by-step solution to the math problem.'),
    }),
  },
  prompt: `Solve the following math problem clearly and display the solution step-by-step like a teacher on a whiteboard. Make it suitable for a student learning in class:\n\n{{problem}}`,
});

const solveMathProblemFlow = ai.defineFlow<
  typeof SolveMathProblemInputSchema,
  typeof SolveMathProblemOutputSchema
>({
  name: 'solveMathProblemFlow',
  inputSchema: SolveMathProblemInputSchema,
  outputSchema: SolveMathProblemOutputSchema,
},
async input => {
  let problem: string | undefined = input.problemText;

  if (input.problemImage) {
    // Extract LaTeX from the image using Mathpix API
    const mathpixResult = await extractMathFromImage(input.problemImage);
    problem = mathpixResult.latex;
  }

  if (!problem) {
    throw new Error('No math problem provided.');
  }

  const {output} = await solveMathProblemPrompt({
    problem,
  });
  return output!;
}
);
