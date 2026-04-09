
import "dotenv/config"
import z from "zod"
import { initChatModel } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { PromptTemplate , ChatPromptTemplate } from "@langchain/core/prompts";

const model = await initChatModel("gpt-4o-mini");

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a senior customer support AI for a SaaS product.

            Your job:
            - Understand the user's issue using conversation context
            - Decide the best next action

            Rules:
            - Be concise
            - Do NOT explain internal reasoning
            - Use only the provided context`,
    ],
    [
        "system",
        `Conversation context:
- User plan: {plan}
- Previous issue: {previous_issue}
- Account status: {account_status}`,],
    ["user", "{input}"],
]);

const supportDecisionSchema = z.object({
    intent: z.enum([
        "billing_issue",
        "technical_issue",
        "account_issue",
        "general_question",
    ]),
    urgency: z.enum(["low", "medium", "high"]),
    action: z.enum([
        "answer_user",
        "escalate_to_human",
        "request_more_info",
    ]),
    reply: z.string().describe("Message shown to the user"),
});

const structuredLlm = model.withStructuredOutput(supportDecisionSchema);

const chain = prompt.pipe(structuredLlm);

const result = await chain.invoke({
    plan: "Free",
    previous_issue: "Payment failed last month",
    account_status: "Active",
    input: "Why can't I export my data?",
});

console.log(result);