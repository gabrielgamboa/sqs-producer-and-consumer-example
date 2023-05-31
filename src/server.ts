process.env.AWS_PROFILE = "gamboa";

import express from "express";
import aws from "aws-sdk";

aws.config.update({ region: "us-east-1" });

const sqs = new aws.SQS();

const app = express();
app.use(express.json());

app.post("/send-username-to-queue", (req, res) => {
  const users = req.body;

  for (const user of users) {
    sqs.sendMessage(
      {
        QueueUrl:
          "https://sqs.us-east-1.amazonaws.com/301560714626/gihub-usernames",
        MessageBody: JSON.stringify(user),
      },
      (err) => {
        if (err) console.log("erro ao enviar mensagem: ", err);
      }
    );
  }

  res.json({ message: "esses usuários serão processados", users });
});

app.listen(3333, () => console.log("Server is running"));
