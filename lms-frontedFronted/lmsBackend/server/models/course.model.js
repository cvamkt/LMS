// const { model, Schema } = require("mongoose");
import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be atleast 8 character'],
        maxLength: [59, 'Title should be less than 60 charaters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        minLength: [8, 'description must be atleast 8 character'],
        maxLength: [200, 'description should be less than 199 charaters'],
    },
    category: {
        type: String,
        required: [true, 'category is required'],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    numbersofLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const Course = model('Course', courseSchema)

// module.exports = Course;
export default Course;