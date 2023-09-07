import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { Button, Input } from "antd";
import { Box, Center } from "@chakra-ui/react";

export default function ChatGpt() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("Weather in Chicago");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 100,
      });
      setResult(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Box bg="#a900ff" color="white" w="100%" p="20px" mt={50}>
        <Input
          style={{
            color: "#a900ff",
            width: "350px",
          }}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Your command.."
        ></Input>

        <Button
          type="primary"
          color="white"
          backgroundColor="white"
          onClick={handleClick}
          disabled={loading || prompt.length === 0}
        >
          {loading ? "Hopping..." : "Hop To"}
        </Button>
        <Center>
          <Box bg="white" color="black" w="100%" margin="10px">
            *Power by ChatGPT text-divinci
            <pre className="result">{result}</pre>
          </Box>
        </Center>
      </Box>
    </div>
  );
}
