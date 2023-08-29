CREATE TABLE MedAssociate(
	Asso_id int,
	Comp_id int,
	Med_id int,
	PRIMARY KEY(Asso_id),
	FOREIGN KEY(Med_id) REFERENCES AllMed (Med_id) ON DELETE CASCADE,
);