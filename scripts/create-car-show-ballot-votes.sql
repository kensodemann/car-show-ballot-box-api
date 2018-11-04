CREATE TABLE IF NOT EXISTS car_show_ballot_votes (
  ID INTEGER NOT NULL,
  CAR_SHOW_CLASS_RID INTEGER NOT NULL REFERENCES car_show_classes (ID),
  CAR_NUMBER INTEGER NOT NULL,
  CONSTRAINT car_show_ballot_votes_pk PRIMARY KEY (ID)
);

ALTER TABLE car_show_ballot_votes
DROP COLUMN IF EXISTS CAR_SHOW_RID;

ALTER TABLE car_show_ballot_votes
ADD COLUMN IF NOT EXISTS CAR_SHOW_BALLOT_RID INTEGER NOT NULL REFERENCES car_show_ballots (ID);

CREATE SEQUENCE IF NOT EXISTS car_show_ballot_votes_id_sequence START WITH 1;

DROP TRIGGER IF EXISTS bir_car_show_ballot_votes ON car_show_ballot_votes;
DROP FUNCTION IF EXISTS bir_car_show_ballot_votes();

CREATE FUNCTION bir_car_show_ballot_votes() RETURNS trigger as $bir_car_show_ballot_votes$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := nextval('car_show_ballot_votes_id_sequence');
  END IF;
  RETURN NEW;
END;
$bir_car_show_ballot_votes$ LANGUAGE plpgsql;

CREATE TRIGGER bir_car_show_ballot_votes BEFORE INSERT ON car_show_ballot_votes
    FOR EACH ROW EXECUTE PROCEDURE bir_car_show_ballot_votes();
