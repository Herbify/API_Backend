const prisma = require("../prisma");

const capitalizeFirstLetter = (str) => {
  return str.toLowerCase().replace(/^(.)|\s+(.)/g, function (match) {
    return match.toUpperCase();
  });
};

class PredictController {
  static async predictChatbotAnswer(req, res) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          message: "Input content message!",
        });
      }

      const data = await prisma.chatbot.findFirst({
        where: {
          question: {
            contains: content,
          },
        },
      });

      let answer = data
        ? data.answer
        : "Sorry, we cannot answer your question because it is not specific. We will always improve our services. Ask more questions!";

      if (
        !data &&
        ["halo", "pagi", "siang", "sore", "malam"].includes(
          content.toLowerCase()
        )
      ) {
        answer = `${capitalizeFirstLetter(
          content
        )}, thank you for using our service, enter your question!`;
      }

      res.status(200).json({
        message: "Success getting the closest answer",
        data: {
          content,
          similarQuestion: data ? data.question : "",
          answer,
        },
      });
    } catch (error) {
      console.log({ error });
      res.status(500).json({
        message: "[Error]:predictHerbal",
        error: error.message,
        detail: error,
      });
    }
  }
}

module.exports = PredictController;
