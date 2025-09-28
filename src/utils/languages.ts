import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

export interface Language {
  id: string;
  name: string;
  extension: any;
  defaultTemplate: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    extension: javascript(),
    defaultTemplate: `function solution() {
    // Write your code here
    
}`,
  },
  {
    id: "python",
    name: "Python",
    extension: python(),
    defaultTemplate: `def solution():
    # Write your code here
    pass`,
  },
  {
    id: "java",
    name: "Java",
    extension: java(),
    defaultTemplate: `public class Solution {
    public void solution() {
        // Write your code here
        
    }
}`,
  },
];

export const getLanguageById = (id: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.id === id);
};

export const getLanguageExtension = (languageId: string) => {
  const language = getLanguageById(languageId);
  return language ? language.extension : javascript();
};
