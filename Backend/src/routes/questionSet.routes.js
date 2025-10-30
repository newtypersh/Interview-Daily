import express from "express";
import * as ctrl from "../controllers/questionSet.controller.js";

const router = express.Router();

// GET /api/v1/question-sets
router.get("/", ctrl.list); 

// GET /api/v1/question-sets/:setId/questions
router.get("/:setId/questions", ctrl.listQuestions); 

export default router;