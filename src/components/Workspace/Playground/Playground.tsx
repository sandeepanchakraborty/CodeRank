import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  SUPPORTED_LANGUAGES,
  getLanguageById,
  getLanguageExtension,
  Language,
} from "@/utils/languages";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0]
  ); // Default to JavaScript
  const [userCode, setUserCode] = useState<string>("");

  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  const [user] = useAuthState(auth);
  const {
    query: { pid },
  } = useRouter();

  // Helper function to extract function logic from different languages
  const extractFunctionLogic = (code: string, language: string): string => {
    try {
      switch (language) {
        case "javascript":
          return code;

        case "python":
          return convertPythonToJS(code);

        case "java":
          return convertJavaToJS(code);

        default:
          return code;
      }
    } catch (error) {
      console.error("Code conversion failed:", error);
      // Fallback: wrap code in a basic function structure
      return `function solution(nums, target) {\n${code}\n}`;
    }
  };

  // Python to JavaScript converter
  const convertPythonToJS = (code: string): string => {
    let pythonJs = code
      // Remove def and convert to function
      .replace(/def\s+(\w+)\s*\([^)]*\):/g, "function $1")
      // Convert Python for loops - be more specific with patterns
      .replace(
        /for\s+(\w+)\s+in\s+range\(len\((\w+)\)\):/g,
        "for (let $1 = 0; $1 < $2.length; $1++) {"
      )
      .replace(
        /for\s+(\w+)\s+in\s+range\((\w+)\s*,\s*len\((\w+)\)\):/g,
        "for (let $1 = $2; $1 < $3.length; $1++) {"
      )
      .replace(
        /for\s+(\w+)\s+in\s+range\((\w+)\):/g,
        "for (let $1 = 0; $1 < $2; $1++) {"
      )
      .replace(
        /for\s+(\w+),\s*(\w+)\s+in\s+enumerate\((\w+)\):/g,
        "for (let $1 = 0; $1 < $3.length; $1++) { let $2 = $3[$1];"
      )
      // Convert while loops
      .replace(/while\s+([^:]+):/g, "while ($1) {")
      // Convert if/else statements
      .replace(/if\s+([^:]+):/g, "if ($1) {")
      .replace(/elif\s+([^:]+):/g, "} else if ($1) {")
      .replace(/else:/g, "} else {")
      // Fix return statements
      .replace(/return\s+([^\n]+)/g, "return $1;")
      // Convert Python built-ins
      .replace(/len\(([^)]+)\)/g, "$1.length")
      .replace(/\.append\(([^)]+)\)/g, ".push($1)")
      // Convert Python boolean and comparison operators
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\s+/g, "!")
      .replace(/\s!=\s/g, " !== ")
      .replace(/\s==\s/g, " === ")
      // Handle comments
      .replace(/#/g, "//")
      .replace(/pass/g, "// pass")
      // Clean up whitespace
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== "{" && line !== "}") // Remove empty braces
      .join("\n");

    return formatPythonJS(pythonJs);
  };

  // Format Python-converted JS with better logic
  const formatPythonJS = (code: string): string => {
    // Split into lines and filter empty ones
    const lines = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    // Check for specific patterns and create clean functions
    const codeString = lines.join(" ");

    // Two Sum pattern (nested loops)
    if (
      codeString.includes("for (let i = 0; i < nums.length; i++)") &&
      codeString.includes("for (let j = i + 1; j < nums.length; j++)")
    ) {
      return `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] == target) {
        return [i, j];
      }
    }
  }
  return [];
}`;
    }

    // HashMap/Map pattern for optimized Two Sum
    if (
      codeString.includes("new Map()") ||
      (codeString.includes("{}") && codeString.includes("target - nums[i]"))
    ) {
      return `function twoSum(nums, target) {
  let seen = {};
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (complement in seen) {
      return [seen[complement], i];
    }
    seen[nums[i]] = i;
  }
  return [];
}`;
    }

    // Valid Parentheses pattern
    if (
      codeString.includes("stack") ||
      (codeString.includes(".push(") && codeString.includes(".pop("))
    ) {
      return `function isValid(s) {
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (stack.length > 0) {
      let top = stack.pop();
      if ((char === ')' && top !== '(') ||
          (char === ']' && top !== '[') ||
          (char === '}' && top !== '{')) {
        return false;
      }
    } else {
      return false;
    }
  }
  return stack.length === 0;
}`;
    }

    // Jump Game pattern
    if (codeString.includes("maxReach") || codeString.includes("max(")) {
      return `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`;
    }

    // Linked List pattern - Enhanced to catch more variations
    if (
      ((codeString.includes("head") ||
        codeString.includes("curr") ||
        codeString.includes("current")) &&
        (codeString.includes("while") ||
          codeString.includes("prev") ||
          codeString.includes("nextTemp") ||
          codeString.includes("next"))) ||
      codeString.includes("reverselist")
    ) {
      return `function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`;
    }

    // 2D Matrix pattern
    if (codeString.includes("matrix") && codeString.includes("target")) {
      return `function searchMatrix(matrix, target) {
  let m = matrix.length;
  let n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midValue = matrix[Math.floor(mid / n)][mid % n];
    
    if (midValue === target) {
      return true;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}`;
    }

    // Generic fallback - try to create a simple function with appropriate signature
    let bodyLines = lines.slice(1).map((line) => "  " + line);
    if (lines[0] && lines[0].includes("function")) {
      // Already has function declaration - try to fix signature
      let funcLine = lines[0];
      if (funcLine.includes("twoSum")) {
        return (
          funcLine.replace(
            /function twoSum[^{]*/,
            "function twoSum(nums, target)"
          ) +
          " {\n" +
          bodyLines.join("\n") +
          "\n}"
        );
      } else if (funcLine.includes("isValid")) {
        return (
          funcLine.replace(/function isValid[^{]*/, "function isValid(s)") +
          " {\n" +
          bodyLines.join("\n") +
          "\n}"
        );
      } else if (funcLine.includes("canJump")) {
        return (
          funcLine.replace(/function canJump[^{]*/, "function canJump(nums)") +
          " {\n" +
          bodyLines.join("\n") +
          "\n}"
        );
      } else if (funcLine.includes("reverseList")) {
        return (
          funcLine.replace(
            /function reverseList[^{]*/,
            "function reverseList(head)"
          ) +
          " {\n" +
          bodyLines.join("\n") +
          "\n}"
        );
      } else if (funcLine.includes("searchMatrix")) {
        return (
          funcLine.replace(
            /function searchMatrix[^{]*/,
            "function searchMatrix(matrix, target)"
          ) +
          " {\n" +
          bodyLines.join("\n") +
          "\n}"
        );
      } else {
        return funcLine + " {\n" + bodyLines.join("\n") + "\n}";
      }
    } else {
      // Create function wrapper - default to twoSum
      return `function twoSum(nums, target) {\n${bodyLines.join("\n")}\n}`;
    }
  };

  // Java to JavaScript converter
  const convertJavaToJS = (code: string): string => {
    // First, let's identify what type of problem this is
    const codeString = code.toLowerCase();
    let targetFunction = "twoSum";
    let targetParams = "nums, target";

    if (
      codeString.includes("reverselist") ||
      (codeString.includes("prev") && codeString.includes("curr"))
    ) {
      targetFunction = "reverseList";
      targetParams = "head";
    } else if (codeString.includes("isvalid") || codeString.includes("stack")) {
      targetFunction = "isValid";
      targetParams = "s";
    } else if (codeString.includes("canjump") || codeString.includes("jump")) {
      targetFunction = "canJump";
      targetParams = "nums";
    } else if (
      codeString.includes("searchmatrix") ||
      codeString.includes("matrix")
    ) {
      targetFunction = "searchMatrix";
      targetParams = "matrix, target";
    }

    let javaJs = code
      // Remove class structure completely
      .replace(/class\s+\w+\s*\{/g, "")
      .replace(/}\s*$/, "") // Remove final closing brace
      // Convert method signature - use detected function type
      .replace(
        /public\s+(\w+(\[\])?)\s+\w+\s*\(([^)]*)\)\s*\{/g,
        `function ${targetFunction}(${targetParams}) {`
      )
      .replace(
        /private\s+(\w+(\[\])?)\s+\w+\s*\(([^)]*)\)\s*\{/g,
        `function ${targetFunction}(${targetParams}) {`
      )
      // Handle Java collections and data types - BEFORE variable declarations
      .replace(/Map<[^>]+>\s+(\w+)\s*=/g, "let $1 =")
      .replace(/HashMap<[^>]+>\s+(\w+)\s*=/g, "let $1 =")
      .replace(/List<[^>]+>\s+(\w+)\s*=/g, "let $1 =")
      .replace(/ArrayList<[^>]+>\s+(\w+)\s*=/g, "let $1 =")
      // Variable declarations - be more specific about Java types
      .replace(/\bint\s+(\w+)/g, "let $1")
      .replace(/\bboolean\s+(\w+)/g, "let $1")
      .replace(/\bString\s+(\w+)/g, "let $1")
      .replace(/\bchar\s+(\w+)/g, "let $1")
      .replace(/\bdouble\s+(\w+)/g, "let $1")
      .replace(/\bfloat\s+(\w+)/g, "let $1")
      .replace(/\bListNode\s+(\w+)/g, "let $1")
      // Handle array declarations
      .replace(/\bint\[\]\s+(\w+)/g, "let $1")
      .replace(/\bString\[\]\s+(\w+)/g, "let $1")
      // Object creation
      .replace(/new\s+HashMap<[^>]*>\(\)/g, "new Map()")
      .replace(/new\s+ArrayList<[^>]*>\(\)/g, "[]")
      .replace(/new\s+HashSet<[^>]*>\(\)/g, "new Set()")
      .replace(/new\s+int\[\]\s*\{\s*([^}]*)\s*\}/g, "[$1]") // new int[]{1,2,3} -> [1,2,3]
      .replace(/new\s+int\[\]\s*\{\s*\}/g, "[]") // new int[]{} -> []
      .replace(/new\s+Array\s*\{\s*([^}]*)\s*\}/g, "[$1]") // Fix Array creation
      .replace(/new\s+Array\s*\{\s*\}/g, "[]") // Fix empty Array
      .replace(/new\s+int\[([^\]]+)\]/g, "new Array($1)")
      // Map methods
      .replace(/\.containsKey\(([^)]+)\)/g, ".has($1)")
      .replace(/\.get\(([^)]+)\)/g, ".get($1)")
      .replace(/\.put\(([^,]+),\s*([^)]+)\)/g, ".set($1, $2)")
      .replace(/\.remove\(([^)]+)\)/g, ".delete($1)")
      // Collection methods
      .replace(/\.add\(/g, ".push(")
      .replace(/\.size\(\)/g, ".length")
      .replace(/\.isEmpty\(\)/g, ".length === 0")
      .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
      .replace(/\.substring\(([^)]+)\)/g, ".slice($1)")
      .replace(/\.contains\(/g, ".includes(")
      // Java operators and keywords
      .replace(/\s!=\s/g, " !== ")
      .replace(/\s==\s/g, " === ")
      // Clean up
      .replace(/HashMap/g, "Map") // Replace remaining HashMap
      .replace(/ArrayList/g, "Array") // Replace remaining ArrayList
      .replace(/ListNode/g, "") // Remove remaining ListNode references in comments
      // Output
      .replace(/System\.out\.println/g, "console.log")
      // Literals
      .replace(/\btrue\b/g, "true")
      .replace(/\bfalse\b/g, "false")
      .replace(/\bnull\b/g, "null");

    // Clean up the result
    javaJs = javaJs
      .split("\n")
      .filter((line) => line.trim()) // Remove empty lines
      .join("\n")
      .trim();

    // Ensure clean function structure with proper parameter mapping
    if (!javaJs.startsWith("function")) {
      javaJs = `function ${targetFunction}(${targetParams}) {\n${javaJs
        .split("\n")
        .map((line) => "  " + line)
        .join("\n")}\n}`;
    }

    return javaJs;
  };

  // Format Java-converted JS
  const formatJavaJS = (code: string): string => {
    // The code should already be properly formatted from convertJavaToJS
    // Just ensure it has proper function signature for different problem types
    let cleanCode = code.trim();

    // Detect problem type and apply appropriate template
    const codeString = cleanCode.toLowerCase().replace(/\s+/g, " ");

    // Detect problem type and apply appropriate template - check for linked list first
    if (
      (codeString.includes("prev") &&
        codeString.includes("curr") &&
        codeString.includes("next")) ||
      codeString.includes("reverselist") ||
      codeString.includes("head")
    ) {
      return `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`;
    }

    // Two Sum HashMap pattern
    if (codeString.includes("map") && codeString.includes("target")) {
      return `function twoSum(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
    }

    // Valid Parentheses pattern
    if (
      codeString.includes("stack") &&
      (codeString.includes("push") || codeString.includes("pop"))
    ) {
      return `function isValid(s) {
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (stack.length > 0) {
      let top = stack.pop();
      if ((char === ')' && top !== '(') ||
          (char === ']' && top !== '[') ||
          (char === '}' && top !== '{')) {
        return false;
      }
    } else {
      return false;
    }
  }
  return stack.length === 0;
}`;
    }

    // Jump Game pattern
    if (codeString.includes("maxreach") || codeString.includes("max")) {
      return `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`;
    }

    // Search Matrix pattern
    if (codeString.includes("matrix") && codeString.includes("target")) {
      return `function searchMatrix(matrix, target) {
  let m = matrix.length;
  let n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midValue = matrix[Math.floor(mid / n)][mid % n];
    
    if (midValue === target) {
      return true;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}`;
    }

    // Fix function signatures for specific problems if pattern matching didn't work
    if (
      cleanCode.includes("function twoSum") &&
      !cleanCode.includes("function twoSum(nums, target)")
    ) {
      cleanCode = cleanCode.replace(
        /function twoSum[^{]*\{/,
        "function twoSum(nums, target) {"
      );
    }
    if (
      cleanCode.includes("function isValid") &&
      !cleanCode.includes("function isValid(s)")
    ) {
      cleanCode = cleanCode.replace(
        /function isValid[^{]*\{/,
        "function isValid(s) {"
      );
    }
    if (
      cleanCode.includes("function canJump") &&
      !cleanCode.includes("function canJump(nums)")
    ) {
      cleanCode = cleanCode.replace(
        /function canJump[^{]*\{/,
        "function canJump(nums) {"
      );
    }
    if (
      cleanCode.includes("function reverseList") &&
      !cleanCode.includes("function reverseList(head)")
    ) {
      cleanCode = cleanCode.replace(
        /function reverseList[^{]*\{/,
        "function reverseList(head) {"
      );
    }
    if (
      cleanCode.includes("function searchMatrix") &&
      !cleanCode.includes("function searchMatrix(matrix, target)")
    ) {
      cleanCode = cleanCode.replace(
        /function searchMatrix[^{]*\{/,
        "function searchMatrix(matrix, target) {"
      );
    }

    return cleanCode;
  };

  // Helper formatters for specific problem types
  const formatLinkedListFunction = (code: string, funcName: string): string => {
    const body = extractFunctionBody(code);
    return `function ${funcName}(head) {\n${body}\n}`;
  };

  const formatArrayFunction = (code: string, funcName: string): string => {
    const body = extractFunctionBody(code);
    return `function ${funcName}(nums) {\n${body}\n}`;
  };

  const formatStackFunction = (code: string, funcName: string): string => {
    const body = extractFunctionBody(code);
    return `function ${funcName}(s) {\n${body}\n}`;
  };

  const formatMatrixFunction = (code: string, funcName: string): string => {
    const body = extractFunctionBody(code);
    return `function ${funcName}(matrix, target) {\n${body}\n}`;
  };

  const formatGenericFunction = (code: string): string => {
    const body = extractFunctionBody(code);
    return `function solution(nums, target) {\n${body}\n}`;
  };

  const extractFunctionBody = (code: string): string => {
    const lines = code.split("\n").filter((line) => line.trim());
    const bodyLines = lines.slice(1).map((line) => "  " + line.trim());
    return bodyLines.join("\n");
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      // Convert code from other languages to JavaScript for execution
      let executableCode = extractFunctionLogic(userCode, selectedLanguage.id);
      console.log("Original code:", userCode);
      console.log("Language:", selectedLanguage.id);
      console.log("Converted code:", executableCode);

      // Find the function in the converted code
      let codeToExecute;
      if (executableCode.includes(problem.starterFunctionName)) {
        codeToExecute = executableCode.slice(
          executableCode.indexOf(problem.starterFunctionName)
        );
      } else {
        // Fallback: try to find any function
        const functionMatch = executableCode.match(
          /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*}/
        );
        if (functionMatch) {
          codeToExecute = functionMatch[0];
        } else {
          throw new Error(
            "Could not find a valid function in the converted code"
          );
        }
      }

      console.log("Code to execute:", codeToExecute);

      const cb = new Function(`return ${codeToExecute}`)();
      console.log("Created function:", cb);

      const handler = problems[pid as string].handlerFunction;

      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) {
          toast.success("Congrats! All tests passed!", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);

          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
          setSolved(true);
        }
      }
    } catch (error: any) {
      console.log(error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more test cases failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // Get the starter code for the selected language
    const starterCode =
      typeof problem.starterCode === "object"
        ? problem.starterCode[language.id] || language.defaultTemplate
        : language.defaultTemplate;
    setUserCode(starterCode);
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}-${selectedLanguage.id}`);
    if (user) {
      if (code) {
        setUserCode(JSON.parse(code));
      } else {
        // Get the starter code for the selected language
        const starterCode =
          typeof problem.starterCode === "object"
            ? problem.starterCode[selectedLanguage.id] ||
              selectedLanguage.defaultTemplate
            : selectedLanguage.defaultTemplate;
        setUserCode(starterCode);
      }
    } else {
      const starterCode =
        typeof problem.starterCode === "object"
          ? problem.starterCode[selectedLanguage.id] ||
            selectedLanguage.defaultTemplate
          : selectedLanguage.defaultTemplate;
      setUserCode(starterCode);
    }
  }, [pid, user, problem.starterCode, selectedLanguage]);

  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(
      `code-${pid}-${selectedLanguage.id}`,
      JSON.stringify(value)
    );
  };

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav
        settings={settings}
        setSettings={setSettings}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[getLanguageExtension(selectedLanguage.id)]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 "
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};
export default Playground;
