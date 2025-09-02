🚀 Main Pages & Features
1. Login Page (/hebrew-auth.html)

Full Hebrew interface with RTL support

Login with email & password – comprehensive validation

Full registration – name, email, password, confirm password, terms of use

Login with Google (mock)

Clear error messages in Hebrew with animations

Loading states with spinners and animations

Keyboard support – Escape, Enter, Tab navigation

Local storage for user details

2. Language Selection Page (/language-selection.html)

3 available languages: Spanish, Korean, French

Interactive language cards with animations

Selected language highlight with cyan border

Difficulty tags – Easy, Medium, Hard

Continue button unlocked only after language selection

Choice stored in localStorage

3. Country Map Page (/country-map.html)

6 milestones with different progress states

Progress path with fill animation

Locked/Unlocked/Completed milestones with different colors

Student avatars on the current milestone

General progress bar with glowing effect

Navigation between milestones by clicking

4. Milestone Page (/milestone.html)

List of 10 words with different statuses

Completed words – green with ✓

Current word – cyan with 📚

Locked words – gray with 🔒

Progress bar for each word

Quiz button unlocked only after all words are completed

5. Word Learning Page (/word-learning.html)

Word display with Hebrew translation

Switch between languages – source & translation

Demo video with play button

Pronunciation audio with play button

Representative image of the word

Personal notes section for hints

Confirm button – “I understood the word”

6. Learning Game Page (/game.html)

Floating words with animations

Target zones with Hebrew labels

Drag-and-drop/click mechanic to match words

Accuracy bar – progress only after 90%

Feedback animations – green/red glow

Help buttons – hints & reload

7. Winner Page (/winner.html)

Happy dancing character with animations

5 stars with fill animations

Score display in percentages

Encouragement message adapted to result

Falling confetti background

Continue buttons for next stage or review

8. Final Quiz Page (/quiz.html)

10 questions covering all learned words

Different question types – multiple choice & fill-in

Progress bar with statistics

Immediate feedback – correct/incorrect

Final results with tailored messages

Option to skip questions

🎨 Design Guide
Professional Colors

Primary: Indigo #6366F1

Secondary: Purple #8B5CF6

Accent: Cyan #06B6D4

Error: Red #DF3F40

Success: Green #10B981

Warning: Amber #F59E0B

Spacing System

Extra small: 4px

Small: 8px

Medium: 16px

Large: 20px

Extra large: 24px

Huge: 32px

Extra huge: 48px

Super huge: 64px

Shadows & Corners

Small shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

Medium shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)

Rounded corners: 4px to 16px

Transitions: 150ms to 350ms

🛠️ Installation & Running
Requirements

Node.js 16+

npm or yarn

Installation
# Clone project
git clone [repository-url]
cd site_project_code

# Install dependencies
npm install

# Start dev server
npm run dev

App Access

Login page: http://localhost:3000/hebrew-auth.html

Language selection: http://localhost:3000/language-selection.html

Country map: http://localhost:3000/country-map.html

Milestone: http://localhost:3000/milestone.html

Word learning: http://localhost:3000/word-learning.html

Learning game: http://localhost:3000/game.html

Winner page: http://localhost:3000/winner.html

Final quiz: http://localhost:3000/quiz.html

🔧 Technical Features
Security

XSS prevention – sanitize all input

Comprehensive validation – check all parameters

Error handling – try-catch in all functions

Accessibility

Keyboard navigation – Tab, Enter, Escape

Screen reader support – ARIA labels

Voice messages – on-screen notifications

Color contrast – standards compliant

Performance

Smooth animations – CSS transitions

Fast loading – optimized code

Local storage – via localStorage

Performance monitoring – tracking tools

📱 Mobile Support

Responsive design – works on all screens

Touch interface – large, accessible buttons

Mobile navigation – gesture support

Optimized performance – for mobile devices

🎯 App Usage
Workflow

Login/Register – create a user account

Choose a language – Spanish, Korean, or French

Navigate the map – select a learning milestone

Learn words – watch, listen, take notes

Play the learning game – match words with meanings

Final quiz – test acquired knowledge

Results & celebration – achievements displayed

Tips

Use the keyboard for quick navigation

Add personal notes for better recall

Practice with the game before the quiz

Check progress on the general bar

🚧 Future Development
Planned Features

Dark mode – dark theme

Achievement system – badges & trophies

Social sharing – competitions & friends

Customization – personalized themes

Level system – advanced progression

Additional languages – Arabic, Chinese, and more

Technical Improvements

PWA – Progressive Web App

Offline mode – work without internet

Sync – cross-device synchronization

Analytics – advanced progress tracking

📞 Support & Contact

Bug reports: [GitHub Issues]

Feature requests: [GitHub Discussions]

Technical support: [Email Support]

VocabQuest – making language learning fun and practical! 🌍✨
