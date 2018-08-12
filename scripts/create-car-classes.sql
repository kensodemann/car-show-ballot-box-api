CREATE TABLE IF NOT EXISTS car_classes (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  DESCRIPTION TEXT NOT NULL,
  ACTIVE BOOLEAN NOT NULL,
  CONSTRAINT car_classes_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS car_class_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_classes ON car_classes;
DROP FUNCTION IF EXISTS bir_car_classes();

CREATE FUNCTION bir_car_classes() RETURNS trigger as $bir_car_classes$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_class_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_classes$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_classes BEFORE INSERT ON car_classes
    FOR EACH ROW EXECUTE PROCEDURE bir_car_classes();

