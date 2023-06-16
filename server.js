require('dotenv').config();

const express = require('express')
const connectDb = require('./db')
const cors = require('cors')
const cron = require('node-cron')
const mongoose = require('mongoose')

const Quiz = require('./models/quiz_model')

const app = express()
const port = process.env.PORT || 8080

// connect to db
connectDb()

const cronSchedule = '* */1 * * *'

cron.schedule(cronSchedule, async () => {
    try {
        // get current date & time
        const currentDateTime = new Date()

        // find quizzes that have a start time earlier than the current time
        const startedQuizzes = await Quiz.find({ startDate: { $lte: currentDateTime } })

        // update the status of the started quizzes
        for (const quiz of startedQuizzes) {
            if (quiz.endDate <= currentDateTime) {
                // quiz has ended, update quiz status to finished
                quiz.status = 'finished'
            } else {
                // quiz is currently ongoing, update status to active
                quiz.status = 'active'
            }

            // save quiz
            await quiz.save()
        }
    } catch (error) {
        console.error('Error Occurred while updating quiz status', error)
    }
})

require('./models/quiz_model')

app.use(cors())
app.use(express.json())
app.use(require('./routes/quiz_routes'))

// start server
app.listen(port, () => console.log(`Server listening on port ${port}!`))