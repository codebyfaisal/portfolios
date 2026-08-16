import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button, Input, Select } from "@/components";

const QuestionBuilder = ({ questions, onChange }) => {
  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      required: false,
      placeholder: "",
      options: [],
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index, updates) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onChange(newQuestions);
  };

  const handleOptionsChange = (index, value) => {
    const options = value.split(",").map((opt) => opt.trim());
    updateQuestion(index, { options });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h3 className="text-lg font-semibold text-foreground">
          Application Questions
        </h3>
        <Button
          onClick={addQuestion}
          uiType="secondary"
          icon={<FaPlus size={14} />}
          label="Add Question"
          type="button"
          style={{ padding: "0.5rem 1rem" }}
        />
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="p-4 border border-border rounded-lg bg-muted/50 space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Question Label"
                    value={q.label}
                    onChange={(e) =>
                      updateQuestion(index, { label: e.target.value })
                    }
                    placeholder="e.g. How many years of experience?"
                    required
                  />
                  <Select
                    label="Answer Type"
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(index, { type: e.target.value })
                    }
                    options={[
                      { value: "text", label: "Short Text" },
                      { value: "textarea", label: "Long Text" },
                      { value: "number", label: "Number" },
                      { value: "select", label: "Dropdown Select" },
                      { value: "date", label: "Date" },
                    ]}
                  />
                </div>

                {q.type === "select" && (
                  <Input
                    label="Options (comma separated)"
                    value={q.options?.join(", ") || ""}
                    onChange={(e) => handleOptionsChange(index, e.target.value)}
                    placeholder="e.g. Option A, Option B, Option C"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Input
                    label="Placeholder (Optional)"
                    value={q.placeholder || ""}
                    onChange={(e) =>
                      updateQuestion(index, { placeholder: e.target.value })
                    }
                    placeholder="e.g. Enter your answer here..."
                  />
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(index, { required: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring focus:ring-offset-background"
                      id={`req-${q.id}`}
                    />
                    <label
                      htmlFor={`req-${q.id}`}
                      className="text-sm text-muted-foreground font-medium cursor-pointer select-none"
                    >
                      Required Field
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => removeQuestion(index)}
                uiType="secondary"
                icon={<FaTrash size={12} />}
                className="text-muted-foreground hover:text-destructive mt-8"
                type="button"
                title="Remove Question"
              />
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 border border-dashed border-border rounded-lg text-muted-foreground">
            No custom questions added.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBuilder;
