CREATE TABLE StandardData(
	Standard_name nvarchar(500) ,
	Standard_id int,
	PRIMARY KEY(Standard_id),
	SS_fingerpring nvarchar(500),
	SS_med_source nvarchar(500),
	SS_used_part nvarchar(500),
	SS_process nvarchar(500),
	SS_extract_detail nvarchar(500),
	SS_extract nvarchar(500),
	SS_ratio nvarchar(1000),
	SS_hplc_instrument nvarchar(500),
	SS_hplc_detect nvarchar(500),

	SS_col_brand nvarchar(500),
	SS_col_type nvarchar(500),
	SS_col_length float,
	SS_col_width float,
	SS_col_particle_size float,
	SS_col_temperature float,

	SS_ch_mobileA_detail nvarchar(500),
	SS_ch_mobileB_detail nvarchar(500),

	SS_ch_mobileA nvarchar(500),
	SS_ch_mobileB nvarchar(500),

	SS_ch_detect_wavelength float,
	SS_ch_flow_rate float,
	SS_ch_Injection float,
	SS_base nvarchar(500)
);