process.env.AWS_PROFILE = "gamboa";

import cron from "node-cron";
import aws from "aws-sdk";

aws.config.update({ region: "us-east-1" });

const sqs = new aws.SQS();

interface UserDto {
  username: string;
}

function getUserInfos({ username }: UserDto) {
  //TO-DO
  // request with axios and print
}

function consumeQueue() {
  sqs.receiveMessage(
    {
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/301560714626/gihub-usernames",
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    },
    (err, data) => {
      if (err) console.log("Erro ao consumir fila: ", err);

      if (!data.Messages || !data.Messages.length)
        console.log("Não tem mais mensagens na fila!");

      if (data.Messages) {
        console.log("Messages received: ", data.Messages.length);
        data.Messages.forEach((message) => {
          const body: UserDto = JSON.parse(message.Body as string);

          getUserInfos(body);

          sqs.deleteMessage(
            {
              QueueUrl:
                "https://sqs.us-east-1.amazonaws.com/301560714626/gihub-usernames",
              ReceiptHandle: message.ReceiptHandle as string,
            },
            (err) => {
              if (err) console.log("Erro ao deletar mensagem da fila: ", err);

              console.log(`Mensagem ${message.MessageId} deletada com sucesso`);
            }
          );
        });
      }
    }
  );
}

cron.schedule("* * * * *", () => {
  console.log("Cron Job Running");
  consumeQueue();
});
