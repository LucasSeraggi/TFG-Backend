CREATE TYPE ENUM_USERS_POSITION AS ENUM (
    'teacher',
    'student'
);

CREATE TYPE ENUM_ACTIVITIES_TYPE AS ENUM (
    'quiz',
    'dissertation',
    'fill_the_blanks'
);

DROP TABLE IF EXISTS schools;

CREATE TABLE IF NOT EXISTS schools (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    logo jsonb,
    cep VARCHAR(9) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS classes;

CREATE TABLE IF NOT EXISTS classes (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    school_id INT NOT NULL,
    users INT ARRAY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL,
    school_id INT NOT NULL,
    class_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration VARCHAR(10) NOT NULL,
    birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
    position ENUM_USERS_POSITION NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(13) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture jsonb,
    address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS subjects;

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL NOT NULL,
    school_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    students INT ARRAY,
    teacher INT,
    period VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS activities;

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM_ACTIVITIES_TYPE NOT NULL,
    description VARCHAR(255),
    period VARCHAR(10) NOT NULL,
    subject_id INT NOT NULL,
    init_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    worth INT NOT NULL,
    file jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS grades;

CREATE TABLE IF NOT EXISTS grades (
    id SERIAL NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    subject_id INT NOT NULL,
    student_id INT NOT NULL,
    activity_id INT NOT NULL,
    period VARCHAR(10) NOT NULL,
    note INT NOT NULL,
    file jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);
