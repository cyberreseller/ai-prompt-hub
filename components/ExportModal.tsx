"use client";

import React, { useState } from "react";
import { X, Copy, Check, FileCode, Terminal, Code2 } from "lucide-react";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  model: string;
  systemPrompt: string;
  promptTemplate: string;
  compiledPrompt?: string;
  onCopySuccess?: (msg: string) => void;
}

export function ExportModal({
  isOpen,
  onClose,
  title,
  model,
  systemPrompt,
  promptTemplate,
  compiledPrompt,
  onCopySuccess,
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<"python" | "curl" | "langchain" | "json">("python");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const contentToUse = compiledPrompt || promptTemplate;

  const getPythonCode = () => {
    if (model.includes("Claude")) {
      return `import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=${JSON.stringify(systemPrompt || "You are a specialized AI assistant.")},
    messages=[
        {"role": "user", "content": ${JSON.stringify(contentToUse)}}
    ]
)

print(response.content[0].text)`;
    }

    if (model.includes("Gemini")) {
      return `import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    system_instruction=${JSON.stringify(systemPrompt || "You are a specialized AI assistant.")}
)

response = model.generate_content(${JSON.stringify(contentToUse)})
print(response.text)`;
    }

    // Default OpenAI
    return `from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0.7,
    messages=[
        {"role": "system", "content": ${JSON.stringify(systemPrompt || "You are a specialized AI assistant.")}},
        {"role": "user", "content": ${JSON.stringify(contentToUse)}}
    ]
)

print(response.choices[0].message.content)`;
  };

  const getCurlCode = () => {
    return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": ${JSON.stringify(systemPrompt || "")}},
      {"role": "user", "content": ${JSON.stringify(contentToUse)}}
    ],
    "temperature": 0.7
  }'`;
  };

  const getLangChainCode = () => {
    return `from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

system_msg = ${JSON.stringify(systemPrompt || "You are an expert AI assistant.")}
user_template = ${JSON.stringify(promptTemplate)}

prompt = ChatPromptTemplate.from_messages([
    ("system", system_msg),
    ("human", user_template),
])

model = ChatOpenAI(model="gpt-4o", temperature=0.7)
chain = prompt | model

# Виклик із підстановкою змінних
# response = chain.invoke({...})`;
  };

  const getJsonSpec = () => {
    return JSON.stringify(
      {
        title,
        recommendedModel: model,
        systemInstructions: systemPrompt,
        template: promptTemplate,
        compiled: compiledPrompt,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const currentCode =
    activeTab === "python"
      ? getPythonCode()
      : activeTab === "curl"
      ? getCurlCode()
      : activeTab === "langchain"
      ? getLangChainCode()
      : getJsonSpec();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    if (onCopySuccess) onCopySuccess("Код інтеграції скопійовано!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0d111a] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Експорт коду для розробників</h3>
              <p className="text-xs text-[#8f9ba8] font-mono">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-5 mb-4">
          <button
            onClick={() => setActiveTab("python")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "python"
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.04] text-[#8f9ba8] hover:text-white"
            }`}
          >
            Python SDK
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "curl"
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.04] text-[#8f9ba8] hover:text-white"
            }`}
          >
            cURL / Bash
          </button>
          <button
            onClick={() => setActiveTab("langchain")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "langchain"
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.04] text-[#8f9ba8] hover:text-white"
            }`}
          >
            LangChain
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "json"
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.04] text-[#8f9ba8] hover:text-white"
            }`}
          >
            JSON Schema
          </button>
        </div>

        {/* Code View */}
        <div className="relative">
          <pre className="p-4 bg-[#07090e] border border-white/[0.06] rounded-2xl font-mono text-xs text-gray-200 overflow-x-auto max-h-[380px] leading-relaxed whitespace-pre-wrap">
            {currentCode}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Скопійовано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Копіювати код</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
