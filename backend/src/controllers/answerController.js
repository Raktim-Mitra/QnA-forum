
import {Answer} from "../models/Answer.js";
import { sendNotification } from "./notificationController.js";
import {Question} from "../models/Question.js";
export const addAnswer = async (req, res) => {
const { questionId, content, userId } = req.body;

  try {
    const answer = await Answer.create({ questionId, content, user: userId });
    const question= await Question.findById(questionId).populate('user');
    await sendNotification({
      recipientId: question.user._id,
      senderId: req.user.id,
      referenceId: answer._id,
      type: "answer",
      message: `${req.user.username || 'Someone'} answered your question: "${answer.content.substring(0, 20)}"`
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ error: "Failed to post answer" });
  }
};

export const voteAnswer = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const voterId = req.user.id; 
  try {
    const answer = await Answer.findById(id);
    answer.votes += type === "up" ? 1 : -1;
    await answer.save();

 
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: "Voting failed" });
  }
};

export const acceptAnswer = async (req, res) => {
  const { answerId, questionId } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (question.userId !== req.user.uid) return res.status(403).json({ error: "Unauthorized" });

    question.acceptedAnswerId = answerId;
    await question.save();
     
    res.json({ message: "Answer accepted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept answer" });
  }
};

//get answers by question id

export const getAnswerByQuestionId=async (req, res) => {
  const { questionId } = req.params;
  try {
    const answers = await Answer.find({ questionId });
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
}
//get total no of answers
export const getTotalNoOfAnswers=async (req, res) => {
  try {
    const answers = await Answer.find({});
    res.status(200).json(answers.length);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
}