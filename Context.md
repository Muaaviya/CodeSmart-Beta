STARTER PROMPT:

Name:
CodeSmart : Smart Task Evaluator

Vision:
Build an online platform where users can submit coding tasks they have already written and receive AI based evaluation and feedback on their code quality.

CoreIdea:
This product works like a virtual code reviewer. users paste code they've written, and the system evaluates it using an AI model and returns:
- Score: x / 10 (eg: 7.5/10)
- Strength: Checks the quality, bugs and logic pf code. Eg: Clean Code, good Logic.
- Improvements: Suggested Areas for Improvements. Eg: Error handling, readability.
- A short Professional verdict.

Main Features:
- User authentication (email login/signup)
- Task submission form for uploading user-written code
- AI evaluation of code using LLMs
- Preview of evaluation result
- Payment system to unlock the full report
- Dashboard for past task history and reports
- Backend powered by Supabase (auth, database, security rules)
- Integration with AI APIs for evaluation
- Code-fixing demonstration (buggy code → AI-assisted refactor)

TechStack:
- Frontend: React + TypeScript
- Backend: Supabase (Auth, Database, RLS, APIs)
- AI: Groq 
- Payments: Razorpay (test mode)
- Hosting: Vercel 

Expectations:
- Production-ready structure
- Secure authentication and row-level security
- AI output must be structured and displayable
- Payment-locked premium content
- Clean UI/UX
- Logical folder structure
- Clear API separation
- No fake features or hardcoded behavior

Goal:
Build this as if you're shipping a real startup product, not a demo project.

Focus Area:
- Reliability
- Clean architecture
- Professional user experience
- AI correctness
- Debugging and refactoring workflows
- Responsible AI usage


User Flow:
1. Users log in
2. Upload coding task
3. Get Ai evaluation
4. Pay to unlock full report
5. View old Evaluation
6. Everything storage related backed by supabase:
    - Authentication -> Email Login
    - Database -> Users , Task, payment 
    - RLS
    - APIs
7. AI integration inside the app