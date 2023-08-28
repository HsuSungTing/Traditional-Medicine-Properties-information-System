CREATE TABLE AllMed(
	Med_id int NOT NULL,
	Med_name nvarchar(300) NOT NULL,
	Med_latin nvarchar(300),
	Med_en nvarchar(300),
	Med_base nvarchar(300),
	Med_content nvarchar(300),
	Med_use_class nvarchar(300),
	Med_character nvarchar(300),
	Med_efficacy nvarchar(300),
	Med_dosage nvarchar(300),
	Med_storage nvarchar(300),
	Med_prescription nvarchar(300),
	Med_mono int,
	Med_double int,
	Med_herb int,
	PRIMARY KEY(Med_id)
);