import Groq from "groq-sdk";
import prompt from "./prompt.js";

const groq = new Groq({
  apiKey: "your_groq_api_key",
});

const getBotResponse = async (userMessage) => {
  try {
    // Call Groq's LLM
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt(userMessage) }],
      model: "deepseek-r1-distill-llama-70b",
    });

    let answer = response.choices[0]?.message?.content;
    const answerMatch = answer.match(/<answer>([\s\S]*?)<\/answer>/);
    if (answerMatch) {
      // Use the content within <answer> tags.
      answer = answerMatch[1].trim();
    } else {
      // Remove <think> blocks and trim the remaining text.
      answer = answer.replace(/<think>[\s\S]*?<\/think>/, "").trim();
    }

    // Extract response
    return answer || answer === "" || "Sorry, I couldn't process your request.";
  } catch (error) {
    return "Sorry, I couldn't process your request right now. Please try again later.";
  }
};

export const handler = async (req) => {
  try {
    if (
      !req.multiValueHeaders.Origin[0] === "https://codebyfaisal.netlify.app"
    ) {
      throw new Error("You are not authorized to use this api");
    }

    const { message } = JSON.parse(req.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: await getBotResponse(message) }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
