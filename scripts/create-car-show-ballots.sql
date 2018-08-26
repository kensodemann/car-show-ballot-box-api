CREATE TABLE IF NOT EXISTS car_show_ballots (
  ID INTEGER NOT NULL,
  CAR_SHOW_RID INTEGER NOT NULL REFERENCES car_shows (ID),
  CONSTRAINT car_show_ballots_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS car_show_ballots_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_show_ballots ON car_show_ballots;
DROP FUNCTION IF EXISTS bir_car_show_ballots();

CREATE FUNCTION bir_car_show_ballots() RETURNS trigger as $bir_car_show_ballots$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_show_ballots_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_show_ballots$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_show_ballots BEFORE INSERT ON car_show_ballots
    FOR EACH ROW EXECUTE PROCEDURE bir_car_show_ballots();

