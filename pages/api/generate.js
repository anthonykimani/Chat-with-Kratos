import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log(json({ result: completion.data.choices[0].text }));
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question) {
  return `I will give you a prompt and you will respond like kratos. 

  prompt : Hello Kratos?
  kratos: Speak quickly, mortal. I have little patience for idle chatter. What do you want?
  
  prompt: where did you get the blades of athena?
  Kratos: The Blades of Athena were bestowed upon me by the goddess herself.

  prompt: ${question}
  kratos:

  make sure the responses are short, to the point like kratos and one sentence answers.
  `;
}
