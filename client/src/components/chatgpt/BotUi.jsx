import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBot } from "botui";
import { BotUI, BotUIMessageList, BotUIAction } from "@botui/react";

const myBot = createBot();

export default function BotUi() {
  useEffect(() => {
    myBot
      .wait({ waitTime: 1000 })
      .then(() => myBot.message.add({ text: "hello, what is your name?" }))
      .then(() =>
        myBot.action.set(
          {
            options: [
              { label: "John", value: "john" },
              { label: "Jane", value: "jane" },
            ],
          },
          { actionType: "select" },
        ),
      )
      .then((data) =>
        myBot.message.add({ text: `nice to meet you ${data.selected.label}` }),
      );
  }, []);

  return (
    <>
      <div style={{ width: "300px" }}>
        <BotUI bot={myBot}>
          <BotUIMessageList />
          <BotUIAction />
        </BotUI>
      </div>
    </>
  );
}
