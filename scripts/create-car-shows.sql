CREATE TABLE IF NOT EXISTS car_shows (
  ID INTEGER NOT NULL,
  NAME TEXT NOT NULL,
  DATE TEXT NOT NULL,
  YEAR INTEGER NOT NULL,
  CONSTRAINT car_shows_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS car_shows_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_shows ON car_shows;
DROP FUNCTION IF EXISTS bir_car_shows();

CREATE FUNCTION bir_car_shows() RETURNS trigger as $bir_car_shows$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_shows_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_shows$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_shows BEFORE INSERT ON car_shows
    FOR EACH ROW EXECUTE PROCEDURE bir_car_shows();
