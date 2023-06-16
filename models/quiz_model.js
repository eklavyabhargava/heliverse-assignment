const mongoose = require('mongoose')

const opts = { toJSON: { virtuals: true } }
const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    rightAnswer: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, opts);

// virtual property for the quiz status
quizSchema.virtual('status').get(function() {
    const currentDateTime = new Date()

    if (currentDateTime < this.startDate) {
        return 'inactive'
    } else if (currentDateTime >= this.startDate && currentDateTime <= this.endDate) {
        return 'active'
    } else {
        return 'finished'
    }
})

mongoose.model("Quiz", quizSchema);