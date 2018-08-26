CREATE TABLE IF NOT EXISTS car_show_classes (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  DESCRIPTION TEXT NOT NULL,
  CAR_SHOW_RID INTEGER NOT NULL REFERENCES car_shows (ID),
  CONSTRAINT car_show_classes_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS car_show_classes_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_show_classes ON car_show_classes;
DROP FUNCTION IF EXISTS bir_car_show_classes();

CREATE FUNCTION bir_car_show_classes() RETURNS trigger as $bir_car_show_classes$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_show_classes_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_show_classes$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_show_classes BEFORE INSERT ON car_show_classes
    FOR EACH ROW EXECUTE PROCEDURE bir_car_show_classes();
