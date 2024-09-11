# Learning Management System (LMS) - Course Sales Platform 📚

## Project Overview:-
<br/>
This project is a Learning Management System (LMS) designed for selling online courses. The platform provides a seamless experience for users to browse, purchase, and access educational content. It offers essential features like course subscriptions, payment integrations, and secure access to course materials.<br/>

The LMS platform is built using modern web technologies, ensuring high performance, responsiveness, and security. The frontend is powered by React.js with Tailwind CSS for styling, while the backend is built using Node.js and Express.js. The platform also integrates with Razorpay for handling payments and subscriptions.

<hr/>
<h2> Live Link🌍-[https://learnquest2024.netlify.app/] </h2>
<hr/>

###


 Features:-
<br/>
- **User Authentication 👨‍🎓:**  Secure login, registration, and password reset functionality.<br/>
- **Course Management 📕:** Admins can add, edit, and manage courses, while users can browse available courses and subscribe to them.<br/>
- **Subscription Management 💲:** Users can subscribe to courses using Razorpay payment integration and manage their active subscriptions.<br/>
- **Payment Integration ✅:** Seamless payment handling using Razorpay for secure transactions.<br/>
- **Course Access ✔:** Only subscribed users can access course materials, ensuring a gated learning experience.<br/>
- **Profile Management 😎:** Users can update their profiles and manage their subscriptions easily.<br/>
- **Admin Panel 👨‍⚖️:** Admins have full control over managing users and courses.<br/>

###
  
 For Students
<br/>
- **Homepage 🏠:** A brief introduction to the platform with links to the course list and user details and random background.<br/>
- **Course List 📚:** A list of all the courses available on the platform, along with their descriptions, category, total lectures and Instructor.<br/>
- **Purchased Course List 📓:** A list of Courses that user will subscribe, can visible in seperate page "PURCHASED COURSE".<br/>
- **Course Content 🎓:** Presents the course content for a particular course, including lectures.<br/>
- **User Details 👤:** Provides details about the student's account, including their name, email and profile pictures<br/>
- **User Edit Details ✏️:** Allows students to edit their account details Such as ; edit your password, name and change profile picture.<br/>
- **Contact 📩:** User can send their query through email.<br/>

###
 For Instructor
<br/>
- **Amin Dashboard 📊:** Offers an overview of the instructor's courses, along with deatils of Registered Users, Subscribed Users through Pie chart📈 and Subscription count, Total Revenue through Bar graph. Admin can create and delete course, He/She can diirectly watch lectures or add lectures from here. It shows details of all created courses such as; S.No; , Title, Course Category, Instructor, Total Lectures Description and Action(Watch lecture and delete course).<br/>
- **Course List 📚:** A list of all the courses available on the platform, along with their descriptions, category, total lectures and Instructor.<br/>
- **View and Edit Profile Details 👀:** Allows instructors to view and edit their account details.<br/>
- **Amin Details 👤:** Provides details about the student's account, including their name, email and profile pictures<br/>
- **Admin Edit Details ✏️:** Allows students to edit their account details Such as ; edit your password, name and change profile picture.<br/>

<h3>System Architecture 🏰</h3>
<br/>
☝ The Learning Management System  platform consists of Four main components: <br/>
The front end, the back end, database and Deployment:. The platform follows a client-server architecture  with the front end serving as the client and the back end and database serving as the server deployemnt to host project globally.

### Fronted
- **React.js**<br/>
- **Tailwind CSS**<br/>
- **Axios for API calls**<br/>
- **Redux for state management**<br/>
- **React Router for navigation**<br/>
- **React Icons for UI enhancements**<br/>
- **React Hot Toast for notifications**<br/>
- **DaisyUI for pre-built UI components**<br/>

### Backend
- **Node.js**<br/>
- **Express.js**<br/>
- **MongoDB for database**<br/>
- **JWT (JSON Web Token) for secure authentication**<br/>
- **Razorpay for payment integration**<br/>

### Database
- **MongoDB Atlas (Cloud-based database for scalable storage)**

### Deployment
- **Frontend: Deployed on Netlify**<br/>
- **Backend: Deployed on Render**


## React Hooks 🎣

Utilized several React hooks for efficient state management and dynamic behavior:

- `useState`
- `useEffect`
- `useDispatch`
- `useParams`
- `useSelector`
- `useLocation`
- `useNavigate`
- `useForm`
- `Custom-Hook`

<br/>

## 📚 **Rract Library/Packages Used** :

- 📊**React.js**: The core library for building user interfaces in a component-based architecture. <br/>
- 🔑**React Router**: For navigation and routing in your React application.<br/>
- ✨**Redux**: For state management across your application.<br/>
- 📈**Axios**: For making HTTP requests to your backend APIs.<br/>
- 👁**Tailwind CSS**: Utility-first CSS framework for styling your components.<br/>
- 👀**DaisyUI**: Tailwind CSS component library for easily building UI components.<br/>
- 🍞**React Hot Toast**: For creating toast notifications in your application.<br/>
- 🎯**React Icons**: For adding scalable vector icons from popular libraries to your UI.<br/>
- 💲**Razorpay**:  for payment integration on the frontend.<br/>
- ✨**react-redux**: Binding React with Redux for managing global state.<br/>
- 📃**FormData API (in React component)**: To handle file uploads in forms.<br/>
- 🎥 **Video React:**  React-based video player for building rich multimedia experiences in web applications.<br/>


<h1>Installation and Setup</h1>
To run the code locally, follow the instructions below:

<h2>Backend Setup</h2>
1.Clone the repository:

```bash
git clone my repository.....
```
2.Navigate to the backend directory:

```bash
cd lms-backend
```
3.Install backend dependencies:

```bash
npm install
```
4.Set up environment variables:

Create a `.env` file in the backend directory and configure the following variables

```bash
NODE_ENV=_________
PORT=____
FRONTEND_URL=_______________

MONGO_URI=<your_mongodb_uri>

JWT_SECRET=<your_jwt_secret>
JWT_EXPIRY=360000000

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=<your_smtp_username>
SMTP_PASSWORD=<your_smtp_password>
SMTP_FROM_EMAIL=<your_smtp_from_email>

RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_SECRET=<your_razorpay_secret>
RAZORPAY_PLAN_ID=<your_razorpay_plan_id>
```
The backend will be running at `http://localhost:5000`.

5.Start the backend server:

```bash
npm run start/node server.js
```

<h2>Fronted Setup</h2>

1.Navigate to the frontend directory:

```bash
cd lms-frontend
```

2.Install frontend dependencies:

```bash
npm install
```
3.Start the frontend server:

```bash
npm run dev
```

Access the frontend by navigating to `http://localhost:3000` in your browser.


## Contact

For any inquiries or feedback, please contact [shivamkrthakur9771@gmail.com].


##NOTE:
Razorpay payment gateway(test mode) have used for buying the course. There is card payment method because there is no upi update in the version of razorpay which i'm using so to buy course simply visit `https://razorpay.com/docs/payments/payments/test-card-details/` that provide dummy card details to buy course in test mode or simply use `4718 6091 0820 4366`😊.

`Feel free to use, modify, and distribute the code.`
Happy coding🎯!



