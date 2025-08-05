'use server';

import { yamlCompletionSuggestions, type YamlCompletionSuggestionsInput, type YamlCompletionSuggestionsOutput } from "@/ai/flows/yaml-completion-suggestions";

export async function getSuggestions(input: YamlCompletionSuggestionsInput): Promise<YamlCompletionSuggestionsOutput | null> {
    try {
        const result = await yamlCompletionSuggestions(input);
        return result;
    } catch (error) {
        console.error("Error getting AI suggestions:", error);
        return null;
    }
}
