DROP TABLE IF EXISTS schools;
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    logo VARCHAR(255),
    social jsonb,
    cep VARCHAR(9) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(40),
    reset_token_created_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    disabled_at TIMESTAMP WITH TIME ZONE
);

DROP TABLE IF EXISTS classes;
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL NOT NULL PRIMARY KEY,
    school_id INT NOT NULL REFERENCES schools (id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL PRIMARY KEY,
    school_id INT NOT NULL REFERENCES schools (id),
    class_id INT REFERENCES classes (id),
    name VARCHAR(255) NOT NULL,
    registration VARCHAR(8),
    birth_date DATE NOT NULL,
    role ENUM_USERS_ROLE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(13) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    address VARCHAR(255),
    reset_token VARCHAR(40),
    reset_token_created_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    disabled_at TIMESTAMP WITH TIME ZONE
);

DROP TABLE IF EXISTS subjects;
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL NOT NULL PRIMARY KEY,
    school_id INT NOT NULL REFERENCES schools (id),
    teacher_id INT NOT NULL REFERENCES users (id),
    class_id INT NOT NULL REFERENCES classes (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    times DATE_CUSTOM[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS modules;
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ordenation INT NOT NULL,
    subject_id INT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    content jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS grades;
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    subject_id INT NOT NULL,
    student_id INT NOT NULL,
    activity_id INT NOT NULL,
    period VARCHAR(10) NOT NULL,
    note INT NOT NULL,
    file jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS news;
CREATE TABLE IF NOT EXISTS news (
    id SERIAL NOT NULL PRIMARY KEY,
    title text NOT NULL,
    description text,
    school_id INT NOT NULL REFERENCES schools (id),
    class_id INT NOT NULL REFERENCES classes (id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
