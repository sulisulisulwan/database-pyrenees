CREATE DATABASE SDC;

USE SDC;

CREATE TABLE reviews (
  id int NOT NULL AUTO_INCREMENT,
  product_id int,
  rating int,
  date date,
  summary varchar(500),
  body varchar(500),
  recommend boolean,
  reported boolean,
  reviewer_name varchar(50),
  reviewer_email varchar(50),
  response varchar(500),
  helpfullness int,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id int NOT NULL AUTO_INCREMENT,
  review_id int,
  url varchar(100),
  PRIMARY KEY (id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);