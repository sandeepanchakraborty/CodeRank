import { useState } from "react";
import { SUPPORTED_LANGUAGES, Language } from "@/utils/languages";
import { IoChevronDown } from "react-icons/io5";

type LanguageDropdownProps = {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
};

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center px-1">
          <div className="text-xs text-label-2 dark:text-dark-label-2">
            {selectedLanguage.name}
          </div>
          <IoChevronDown className="ml-1 h-3 w-3" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-dark-layer-1 border border-dark-fill-3 rounded-md shadow-lg z-50 min-w-[120px]">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.id}
              className="block w-full text-left px-3 py-2 text-xs text-dark-label-2 hover:bg-dark-fill-3 first:rounded-t-md last:rounded-b-md"
              onClick={() => handleLanguageSelect(language)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default LanguageDropdown;
