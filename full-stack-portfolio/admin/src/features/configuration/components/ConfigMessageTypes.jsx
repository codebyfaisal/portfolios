import React, { useState } from "react";
import { FaEnvelope, FaPlus, FaTrash } from "react-icons/fa";
import { ColorPicker } from "antd";
import { Input, Button, Card } from "@/components";

const ConfigMessageTypes = ({ messageTypes = [], onChange }) => {
  const [newMessageType, setNewMessageType] = useState({
    type: "",
    typeColor: "#ffffff",
  });

  const handleAddMessageType = (e) => {
    e.preventDefault();
    const typeName = newMessageType.type.trim();
    if (typeName) {
      const existingIndex = messageTypes.findIndex(
        (t) => t.type.toLowerCase() === typeName.toLowerCase()
      );

      let updatedTypes;
      if (existingIndex !== -1) {
        updatedTypes = [...messageTypes];
        updatedTypes[existingIndex] = {
          ...updatedTypes[existingIndex],
          typeColor: newMessageType.typeColor,
        };
      } else {
        updatedTypes = [
          ...messageTypes,
          {
            type: typeName,
            typeColor: newMessageType.typeColor,
          },
        ];
      }
      onChange(updatedTypes);
      setNewMessageType({ type: "", typeColor: "#ffffff" });
    }
  };

  const handleRemoveMessageType = (index) => {
    const updatedTypes = messageTypes.filter((_, i) => i !== index);
    onChange(updatedTypes);
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FaEnvelope className="text-primary" /> Message Types
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Type Name"
          value={newMessageType.type}
          onChange={(e) =>
            setNewMessageType({
              ...newMessageType,
              type: e.target.value,
            })
          }
          placeholder="e.g. Project Inquiry"
          className="col-span-full"
        />
        <div className="col-span-3 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Color
          </label>
          <div className="flex gap-2">
            <ColorPicker
              value={newMessageType.typeColor || "#ffffff"}
              onChange={(value, hex) =>
                setNewMessageType({
                  ...newMessageType,
                  typeColor: hex,
                })
              }
              showText
              className="w-full p-2! flex! items-center! justify-center! bg-input!"
            />
          </div>
        </div>
        <div className="flex items-end pb-0.5 col-span-1">
          <Button
            onClick={handleAddMessageType}
            uiType="primary"
            icon={<FaPlus size={14} />}
            label="Add"
            className="w-full flex justify-center"
            style={{ padding: "0.6rem" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {messageTypes.map((t, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-foreground border border-border"
            style={{ backgroundColor: t.typeColor || "#27272a" }}
          >
            <span>{t.type}</span>
            <button
              type="button"
              onClick={() => handleRemoveMessageType(index)}
              className="hover:text-red-300 transition-colors"
            >
              <FaTrash size={10} />
            </button>
          </div>
        ))}
        {messageTypes.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No message types added.
          </p>
        )}
      </div>
    </Card>
  );
};

export default ConfigMessageTypes;
