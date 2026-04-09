import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    SystemMessage,
    HumanMessage,
} from "@langchain/core/messages";
import { createAgent } from "langchain";
import { ExaSearchResults } from "@langchain/exa";
import Exa from "exa-js";
import { initChatModel } from "langchain";
import "dotenv/config";


const model = await initChatModel("gpt-4o-mini");

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


const subagent1 = createAgent({
    model:model,
  systemPrompt: `'Your are a helpfull AI assistant , that interact with other assistant, you Job is to find  weather info,for world cities'`,
  tools: [searchTool]
});
// translator
const subagent2 = createAgent({
    model:model,
  systemPrompt: `'Your are a helpfull AI assistant , that interact with other assistant, you Job is to Translate English language to French eg: what is a AI, french:que signifie l'intelligence artificiel'`,
});


const callSubagent1 = tool(
  async ({ query }) => {
    console.log('call sub agent 1:  :')

    const result = await subagent1.invoke({
      messages: [{ role: "user", content: query }]
    });
    return result.messages.at(-1)?.text;
  },
  {
    name: "Researcher",
    description: "Find realtime weather about world cities",
    schema: z.object({
      query: z.string().describe("The query to to send to subagent1."),
    }),
  }
);



const callSubagent2 = tool(
  async ({ query }) => {
    console.log('call subagent 2')

    const result = await subagent2.invoke({
      messages: [{ role: "user", content: query }]
    });
    return result.messages.at(-1)?.text;
  },
  {
    name: "Translaor",
    description: "Translator of English language to French",
    schema: z.object({
      query: z.string().describe("The query to to send to subagent2."),
    }),
  }
);

// main agent
const agent = createAgent({
  model:model,
  systemPrompt: `
  Your are a helpfull AI assistant that interact with subAgents.
  You have 2 subagents passed to your as tools, 
  - the goal of subagent 1 is to find realtime information about weather.
  the goal of subagent 2 is to Translate English language to French
  `,
  tools: [callSubagent1,callSubagent2]
});


const agentOutput = await agent.invoke({
    messages: [new HumanMessage('hello'),new HumanMessage('What is the currrent weather in new york'),
      new HumanMessage('once you have the information of current weather Translate it to French')
    ],
});
const aiResponse = agentOutput.messages[agentOutput.messages.length - 1].content

console.log(aiResponse)



