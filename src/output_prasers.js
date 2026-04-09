import z from "zod"
import "dotenv/config";
import { initChatModel } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";


// process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const model = await initChatModel("gpt-4o-mini");


const animalSchema = z.object({
    animals:z.array(z.string()).describe('List of wild animals')
}).describe('return a list of wild animals')

const boolanSchema = z.object({
    val:z.boolean().describe('true or false')
}).describe('return true or false')

const struturedLLm = model.withStructuredOutput(animalSchema);
const result = await struturedLLm.invoke([
    new HumanMessage('Return a a list of 5 wild animals')
])

console.log(result)