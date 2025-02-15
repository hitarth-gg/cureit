# Cureit 🚀

## Introduction

Cureit is an **intuitive and robust** doctor appointment booking platform designed to **mitigate long waiting times** and **optimize** the scheduling process for medical consultations. The platform ensures a **seamless** user experience by enabling patients to book appointments effortlessly while equipping doctors with efficient schedule management tools. Cureit is powered by **Supabase** for authentication, database management, and real-time synchronization.

📽 **Demo Video**
🌐 **Deployed Project Link** -  [https://aryamagarwal.github.io/cureit](https://aryamagarwal.github.io/cureit)

---

## Features and Functions

### 1. Sign-Up and Login

- Users receive an **email verification link** upon sign-up.
- After verification, they can log in using **email-password authentication**.
- **Role-based access control (RBAC)** for patients and doctors.
- Secure session handling via **Supabase Auth**.
- Post-login redirection to the **profile dashboard** for additional details.
- **Forgot Password** feature for secure password recovery.

### 2. Booking Appointment

Booking an appointment follows a structured **multi-step process** ensuring accuracy and an optimized workflow.

#### **Personal Details**

- Users input **key personal details** such as **name, age, gender, address, and health issue**.
- **Geolocation API integration** for fetching the user's **current location**.

#### **AI-Powered Doctor Specialization Suggestion**

- **AI-driven model** dynamically determines the **most suitable doctor specialization** based on user symptoms.
- Uses **TF-IDF** vectorization and a **Random Forest classifier** to analyze user input.
- Preprocessing techniques like emoji removal, spell correction (TextBlob), and stopword removal (NLTK) enhance input quality.
- If confidence is low, the ML model predicts the specialist with probability-based classification.

#### **Slot Selection**

- **Automated dynamic slot generation** based on real-time doctor availability.
- **Real-time slot updates** to **prevent double booking**, powered by **Supabase**.
- **Date picker** for selecting the consultation date.
- Displays **doctor profiles** with expertise tags, enabling users to make informed decisions.

#### **Review Booking**

- Users can **verify all appointment details** before finalizing the booking.
- **Editable appointment flow**, allowing users to revise selections before confirmation.
- **Future-proof payment gateway integration** for seamless transactions.

### 3. Patient Dashboard

The **Patient Dashboard** provides users with a centralized interface to manage appointments and profile details.

#### **Profile Section**

- Users can **update and manage** their **personal details**.
- **Profile image upload** functionality for enhanced personalization.

#### **Scheduled Appointments**

- Displays **real-time queue status** with an estimated consultation time.
- Option to **cancel scheduled appointments** as needed.

#### **Appointment History**

- Comprehensive record of previous consultations.
- Access to **digital prescriptions and doctor notes**.

### 4. Doctor Dashboard

The **Doctor Dashboard** provides an intelligent scheduling system for healthcare professionals.

#### **Profile Section**

- Doctors can **view** their **specialization, availability, and clinic details**.
- Profile updates are **restricted to administrators** to maintain data integrity.

#### **Live Queue Management**

- **Real-time queue visualization** for efficient patient flow management.
- Doctors can mark patient statuses as **checked-in, completed, or skipped**.

##### **Skipping an Appointment**

- Doctors can **skip an appointment** if a patient is unavailable or late.
- **Automated queue updates** notify the **next patient** in line.

##### **OTP Verification**

- **Secure OTP-based authentication** ensures **correct patient identification** before consultation.

#### **History**

- Maintains a **log of all past consultations**, including patient details.
- Allows doctors to **review and manage prescriptions and notes**.

### 5. Dynamic Queue Updates

- **Instant queue synchronization** using **Supabase real-time database**.
- **Future enhancement**: Instant patient notifications when their turn approaches.
- **Redis-based caching** for efficient queue management, enhancing scalability and responsiveness.

### 6. AI-Powered Chatbot

- **Retrieval-Augmented Generation (RAG)-based chatbot** for dynamic retrieval of medical knowledge.
- Uses **Faiss** with **Sentence Transformers** for fast and accurate FAQ retrieval based on user queries.
- Ensures **precise and personalized medical guidance**.
- Supports real-time interaction via a **FastAPI**-powered backend.

### 7. Machine Learning Integration

- **AI-assisted diagnostic insights** for **symptom-based doctor recommendations**.
- **Predictive analytics** for optimized appointment scheduling.

### 8. Reminder System

- **Automated email and SMS reminders** for upcoming consultations.

### 9. Online Prescriptions

- Doctors can **generate, upload, and digitally sign prescriptions**.
- Patients can **securely access and download prescriptions** from their dashboard.

### 10. Feedback System

- Patients can **submit structured feedback** for doctors.
- **AI-driven sentiment analysis** extracts **meaningful insights from patient feedback** using **DistilBERT** and **Sentence Transformers**.
- Uses precomputed embeddings for efficient similarity matching and tagging.
- Dynamically generates relevant expertise tags for doctor profiles based on **semantic similarity (Faiss)** and **keyword-based classification**.
- Enhances **user experience and service optimization**.

---

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (**PostgreSQL, Authentication, Real-time Database**), Node.js, Express.js, FastAPI
- **Machine Learning:** Python, Faiss, Sentence Transformers, Scikit-learn, Hugging Face Transformers, NLTK, TextBlob
- **Authentication:** Supabase Auth
- **Caching & Performance:** Redis for **high-speed data retrieval and scalability**
- **Data Fetching & State Management:** **TanStack React Query** for optimized client-server synchronization
- **Email Services:** Nodemailer for **automated email handling, including OTP-based authentication**
- **Deployment:** GitHub Pages, Render

---

## Implementation Flowchart

![Idea_User_Diagram_final_darkkk drawio](https://github.com/user-attachments/assets/a7756791-e7e1-4c55-9de3-f2d22ff1e47e)



---
## Conclusion

Cureit **transforms the doctor appointment booking experience** by delivering a **high-performance, AI-integrated, and real-time platform** for **patients and doctors** alike. By leveraging **Supabase for real-time updates, authentication, and secure data management**, the platform ensures **uncompromised reliability and ease of use**. Features like **ML-based doctor recommendations, dynamic queue management, Redis caching for performance scaling, and digital prescriptions** position Cureit as a **cutting-edge solution enhancing healthcare accessibility and efficiency**.

