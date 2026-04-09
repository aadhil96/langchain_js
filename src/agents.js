import "dotenv/config"
import z from "zod"
import { initChatModel } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { PromptTemplate , ChatPromptTemplate } from "@langchain/core/prompts";
import {tool} from "@langchain/core/tools"
import { createAgent } from "langchain";
import Exa from "exa-js";


const model = await initChatModel("gpt-4o-mini");

const client = new Exa(process.env.EXA_SEARCH_API_KEY);

const searchTool = tool(
  async ({ query }) => {
    const result = await client.search(query, {
      numResults: 2,
      type: "auto",
    });

    return result;
  },
  {
    name: "search_web",
    description: "Search the web for real-time information.",
    schema: z.object({
      query: z.string(),
    }),
  }
);


const agent = createAgent({
    model,
    tools:[searchTool],
    systemPrompt:'Your are a helpfull AI assistant that chat with User in English'
})

const agentOutput = await agent.invoke({
    messages : [new HumanMessage('whats the weather now in new york city?')]
},{
    recursionLimit: 30,
})

const aiResponse = agentOutput.messages[agentOutput.messages.length -1].content

console.log(aiResponse)