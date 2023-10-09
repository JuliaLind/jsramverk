const delayed = require('../models/delayed.js');
const DelayType = require("./delayed.js");
const codes = require('../models/codes.js');
const CodeType = require("./code.js");
const tickets = require('../models/tickets.js');
const TicketType = require('./ticket.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLInt,
    // GraphQLNonNull
} = require('graphql');
const { Code } = require('mongodb');

// const CourseType = require("./course.js");
// const TeacherType = require("./teacher.js");
// const StudentType = require("./student.js");

// const courses = require("../models/courses.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        delay: {
            type: DelayType,
            description: 'A single delay',
            args: {
                activityId: { type: GraphQLString }
            },
            resolve: async function(_, args) {
                let delayArray = await delayed.getFromTrafikVerket()

                return delayArray.find(delay => delay.ActivityId === args.ActivityId);
            }
        },
        delayed: {
            type: GraphQLList(DelayType),
            description: 'List of all delayed trains',
            resolve: async function() {
                return await delayed.getFromTrafikVerket();
            }
        },
        codes: {
            type: GraphQLList(CodeType),
            description: 'List of reason codes',
            resolve: async function() {
                return await codes.getFromTrafikVerket();
            }
        },
        tickets: {
            type: GraphQLList(TicketType),
            description: 'List of tickets',
            resolve: async function() {
                return await tickets.getTickets();
            }
        },
//         teacher: {
//             type: TeacherType,
//             description: 'A single teacher',
//             args: {
//                 acronym: { type: GraphQLString }
//             },
//             resolve: async function (parent, args) {
//                 let teachers = await getPeople("teachers");

//                 return teachers.find(teacher => teacher.acronym === args.acronym)
//             }
//         },
//         teachers: {
//             type: GraphQLList(TeacherType),
//             description: 'List of teachers',
//             resolve: async function() {
//                 return await getPeople("teachers");
//             }
//         },
//         students: {
//             type: GraphQLList(StudentType),
//             description: 'List of students',
//             resolve: async function() {
//                 return await getPeople("students");
//             }
//         }
    })
});

// async function getPeople(entity) {
//     let courseArray = await courses.getAll();
//     let people = [];
//     let acronyms = [];
//     courseArray.forEach(function(course) {
//         course[entity].forEach(function(person) {
//             if (acronyms.indexOf(person.acronym) === -1) {
//                 people.push(person);
//                 acronyms.push(person.acronym);
//             }
//         });
//     });

//     return people;
// }

module.exports = RootQueryType;
