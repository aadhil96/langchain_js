import "dotenv/config"
import { initChatModel } from "langchain";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";

const model = await initChatModel("gpt-4o-mini");


// async function run() {
//   const response = await model.invoke("Hello ");
//   console.log(response.content);
// }

// run();

// const response = await model.invoke("Hey ?")
// console.log(response.content)

const aiMsg = await model.invoke([
     
    new SystemMessage('You are Helpfull Assistant'),
    new HumanMessage('Hello ?')

])

console.log(aiMsg.content)