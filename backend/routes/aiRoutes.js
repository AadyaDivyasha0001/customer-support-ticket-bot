const express = require("express");
const router = express.Router();

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

router.post(
  "/generate-reply",
  async (req, res) => {
    try {
      const { issue } = req.body;

      const model =
        genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

      const prompt = `
You are a professional customer support agent.

Customer issue:
${issue}

Generate a helpful support reply.
Keep it under 80 words.
`;

      const result =
        await model.generateContent(
          prompt
        );

      const reply =
        result.response.text();

      res.json({
        reply,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "AI reply generation failed",
      });
    }
  }
);

module.exports = router;