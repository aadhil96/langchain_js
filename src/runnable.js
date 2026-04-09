
import "dotenv/config"
import { initChatModel } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";

const model = await initChatModel("gpt-4o-mini");