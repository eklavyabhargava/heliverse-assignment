const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const Quiz = mongoose.model('Quiz')

// API to create new quiz
router.post('/quizzes', async (req, res) => {
    // get and verify required data
    const { question, options, rightAnswer, startDate, endDate } = req.body;

    if (!question || !options || rightAnswer === undefined || rightAnswer === null || !startDate || !endDate) {
        return res.status(400).json({ error: "Mandatory fields are missing" })
    }

    try {
        const startDateString = new Date(startDate)
        const endDateString = new Date(endDate)

        // create new quiz and store it in database
        const quiz = new Quiz({ question, options, rightAnswer, startDate: startDateString, endDate: endDateString })
        const newQuiz = await quiz.save()

        return res.status(201).json({ success: newQuiz })
    } catch (error) {
        console.log("Error occurred while creating new quiz", error)
        return res.status(500).json({ error: "Internal Error Occurred" })
    }
})

// API to get active quizzes
router.get('/quizzes/active', async (req, res) => {
    try {
        // get all quizzes and filter quizzes which status is active
        const quizzes = await Quiz.find()
        const activeQuizzes = quizzes.filter((quiz) => quiz.status === 'active')

        res.status(200).json(activeQuizzes)
    } catch (error) {
        console.log("Error occurred while getting active quizzes", error)
        return res.status(500).json({ error: "Internal Error Occurred" })
    }
})

// API to get quiz's result
router.get('/quizzes/:id/result', async (req, res) => {
    try {
        const quizId = req.params.id

        if (quizId === undefined || quizId === null) {
            return res.status(200).json({ error: "ID is invalid" })
        }

        // find quiz by id
        const quiz = await Quiz.findById(quizId)

        if (!quiz) {
            return res.status(404).json({ error: "Quiz Not Found" })
        }

        const currentDateTime = new Date()

        const resultDateTime = new Date(quiz.endDate.getTime() + 5 * 60000)

        if (resultDateTime < currentDateTime) {
            const result = quiz.options[quiz.rightAnswer]
            return res.status(200).json({ result: result })
        }

        return res.status(404).json({ error: "Quiz result not available yet" })
    } catch (error) {
        console.log("Error occurred while getting quizzes from database", error)
        return res.status(500).json({ error: "Internal Error Occurred" })
    }
})

// API to get all quizzes
router.get('/quizzes/all', async (req, res) => {
    try {
        // get all quizzes from database
        const quizzes = await Quiz.find()

        return res.status(200).json(quizzes);
    } catch (error) {
        console.log("Error Occurred while getting quizzes", error)
        return res.status(500).json({ error: "Internal Error Occurred" })
    }
})

module.exports = router