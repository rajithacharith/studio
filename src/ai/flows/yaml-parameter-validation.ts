'use server';

/**
 * @fileOverview Validates YAML parameters based on the provided context.
 *
 * - validateYamlParameter - A function that validates YAML parameters.
 * - ValidateYamlParameterInput - The input type for the validateYamlParameter function.
 * - ValidateYamlParameterOutput - The return type for the validateYamlParameter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateYamlParameterInputSchema = z.object({
  yamlContext: z
    .string()
    .describe('The YAML context in which the parameter is being suggested.'),
  parameter: z.string().describe('The parameter to validate.'),
});
export type ValidateYamlParameterInput = z.infer<
  typeof ValidateYamlParameterInputSchema
>;

const ValidateYamlParameterOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the parameter is valid in the context.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the parameter is invalid, if applicable.'),
});
export type ValidateYamlParameterOutput = z.infer<
  typeof ValidateYamlParameterOutputSchema
>;

export async function validateYamlParameter(
  input: ValidateYamlParameterInput
): Promise<ValidateYamlParameterOutput> {
  return validateYamlParameterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yamlParameterValidationPrompt',
  input: {schema: ValidateYamlParameterInputSchema},
  output: {schema: ValidateYamlParameterOutputSchema},
  prompt: `You are an expert YAML validator. Given the following YAML context and a proposed parameter, determine if the parameter is valid in the context.\n\nYAML Context:\n\n```yaml\n{{{yamlContext}}}\n```\n\nProposed Parameter: {{{parameter}}}\n\nRespond with JSON in the following format:\n\n{
  "isValid": true|false,
  "reason": "A brief explanation if isValid is false"
}\n\nIf the parameter is valid, isValid should be true and the reason should be omitted. If the parameter is invalid, isValid should be false and the reason should explain why. Focus on whether the parameter makes sense semantically and structurally within the YAML context.\n\nConsider the OpenChoreo YAML Configuration Guide when making your determination. You should assume the user is following the guide.\n\nPay close attention to indentation and type mismatches. For example, if the YAML context expects a boolean, but the parameter is a string, then it is invalid.\n\nBe concise.`,
});

const validateYamlParameterFlow = ai.defineFlow(
  {
    name: 'validateYamlParameterFlow',
    inputSchema: ValidateYamlParameterInputSchema,
    outputSchema: ValidateYamlParameterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
