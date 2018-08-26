CREATE TABLE IF NOT EXISTS car_show_voting_results (
  ID INTEGER NOT NULL,
  CAR_SHOW_CLASS_RID INTEGER NOT NULL REFERENCES car_show_classes (ID),
  CAR_NUMBER INTEGER NOT NULL,
  VOTES INTEGER NOT NULL,
  OWNER TEXT,
  YEAR INTEGER,
  MAKE TEXT,
  MODEL TEXT,
  CONSTRAINT car_show_voting_results_pk PRIMARY KEY (ID)
);

CREATE SEQUENCE IF NOT EXISTS car_show_voting_results_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_show_voting_results ON car_show_voting_results;
DROP FUNCTION IF EXISTS bir_car_show_voting_results();

CREATE FUNCTION bir_car_show_voting_results() RETURNS trigger as $bir_car_show_voting_results$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_show_voting_results_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_show_voting_results$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_show_voting_results BEFORE INSERT ON car_show_voting_results
    FOR EACH ROW EXECUTE PROCEDURE bir_car_show_voting_results();
