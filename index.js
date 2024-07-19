const express = require('express');
const app = express();
const port = 6000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
let data = mongoose.connect('mongodb://localhost:27017/firstdb')
const { Schema } = mongoose;
app.use(bodyParser.json());
const StudentSchema = new Schema({
    name: String,
    email: String,
    phone: String
});
const StudentModel = mongoose.model("student", StudentSchema);
app.get('/student', (req, res) => {
    StudentModel.find({})
        .then(function (student) {
            res.json(student);
        })
        .catch(function (error) {
            console.log("error", error);
            res.status(500).json({ error: 'An error occurred' });
        });
});
//search a student
app.get('/student/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const student = StudentModel.findById(id)
        .then(
            student => {
                if (student) {
                    res.json({ data: student })
                } else {
                    res.json({ Error: 'User not found' })
                }
            }
        ).catch(error => {
            console.log(error);
        })
});

//create new student
app.post('/student/create-student', function (req, res, next) {
    const data = req.body;
    if (!data.email) {
        res.json({
            error: 'Email is required'
        })
    } else if (!data.name) {
        res.json({
            error: 'Name is required'
        })
    }else if(!data.phone){
        res.json({
            Error: 'Phone is required'
        })
    }else{
        const newStudent = new StudentModel(data);
        newStudent.save()
        .then(
            savedStudent => res.json({
                student: savedStudent
            })
        ).catch(error =>{
            res.json({
                Error: error
            })
        })
        
    }
})

//update new user
app.patch('/student/update/:id', function(req, res, next){
    const id = req.params.id;
    const data = req.body;
    const student = StudentModel.findByIdAndUpdate(id, {
        name : data.name,
        email: data.email,
        phone: data.phone
    },
    {new: true}).then(
        updatedUser => res.json({
            student: updatedUser
        })
    ).catch(error =>{
        res.json({
            error: error
        })
    })
})

//delete a student
app.delete('/student/delete/:id', function(req, res, next){
    const id = req.params.id;
    StudentModel.findByIdAndDelete(id)
    .then(
        deletedStudent =>{
            res.json({
                student: deletedStudent,
                message: 'Student has been deleted successfully!'
            })
        }
    ).catch(error =>{
        res.json({
            error: error
        })
    })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
