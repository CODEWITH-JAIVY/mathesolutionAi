# **App Name**: MathVision

## Core Features:

- Problem Solver: Use the OpenAI GPT-4 Vision API tool to interpret and solve math problems from text or images, displaying step-by-step solutions.
- Whiteboard Display: Display solutions on a whiteboard-style interface using React Konva or Fabric.js.
- Interactive Chat: Enable users to ask follow-up questions about the solution in a chat-like interface.

## Style Guidelines:

- Primary color: #f0f8ff  to simulate a real whiteboard.
- Secondary color: #e6e6fa for UI elements and backgrounds.
- Accent: #7b68ee for interactive elements and highlights.
- Clean and intuitive layout with a clear separation between the input area, whiteboard display, and chat interface.
- Use simple, recognizable icons for actions like submitting problems, clearing the whiteboard, and sending chat messages.
- Subtle animations for loading states and transitions to provide a smooth user experience.

## Original User Request:
create a web where user submit theire mathematic problem either  in  text forn  of image of the question and web provided the soltution on white boad like as classroom boad further giver the option to they ask about more  , which api is reuied used it five me the project fullt resposive for mobiel and pc  on heading tile with codewithjaivy ( name ) ubmit math problems via text or image.

View solutions displayed on a whiteboard-style interface (like a classroom).

Ask follow-up questions in a chat-like interface.


Required APIs and Tools
OpenAI GPT-4 Vision API – To interpret image-based math questions and solve text queries.

Mathpix API – Extract LaTeX or structured math from images.

React Konva or Fabric.js – To draw and render a whiteboard UI on the web.

Express.js (Node.js) – Backend to handle user uploads, API requests, and chat history.

Firebase – For authentication and real-time chat features (optional but powerful).

Project Stack
Frontend: React.js + Tailwind CSS (fully responsive)

Backend: Node.js + Express.js

AI Integration: OpenAI API, Mathpix API

Whiteboard UI: Konva.js (React wrapper)

Deployment: Vercel (Frontend), Render/Node + Firebase (Backend/Auth)

Prompt for OpenAI (to solve text or image-based math)
"Solve the following math problem clearly and display the solution step-by-step like a teacher on a whiteboard. Make it suitable for a student learning in class: [insert question here]."
  