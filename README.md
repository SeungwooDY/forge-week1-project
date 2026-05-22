# Thomas Jefferson Elementary School Dashboard

## Description
This web app is an intuitive, simple dashboard where staff of Thomas Jefferson Elementary can add and edit information regarding their school such as student grades, roster, teacher information, school events, and more.

Written in JavaScript and React.js. Database managed by Google Firestore. Styled with Tailwind CSS.

## Overview
Thomas Jefferson Elementary has been keeping track of their classes, rosters, grades, etc. with paper records which has lead to continuously making copies, losing critical information, and other issues that come from managing hundreds of students with only paper. This has resulted in inefficiencies and faculty frustration. The school administration is unfamiliar with web development, but have requested an easy to use, user friendly web application where they can migrate their data and offers the same functionality as their current organizational  model. 

## Features
### Home Page
Welcome dashboard for the school, can quickly navigate to:
- Student Directory
- Teacher Directory
- Class Directory
- School Calendar

Recent Announcements section at the bottom.

### Class Directory
Can view information regarding all registered classes such as the name, student grade, teacher name, room location, time, year, and grade distribution.
Includes options to edit or delete classes from the registry, and can also add and filter classes by name. All fields are fully customizable and teachers can enter a custom weighting for distribution depending on the needs of the class.

### Assignments Page
Every specific class has their own assignments page, where teachers can create and edit assignments. New assignments can be automatically assigned to its category (homework, quiz, project, test) with custom weighting applied. 

### Grades Page
List of all students with a drop down of all assignments in that class. Individual assignment grades for each student can be edited. Grades not yet entered do not impact their overall grades.

### Student Roster
Can view information regarding enrolled students such as name, grade, student ID, address, and date of birth. Can add/remove existing students from the class without removing them from the registry.

### Teacher Directory
Can view all teachers' names and email, their assigned classes, and search as well. Can view class details for each teacher, and also add/edit teachers.

### Student Directory
Can view all registered students and their information. Options are included to edit or delete students from the registry. Can filter students by name and view their enrolled classes.

### School Calendar
Can add, edit, and delete events in an interactive calendar. Events that have passed are colored black, while ongoing/future events are colored blue.

## Takeaways and Risks
### Takeaways
#### Intuitive Design
- Clean layout
- Fewer clicks needed
- Designed for non-technical users

#### Dashboard does "heavy lifting"
- Automatic grade calculations
- Manual entry errors are reduced
- Consistent grading policies across the board

#### Reliable Workflows
- Centralization of information
- Increase in speed and efficiency for teachers
- Prioritizes spending time with students instead of tedious record keeping

### Risks
#### Software Adoption
- Staff may resist unfamiliarity
- Poor training will result in wasted time and errors

#### Data Migration
- Errors from moving records may arise
- Data may be missing/mismatched when transferring records

#### Dependency/Security
- Dashboard is dependent on software, primarily Google Firestore
- If Google Firestore suffers an outage or cyberattack, the service will not run
- Physical backups encouraged and secondary plans if software goes down

## Future Steps
- Implement login page to separate between admin, teacher, and student permissions
- Add sorting features for different fields, not just names
- Implement messaging system where students can communicate with teachers and/or peers
- Add quick access button that takes a teacher or student to a page with all their personal classes
