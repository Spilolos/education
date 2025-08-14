# EduGhana - Interactive Learning Platform

A comprehensive educational platform featuring interactive quizzes with instant feedback, progress tracking, and retry functionality for multiple subjects.

## Features

### 🎯 Interactive Quizzes
- **5 questions per subject** with comprehensive coverage
- **Instant feedback** on correct/incorrect answers
- **Detailed explanations** for each question
- **Progress tracking** with visual progress bar
- **Retry functionality** for incorrect answers
- **Next button** to advance through questions
- **Final score display** with retry option

### 📚 Subject Coverage
1. **Mathematics** - Numbers, Algebra, Geometry
2. **Science** - Biology, Physics, Chemistry
3. **English & Literature** - Grammar, Comprehension, Literature
4. **Ghanaian History** - Pre-colonial states to independence

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Clean, modern interface** with Tailwind CSS
- **Smooth animations** and hover effects
- **Accessible navigation** between subjects
- **Professional color scheme** with green branding

## File Structure

```
EduGhana/
├── index.html          # Main landing page with subject navigation
├── math.html           # Mathematics subject page with quiz
├── science.html        # Science subject page with quiz
├── english.html        # English & Literature subject page with quiz
├── history.html        # Ghanaian History subject page with quiz
├── quiz.js             # Interactive quiz functionality
└── README.md           # Project documentation
```

## How to Use

1. **Open `index.html`** in any modern web browser
2. **Choose a subject** from the main page
3. **Read the notes** to understand the concepts
4. **Take the quiz** with 5 questions per subject
5. **Get instant feedback** on your answers
6. **Retry incorrect answers** until you get them right
7. **Track your progress** with the progress bar
8. **View your final score** and retry the entire quiz if desired

## Quiz Features

### Question Navigation
- **Progress bar** shows current question position
- **Question counter** displays "Question X of 5"
- **Next button** appears after correct answers
- **Retry button** for incorrect answers

### Feedback System
- **Green feedback** for correct answers with explanations
- **Red feedback** for incorrect answers with retry option
- **Detailed explanations** help reinforce learning
- **Visual indicators** show correct/incorrect options

### Completion
- **Final score display** shows performance
- **Retry quiz option** to start over
- **Back to subjects** navigation
- **100% progress** indication

## Technical Details

### Technologies Used
- **HTML5** for structure
- **CSS3** with Tailwind CSS for styling
- **Vanilla JavaScript** for interactivity
- **Google Fonts** (Poppins) for typography

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Deployment
This is a **static website** that can be deployed on:
- GitHub Pages
- Netlify
- Vercel
- Any web hosting service

## Quiz Data Structure

Each subject contains quiz data in this format:

```javascript
window.quizData = {
    title: 'Subject Quiz',
    questions: [
        {
            prompt: 'Question text?',
            options: [
                { text: 'Option 1', correct: true },
                { text: 'Option 2' },
                { text: 'Option 3' },
                { text: 'Option 4' }
            ],
            explanation: 'Detailed explanation of the correct answer.'
        }
        // ... more questions
    ]
};
```

## Customization

### Adding New Subjects
1. Create a new HTML file following the existing pattern
2. Add quiz data with 5 questions
3. Update navigation links in all files
4. Add subject card to index.html

### Modifying Questions
1. Edit the `window.quizData` object in the subject file
2. Ensure each question has 4 options with one marked `correct: true`
3. Add helpful explanations for learning reinforcement

### Styling Changes
- Modify Tailwind CSS classes in HTML files
- Update color scheme in CSS variables
- Adjust responsive breakpoints as needed

## Educational Benefits

- **Immediate feedback** reinforces learning
- **Retry mechanism** encourages persistence
- **Progress tracking** motivates completion
- **Detailed explanations** enhance understanding
- **Multiple subjects** provide comprehensive coverage
- **Mobile-friendly** enables learning anywhere

## License

© 2025 EduGhana. All rights reserved.

---

**Ready to deploy!** Simply upload all files to any web hosting service for immediate use.
