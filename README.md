# Hackofiesta 6.0 - Cureit

## Introduction
Cureit is a comprehensive and user-friendly doctor appointment booking platform designed to eliminate the inconvenience of long waiting times and streamline the process of scheduling medical consultations. The platform ensures a hassle-free experience for patients by allowing them to book appointments with ease while also assisting doctors in managing their schedules efficiently. Cureit is built using **Supabase** for authentication, database management, and real-time updates.

Demo Video - 
Deployed Project Link - 

## Features and Functions

### 1. Sign-Up and Login
- Users can sign up using their email and password or through third-party authentication options.
- Role-based authentication for patients and doctors.
- Secure session management with supabase auth.
- Profile completion step after sign-up, where users enter relevant details.
- **Forgot Password** feature  to allow users to reset their passwords securely.

### 2. Booking Appointment
Booking an appointment involves multiple steps to ensure accuracy and a smooth experience.

#### **Personal Details**
- Users fill in essential personal details such as name, age, contact information, and medical history (if required).
- Option to store medical history for future reference.

#### **ML Model for Determining Doctor Type**
- A machine learning model assists users in identifying the most suitable doctor based on symptoms provided.
- Users can also manually select a specialization if they already know their requirements.

#### **Slot Selection**
- Dynamic slot generation based on doctor availability.
- Real-time updates to prevent double booking using Supabase.
- Sorting and filtering options to select the most convenient time.

#### **Review Booking**
- Users can review the selected appointment details before finalizing.
- Option to reschedule or cancel before confirmation.
- Payment gateway integration (if required for consultation fees).

### 3. Patient Dashboard
The **Patient Dashboard** allows users to manage their appointments and profile details efficiently.

#### **Profile Section**
- Users can update their personal details, medical history, and preferences.
- Profile photo upload option.

#### **Scheduled Appointments**
- Displays upcoming appointments with relevant details.
- Options to reschedule or cancel appointments.

#### **Appointment History**
- Provides a record of past consultations with doctors.
- Option to download prescriptions and medical notes.

### 4. Doctor Dashboard
The **Doctor Dashboard** helps healthcare professionals efficiently manage their schedules and patient interactions.

#### **Profile Section**
- Doctors can update their specialization, availability, and clinic details.

#### **Live Queue**
- Displays real-time updates of waiting patients.
- Doctors can mark patients as checked-in, completed, or skipped.

##### **Skip Appointment**
- Allows doctors to skip an appointment if a patient is unavailable or late.
- Automatically updates the queue to notify the next patient.

##### **OTP Verification**
- Secure OTP-based verification to ensure the correct patient is being consulted.

#### **History**
- A log of all past consultations with patient details.
- Option to review notes and prescriptions issued.

### 5. Dynamic Queue Updates
- Live synchronization of queue updates using Supabase real-time database.
- Patients get instant notifications when their turn is approaching.
- **Redis caching** implemented for efficient queue management, improving scalability and performance.

### 6. RAG-Based Chatbot
- A Retrieval-Augmented Generation (RAG) based AI chatbot to assist users with queries.
- Provides medical guidance based on pre-trained models and verified sources.

### 7. ML Model Implementation
- AI-driven insights for patient diagnosis suggestions.
- Predictive analysis for appointment scheduling trends.

### 8. Reminder System
- Automated reminders for upcoming appointments via email and SMS.
- Customizable notification settings for patients.

### 9. Online Prescriptions
- Doctors can generate and upload digital prescriptions.
- Patients can download or view prescriptions from their dashboard.

### 10. Feedback System
- Patients can provide ratings and reviews for doctors.
- Helps in improving user experience and service quality.

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication, Real-time Database)
- **Machine Learning:** Python, TensorFlow
- **Authentication:** Supabase Auth
- **Caching & Performance:** Redis for caching to improve scalability and fast data retrieval
- **Data Fetching & State Management:** TanStack React Query for optimized data synchronization and caching
- **Email Services:** Nodemailer for sending emails, including password reset functionality
- **Deployment:** Vercel / AWS
- **Notifications:** Twilio (for SMS), Email services

## Conclusion
Cureit revolutionizes doctor appointment booking by providing a **seamless, efficient, and AI-powered** experience for both patients and doctors. By leveraging **Supabase for real-time updates, authentication, and secure data management**, the platform ensures reliability and ease of use. With features like **ML-based doctor recommendations, dynamic queue management, Redis caching for scalability, and online prescriptions**, Cureit aims to enhance healthcare accessibility and efficiency.

