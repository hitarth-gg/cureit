# Cureit 🚀

## Introduction

Cureit  is an **intuitive and robust** doctor appointment booking platform designed to **mitigate long waiting times** and **optimize** the scheduling process for medical consultations. The platform ensures a **seamless** user experience by enabling patients to book appointments effortlessly while equipping doctors with efficient schedule management tools. Cureit is powered by **Supabase** for authentication, database management, and real-time synchronization.

📽 **Demo Video** - [Demo Video Link](https://drive.google.com/file/d/1k3WiRaZEbQIiUDKqEWMddZDIjULpND-e/view?usp=sharing)

🌐 **Deployed Project Link** -  [https://aryamagarwal.github.io/cureit](https://aryamagarwal.github.io/cureit)

## Index
- [Introduction](#introduction)
- [Features and Functions](#features-and-functions)
  - [Sign-Up and Login](#1-sign-up-and-login)
  - [Booking Appointment](#2-booking-appointment)
  - [Patient Dashboard](#3-patient-dashboard)
  - [Doctor Dashboard](#4-doctor-dashboard)
  - [Dynamic Queue Updates](#5-dynamic-queue-updates)
  - [AI-Powered Chatbot](#6-ai-powered-chatbot)
  - [Machine Learning Integration](#7-machine-learning-integration)
  - [Reminder System](#8-reminder-system)
  - [Online Prescriptions](#9-online-prescriptions)
  - [Feedback System](#10-feedback-system)
- [Tech Stack](#Technology-Stack)
- [Implementation Flowchart](#Implementation-Flowchart)
- [Continuous Improvement](#Continuous-Improvement)
- [Conclusion](#Conclusion)
- [Application Testing Guide](#application-testing-guide)


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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/b55d10b5-1a72-4a66-be3d-71d0c39c8ca1">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/84ac78b0-85fc-415d-8e49-dcb1994ca2b8">
  <img src="https://github.com/user-attachments/assets/b55d10b5-1a72-4a66-be3d-71d0c39c8ca1" alt="My Image">
</picture>

---
## Continuous Improvement

### 1) Reception Dashboard
- Patients check in by scanning a dynamic QR code.
- QR code updates periodically for security.

### 2) Managing Doctor Absences
- Each doctor has 5 buffer slots for emergencies.
- Patients can:
  - Choose another available doctor.
  - Reschedule their appointment.

### 3) Online Video Consultation
- Enable virtual appointments for remote consultations.
- Simple and user-friendly booking.

### 4) MBBS Intern Contributions
- Interns assist with minor cases via online consultations.
- Provides hands-on experience under supervision.

### 5) Secure Payment System
- Integrate payment gateway for smooth transactions and overall application robustness.

### 6) Real-Time Monitoring Dashboard
- Displays ongoing consultations at reception.
- Shows doctor and patient queue details.
- Helps manage waiting times efficiently.

These upgrades enhance efficiency, patient experience, and overall system effectiveness.

---
## Conclusion

Cureit **transforms the doctor appointment booking experience** by delivering a **high-performance, AI-integrated, and real-time platform** for **patients and doctors** alike. By leveraging **Supabase for real-time updates, authentication, and secure data management**, the platform ensures **uncompromised reliability and ease of use**. Features like **ML-based doctor recommendations, dynamic queue management, Redis caching for performance scaling, and digital prescriptions** position Cureit as a **cutting-edge solution enhancing healthcare accessibility and efficiency**.

---

# Application Testing Guide

## Login Credentials for Testing Doctor Dashboard
Use the following doctor accounts to log in and test the application:

| Doctor Email               | Password      |
|----------------------------|--------------|
| doctor1@example.com       | password123  |
| doctor2@example.com       | password123  |
| doctor3@example.com       | password123  |
| doctor4@example.com       | password123  |
| doctor5@example.com       | password123  |
| doctor6@example.com       | password123  |
| doctor7@example.com       | password123  |
| doctor8@example.com       | password123  |
| doctor9@example.com       | password123  |
| doctor10@example.com      | password123  |



## Specializations Available in Database
Currently, the following doctor specializations are available in the database:

- Dermatologist
- Pediatrician
- Cardiologist
- Psychiatrist
- Orthopedic
- Neurologist
- Gynecologist
- Urologist
- ENT (Ear, Nose, Throat Specialist)
- General Physician

## Notes:
- The doctor data in the database is for **testing purposes only**.
- The **ML model** can map doctors to a **variety of other specializations** beyond those currently available in the database.


## Patient Dashboard Testing Guide

- Patients can sign up using their email ID.
- After email verification, they can log in and follow the booking workflow.
- Patients can edit their profile details, including name, age, and contact information.
- They can book, view and cancel appointments from their dashboard.
- Patients can access their medical history and view prescriptions and doctor's remarks (if any).



---
