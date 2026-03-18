-- LMS Seed Data
-- Run this AFTER migrations have been applied

-- Insert sample subjects
INSERT INTO subjects (title, slug, description, is_published) VALUES
('Java Programming', 'java-programming', 'Master Java from fundamentals to OOP, data structures, and advanced topics.', 1),
('Python for Beginners', 'python-beginners', 'Learn Python programming with hands-on examples and real-world projects.', 1),
('Machine Learning Basics', 'machine-learning-basics', 'Introduction to ML concepts, algorithms, and practical applications using Python.', 1);

-- Java Course sections + videos
INSERT INTO sections (subject_id, title, order_index) VALUES
(1, 'Getting Started', 1),
(1, 'Core Concepts', 2),
(1, 'Object Oriented Programming', 3);

INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(1, 'Introduction to Java', 'What is Java and why learn it?', 'dQw4w9WgXcQ', 1, 600),
(1, 'Setting Up JDK & IDE', 'Install JDK and configure IntelliJ IDEA.', 'dQw4w9WgXcQ', 2, 720),
(2, 'Variables and Data Types', 'Understanding primitive types in Java.', 'dQw4w9WgXcQ', 1, 540),
(2, 'Control Flow', 'If statements, loops, and switch in Java.', 'dQw4w9WgXcQ', 2, 680),
(3, 'Classes and Objects', 'Introduction to OOP fundamentals.', 'dQw4w9WgXcQ', 1, 820),
(3, 'Inheritance and Polymorphism', 'Advanced OOP concepts in Java.', 'dQw4w9WgXcQ', 2, 910);

-- Python Course sections + videos
INSERT INTO sections (subject_id, title, order_index) VALUES
(2, 'Python Fundamentals', 1),
(2, 'Data Structures', 2);

INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(4, 'Why Python?', 'Python overview and use cases.', 'dQw4w9WgXcQ', 1, 480),
(4, 'Variables and Types', 'Python dynamic typing explained.', 'dQw4w9WgXcQ', 2, 560),
(5, 'Lists and Dicts', 'Working with Python collections.', 'dQw4w9WgXcQ', 1, 700),
(5, 'List Comprehensions', 'Pythonic way to build lists.', 'dQw4w9WgXcQ', 2, 620);

-- ML Course sections + videos
INSERT INTO sections (subject_id, title, order_index) VALUES
(3, 'Introduction to ML', 1),
(3, 'Supervised Learning', 2);

INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(6, 'What is Machine Learning?', 'Overview of ML types and applications.', 'dQw4w9WgXcQ', 1, 720),
(6, 'Linear Regression', 'Your first ML model from scratch.', 'dQw4w9WgXcQ', 2, 900),
(7, 'Classification Basics', 'K-NN and decision trees explained.', 'dQw4w9WgXcQ', 1, 840),
(7, 'Model Evaluation', 'Accuracy, precision, recall, F1 score.', 'dQw4w9WgXcQ', 2, 780);
