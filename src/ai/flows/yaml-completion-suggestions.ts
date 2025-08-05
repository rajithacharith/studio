'use server';

/**
 * @fileOverview Provides AI-powered YAML configuration suggestions and autocompletion.
 *
 * - yamlCompletionSuggestions - A function that suggests YAML configurations based on context and user inputs.
 * - YamlCompletionSuggestionsInput - The input type for the yamlCompletionSuggestions function.
 * - YamlCompletionSuggestionsOutput - The return type for the yamlCompletionSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YamlCompletionSuggestionsInputSchema = z.object({
  context: z.string().describe('The current YAML configuration context.'),
  userInput: z.string().describe('The user input to provide suggestions for.'),
});
export type YamlCompletionSuggestionsInput = z.infer<typeof YamlCompletionSuggestionsInputSchema>;

const YamlCompletionSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of YAML configuration suggestions based on the context and user input.'),
});
export type YamlCompletionSuggestionsOutput = z.infer<typeof YamlCompletionSuggestionsOutputSchema>;

export async function yamlCompletionSuggestions(
  input: YamlCompletionSuggestionsInput
): Promise<YamlCompletionSuggestionsOutput> {
  return yamlCompletionSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yamlCompletionSuggestionsPrompt',
  input: {schema: YamlCompletionSuggestionsInputSchema},
  output: {schema: YamlCompletionSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides YAML configuration suggestions based on context and user input.

  Context: {{{context}}}
  User Input: {{{userInput}}}

  Provide an array of YAML configuration suggestions that are relevant to the context and user input. The suggestions should be valid YAML configurations.
  Ensure your response can be parsed as a valid JSON array of strings, where each string is a suggestion.
  Do not include any explanation, only include JSON array. For example:
  [\"apiVersion: openchoreo.dev/v1alpha1\", \"kind: Component\", \"metadata:\"]`,
});

const yamlCompletionSuggestionsFlow = ai.defineFlow(
  {
    name: 'yamlCompletionSuggestionsFlow',
    inputSchema: YamlCompletionSuggestionsInputSchema,
    outputSchema: YamlCompletionSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
